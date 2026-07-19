import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "MedLink — Your Trusted Healthcare Partner",
  description: "Book appointments, find doctors, explore medical information, and access emergency services — all in one place.",
  keywords: ["healthcare", "appointments", "doctors", "medical", "MedLink"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900 text-white py-8 text-center mt-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
            <p className="relative z-10">&copy; 2026 MedLink. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
