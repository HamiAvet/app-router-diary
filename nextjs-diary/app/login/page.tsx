'use client'

import { FormEvent } from "react";
import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./page.css";
//import { getSessionUser } from "../lib/session";

export default function LoginPage() {
    /*const user = await getSessionUser();
    if (JSON.stringify(user) !== "{}") {
        redirect('/diary');
    }*/
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);

    const handlePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    }

    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
       user.preventDefault();  
       const formData = new FormData(user.currentTarget);  
       const data = Object.fromEntries(formData);  
       const JSONData = JSON.stringify(data);  
       
       const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSONData
        }

        const response = await fetch("/api/auth/login/", options);
        const result = await response.json();
        
        if (response.status === 201) {
            localStorage.setItem('username', result[0].username);
            localStorage.setItem('userId', result[0].id);
            redirect('/diary');
        } else {
            setError(result.error);
        }
   };

    return (
        <div className="login_container">
            <h1>Login</h1>
            <form className="login_form" onSubmit={handleForm}>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <div className="input_div">
                        <input name="email" id="email" type="email" maxLength={80} required/>
                    </div>
                </div>    
                <div className="input_container">
                    <label htmlFor="password">Password</label>
                    <div className="input_div">
                        <input name="password" id="password" type={showPassword ? "text" : "password"} maxLength={50} required />
                        <button className="showPassword_btn" type="button" onClick={handlePasswordVisibility}>
                            <Image width={20} height={20} src={showPassword ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPassword ? "Hide" : "Show"}/>
                        </button>
                    </div>
                </div>
                <div className="buttons_container">
                    <button type="submit" className="confirm_btn">Login</button>
                    <Link href="/register">
                        <button className="redirect_btn">Sing Up</button>
                    </Link>
                </div>
                {error && <p className="error_message">{error}</p>}
            </form>
        </div>
    )
}
