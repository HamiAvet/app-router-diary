'use client';


import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import "./page.css";

export default function Home() {
  // get actual url


    const userId = localStorage.getItem('userId');
    if (userId) {
      redirect('/diary');
    }

 
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
