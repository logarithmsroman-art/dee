import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { GlobalNavbar } from "@/components/global/GlobalNavbar";
import { Footer } from "@/components/global/Footer";

export const runtime = 'edge';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dee's Pen House | Storytelling & Creative Agency",
  description: "Bespoke ghostwriting, content writing, and brand storytelling by Dee's Pen House.",
  openGraph: {
    title: "Dee's Pen House",
    description: "Bespoke ghostwriting, content writing, and brand storytelling by Dee's Pen House.",
    type: "website",
    siteName: "Dee's Pen House",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans">
        <GlobalNavbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
