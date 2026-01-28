"use client"

import { useEffect } from "react"
import { useState } from "react"
import { redirect } from "next/navigation"
import { usePathname } from "next/navigation"

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    const [isChecked, setIsChecked] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const userSession = await fetch('/api/sessionProviders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (userSession.status === 201) {
                    setIsAuthed(true);
                } else {
                    setIsAuthed(false);
                }
                setIsChecked(true);
            } catch {
                setIsAuthed(false);
            } 
        };
        checkSession();
        
    }, [pathname]);

    if (isChecked) {
        if (isAuthed) {
            console.log("is Authed :", isAuthed);
            if (pathname === "/" || pathname === "/login" || pathname === "/register") {
                console.log("the pathname is :", pathname);
                redirect("/diary");
            }
        }
        if (!isAuthed) {
            console.log("is Not Authed :", isAuthed);
            if ((pathname === "/diary" || pathname === "/diary/create" || pathname === "/settings") || pathname === "/settings/changePassword/null") {
                console.log("the pathname is :", pathname);
                redirect("/login");
            }
        }
    }
    if (!isChecked) {
        return null;
    }
    return <>{children}</>;
}

