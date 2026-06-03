import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import generateKey from '@/app/cli/generateKey';
import { getUserByEmail } from '@/app/lib/userDataUtils';
import { addNewToken } from '@/app/lib/tokenDataUtils';

// Handle POST request to initiate password reset
export async function POST(request) {
    // Get email data from request
    const data = await request.json();
    const email = data.email;
    const user = await getUserByEmail({ email });

    // If no user is found with the provided email, return a 404 response
    if (!user || user.length === 0) {
        return NextResponse.json({ message: `No user found with email ${email}` }, { status: 404 });
    }
    // Else, get user's id and generate a reset token, then store the token in the database
    const userId = user[0].id;
    // Generate a unique token for password reset
    const token = generateKey();
    // Store the token in the database with an association to the user ID
    await addNewToken({ token, userId });

    // Create a transporter using Ethereal test credentials.
    // For production, replace with your actual SMTP server details.
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // SMTP server address (e.g., smtp.gmail.com for Gmail)
    port: 465, // SMTP server port (465 for SSL, 587 for TLS)
    secure: true, // Use true for port 465, false for port 587
    service: "gmail", // Service name (e.g., 'gmail' for Gmail)
    // Etablish authentication using environment variables for security
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // The 16-character App Password
    },
    });

    // Send an email using async/await
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER, // Sender address
        to: email, // List of receivers
        subject: "Password Reset Request : My Diary", // Subject line
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Dear user,</p>
            <p>We received a request to reset your password. Please use the following link to reset your password:</p>
            <a href='http://localhost:3000/settings/changePassword/${token}'>Reset your password</a>
        </div>`, // HTML version of the message
    });

    // Here you would typically initiate the password reset process,
    // such as generating a reset token and sending an email.
    // For this example, we'll just return a success response.
    return NextResponse.json({ message: `Password reset link sent to ${email}` }, { status: 200 });
}