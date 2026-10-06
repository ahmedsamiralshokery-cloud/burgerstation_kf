"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { Menu } from "./Menu";
import { CartDrawer } from "./CartDrawer";

export function Storefront({ lang }: { lang: Locale }) {
  const other = lang === "ar" ? "en" : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir}>
      {/* Language switcher */}
      <nav
        style={{
          position: "absolute",
          top: 10,
          [lang === "ar" ? "left" : "right"]: 12,
          zIndex: 25,
        }}
      >
        <Link
          href={`/${other}`}
          style={{
            color: "var(--muted)",
            fontSize: ".8rem",
            fontWeight: 700,
            textDecoration: "none",
            border: "1px solid var(--card)",
            borderRadius: 999,
            padding: "3px 10px",
            background: "var(--card)",
          }}
        >
          {other === "en" ? "EN" : "عربي"}
        </Link>
      </nav>

      {/* Header */}
      <header className="site">
        <Image src="/images/logo.jpg" alt="Burger Station logo" width={110} height={110} />
        <h1>{lang === "ar" ? "Burger Station" : "Burger Station"}</h1>
        <p>{t(lang, "tagline")} · {t(lang, "rating")}</p>
        <a className="btn" href="tel:01276570279">
          {t(lang, "call")}
        </a>
      </header>

      <main className="w">
        {/* Photos */}
        <div className="pics">
          <Image src="/images/photo0.jpg" alt="Burger Station interior" width={400} height={240} />
          <Image src="/images/photo1.jpg" alt="Burger Station food" width={400} height={240} />
        </div>

        {/* Menu */}
        <h2 className="bi">
          <span>{t(lang, "menu")}</span>
          <span dir="ltr">{lang === "ar" ? "Menu" : "المنيو"}</span>
        </h2>
        <p className="note">{t(lang, "menuNote")}</p>
        <Menu lang={lang} />

        {/* Visit Us */}
        <h2 className="bi">
          <span>{t(lang, "visit")}</span>
          <span dir="ltr">{lang === "ar" ? "Visit Us" : "زورونا"}</span>
        </h2>
        <div className="box">
          <p>📍 {t(lang, "address")}</p>
          <p>🕚 {t(lang, "hours")}</p>
        </div>
      </main>

      <footer className="site">
        {t(lang, "footer")}{" "}
        <a className="adm" href={`/${lang}/admin`} title="Admin" aria-label="Admin">
          {t(lang, "adminHint")}
        </a>
      </footer>

      <CartDrawer lang={lang} />
    </div>
  );
}
