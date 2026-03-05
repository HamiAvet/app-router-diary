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
        return await fetchToken();
    }

    // Step 3: If permission is not granted, request permission from the user
    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            return await fetchToken();
        }
    }

    // If permission is denied, log an error and return null
    return null;
}

export default function useFcmToken() {
    const router = useRouter(); // Initialize the router for navigation
    const [token, setToken] = useState<string | null>(null); // State to hold the FCM token
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null); // State to hold the notification permission status
    const retryLoadToken = useRef(0); // Ref to track the number of retries for loading the token
    const isLoading = useRef(false); // Ref to track if the token is currently being loaded

    // Function to load the FCM token and handle notification permission
    const loadToken = async () => {
        // Step 4: Prevent multiple fetches if already fetching or in process
        if (isLoading.current) return;

        isLoading.current = true; // Mark that we are currently loading the token
        const token = await getNotificationPermission(); // Get notification permission and token
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
        if (!token) {
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
        setToken(token);
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
            if (!token) return; // Exit if token is not available

            const fcmMessaging = await messaging(); // Get the messaging instance

            if (!fcmMessaging) return; // Exit if messaging is not supported

            // Step 9: Register a listener for incoming FCM messages
            const unsubscribe: Unsubscribe = onMessage(fcmMessaging, (payload) => {
                if (Notification.permission !== "granted") return; // Exit if notifications are not permitted
                // Get the link from the payload, which it came from the FCM service or from the data (application itself)
                const link = payload.fcmOptions?.link || payload.data?.link;

                if (link) {
                    // Show a toast notification with the title and body from the payload, and include an action to navigate to the link when clicked
                    toast.info(`${payload.notification?.title}: 
                        ${payload.notification?.body}`,
                    {
                        action: {
                            label: "Close",
                            onClick: () => {
                                toast.dismiss(); // Dismiss the toast when the action button is clicked
                            },
                        },
                    }); 
                } else {
                    // If no link is provided, just show the notification without an action
                    toast.info(`${payload.notification?.title}: 
                        ${payload.notification?.body}`); // Show a toast notification with the title and body from the payload
                }

                // --------------------------------------------------------
                /* Disable this if you only want toast notifications
                const notif = new Notification(
                    payload.notification?.title || "New Notification",
                    {
                        body: payload.notification?.body || "You have a new notification.",
                        // You can also include an icon or other options here
                        data: link ? { url: link } : undefined, // Include the link in the notification data if it exists
                    }
                );

                // Step 10: Handle the notification click event to navigate to the link if it exists
                notif.onclick = (event) => {
                    event.preventDefault(); // To not refresh the page when notification is clicked
                    const link = (event.target as any)?.data?.url; // Get the link from the notification data
                    if (link) {
                        router.push(link); // Navigate to the link when the notification is clicked
                    } else {
                        console.log("No link provided in the notification payload."); // Log if no link is provided
                    }
                                 
                };   
                // -------------------------------------------------------- */               
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
    }, [token, router, toast]);
    
    return { token, notificationPermission }; // Return the token and notification permission status from the hook
};

// Example usage of the useFcmToken hook in a component
/*
    const { token, notificationPermission } = useFcmToken(); // Use the custom hook to get the FCM token and notification permission status

    // You can use the token and notificationPermission in your component as needed
    console.log("FCM Token:", token);
    console.log("Notification Permission:", notificationPermission);

    // For example, you can display the token and permission status in the UI
    <div>
        <p>FCM Token: {token ? token : "No token available"}</p>
        <p>Notification Permission: {notificationPermission}</p>
    </div>      

*/