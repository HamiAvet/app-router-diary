'use client'

import { FormEvent } from "react";
import { redirect } from "next/navigation";

export default function LogoutButton() {
    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
        user.preventDefault();  
        const formData = new FormData(user.currentTarget);  
        
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
 
        const response = await fetch("/api/auth/logout/", options);
        if (response.status === 200) {
            redirect('/login');
        } 
    };

    return (
        <form onSubmit={handleForm}>
            <button className="logout_button" type="submit" >Logout</button>
        </form>
    )
}