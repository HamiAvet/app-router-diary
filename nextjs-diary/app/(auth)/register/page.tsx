'use client'

import NavBar from "@/app/ui/navbar/navbar";
import Footer from "@/app/ui/footer/footer";
import { useState, useEffect, FormEvent } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import generateKey from "@/app/cli/generateKey";
import "./page.css";

// Define the types of error messages
type Errors = {
    usernameError: string,
    emailError: string,
    passwordError: string,
    passwordConfirmError: string,
}

export default function RegisterPage() {
    // State to hold error messages
    const [ errors, setErrors ] = useState<Errors | null>({
        usernameError: "",
        emailError: "",
        passwordError: "",
        passwordConfirmError: "",
    });;    

    // state to toggle password visibility
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ showPasswordConfirm, setShowPasswordConfirm ] = useState<boolean>(false);

    /*
    // Authentication check
    const [checked, setChecked] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);

    // On component mount, check for user authentication
    useEffect(() => {
        const verifySession = async () => {
            const response = await fetch('/api/sessionProviders', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            if (response.status === 201) {
                redirect('/diary'); // Redirect to diary if authenticated
            } else {
                setIsAuthed(false); // Mark that user is not authenticated
            }
            setChecked(true); // Mark that the check is done
        };
        verifySession();
    }, []);

    // If authentication check is not done yet, return null
    if (!checked || isAuthed) {
        return null; 
    }
    */

    // Handle password visibility toggle
    const handlePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // For not reloading the page on button click
        setShowPassword(!showPassword);
    }
    const handlePasswordConfirmVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // For not reloading the page on button click
        setShowPasswordConfirm(!showPasswordConfirm);
    }

    // Handle form submission
    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
        user.preventDefault(); // For not reloading the page on form submit

        // Clear previous errors
        setErrors({
            usernameError: "",
            emailError: "",
            passwordError: "",
            passwordConfirmError: "",
        })
        // Generate a unique user ID
        const userId = generateKey();

        // Get form data
        const formData = new FormData(user.currentTarget);  
        formData.append('id', userId);  // Append the generated user ID to the form data
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

        // Send the registration request
        const response = await fetch("/api/auth/register/", options);

        if (response.status === 400) { // If there are validation errors
            const result = await response.json();  // Get errors         
            // Update state with error messages        
            setErrors({
                usernameError: result.usernameError || "",
                emailError: result.emailError || "",
                passwordError: result.passwordError || "",
                passwordConfirmError: data.password !== data.passwordConfirm ? "Passwords do not match" : "",
            });            
        } else if (response.status === 201) { // Else if there are no errors
            redirect('/login'); // Redirect to login page
        }
    };

    // Return the registration form JSX
    return (
        <>
            <NavBar />
            <div className="register_container">
                <h1>Register</h1>
                <form className="register_form" onSubmit={handleForm}>
                    <div className="input_container">
                        <label htmlFor="username">Username</label>
                        <div className="input_div">
                            <input name="username" id="username" type="text" maxLength={20} autoComplete="off" onChange={() => {
                                setErrors(prev => ({
                                    ...(prev ?? {usernameError: ""}),
                                        usernameError: "",
                                        emailError: errors?.emailError || "",
                                        passwordError: errors?.passwordError || "",
                                        passwordConfirmError: errors?.passwordConfirmError || "",
                                }))
                            }}/>
                        </div>
                        {errors?.usernameError && <p className="error_message">{ errors.usernameError }</p>}
                    </div>
                    <div className="input_container">
                        <label htmlFor="email">Email</label>
                        <div className="input_div">
                            <input name="email" id="email" type="email" maxLength={50} autoComplete="off" onChange={() => {
                                setErrors(prev => ({
                                    ...(prev ?? {emailError: ""}),
                                        usernameError: errors?.usernameError || "",
                                        emailError: "",
                                        passwordError: errors?.passwordError || "",
                                        passwordConfirmError: errors?.passwordConfirmError || "",
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
                                    ...(prev ?? {passwordError: ""}),
                                        usernameError: errors?.usernameError || "",
                                        emailError: errors?.emailError || "",
                                        passwordError: "",
                                        passwordConfirmError: errors?.passwordConfirmError || "",
                                }))
                            }}/>
                            <button className="showPassword_btn" type="button" onClick={handlePasswordVisibility}>
                                <Image width={20} height={20} src={showPassword ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPassword ? "Hide" : "Show"}/>
                            </button>
                        </div>
                        {errors?.passwordError && <p className="error_message">{ errors.passwordError }</p>}
                    </div>
                    <div className="input_container">
                        <label htmlFor="passwordConfirm">Password Confirmation</label>
                        <div className="input_div">
                            <input name="passwordConfirm" id="passwordConfirm" type={showPasswordConfirm ? "text" : "password"} maxLength={50} onChange={() => {
                                setErrors(prev => ({
                                    ...(prev ?? {passwordConfirmError: ""}),
                                        usernameError: errors?.usernameError || "",
                                        emailError: errors?.emailError || "",
                                        passwordError: errors?.passwordError || "",
                                        passwordConfirmError: "",
                                }))
                            }}/>
                            <button className="showPassword_btn" type="button" onClick={handlePasswordConfirmVisibility}>
                                <Image width={20} height={20} src={showPasswordConfirm ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPasswordConfirm ? "Hide" : "Show"}/>
                            </button>
                        </div>
                        {errors?.passwordConfirmError && <p className="error_message">{ errors.passwordConfirmError }</p>}
                    </div>
                    <div className="buttons_container">
                        <button type="submit" className="confirm_btn">Sign Up</button>
                        <Link href="/login">
                            <button type="button" className="redirect_btn">Login</button>
                        </Link>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    )
}
