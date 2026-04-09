import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigate from "./componenets/Navigate";


export const metadata: Metadata = {
  title: "ATGS",
  description: "Academic Ticketing and Graduation System for University of Oregon made by Duck Desk",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const dynamic = "force-dynamic";

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
