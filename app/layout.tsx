import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Often good for PWA feel
};

export const metadata: Metadata = {
  title: "Instagram Downloader",
  description: "Download Instagram Reels and Posts easily.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "InstaDL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-2xl z-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
