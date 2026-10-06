import type { Metadata } from "next";
import type { Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { DEFAULT_MENU } from "@/lib/menu-default";
import { Storefront } from "@/components/Storefront";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const lang = (await params).lang;
  const isAr = lang === "ar";
  return {
    title: isAr
      ? "Burger Station | كفر الدوار — أول مطعم برجر متخصص"
      : "Burger Station | Kafr El Dawar — Specialty Burgers",
    description: isAr
      ? "أول مطعم برجر متخصص في كفر الدوار. اطلب عبر واتساب — توصيل وسفري. ش. الحدائق، أبراج الحلواني."
      : "The first specialty burger restaurant in Kafr El Dawar. Order via WhatsApp — delivery & takeaway.",
    alternates: { languages: { ar: "/ar", en: "/en" } },
    openGraph: {
      title: "Burger Station | " + (isAr ? "كفر الدوار" : "Kafr El Dawar"),
      description: t(lang, "tagline") + " · " + t(lang, "rating"),
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
      images: [{ url: "/images/photo0.jpg", width: 640, height: 480 }],
    },
    twitter: {
      card: "summary",
      title: "Burger Station | " + (isAr ? "كفر الدوار" : "Kafr El Dawar"),
    },
  };
}

function RestaurantSchema({ lang }: { lang: Locale }) {
  const isAr = lang === "ar";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Burger Station",
    image: "/images/photo0.jpg",
    telephone: "+201276570279",
    priceRange: "EGP 10-150",
    servesCuisine: "Burgers",
    address: {
      "@type": "PostalAddress",
      streetAddress: isAr
        ? "ش. الحدائق، أبراج الحلواني، أمام الكنيسة"
        : "Al Hadaiq St., El Halawany Towers, in front of the church",
      addressLocality: isAr ? "كفر الدوار" : "Kafr El Dawar",
      addressCountry: "EG",
    },
    openingHours: "Mo-Su 11:00-06:00",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const lang = (await params).lang;
  return (
    <>
      <RestaurantSchema lang={lang} />
      <Storefront lang={lang} />
    </>
  );
}
