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


const emailSchema = new mongoose.Schema({
    subject: String,
    message: String,
    recipients: [String],
    status: String,
    sentAt: {
        type: Date,
        default: Date.now
    }
});

const Email = mongoose.model(
    "email",
    emailSchema,
    "EmailHistory"
);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP ERROR:", error);
    } else {
        console.log("SMTP READY");
    }
});


app.post('/send-emails', async (req, res) => {

    console.log("Route hit!");

    try {

        const { message, emailList, subject } = req.body;

        console.log("Subject:", subject);
        console.log("Recipients:", emailList.length);

        if (!Array.isArray(emailList) || emailList.length === 0) {
    return res.status(400).send("No emails provided");
}

        for (let i = 0; i < emailList.length; i++) {

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: emailList[i],
                subject: subject,
                text: message
            });

            console.log(`Email sent to ${emailList[i]}`);
        }

        await Email.create({
            subject,
            message,
            recipients: emailList,
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