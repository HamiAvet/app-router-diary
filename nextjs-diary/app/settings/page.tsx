"use client";

import NavBar from "@/app/ui/navbar/navbar";
import Footer from "@/app/ui/footer/footer";
import { FormEvent, useEffect } from "react";
import { useState } from "react";
import { redirect } from "next/navigation";
import DeleteAccountButton from "@/app/ui/deleteAccountButton/deleteAccountButton"
import Link from "next/link";
import "./page.css";

// Define the types of error messages
type Errors = {
    emailError: string,
}

export default function Settings() {
    // State to hold error messages
    const [ errors, setErrors ] = useState<Errors | null>({
        emailError: "",
    });

    const [ userData, setUserData ] = useState<{ username: string; email: string; } | null>(null); // State to hold user data
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

    // If authentication check is not done yet, return null
    if (!checked || !isAuthed) {
        return null; 
    }


    // Handle form submission
    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
        user.preventDefault(); // For not reloading the page on form submit

        // Clear previous errors
        setErrors({
            emailError: "",
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
            <NavBar />
            <div className="settings_container">
                <h1>Account Settings</h1>
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
                    <div className="buttons_container">
                        <button type="submit" className="confirm_btn" disabled={hasNoChanged}>Confirm</button>
                        <Link href="/diary">
                            <button type="button" className="redirect_btn">Cancel</button>
                        </Link>
                    </div>
                        <Link href="/settings/changePassword/null" className="change_password_link">Change Password</Link>
                </form>
            </div>
            <Footer />
        </>

    );
}