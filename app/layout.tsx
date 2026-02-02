import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slides Template Generator for TipTap",
  description: "Generate and Download Templates using Custom Themes in Tiptap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <Toaster position="top-center" reverseOrder={false} />

        {children}
      </body>
    </html>
  );
}
