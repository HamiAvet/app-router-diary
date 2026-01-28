"use client"

import Footer from "@/app/ui/footer/footer";
import { useState, useEffect, FormEvent } from "react";
import { redirect, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./page.css";

// Define the types of error messages
type Errors = {
    passwordError: string,
    passwordConfirmError: string,
}

// Define the type for valid token data
type TokenValid = {
    userId: string,
    token: string,
}

export default function ChangePassword() {
    // Get route parameters in dynamic routes [token]
    const params = useParams(); 
    // State to hold error messages
    const [ errors, setErrors ] = useState<Errors | null>({
        passwordError: "",
        passwordConfirmError: "",
    });
    
    // state to toggle password visibility
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ showPasswordConfirm, setShowPasswordConfirm ] = useState<boolean>(false);
    // Vérification du token uniquement
    const [tokenValid, setTokenValid] = useState<TokenValid | null>(null);
    const token = params.token as string;

    useEffect(() => {
        async function verifyToken() {
            try {
                const response = await fetch(`/api/settings/changePassword/${token}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (response.status === 400) {
                    redirect("/login");
                }
                const result = await response.json();
                if (result.tokenData && result.tokenData[0]?.userid && result.tokenData[0]?.token) {
                    setTokenValid({
                        userId: result.tokenData[0].userid,
                        token: result.tokenData[0].token
                    });
                } else {
                    redirect("/login");
                }
            } catch (error) {
                redirect("/login");
            }
        }
        verifyToken();
    }, [token]);
    // Handle password visibility toggle
    const handlePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // For not reloading the page on button click
        setShowPassword(!showPassword);
    };
  
    // Handle password confirmation visibility toggle
    const handlePasswordConfirmVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // For not reloading the page on button click
        setShowPasswordConfirm(!showPasswordConfirm);
    };

    // Handle form submission
    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
        user.preventDefault(); // For not reloading the page on form submit

        // Clear previous errors
        setErrors({
            passwordError: "",
            passwordConfirmError: "",
        });

        // Get form data
        const formData = new FormData(user.currentTarget);  
        const userId = localStorage.getItem('userId') || tokenValid?.userId || ""; // Get userId from localStorage ou du token
        formData.append('id', userId); // Append the user ID to the form data
        const data = Object.fromEntries(formData);

        // Define request options
        const options = {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(data)
        }

        // Send POST request to update user settings
        const response = await fetch("/api/settings", options);

        if (response.status === 400) {
            const result = await response.json();
            setErrors({
                passwordError: result.newPasswordError || "",
                passwordConfirmError: result.newPasswordConfirmError || "",
            });
            return;
        } else if (response.status === 200) {
            redirect('/login');
        }
    };
    // Afficher le formulaire seulement si le token est valide
    return (
        <>
            {tokenValid ? (
                <div className="changePassword_container">
                    <h2>Change your Password</h2>
                    <form className="changePassword_form" onSubmit={handleForm}>
                        <div className="input_container">
                            <label htmlFor="password">New Password</label>
                            <div className="input_div">
                                <input name="newPassword" id="password" type={showPassword ? "text" : "password"} maxLength={50} autoComplete="off"/>
                                <button className="showPassword_btn" type="button" onClick={handlePasswordVisibility}>
                                    <Image width={20} height={20} src={showPassword ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPassword ? "Hide" : "Show"}/>
                                </button>
                            </div>
                            {errors?.passwordError && <p className="error_message">{ errors.passwordError }</p>}
                        </div>
                        <div className="input_container">
                            <label htmlFor="passwordConfirm">Password Confirmation</label>
                            <div className="input_div">
                                <input name="newPasswordConfirm" id="passwordConfirm" type={showPasswordConfirm ? "text" : "password"} maxLength={50} autoComplete="off"/>
                                <button className="showPassword_btn" type="button" onClick={handlePasswordConfirmVisibility}>
                                    <Image width={20} height={20} src={showPasswordConfirm ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPasswordConfirm ? "Hide" : "Show"}/>
                                </button>
                            </div>
                            {errors?.passwordConfirmError && <p className="error_message">{ errors.passwordConfirmError }</p>}
                        </div>
                        <div className="buttons_container">
                            <button type="submit" className="confirm_btn">Confirm</button>
                            <Link href="/login">
                                <button className="redirect_btn">Cancel</button>
                            </Link>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="changePassword_container">
                    <h2>Checking token...</h2>
                </div>
            )}
            <Footer />
        </>
    );
}