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
    
    // Authentication check
    const [checked, setChecked] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);

    const [tokenValid, setTokenValid] = useState<TokenValid | null>({ userId: "", token: ""});

    // Get token from route parameters
    const token = params.token as string; 

    useEffect(() => {
        // Function to verify authentication
        async function verifyAuth() {
            try {
                // Check if user is already logged in
                const userId = localStorage.getItem("userId") || null;
                // If user is logged in
                if (userId) {
                    // If token is "null", allow access to change password page
                    if (token === "null") {   
                        setIsAuthed(true); // User is authenticated                
                    } else {
                        redirect('/login'); // Redirect to login if logged in
                    } 
                } else {
                     // Verify token on component mount
                    if (token === "null" || !token) {
                        redirect('/login'); // No token provided
                    } else {
                        // Verify token on component mount
                        const response = await fetch(`/api/settings/changePassword/${token}`, { 
                            method: "GET", // Because we are getting data from the server
                            headers: {
                                "Content-Type": "application/json"
                            },
                            // No body needed for GET request
                        });
                        // Get response data
                        const result = await response.json();
                        // Set token data in state
                        setTokenValid({
                            userId: result.tokenData[0].userid,
                            token: result.tokenData[0].token
                        });
                        if (response.status === 400) {
                            redirect('/login'); // Redirect to login if token is invalid
                        } else {
                            setIsAuthed(true); // User is authenticated
                        }
                    }
                }
            } catch (error) { 
                console.error("Error verifying authentication:", error);
                redirect('/login'); // Redirect to login on error
            } finally {
                setChecked(true); // Mark that the check is done
            }
        }
        verifyAuth();
    }, [token]);
    
    // If authentication check is not done yet, return null
    if (!checked || !isAuthed) {
        return null; 
    }
    
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
        const userId = localStorage.getItem('userId') ? localStorage.getItem('userId') || "" : tokenValid?.userId || ""; // Get userId from localStorage        
        formData.append('id', userId); // Append the user ID to the form data
        const data = Object.fromEntries(formData);


        // Define request options
        const options = {
            method : "POST", // Because we are posting data to the server
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(data) // The JSON data that we want to send
        }

        // Send POST request to update user settings
        const response = await fetch("/api/settings", options);

        if (response.status === 400) { // If there are validation errors
            const result = await response.json(); // Get errors          
            // Update state with error messages
            setErrors({
                passwordError: result.newPasswordError || "",
                passwordConfirmError: result.newPasswordConfirmError || "",
            });
            return; // Exit the function if there are errors
        } else if (response.status === 200) { // Else if there are no errors
            redirect('/login'); // Redirect to login page
        }
    };
    return (
        <>
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
            <Footer />
        </>
    )
}