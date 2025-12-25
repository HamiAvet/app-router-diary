import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


// Handle POST request to initiate password reset
export async function POST(request) {
    // Get email data from request
    const data = await request.json();
    const email = data.email;

    // Create a transporter using Ethereal test credentials.
    // For production, replace with your actual SMTP server details.
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use true for port 465, false for port 587
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // The 16-character App Password
    },
    });

    // Send an email using async/await
    const info = await transporter.sendMail({
        from: email, // Sender address
        to: process.env.EMAIL_USER, // List of receivers
        subject: "Hello ✔",
        text: "Hello world?", // Plain-text version of the message
        html: "<b>Hello world?</b>", // HTML version of the message
    });

    console.log("Message sent:", info.messageId);
    // Here you would typically initiate the password reset process,
    // such as generating a reset token and sending an email.
    // For this example, we'll just return a success response.
    return NextResponse.json({ message: `Password reset link sent to ${email}` }, { status: 200 });
}