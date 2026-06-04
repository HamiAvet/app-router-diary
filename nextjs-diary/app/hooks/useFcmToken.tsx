"use client";

import { useEffect, useState, useRef } from "react";
import { onMessage, Unsubscribe } from "firebase/messaging";
import { messaging, fetchToken } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Function to handle notification permission and to get the FCM token
async function getNotificationPermission() {
    // Step 1: Check if the browser supports notifications
    if (!("Notification" in window)) {
        return null;
    }

    // Step 2: Check if the permission is already granted
    if (Notification.permission === "granted") {
        // If permission is granted, fetch the FCM token
        const fcmtoken = await fetchToken();
        // console.log(fcmtoken);
        
        // Get the user ID from local storage
        const userId = localStorage.getItem("userId"); 
        // If user ID and token are available, send the token to the server to save it in the database
        if (userId && fcmtoken) {
            // Send the token to the server to save it in the database
            await fetch("/api/pushFcm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, fcmtoken }),
            });
        }        
        return fcmtoken;
    }

    // Step 3: If permission is not granted, request permission from the user
    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const fcmtoken = await fetchToken();
            const userId = localStorage.getItem("userId"); // Get the user ID from local storage
            if (userId && fcmtoken) {
                // Send the token to the server to save it in the database
                await fetch("/api/pushFcm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId, token: fcmtoken }),
                });
            }
            return fcmtoken;
        }
    }

    // If permission is denied, log an error and return null
    return null;
}

export default function useFcmToken() {
    const router = useRouter(); // Initialize the router for navigation
    const [fcmToken, setFcmToken] = useState<string | null>(null); // State to hold the FCM token
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null); // State to hold the notification permission status
    const retryLoadToken = useRef(0); // Ref to track the number of retries for loading the token
    const isLoading = useRef(false); // Ref to track if the token is currently being loaded
    // Function to load the FCM token and handle notification permission
    const loadToken = async () => {
        // Step 4: Prevent multiple fetches if already fetching or in process
        if (isLoading.current) return;

        isLoading.current = true; // Mark that we are currently loading the token
        const fcmToken = await getNotificationPermission(); // Get notification permission and token        
        console.log("FCM Token Hook Initialized:", fcmToken); // Log when the hook is initialized

        // Step 5: Handle the case where permission is denied
        if (Notification.permission === "denied") {
            // If permission is denied, set the notification permission state and show an error message
            setNotificationPermission("denied");
            toast.error(`Notification permission denied :
                Please enable it in your browser settings.`);
            isLoading.current = false;
            return;
        }

        // Step 6: Retry fetching the token if it fails, up to a maximum of 3 attempts
        // This step is typical initially as the service worker may not be ready/installed yet.
        if (!fcmToken) {
            if (retryLoadToken.current >= 3) { // Retry up more that to 3 times
            toast.error(`Notification issue : 
                Unable to load fcmToken after 3 attempts. Please refresh the browser.`);
            isLoading.current = false;
            return;
            }
            retryLoadToken.current += 1;
            isLoading.current = false;
            return;
        }

        // Step 7: If token is successfully fetched, set the token and notification permission state
        setNotificationPermission(Notification.permission || "granted");
        setFcmToken(fcmToken);
        isLoading.current = false; // Mark that loading is done
    };

    useEffect(() => {
        // Step 8: Initialize the token loading process when the component mounts
        if ("Notification" in window) {
            loadToken(); // The token loading function itself
        }
    }, []);

    useEffect(() => {
        const setupListener = async () => {
            if (!fcmToken) return; // Exit if token is not available

            const fcmMessaging = await messaging(); // Get the messaging instance
            
            if (!fcmMessaging) return; // Exit if messaging is not supported

            // Step 9: Register a listener for incoming FCM messages
            const unsubscribe: Unsubscribe = onMessage(fcmMessaging, (payload) => {
                if (Notification.permission !== "granted") return; // Exit if notifications are not permitted
                // Get the link from the payload, which it came from the FCM service or from the data (application itself)
                const link = payload.fcmOptions?.link || payload.data?.link;

                const toastTitle =
                    payload.notification?.title ||
                    payload.data?.title ||
                    "Notification";
                const toastBody =
                    payload.notification?.body ||
                    payload.data?.body ||
                    "";

                toast.info(`${toastTitle}: ${toastBody}`, link
                    ? {
                        action: {
                            label: "Close",
                            onClick: () => {
                                toast.dismiss(); // Dismiss the toast when the action button is clicked
                            },
                        },
                    }
                    : undefined
                );
            });


        // return the unsubscribe function
        return unsubscribe; 
        };

        // Step 11: // Cleanup the listener when the component unmounts or when token changes
        let unsubscribe: Unsubscribe | null = null; // Initialize the unsubscribe variable
        setupListener().then((unsub) => {
            if (unsub) {
                unsubscribe = unsub; // Set the unsubscribe function once the listener is set up
            }
        });

        return () => unsubscribe?.(); // Cleanup the listener when the component unmounts or when token changes
    }, [fcmToken, router]); // Re-run the effect if the token or router changes
    
    return { fcmToken, notificationPermission }; // Return the token and notification permission status from the hook
};

// Example usage of the useFcmToken hook in a component
/*
    const { fcmToken, notificationPermission } = useFcmToken(); // Use the custom hook to get the FCM token and notification permission status

    // You can use the fcmToken and notificationPermission in your component as needed
    console.log("FCM Token:", fcmToken);
    console.log("Notification Permission:", notificationPermission);

    // For example, you can display the token and permission status in the UI
    <div>
        <p>FCM Token: {fcmToken ? fcmToken : "No token available"}</p>
        <p>Notification Permission: {notificationPermission}</p>
    </div>      

*/