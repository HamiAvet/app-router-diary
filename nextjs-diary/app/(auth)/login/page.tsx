'use client'

import Footer from "@/app/ui/footer/footer";
import { useState, useEffect, FormEvent } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./page.css";

// Define the types of error messages
type Errors = {
    emailError: string,
    passwordError: string,
}

export default function LoginPage() {
    // State to hold error messages
    const [ errors, setErrors ] = useState<Errors | null>({
        emailError: "",
        passwordError: "",
    });;
    // state to toggle password visibility
    const [ showPassword, setShowPassword ] = useState<boolean>(false);    

    // Authentication check
    const [checked, setChecked] = useState(false);
    const [isNotAuthed, setIsNotAuthed] = useState(false);

    // On component mount, check for user authentication
    useEffect(() => {
        const user = localStorage.getItem("userId") || null;
        if (user) {
        redirect('/diary'); // Redirect to diary if authenticated
        } else {
        setIsNotAuthed(true); // User is not authenticated
        }
        setChecked(true); // Mark that the check is done
    }, []);

    // If authentication check is not done yet, return null
    if (!checked || !isNotAuthed) {
        return null; 
    }

    // Handle password visibility toggle
    const handlePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // For not reloading the page on button click
        setShowPassword(!showPassword);
    }

    // Handle form submission
    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
       user.preventDefault(); // For not reloading the page on form submit

        // Clear previous errors
        setErrors({
            emailError: "",
            passwordError: "",
        });

       // Get form data
       const formData = new FormData(user.currentTarget);  
       const data = Object.fromEntries(formData);  
       const JSONData = JSON.stringify(data);  
       
        // Define request options
       const options = {
            method: "POST", // Because we are posting data to the server
            headers: {
                "Content-Type": "application/json"
            },
            body : JSONData // The JSON data that we want to send
        }

        // Send POST request to login 
        const response = await fetch("/api/auth/login/", options);

        // Get the result
        const result = await response.json();
        if (response.status === 400) { // If there are validation errors
            // Update state with error messages
            setErrors({
                emailError: result.emailError || "",
                passwordError: result.passwordError || "",
            });
        }
        else if (response.status === 201) { // Else if there are no errors
            // Store user info in localStorage 
            localStorage.setItem('username', result[0].username);
            localStorage.setItem('userId', result[0].id);
            redirect('/diary'); // Redirect to diary page
        }  
   };

    // Return the login form JSX
    return (
        <>
            <div className="login_container">
                <h1>Login</h1>
                <form className="login_form" onSubmit={handleForm}>
                    <div className="input_container">
                        <label htmlFor="email">Email</label>
                        <div className="input_div">
                            <input name="email" id="email" type="email" maxLength={80} onChange={() => {
                                setErrors(prev => ({
                                    ...(prev ?? {emailError: ""}),
                                        emailError: "",
                                        passwordError: errors?.passwordError || "",
                                }))
                            }}/>
                        </div>
                        {errors?.emailError && <p className="error_message">{ errors.emailError }</p>}
                    </div>    
                    <div className="input_container">
                        <label htmlFor="password">Password</label>
                        <div className="input_div">
                            <input name="password" id="password" type={showPassword ? "text" : "password"} maxLength={50} onChange={() => {
                                setErrors(prev => ({
                                    ...(prev ?? {passwordConfirmError: ""}),
                                        emailError: errors?.emailError || "",
                                        passwordError: "",
                                }))
                            }}/>
                            <button className="showPassword_btn" type="button" onClick={handlePasswordVisibility}>
                                <Image width={20} height={20} src={showPassword ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPassword ? "Hide" : "Show"}/>
                            </button>
                        </div>                    
                        {errors?.passwordError && <p className="error_message">{ errors.passwordError }</p>}

                    </div>
                    <div className="buttons_container">
                        <button type="submit" className="confirm_btn">Login</button>
                        <Link href="/register">
                            <button className="redirect_btn">Sing Up</button>
                        </Link>
                    </div>
                    <Link href="/forgotPassword" className="forgotPasswordLink">Forgot Password ?</Link>
                </form>
            </div>
            <Footer />
        </>
    )
}
