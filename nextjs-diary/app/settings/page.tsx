"use client";

import { FormEvent, useEffect } from "react";
import { useState } from "react";
import { redirect } from "next/navigation";
import WebPushPermissionButton from "../ui/WebPushPermissionButton/WebPushPermissionButton";
import DeleteAccountButton from "../ui/deleteAccountButton/deleteAccountButton"
import Link from "next/link";
import Image from "next/image";
import "./page.css";

// Define the types of error messages
type Errors = {
    emailError: string,
    passwordError: string,
    passwordConfirmError: string,
}

export default function Settings() {
    // State to hold error messages
    const [ errors, setErrors ] = useState<Errors | null>({
        emailError: "",
        passwordError: "",
        passwordConfirmError: "",
    });

    // state to toggle password visibility
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ showPasswordConfirm, setShowPasswordConfirm ] = useState<boolean>(false);

    const [ userData, setUserData ] = useState<{ username: string; email: string; password: string } | null>(null); // State to hold user data
    const [ hasNoChanged , setHasChanged ] = useState<boolean>(false); // State to track if any changes were made

    // Authentication check
    const [checked, setChecked] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);

    // On component mount, check for user authentication
    useEffect(() => {
        const user = localStorage.getItem("userId") || null;
        if (!user) {
        redirect('/'); // Redirect to home if not authenticated
        } else {
        setIsAuthed(true); // User is authenticated
        }
        setChecked(true); // Mark that the check is done
    }, []);

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

    // Fetch user data on component mount
    useEffect(() => {
        async function fetchUserData() {
            const userId = localStorage.getItem('userId');

            if (userId) { // If userId exists in localStorage
                // Fetch user data from the server
                const response = await fetch(`/api/settings/${userId}`, { 
                    method: "GET", // Because we are getting data from the server
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // No body needed for GET request
                 });
                if (response.ok) { // If response is ok
                    const result = await response.json(); // Get user data
                    setUserData(result[0]) ; // Set user data in state
                }
            }
        }
        
        fetchUserData(); // Call the async function to fetch user data
    }, []);
    

    // Handle form submission
    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
        user.preventDefault(); // For not reloading the page on form submit

        // Clear previous errors
        setErrors({
            emailError: "",
            passwordError: "",
            passwordConfirmError: "",
        });

        // Get form data
        const formData = new FormData(user.currentTarget);  
        const userId = localStorage.getItem('userId') || ''; // Get userId from localStorage
        formData.append('id', userId); // Append the user ID to the form data
        const data = Object.fromEntries(formData);

        // Check which fields were changed
        let nameWasChanged = false;
        const updateData = {id : userId} as { id : string; newUsername?: string | null; newEmail?: string | null; newPassword?: string | null; oldPassword?: string | null};
        
        // Compare in each field the initial username with the new username
        if (userData?.username !== data.newUsername && typeof data.newUsername === 'string' && data.newUsername.trim() !== '') {
            updateData.newUsername = data.newUsername as string;
            nameWasChanged = true;
            setHasChanged(true);
        } 

        // Compare in each field the initial email with the new email
        if (userData?.email !== data.newEmail && typeof data.newEmail === 'string' && data.newEmail.trim() !== '') {
            updateData.newEmail = data.newEmail as string;
            setHasChanged(true);
        }

        // Compare in each field the initial password with the new password
        if (userData?.password !== data.newPassword && typeof data.newPassword === 'string' && data.newPassword.trim() !== '') {
            updateData.newPassword = data.newPassword as string
            updateData.oldPassword = userData?.password
            setHasChanged(true);
        }  

        // If no fields were changed, redirect back to diary
        if (Object.keys(updateData).length === 1 || userData?.username === data.newUsername && userData?.email === data.newEmail) { 
            redirect('/diary');
        }

        // Define request options
        const options = {
            method : "POST", // Because we are posting data to the server
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(data) // The JSON data that we want to send
        }

        // Send POST request to update user settings
        const response = await fetch("/api/settings/", options);

        if (response.status === 400) { // If there are validation errors
            const result = await response.json(); // Get errors          
            // Update state with error messages
            setErrors({
                emailError: result.newEmailError || "",
                passwordError: result.newPasswordError || "",
                passwordConfirmError: result.newPasswordConfirmError || "",
            });
            return; // Exit the function if there are errors
        } else if (response.status === 200) { // Else if there are no errors
            if (nameWasChanged) localStorage.setItem('username', data.newUsername as string); // Update username in localStorage if it was changed
            redirect('/diary'); // Redirect to diary page
        }
    };

    // Return the settings page JSX
    return (
        <>
            <div className="settings_container">
                <h1>Account Settings</h1>
                <WebPushPermissionButton />
                <DeleteAccountButton />
                <form className="settings_form" onSubmit={handleForm}>
                    <div className="input_container">
                        <label htmlFor="username">Username</label>
                        <div className="input_div">
                            <input name="newUsername" id="username" type="text" maxLength={20} placeholder={userData?.username} autoComplete="off" />
                        </div>
                    </div>
                    <div className="input_container">
                        <label htmlFor="email">Email</label>
                        <div className="input_div">
                            <input name="newEmail" id="email" type="email" maxLength={50} placeholder={userData?.email} autoComplete="off"/>
                        </div>
                        {errors?.emailError && <p className="error_message">{ errors.emailError }</p>}
                    </div>    
                    <h2>Change your Password</h2>
                    <div className="input_container">
                        <label htmlFor="password">Password</label>
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
                        <button type="submit" className="confirm_btn" disabled={hasNoChanged}>Confirm</button>
                        <Link href="/diary">
                            <button type="button" className="redirect_btn">Cancel</button>
                        </Link>
                    </div>
                </form>
            </div>
        </>

    );
}