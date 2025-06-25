import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import { RoleProvider } from "@/Context/RoleContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AasPass",
  description: "Find what interesting happeing around you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RoleProvider>

          {children}

        </RoleProvider>
      </body>
    </html>
  );
}
