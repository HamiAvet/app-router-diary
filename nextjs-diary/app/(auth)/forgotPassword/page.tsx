"use client"

import Footer from "@/app/ui/footer/footer";
import { useState } from "react";
import Link from "next/link";
import "./page.css";

// Handle the send change password request page
export default function ForgotPassword() {
    const [error, setError] = useState<string | null>(null);

    const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        const response = await fetch('/api/forgotPassword', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })
        const result = await response.json();

        if (!response.ok) {
            setError(result.message);
        } else {
            setError("ok");
        }

    }
    return (
        <>
            <div className="forgotPassword_container">
                <h1>ForgotPassword</h1>
                <p>Please enter your email address to receive a password reset link</p>
                <form className="forgotPassword_form" onSubmit={handleForm}>
                    <div className="input_container">
                        <label htmlFor="email">Email</label>
                        <div className="input_div">
                            <input type="email" id="email" name="email" required />
                        </div>
                        {error ? (
                            error !== "ok" ? (
                                <p className="error_message">{error}</p>
                            ) : (
                                <p className="success_message">
                                An email has been sent with a link to reset your password
                                </p>
                            )
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