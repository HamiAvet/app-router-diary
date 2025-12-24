"use client"

import Link from "next/dist/client/link";
import "./footer.css";

// Footer component
export default function Footer() {
    return (
        <footer className="footer_container">
            <Link href="/privacyPolicy" className="privacy_policy_link">Privacy Policy</Link>
            <p className="copyrights">© 2024 My-Diary. All rights reserved.</p>
        </footer>
    );
}