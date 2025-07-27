import type React from "react";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Onmo Campaign Manager</title>
                <meta name="description" content="AI-powered advertising campaign management" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <ReactQueryProvider>{children}</ReactQueryProvider>
            </body>
        </html>
    );
}
