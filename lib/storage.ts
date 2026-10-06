/* Safe localStorage helpers — no-op on SSR, guarded on parse errors */

export function read<T>(key: string, fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function write(key: string, val: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
    return true;
  } catch {
    return false;
  }
}

export function remove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/* Arabic-Indic digits | أرقام عربية */
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export const ad = (v: number | string): string =>
  String(v).replace(/\d/g, (d) => AR_DIGITS[+d]);

/* Convert Arabic-Indic digits back to latin — for phone numbers */
export const latinDigits = (v: string): string =>
  v.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
