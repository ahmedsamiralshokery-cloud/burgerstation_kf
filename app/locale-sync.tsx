"use client";

import { useEffect } from "react";

/* Keeps <html> lang + dir in sync with the URL's locale prefix */
export function LocaleSync() {
  useEffect(() => {
    const sync = () => {
      const m = window.location.pathname.match(/^\/(ar|en)(\/|$)/);
      const locale = m ? m[1] : "ar";
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      document.title =
        locale === "ar"
          ? "Burger Station | كفر الدوار"
          : "Burger Station | Kafr El Dawar";
      try {
        localStorage.setItem("bs_locale", locale);
      } catch {
        /* ignore */
      }
    };
    sync();
    window.addEventListener("popstate", sync);
  }, []);
  return null;
}
