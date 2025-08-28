'use client'

import { FormEvent } from "react";
import { useState } from "react";
import "./page.css";

export default function registerPage() {
    const [ results, setResults ] = useState(null);


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

        const response = await fetch("/api/register/", options);
        const result = await response.json();
        setResults(result);
        console.log(results);
    
   };
    return (
        <div className="register_container">
            <h1>Register</h1>
            <form className="register_form" onSubmit={handleForm}>
                <div className="input_div">
                    <label htmlFor="username">Username</label>
                    <input name="username" id="username" type="text" maxLength={20} required/>
                </div>
                <div className="input_div">
                    <label htmlFor="email">Email</label>
                    <input name="email" id="email" type="email" maxLength={20} required/>
                </div>
                <div className="input_div">
                    <label htmlFor="password">Password</label>
                    <input name="password" id="password" type="password" maxLength={20} required/>
                </div>
                <button type="submit">Register</button>
            </form>
            
        </div>
    )
}