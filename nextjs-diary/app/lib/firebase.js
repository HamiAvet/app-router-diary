import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpXtU0AP01dkeHQPd6rTe7dv9bUFi5Aow",
  authDomain: "my-diary-notif.firebaseapp.com",
  projectId: "my-diary-notif",
  storageBucket: "my-diary-notif.firebasestorage.app",
  messagingSenderId: "781350826419",
  appId: "1:781350826419:web:9985ad419b5cf2a5e01bc6",
  measurementId: "G-3W0GE1FBPD"
};

// Initialize Firebase and get messaging instance
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Function to get messaging instance if supported
const messaging = async () => {
  // Check if Firebase Messaging is supported in the current browser
  const supported = await isSupported();
  if (supported) {
    // If supported, return the messaging instance
    return getMessaging(firebaseApp);
  }
};

// Function to fetch the FCM token
export const fetchToken = async () => {
  try {
    // Get the messaging instance
    const fcmMessaging = await messaging();
    // If messaging is supported, get the FCM token using the VAPID key
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });
      // Return the token if it was successfully retrieved
      return token;
    }
  } catch (error) {
    // Else log any errors that occur during the token retrieval process
    console.error("Error fetching FCM token:", error);
    return null;
  }
};

export { firebaseApp, messaging };
