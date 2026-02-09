import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Learn with AI",
    description: "Platform for AI-powered learning",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
