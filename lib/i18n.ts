import ar from "../messages/ar.json";
import en from "../messages/en.json";
import type { Locale } from "./config";

const MESSAGES: Record<Locale, Record<string, string>> = { ar, en };

export function t(locale: Locale, key: string): string {
  return MESSAGES[locale][key] ?? key;
}

export const MESSAGES_ = MESSAGES;
