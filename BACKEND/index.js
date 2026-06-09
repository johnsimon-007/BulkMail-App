const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB Error:", err);
    });

// Email History Schema
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

// Brevo SMTP

console.log("BREVO USER:", process.env.BREVO_USER);
console.log("BREVO PASS EXISTS:", !!process.env.BREVO_PASS);

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 2525,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});

// Test SMTP connection when server starts
transporter.verify((err, success) => {
    if (err) {
        console.log("SMTP ERROR:", err);
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

            const info = await transporter.sendMail({
                from: "johnsimon987654@gmail.com",
                to: emailList[i],
                subject: subject,
                text: message
            });

            console.log(`Email sent to ${emailList[i]}`);
            console.log(info.messageId);
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