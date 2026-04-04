import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { GlobalNavbar } from "@/components/global/GlobalNavbar";
import { Footer } from "@/components/global/Footer";

;

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
  metadataBase: new URL('https://deespenhouse.site'),
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "Dee's Pen House | Architect of Narratives",
    description: "Bespoke ghostwriting, content writing, and brand storytelling by Dee's Pen House.",
    url: 'https://deespenhouse.site',
    siteName: "Dee's Pen House",
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: "Dee's Pen House Branding",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dee's Pen House | Storytelling & Creative Agency",
    description: "Bespoke ghostwriting, content writing, and brand storytelling by Dee's Pen House.",
    images: ['/opengraph-image.png'],
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
