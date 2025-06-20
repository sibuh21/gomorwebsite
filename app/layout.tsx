import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "@radix-ui/themes/styles.css";
import { Providers } from "./providers";
import { Metadata } from "next";

export const metadata:Metadata={
  title:"gomor website",
  description:"gomor architects website"
}
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NavBar />
            <main className="pl-5 min-h-screen" >{children}</main>
          {/* <Footer /> */}
         
        </Providers>
      </body>
    </html>
  );
}
