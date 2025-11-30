import "./globals.css";
import { ReactNode } from "react";
import ToastContainer from "../components/toast";
import BottomNav from "../components/BottomNav";


export const metadata = {
  title: "YogAstra",
  description: "Yogasana Scoring System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900 bg-gradient-to-br from-indigo-200 via-blue-200 to-white">
        {children}
        <BottomNav />
        <ToastContainer />
      </body>
    </html>
  );
}
