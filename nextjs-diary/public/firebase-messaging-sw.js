// Import the Firebase scripts needed for the service worker
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

// The Firebase configuration for this project (copied from the Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCpXtU0AP01dkeHQPd6rTe7dv9bUFi5Aow",
  authDomain: "my-diary-notif.firebaseapp.com",
  projectId: "my-diary-notif",
  storageBucket: "my-diary-notif.firebasestorage.app",
  messagingSenderId: "781350826419",
  appId: "1:781350826419:web:9985ad419b5cf2a5e01bc6",
  measurementId: "G-3W0GE1FBPD"
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);
// Get an instance of Firebase Messaging to handle background messages
const messaging = firebase.messaging();

// Handle background messages received through Firebase Cloud Messaging
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  // Prepering the notification options

  // Checking if a link exists in the payload using fcmOptions or data, and using it for the notification click action
  const link = payload.fcmOptions.link || payload.data?.link
  
  // Setting up the notification title and options
  const notificationTitle = payload.notification.title;
  const notificationOptions = { 
    body: payload.notification.body,
    icon: '/diary-icon.svg',
    data: { url: link } // You can put whatever data you want here
  };
  
  // Show the notification to the user
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events to navigate the user to the appropriate page when they click on the notification
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  // Close the notification
  event.notification.close(); 
  
  // This checks if the client is already open and if it is, it focuses on the tab. 
  // If it is not open, it opens a new tab with the URL passed in the notification payload
  
  event.waitUntil(
    // Match the clients to see if there's already a tab open with the URL from the notification data
    clients
      // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
      .matchAll({ type: "window", includeUncontrolled: true })
      // Get the clients list
      .then((clientsList) => {
        // Get the URL from the notification data
        const url = event.notification.data?.url;
        // If there's no URL, just return and do nothing
        if (!url) {
          return;
        };
        // For each client in the clients list, check if the URL matches the one from the notification data
        clientsList.forEach(client => {
          // If there's already a tab open with the URL, focus it again
          if (client.url === url && "focus" in client) {
            return client.focus();
          };
        });
        // If not, open a new tab with the URL
        if (clients.openWindow) {
          return clients.openWindow(url);
        };
      })
  );
});