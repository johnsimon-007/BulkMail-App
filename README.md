# EasyMail.com

A MERN-based Bulk Email Sending Application that allows users to upload an Excel file containing email addresses and send emails to multiple recipients at once.

## Features

- Upload Excel (.xlsx) files
- Extract email addresses automatically
- Send bulk emails using Brevo SMTP
- Store email history in MongoDB
- Responsive and simple user interface
- Deployed online using Vercel and Render

## Tech Stack

### Frontend
- React.js
- Axios
- XLSX

### Backend
- Node.js
- Express.js
- Nodemailer
- Brevo SMTP

### Database
- MongoDB Atlas
- Mongoose

## How It Works

1. Enter the email subject.
2. Enter the email message.
3. Upload an Excel file containing recipient email addresses.
4. Click **Send Emails**.
5. Emails are sent to all recipients and the email history is stored in MongoDB.

