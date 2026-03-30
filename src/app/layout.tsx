import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Warbler Banner alternatifi — ultra-thin editorial serif
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AEB Avukatlık Ortaklığı | Hukuki Danışmanlık",
    template: "%s | AEB Avukatlık Ortaklığı",
  },
  description:
    "Aşcı Etci Benglian Avukatlık Ortaklığı — ticaret hukuku, uyuşmazlık çözümü ve kurumsal danışmanlık alanlarında uzmanlaşmış bağımsız hukuk bürosu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
