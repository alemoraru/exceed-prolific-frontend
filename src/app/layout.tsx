import type {Metadata} from "next";
import {Gabarito} from "next/font/google";
import "./globals.css";
import React from "react";

const gabarito = Gabarito({
    variable: "--font-gabarito",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "EXCEED Prolific",
    description: "Prolific mockup study for EXCEED.",
    icons: {
        icon: 'favicon.ico',
        shortcut: 'favicon.ico',
        apple: 'favicon.ico'
    }
};

export default function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en">
        <body
            className={`${gabarito.className} ${gabarito.variable} font-sans antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
