"use client"

import { useEffect } from "react"
import { useState } from "react"
import { redirect } from "next/navigation"
import { usePathname } from "next/navigation"

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    // Initilize state to check if the session has been checked and if the user is authenticated
    const [isChecked, setIsChecked] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);

    // Get the current pathname to check if the user is on a protected route
    const pathname = usePathname();

    // Check the session on component mount and when the pathname changes
    useEffect(() => {
        const checkSession = async () => {
            try {
                // Make a request to the sessionProviders API route to check if the user is authenticated
                const userSession = await fetch('/api/sessionProviders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // If the response status is 201, the user is authenticated, otherwise they are not
                if (userSession.status === 201) {
                    setIsAuthed(true);
                } else {
                    // If the user is not authenticated, set the state to false
                    setIsAuthed(false);
                }
                // Set the state to true to indicate that the session has been checked
                setIsChecked(true);
            } catch {
                setIsAuthed(false);
            } 
        };
        // Call the checkSession function to check the session
        checkSession();
        
    }, [pathname]);
    
    // If the session has been checked
    if (isChecked) {
        // If the user is authenticated and they are on a protected route, redirect them to the diary page
        if (isAuthed) {
            console.log("is Authed :", isAuthed);
            console.log("the pathname is :", pathname);

            // this block is working went pathname is not /settings/changePassword/null           
            if (["/", "/login", "/register"].includes(pathname) 
                || (pathname.startsWith("/settings/changePassword/") 
                && pathname !== "/settings/changePassword/null")) {
                console.log("redirecting to /diary from");
                redirect("/diary");
            }
        }
        // If the user is not authenticated and they are on a protected route, redirect them to the login page
        if (!isAuthed) {
            console.log("is Not Authed :", isAuthed);
            console.log("the pathname is :", pathname);
            
            // this block is don't working went pathname is /settings/changePassword/null, but it should work
            if ((pathname === "/diary" || pathname === "/diary/create" || pathname === "/settings") 
                || pathname === "/settings/changePassword/null") {
                redirect("/login");
            }
        }
    }
    // If the session has not been checked, return null to prevent rendering the children components
    if (!isChecked) {
        return null;
    }
    // If the session has been checked and the user is authenticated, return the children components
    return <>{children}</>;
}

/*
"use client"

import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    const [isChecked, setIsChecked] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const userSession = await fetch('/api/sessionProviders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setIsAuthed(userSession.status === 201);
            } catch {
                setIsAuthed(false);
            } finally {
                setIsChecked(true);
            }
        };
        
        checkSession();
    }, []);

    useEffect(() => {
        if (!isChecked) return;

        const publicRoutes = ["/", "/login", "/register"];
        
        const isPasswordResetRoute = pathname.startsWith("/settings/changePassword/");
        const isValidResetRoute = isPasswordResetRoute && pathname !== "/settings/changePassword/null";
        
        const protectedRoutes = ["/diary", "/diary/create", "/settings"];

        if (!isAuthed) {

            if (protectedRoutes.includes(pathname) || 
                (isPasswordResetRoute && !isValidResetRoute)) {
                console.log("Unauth access to protected route, redirecting to /login");
                router.replace("/login");
            }
            return;
        }

        if (isAuthed) {

            if (publicRoutes.includes(pathname) || 
                (isPasswordResetRoute && !isValidResetRoute && pathname !== "/settings")) {
                console.log("Auth user on public route, redirecting to /diary");
                router.replace("/diary");
            }
        }
    }, [isChecked, isAuthed, pathname, router]);

    if (!isChecked) {
        return null;
    }
    
    return <>{children}</>;
}
*/