"use client"

import Link from "next/dist/client/link";
import "./page.css";

// Handle the privacy policy page
export default function PrivacyPolicy() {
    return (
        <>
            <div className="privacyPolicy_container">
                <h1 className="privacyPolicy_title">Privacy Policy</h1>
                <p className="privacyPolicy_paragraph">This is the privacy policy of the Diary Application. 
                    We value your privacy and are committed to protecting your personal information. 
                    This policy outlines how we collect, use, and safeguard your data.
                </p>
                <div className="privacyPolicy_section">
                    <h2 className="privacyPolicy_sectionTitle">Introduction to My-Diary</h2>
                    <p className="privacyPolicy_paragraph">My-Diary presents itself as the simplest online diary available. 
                        The application has been designed with particular attention to the protection of personal data, 
                        limiting its use to what is strictly necessary. Only cookies essential for the proper functioning 
                        of the application are employed, excluding any unnecessary collection of personal information.
                    </p>
                </div>
                <div className="privacyPolicy_section">
                    <h2 className="privacyPolicy_sectionTitle">Data Storage and Security</h2>
                    <p className="privacyPolicy_paragraph">User data is hosted by NeonDB, a trusted provider based in London, United Kingdom. 
                        My-Diary never shares its users' data with third parties or other companies. 
                        Although the hosting provider claims to ensure data integrity and security, 
                        My-Diary declines all responsibility in the event of data loss or possible sharing by the host, 
                        including with other companies or government authorities. However, the amount of data stored remains limited: 
                        only the user's email address, name, and planned activities are retained.
                    </p>
                </div>
                <div className="privacyPolicy_section">
                    <h2 className="privacyPolicy_sectionTitle">No Advertising and Non-profit Purpose</h2>
                    <p className="privacyPolicy_paragraph">My-Diary contains no advertising, reflecting its non-profit nature. 
                        The sole aim of the site is to simplify users' lives, with no hidden commercial interest. 
                        This site does not belong to any company; it is an amateur project, developed to be shared 
                        with others who wish to use a simple online diary that respects privacy.
                    </p>
                </div>
                <div className="privacyPolicy_section">
                    <h2 className="privacyPolicy_sectionTitle">Account Management</h2>
                    <p className="privacyPolicy_paragraph">Users retain full control over their data: they can delete their account 
                        and all their personal information at any time, directly from the account settings page.
                    </p>
                </div>
                <div className="privacyPolicy_section">
                    <h2 className="privacyPolicy_sectionTitle">GDPR Compliance</h2>
                    <p className="privacyPolicy_paragraph">The General Data Protection Regulation (GDPR) is a European regulation aimed at strengthening the security, 
                        confidentiality, and control that each user has over their personal data. 
                        To ensure compliance with these requirements, My-Diary implements concrete measures: 
                        all data is encrypted during storage and transmission, access to information is strictly limited to authorised individuals, 
                        and every team member receives regular training on data protection. 
                        These actions reflect a genuine and transparent commitment to offering every user the assurance that their information
                        is protected with the utmost care. This desire for clarity and detail guides the entire My-Diary privacy policy: 
                        every commitment or principle adopted is explicitly presented in order to inspire trust and understanding.
                    </p>
                </div>
                <div className="privacyPolicy_section contact_section">
                    <h2 className="privacyPolicy_sectionTitle">Contact Information</h2>
                    <p className="privacyPolicy_paragraph">For any questions, please contact us at : </p>
                    <Link href="mailto:hamov2003@gmail.com" className="email_link">hamov2003@gmail.com</Link>
                </div>
                
            </div>
        </>
    )
}