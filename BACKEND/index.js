const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB Error:", err);
    });

const credentialSchema = new mongoose.Schema({
    user: String,
    pass: String
});

const emailSchema = new mongoose.Schema({
    subject: String,
    message: String,
    recipients: [String],
    status: String,
    sentAt: { type: Date, default: Date.now }
})

const credential = mongoose.model("credential", credentialSchema, "BulkMail");
const Email = mongoose.model("email", emailSchema, "EmailHistory");

let transporter;

credential.find()
    .then((data) => {
        console.log("Credentials fetched successfully");
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || data[0].user.trim(),
                pass: process.env.EMAIL_PASS || data[0].pass.trim(),
            }
        });
        transporter.verify((error, success) => {
            if (error) {
                console.log("VERIFY ERROR:", error);
            } else {
                console.log("SMTP READY");
            }
        });

    })
    .catch((err) => {
        console.log("Error fetching credentials:", err);
    });


app.post('/send-emails', async (req, res) => {
    console.log("Route hit!");
    try {

        const msg = req.body.message;
        const Emails = req.body.emailList;
        const subject = req.body.subject;

        console.log("Message:", msg);
        console.log("Emails:", Emails);
        console.log("Subject:", subject);

        if (!transporter) {
            return res.status(500).send("Transporter not initialized");
        }

        for (let i = 0; i < Emails.length; i++) {

            await transporter.sendMail({
                from: "johnsimonjmj@gmail.com",
                to: Emails[i],
                subject: subject,
                text: msg
            });

            console.log(`Email sent to ${Emails[i]}`);
        }
        await Email.create({
            subject: subject,
            message: msg,
            recipients: Emails,
            status: "Success"
        });
        res.status(200).send("Emails sent successfully");

    } catch (err) {
        console.error("FULL ERROR:", err);
        res.status(500).send(err.message);
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});