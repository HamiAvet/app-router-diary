"use client"

import NavBar from "@/app/ui/navbar/navbar";
import Footer from "@/app/ui/footer/footer";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import "./page.css";

// Handle the send change password request page
export default function ForgotPassword() {
    // Initialize the error state to null
    const [error, setError] = useState<string | null>(null);

    // Handle the form submission for sending the password reset email
    const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // To not refresh the page on form submission

        // Get the email from the form data
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        // Send a POST request to the forgotPassword API route with the email in the request body
        const response = await fetch('/api/forgotPassword', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });
    
        // Catch the response from the API route and parse it as JSON
        const result = await response.json();

        if (!response.ok) {
            // If the response is not ok, set the error state to the message from the API route
            setError(result.message);
        } else {
            // Else, if the response is ok, set the error state to null and show a success toast message
            setError("An email has been sent successfully");
            toast.success("An email has been sent with a link to reset your password");
        }
    }
    
    return (
        <>
            <NavBar />
            <div className="forgotPassword_container">
                <h1>ForgotPassword</h1>
                <p>Please enter your email address to receive a password reset link</p>
                <form className="forgotPassword_form" onSubmit={handleForm}>
                    <div className="input_container">
                        <label htmlFor="email">Email</label>
                        <div className="input_div">
                            <input type="email" id="email" name="email" required onChange={() => setError(null)}/>
                        </div>
                        {error ? (
                            <p className={error === "An email has been sent successfully" ? "success_message" : "error_message"}>{error}</p>
                        ) : null}
                    </div>
                    <div className="buttons_container">
                        <button type="submit" className="confirm_btn">Send</button>
                        <Link href="/login">
                            <button className="redirect_btn">Cancel</button>
                        </Link>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    )
}