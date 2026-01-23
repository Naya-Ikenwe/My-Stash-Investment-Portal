import type { Metadata } from "next";
// import { Montserrat } from "next/font/google";
import "./globals.css";
import { bodyFont, headingFont } from "./fonts";
import { Toaster } from "react-hot-toast"; 

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-montserrat",
// });

export const metadata: Metadata = {
  title: "MyStash Investment Portal",
  description: "Secured investments for you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
        // className={`${montserrat.variable} antialiased`}
      >
        {children}

        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
