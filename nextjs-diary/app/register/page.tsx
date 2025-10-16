'use client'

import { FormEvent } from "react";
import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import generateKey from "@/app/cli/generateKey";
import "./page.css";

export default function RegisterPage() {
    /*const user = await getSessionUser();
    if (JSON.stringify(user) !== "{}") {
        redirect('/diary');
    }*/
    const [ error, setError ] = useState<string | null>(null);
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ showPasswordConfirm, setShowPasswordConfirm ] = useState<boolean>(false);

    const handlePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    }

    const handlePasswordConfirmVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowPasswordConfirm(!showPasswordConfirm);
    }

    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
        user.preventDefault();  
        const userId = generateKey();
        const formData = new FormData(user.currentTarget);  
        formData.append('id', userId); 
        
        const data = Object.fromEntries(formData);  
        if (data.password !== data.passwordConfirm) {
            setError("Passwords do not match");
            return;
        }
        const JSONData = JSON.stringify(data);  
        console.log(JSONData);  
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSONData
        }

        const response = await fetch("/api/auth/register/", options);
        if (response.status === 201) {
            redirect('/login');
        }
    };

    return (
        <div className="register_container">
            <h1>Register</h1>
            <form className="register_form" onSubmit={handleForm}>
                <div className="input_container">
                    <label htmlFor="username">Username</label>
                    <div className="input_div">
                        <input name="username" id="username" type="text" maxLength={20} required autoComplete="off"/>
                    </div>
                </div>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <div className="input_div">
                        <input name="email" id="email" type="email" maxLength={50} required autoComplete="lo"/>
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
                <div className="input_container">
                    <label htmlFor="passwordConfirm">Password Confirmation</label>
                    <div className="input_div">
                        <input name="passwordConfirm" id="passwordConfirm" type={showPasswordConfirm ? "text" : "password"} maxLength={50} required />
                        <button className="showPassword_btn" type="button" onClick={handlePasswordConfirmVisibility}>
                            <Image width={20} height={20} src={showPasswordConfirm ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPasswordConfirm ? "Hide" : "Show"}/>
                        </button>
                    </div>
                </div>
                <div className="buttons_container">
                    <button type="submit" className="confirm_btn">Sign Up</button>
                    <Link href="/login">
                        <button type="button" className="redirect_btn">Login</button>
                    </Link>
                </div>

                {error && <p className="error_message">{error}</p>}
            </form>
        </div>
    )
}
