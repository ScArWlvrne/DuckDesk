import type { Metadata } from "next";
import "./globals.css";
import Navigate from "./componenets/Navigate";


export const metadata: Metadata = {
  title: "ATGS",
  description: "Academic Ticketing and Graduation System for University of Oregon made by Duck Desk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
