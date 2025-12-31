'use client'

import Link from "next/link";
import LogoutButton from "@/app/ui/logoutButton/logoutButton"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./navbar.css";

export default function NavBar() {
    const [ username, setUsername ] = useState(null);
    const [ isLogged, setIsLogged ] = useState(false);
    const pathname = usePathname();
    
    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            setUsername(username);
            setIsLogged(true);
        }
    }, []);

    if (!isLogged && pathname === "/login") {
        return (
            <nav className="navBar">
                <div className="logo" >
                    <Link href="/diary" >
                        <img src="/diary-icon.svg" alt="Logo" width={50} height={50} />
                    </Link>
                </div>
                <Link href="/register" className="auth_button">Sign Up</Link>
            </nav>
        );
    } else if (!isLogged && pathname !== "/login") {
        return (
            <nav className="navBar">
                <div className="logo" >
                    <Link href="/diary" >
                        <img src="/diary-icon.svg" alt="Logo" width={50} height={50} />
                    </Link>
                </div>
                <div className="buttons-container">
                    <Link href="/login" className="auth_button">Login</Link>
                </div>
            </nav>
        );
    } else {
        return (
            <nav className="navBar">
                <div className="logo" >
                    <Link href="/diary" >
                        <img src="/diary-icon.svg" alt="Logo" width={50} height={50} />
                    </Link>
                </div>
                <div className="user">
                    <img src="/user.svg" alt="User" className="user_icon" width={40} height={40} />
                    <p>{username}</p>
                    <Link href="/settings" className="settings_button" >
                        <img src="/settings-3-line.svg" alt="Settings" width={20} height={20} />
                    </Link>
                </div>
                <div className="buttons-container">
                    <LogoutButton/>
                </div>
            </nav>
        );
    }
}