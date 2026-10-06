import type { Metadata } from "next";
import "./globals.css";
import { LocaleSync } from "./locale-sync";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Burger Station | كفر الدوار — أول مطعم برجر متخصص",
  description:
    "أول مطعم برجر متخصص في كفر الدوار. اطلب عبر واتساب — توصيل وسفري. ش. الحدائق، أبراج الحلواني.",
  openGraph: {
    title: "Burger Station | كفر الدوار",
    description: "أول مطعم برجر متخصص في كفر الدوار · ⭐ 4.8",
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/images/logo.jpg", width: 110, height: 110 }],
  },
  twitter: {
    card: "summary",
    title: "Burger Station | كفر الدوار",
    description: "أول مطعم برجر متخصص في كفر الدوار · ⭐ 4.8",
  },
  icons: { icon: "/images/logo.jpg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <LocaleSync />
      </body>
    </html>
  );
}
