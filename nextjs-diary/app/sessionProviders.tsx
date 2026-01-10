"use client"

import { useEffect } from "react"

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  // On component mount, clear local storage if there is no active session
  
  useEffect(() => {
    const clearStorageIfNoSession = async () => {
        // Make an API call to check for an active user session
        const userSession = await fetch('/api/sessionProviders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        // If there is no active user session, clear local storage
        if (userSession.status === 200) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
            }
        }
    };
    clearStorageIfNoSession();
  }, [])
    return <>{children}</>
}

/*
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
            } catch {
                setIsAuthed(false);
            } finally {
                setIsChecked(true);
            }
        };
        checkSession();
    }, [pathname]);

    useEffect(() => {
        if (!isChecked) return;
        if (isAuthed) {
            if (["/", "/login", "/register"].includes(pathname)) {
                redirect("/diary");
            }
        } else {
            if (["/diary", "/diary/create", "/settings", "/settings/changePassword/null"].includes(pathname)) {
                redirect("/login");
            }
        }
    }, [isChecked, isAuthed, pathname]);

    if (!isChecked) {
        return null;
    }
    return <>{children}</>;
}

*/