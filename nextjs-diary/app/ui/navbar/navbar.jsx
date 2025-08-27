'use client'

import { useState } from "react";
import Link from "next/link";
import "./navbar.css";

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        if (!isLoggedIn) {
            setIsLoggedIn(true); 
        } else {
            setIsLoggedIn(false);
        }
        
    }

    return (
        <nav className="navBar">
            <div className="logo" >
                <Link href="/diary" >
                    <img src="/diary-icon.svg" alt="Logo" width={50} height={50} />
                </Link>
            </div>
            <div className="user" >
                <img src="/user.svg" alt="User" width={40} height={40} />
                <p>User Name</p>
                <button className="settings_button" >
                    <img src="/settings-3-line.svg" alt="Settings" width={20} height={20} />
                </button>
            </div>
            <div className="buttons-container">
                {isLoggedIn ? (
                    <button className="logout_button" onClick={handleLogin} >Logout</button>
                ) : (
                    <button className="login_button" onClick={handleLogin} >Login</button>
                )}
            </div>
        </nav>
    )
}