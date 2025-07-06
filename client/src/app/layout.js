import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { RoleProvider } from "@/Context/RoleContext";
import { UserProvider } from "@/Context/userContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AassPass",
  description: "Find what interesting happeing around you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><UserProvider>

          <RoleProvider>

            {children}

          </RoleProvider>
      </UserProvider>
      </body>
    </html>
  );
}
