import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Providers } from "./providers";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gomor | Gomor Architects",
  description:
    "Gomor Architects is an architecture and design studio creating innovative, sustainable projects worldwide.",
  icons: {
    icon: "/images/gomor.png",
    shortcut: "/images/gomor.png",
    apple: "/images/gomor.png",
  },
  openGraph: {
    title: "Gomor | Gomor Architects",
    description:
      "Gomor Architects is an architecture and design studio creating innovative, sustainable projects worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="cUSGsRAfnBCAQhpzRtLUQmlGNf-F5UkTlsd3atLF4Ug" />
      </head>
      <body style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" }}>
        <Providers>
          <Suspense>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
