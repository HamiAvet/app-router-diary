"use client";

import "./page.css";
import NavBar from "../ui/navbar/navbar"; 
import { FormEvent, useEffect } from "react";
import { useState } from "react";
import { redirect } from "next/navigation";
import WebPushPermissionButton from "../ui/WebPushPermissionButton/WebPushPermissionButton";
import DeleteAccountButton from "../ui/deleteAccountButton/deleteAccountButton"
import Link from "next/link";
import Image from "next/image";

export default function Settings() {
    const [ error, setError ] = useState<string | null>(null);
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ showPasswordConfirm, setShowPasswordConfirm ] = useState<boolean>(false);
    const [ userData, setUserData ] = useState<{ username: string; email: string; password: string } | null>(null);
    const [ hasNoChanged , setHasChanged ] = useState<boolean>(false);
  
    const handlePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowPassword(!showPassword);
    };
  
    const handlePasswordConfirmVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowPasswordConfirm(!showPasswordConfirm);
    };

    useEffect(() => {
        async function fetchUserData() {
            const userId = localStorage.getItem('userId');

            if (userId) {
                const response = await fetch(`/api/settings/${userId}`, { 
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                 });
                if (response.ok) {
                    const result = await response.json();
                    setUserData(result[0])
                }
            }
        }
        
        fetchUserData();
    }, []);
    

    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
        user.preventDefault();  
        const formData = new FormData(user.currentTarget);  
        const userId = localStorage.getItem('userId') || '';
        formData.append('id', userId); 
        const data = Object.fromEntries(formData);
        console.log(data);
        
        if (data.newPassword !== data.newPasswordConfirm) {            
            setError("Passwords do not match");
            return;
        }
        let nameWasChanged = false;
        const updateData = {id : userId} as { id : string; newUsername?: string | null; newEmail?: string | null; newPassword?: string | null; oldPassword?: string | null};
        if (userData?.username !== data.newUsername && typeof data.newUsername === 'string' && data.newUsername.trim() !== '') {
            updateData.newUsername = data.newUsername as string;
            nameWasChanged = true;
            setHasChanged(true);
        } 
        if (userData?.email !== data.newEmail && typeof data.newEmail === 'string' && data.newEmail.trim() !== '') {
            updateData.newEmail = data.newEmail as string;
            setHasChanged(true);
        }
        if (userData?.password !== data.newPassword && typeof data.newPassword === 'string' && data.newPassword.trim() !== '') {
            updateData.newPassword = data.newPassword as string
            updateData.oldPassword = userData?.password
            setHasChanged(true);
        }  
        if (Object.keys(updateData).length === 1 || userData?.username === data.newUsername && userData?.email === data.newEmail) { 
            redirect('/diary');
        }

        const options = {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(updateData)
        }

        const response = await fetch("/api/settings/", options);
        if (response.status === 200) {
            if (nameWasChanged) localStorage.setItem('username', data.newUsername as string);
            redirect('/diary');
        }
    };

    return (
        <>
            <NavBar />
            <div className="register_container">
                <h1>Account Settings</h1>
                <WebPushPermissionButton />
                <DeleteAccountButton />
                <form className="register_form" onSubmit={handleForm}>
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
                    </div>
                    <div className="input_container">
                        <label htmlFor="passwordConfirm">Password Confirmation</label>
                        <div className="input_div">
                            <input name="newPasswordConfirm" id="passwordConfirm" type={showPasswordConfirm ? "text" : "password"} maxLength={50} autoComplete="off"/>
                            <button className="showPassword_btn" type="button" onClick={handlePasswordConfirmVisibility}>
                                <Image width={20} height={20} src={showPasswordConfirm ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPasswordConfirm ? "Hide" : "Show"}/>
                            </button>
                        </div>
                    </div>
                    <div className="buttons_container">
                        <button type="submit" className="confirm_btn" disabled={hasNoChanged}>Confirm</button>
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