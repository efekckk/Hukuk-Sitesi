import type { Metadata } from "next";
import { Geist, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Hukuk Bürosu | Profesyonel Hukuki Danışmanlık",
    template: "%s | Hukuk Bürosu",
  },
  description:
    "Uzman avukat kadromuzla ceza hukuku, aile hukuku, iş hukuku ve daha birçok alanda profesyonel hukuki danışmanlık hizmeti sunuyoruz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
