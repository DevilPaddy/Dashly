import type { Metadata } from "next";
import { Inter_Tight, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Navbar from "./components/pageUi/Navbar";
import Footer from "./components/pageUi/Footer";


const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dashly",
  description: "Privacy-first productivity dashboard",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${interTight.variable}
          ${libreBaskerville.variable}
          antialiased
        `}
      >
        <Navbar />
        <div className="mx-auto">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

