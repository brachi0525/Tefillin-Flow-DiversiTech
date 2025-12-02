"use client";
import "../i18n";
import "./globals.css";
import "../styles/direction.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import { useDirection } from "../hooks/useDirection";
import { Toaster } from "react-hot-toast";

//import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { direction, isRTL } = useDirection();

  return (
    <html lang={isRTL ? "he" : "en"} dir={direction}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-right" reverseOrder={false} /> 
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}
