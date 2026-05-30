import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kavata’s Kitchen - Handcrafted African Gourmet Dining",
  description: "Experience premium, handcrafted Swahili heritage meals and gourmet fast food in Nairobi. Prepared with personal care by Chef Kavata and delivered fresh to your doorstep.",
  keywords: "Kavata's Kitchen, luxury food delivery Nairobi, gourmet Swahili Pilau, premium Nyama Choma, organic Kenyan restaurants, Westlands food delivery",
  openGraph: {
    title: "Kavata’s Kitchen - Handcrafted African Gourmet Dining",
    description: "Experience premium, handcrafted Swahili heritage meals and gourmet fast food in Nairobi.",
    url: "https://kavatas-kitchen.vercel.app",
    type: "website",
  }
};

import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0B0B0C] text-white flex flex-col font-sans select-none">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
