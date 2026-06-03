"use client"

import Footer from "@/app/ui/footer/footer";
import NavBar from "@/app/ui/navbar/navbar";
import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useFcmToken from "@/app/hooks/useFcmToken";
import { toast } from "sonner";
import "./page.css";

// Define the types of error messages
type Errors = {
    passwordError: string,
    passwordConfirmError: string,
}

// Define the type for valid token data
type TokenValid = {
    userId: string,
    token: string,
}

export default function ChangePassword() {
    // Get route parameters in dynamic routes [token]
    const params = useParams(); 
    // State to hold error messages
    const [ errors, setErrors ] = useState<Errors | null>({
        passwordError: "",
        passwordConfirmError: "",
    });
        // state to toggle password visibility
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ showPasswordConfirm, setShowPasswordConfirm ] = useState<boolean>(false);
    // Vérification du token uniquement
    const [tokenValid, setTokenValid] = useState<TokenValid | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const passwordUpdateToken = params.token as string;

    const router = useRouter();

    const { fcmToken } = useFcmToken(); // Custom hook to manage FCM token and notification permission

    useEffect(() => {
        async function verifyToken() {
            try {
                if (passwordUpdateToken != "null") {
                    const response = await fetch(`/api/settings/changePassword/${passwordUpdateToken}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                    
                    // if user is not authenticated and if the token is invalid, redirect to login page
                    if (response.status === 400) {
                        toast.error("Invalid or expired token. Please request a new password reset.");
                        // Redirect to login page
                        router.replace("/login");
                        // You can't use redirect() here because useffect is absorbing it, so we use router.replace() instead
                        return;
                    }

                    const result = await response.json();
                    
                    if (result.tokenData && result.tokenData[0]?.userid && result.tokenData[0]?.token) {
                        setTokenValid({
                            userId: result.tokenData[0].userid,
                            token: result.tokenData[0].token
                        });
                    }
                } else {
                    console.log("No token provided in the URL.");
                    console.log(tokenValid);
                    
                }

                setIsChecked(true); // Set isChecked to true after token verification is complete
            } catch (error) {
                console.error("Error verifying token:", error);
            }
        }
        verifyToken();
    }, [passwordUpdateToken]);
    
    if (!isChecked) {
        return null; // Return null while checking the token to prevent rendering the form
    }

    // Handle password visibility toggle
    const handlePasswordVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // For not reloading the page on button click
        setShowPassword(!showPassword);
    };
  
    // Handle password confirmation visibility toggle
    const handlePasswordConfirmVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // For not reloading the page on button click
        setShowPasswordConfirm(!showPasswordConfirm);
    };

    // Handle form submission
    const handleForm = async (user: FormEvent<HTMLFormElement>) => {  
        user.preventDefault(); // For not reloading the page on form submit

        // Clear previous errors
        setErrors({
            passwordError: "",
            passwordConfirmError: "",
        });

        // Get form data
        const formData = new FormData(user.currentTarget);  
        const userId = localStorage.getItem('userId') || tokenValid?.userId || ""; // Get userId from localStorage ou du token
        formData.append('id', userId); // Append the user ID to the form data
        const data = Object.fromEntries(formData);

        // Define request options
        const options = {
            method : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(data)
        }

        // Send POST request to update user settings
        const response = await fetch("/api/settings", options);

        if (response.status === 400) {
            const result = await response.json();
            setErrors({
                passwordError: result.newPasswordError || "",
                passwordConfirmError: result.newPasswordConfirmError || "",
            });
            return;
        } else if (response.status === 200) {
            // Send a notification to the user about the updated password
            await fetch("/api/sendNotification", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ 
                  token: fcmToken,
                  title: "Password was updated",
                  message: `Your password has been updated successfully!`,
                  imageUrl: "/diary-icon.svg", // You can include an image URL in the notification payload if needed
                  link: "/diary" // You can include a link in the notification payload if needed
              })
            });
            // Redirect to settings page after successful password change
            router.replace('/settings');
        }
    };

    return (
        <>
            <NavBar />
            <div className="changePassword_container">
                <h2>Change your Password</h2>
                <form className="changePassword_form" onSubmit={handleForm}>
                    <div className="input_container">
                        <label htmlFor="password">New Password</label>
                        <div className="input_div">
                            <input name="newPassword" id="password" type={showPassword ? "text" : "password"} maxLength={50} autoComplete="off"/>
                            <button className="showPassword_btn" type="button" onClick={handlePasswordVisibility}>
                                <Image width={20} height={20} src={showPassword ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPassword ? "Hide" : "Show"}/>
                            </button>
                        </div>
                        {errors?.passwordError && <p className="error_message">{ errors.passwordError }</p>}
                    </div>
                    <div className="input_container">
                        <label htmlFor="passwordConfirm">Password Confirmation</label>
                        <div className="input_div">
                            <input name="newPasswordConfirm" id="passwordConfirm" type={showPasswordConfirm ? "text" : "password"} maxLength={50} autoComplete="off"/>
                            <button className="showPassword_btn" type="button" onClick={handlePasswordConfirmVisibility}>
                                <Image width={20} height={20} src={showPasswordConfirm ? "/eye-closed-bold.svg" : "/eye-bold.svg"} alt={showPasswordConfirm ? "Hide" : "Show"}/>
                            </button>
                        </div>
                        {errors?.passwordConfirmError && <p className="error_message">{ errors.passwordConfirmError }</p>}
                    </div>
                    <div className="buttons_container">
                        <button type="submit" className="confirm_btn">Confirm</button>
                        <Link href="/login">
                            <button className="redirect_btn">Cancel</button>
                        </Link>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}