'use client';

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import "./page.css";

export default function Home() {
  // Authentication check
  const [checked, setChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  // On component mount, check for user authentication
  useEffect(() => {
    const user = localStorage.getItem("userId") || null;
    if (user) {
      redirect('/diary'); // Redirect to diary if authenticated
    } else {
      setIsAuthed(true); // User is not authenticated
    }
      setChecked(true); // Mark that the check is done
  }, []);

  // If authentication check is not done yet, return null
  if (!checked || !isAuthed) {
    return null; 
  }
  
  // Return the home page JSX
  return (
    <div className="home_container">
      <main className="home_main">
        <Image src="/fb36ca3d.png" alt="Welcome !" width={600} height={600}/>
        <div className="home_text_container">
          <h1>Diary</h1>
          <p>Welcome to your personal diary. Organize your events and tasks efficiently.</p>
          <div className="buttons_container">
            <Link href="/register">
              <button type="submit" className="singup_btn">Sign Up</button>
            </Link>
            <Link href="/login">
              <button type="button" className="login_btn">Login</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
