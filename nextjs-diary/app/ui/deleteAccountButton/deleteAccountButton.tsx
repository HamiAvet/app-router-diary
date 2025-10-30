'use client'

import { FormEvent, useState } from "react";
import { redirect } from "next/navigation";
import "./deleteAccountButton.css";

export default function DeleteAccountButton() {
    const [needValidatin, setNeedValidation] = useState(false)

    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
        user.preventDefault();  
        const formData = new FormData(user.currentTarget);  
        const userId = localStorage.getItem('userId') || '';
        formData.append('id', userId); 
        const data = Object.fromEntries(formData);  
        console.log(data);  
        const JSONData = JSON.stringify(data);  
        console.log(JSONData);  
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSONData
        }

        
        const response = await fetch("/api/settings/deleteAccount/", options);
        if (response.status === 200) {
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            redirect('/login');
            
        }
    };

    if (!needValidatin) {
        return (
            <button className="delete_account_button" onClick={() => setNeedValidation(true)}>Delete your Account</button>
        )
    } else {
        return (
            <form className="delete_account_form" onSubmit={handleForm}>
                <h3>Are you sure ? </h3>
                <p>Your accout well be defenetlie deleted from our database</p>
                <div className="delete_account_buttons_container">
                    <button className="confirm_delete_account_button" type="submit">Confirm</button>
                    <button className="cancel_delete_account_button" onClick={() => setNeedValidation(false)}>Cancel</button>                    
                </div>

            </form>
        )
    }
}