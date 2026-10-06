"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_MENU, type MenuData } from "./menu-default";
import { CONFIG } from "./config";
import { read, write } from "./storage";
import type { MenuItem, MenuCategory } from "./menu-types";

export interface CartLine {
  k: string; // "itemId|s" or "itemId|d"
  qty: number;
}

export interface ResolvedItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  img: string;
}

interface CartCtx {
  menu: MenuData;
  setMenu: (m: MenuData) => boolean;
  resetMenu: () => void;
  cart: CartLine[];
  count: number;
  total: number;
  lookup: (k: string) => ResolvedItem | null;
  addToCart: (k: string) => void;
  changeQty: (k: string, delta: number) => void;
  removeLine: (k: string) => void;
  clearCart: () => void;
  toast: (msg: string) => void;
  toastMsg: string;
  toastShow: boolean;
}

const Ctx = createContext<CartCtx | null>(null);

const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));

export function CartProvider({ children }: { children: ReactNode }) {
  const [menu, setMenuState] = useState<MenuData>(DEFAULT_MENU);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);

  /* Hydrate: load persisted menu + cart once */
  useEffect(() => {
    const saved = read<MenuData | null>(CONFIG.menuKey, null);
    if (saved && Array.isArray(saved.items) && Array.isArray(saved.categories)) {
      setMenuState(clone(saved));
    }
    setCart(read<CartLine[]>(CONFIG.cartKey, []));
  }, []);

  useEffect(() => {
    write(CONFIG.cartKey, cart);
  }, [cart]);

  const lookup = useCallback(
    (k: string): ResolvedItem | null => {
      const [id, sz] = k.split("|");
      const it: MenuItem | undefined = menu.items.find((i) => i.id === id);
      if (!it) return null;
      const cat: MenuCategory =
        menu.categories.find((c) => c.id === it.cat) ??
        { id: "", ar: "", en: "", sized: false, emoji: "" };
      const dbl = sz === "d" && it.p2 != null;
      return {
        id,
        name:
          it.ar +
          (cat.sized
            ? dbl
              ? " (دبل)"
              : " (سنجل)"
            : ""),
        price: Number(dbl ? it.p2 : it.p1),
        emoji: cat.emoji || "🍽️",
        img: it.img,
      };
    },
    [menu],
  );

  const total = useMemo(
    () =>
      cart.reduce((s, c) => {
        const p = lookup(c.k);
        return s + (p ? p.price * c.qty : 0);
      }, 0),
    [cart, lookup],
  );

  const count = useMemo(() => cart.reduce((a, c) => a + c.qty, 0), [cart]);

  /* Drop lines whose item was deleted from the menu */
  useEffect(() => {
    setCart((c) => c.filter((l) => lookup(l.k)));
  }, [lookup]);

  const setMenu = useCallback((m: MenuData): boolean => {
    if (!write(CONFIG.menuKey, m)) return false;
    setMenuState(clone(m));
    return true;
  }, []);

  const resetMenu = useCallback(() => {
    try {
      window.localStorage.removeItem(CONFIG.menuKey);
    } catch {
      /* ignore */
    }
    setMenuState(clone(DEFAULT_MENU));
  }, []);

  const addToCart = useCallback((k: string) => {
    setCart((c) => {
      const found = c.find((x) => x.k === k);
      return found
        ? c.map((x) => (x.k === k ? { ...x, qty: x.qty + 1 } : x))
        : [...c, { k, qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((k: string, delta: number) => {
    setCart((c) =>
      c
        .map((x) => (x.k === k ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0),
    );
  }, []);

  const removeLine = useCallback((k: string) => {
    setCart((c) => c.filter((x) => x.k !== k));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 1600);
  }, []);

  const value = useMemo(
    () => ({
      menu,
      setMenu,
      resetMenu,
      cart,
      count,
      total,
      lookup,
      addToCart,
      changeQty,
      removeLine,
      clearCart,
      toast,
      toastMsg,
      toastShow,
    }),
    [
      menu,
      setMenu,
      resetMenu,
      cart,
      count,
      total,
      lookup,
      addToCart,
      changeQty,
      removeLine,
      clearCart,
      toast,
      toastMsg,
      toastShow,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
