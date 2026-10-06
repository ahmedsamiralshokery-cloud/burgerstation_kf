export const CONFIG = {
  whatsapp: "201276570279", // international format, no "+"
  currency: "ج.م",
  menuKey: "bs_menu",
  cartKey: "bs_cart",
  custKey: "bs_customer",
  adminKey: "bs_admin",
  adminPassword: "burger2026",
} as const;

export type Locale = "ar" | "en";
export const LOCALES: Locale[] = ["ar", "en"];
export const DEFAULT_LOCALE: Locale = "ar";