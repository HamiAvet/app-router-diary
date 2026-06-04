import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "./sessionProviders";
import { Toaster } from "sonner";


import "./globals.css";

// Import Geist and Geist Mono fonts from Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Import Geist Mono font from Google Fonts
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define metadata for the application
export const metadata: Metadata = {
  title: "My-Diary - Simple Online Diary",
  description: "A simple and secure online diary application to keep your thoughts and memories safe.",
};

// Root layout component that wraps the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // You can add global providers here if needed using usepathname or other hooks
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster
          toastOptions={{
            actionButtonStyle: {
              background: "#427ffa",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 14px",
              cursor: "pointer",
            },
            cancelButtonStyle: {
              background: "#E5E7EB",
              color: "#111827",
              fontWeight: "bold",
              padding: "10px 14px",
              borderRadius: "8px",
              cursor: "pointer",
            },
            style: {
              background: "#fff",
              color: "#111827",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
