import "./globals.css";
import { ReactNode } from "react";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "YogAstra",
  description: "Yogasana Scoring System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />

        {/* iOS support */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>

      <body className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-200 to-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
