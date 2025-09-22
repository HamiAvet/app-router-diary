"use client";

import "./page.css";
import NavBar from "../ui/navbar/navbar"; 
import { FormEvent } from "react";
import { useState } from "react";
//import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


export default function Settings() {
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
        const formData = new FormData(user.currentTarget);  
        const data = Object.fromEntries(formData);
        const JSONData = JSON.stringify(data);  
        console.log(JSONData);  
    };

    return (
        <>
            <NavBar />
            <div className="register_container">
                <h1>Account Settings</h1>
                <form className="register_form" onSubmit={handleForm}>
                    <div className="input_container">
                        <label htmlFor="username">Username</label>
                        <div className="input_div">
                            <input name="username" id="username" type="text" maxLength={20} placeholder="ggg" required autoComplete="off" />
                        </div>
                    </div>
                    <div className="input_container">
                        <label htmlFor="email">Email</label>
                        <div className="input_div">
                            <input name="email" id="email" type="email" maxLength={50} placeholder="" required autoComplete="off"/>
                        </div>
                    </div>    
                    <h2>Change your Password</h2>
                    <div className="input_container">
                        <label htmlFor="password">Password</label>
                        <div className="input_div">
                            <input name="password" id="password" type={showPassword ? "text" : "password"} maxLength={50} required autoComplete="off"/>
                            <button className="showPassword_btn" type="button" onClick={handlePasswordVisibility}>
                                <Image width={20} height={20} src={showPassword ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPassword ? "Hide" : "Show"}/>
                            </button>
                        </div>
                    </div>
                    <div className="input_container">
                        <label htmlFor="passwordConfirm">Password Confirmation</label>
                        <div className="input_div">
                            <input name="passwordConfirm" id="passwordConfirm" type={showPasswordConfirm ? "text" : "password"} maxLength={50} required autoComplete="off"/>
                            <button className="showPassword_btn" type="button" onClick={handlePasswordConfirmVisibility}>
                                <Image width={20} height={20} src={showPasswordConfirm ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPasswordConfirm ? "Hide" : "Show"}/>
                            </button>
                        </div>
                    </div>
                    <div className="buttons_container">
                        <button type="submit" className="confirm_btn">Confirm</button>
                        <Link href="/login">
                            <button type="button" className="redirect_btn">Cancel</button>
                        </Link>
                    </div>

                    {error && <p className="error_message">{error}</p>}
                </form>
            </div>
        </>

    );
}