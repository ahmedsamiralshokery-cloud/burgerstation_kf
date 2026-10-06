"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { useCart } from "@/lib/cart-context";
import { ad, read, write } from "@/lib/storage";
import { CONFIG } from "@/lib/config";

function buildMessage(cust: { name: string; phone: string; addr: string }, lines: { name: string; qty: number; price: number }[], total: number, cur: string) {
  const detail = lines.map((l, i) => `${ad(i + 1)}. ${l.name} × ${ad(l.qty)} = ${ad(l.price * l.qty)} ${cur}`).join("\n");
  return [
    "🍔 *طلب جديد - Burger Station*",
    "",
    `👤 الاسم: ${cust.name}`,
    `📞 الهاتف: ${ad(cust.phone)}`,
    `📍 العنوان: ${cust.addr}`,
    "",
    "🧾 *تفاصيل الطلب:*",
    detail,
    "",
    `💰 *الإجمالي: ${ad(total)} ${cur}*`,
  ].join("\n");
}

export function CartDrawer({ lang }: { lang: Locale }) {
  const {
    cart, total, count, lookup, changeQty, removeLine, toast,
  } = useCart();
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [cust, setCust] = useState({ name: "", phone: "", addr: "" });
  const [loaded, setLoaded] = useState(false);

  const cur = t(lang, "currency");

  /* Remember customer details */
  useEffect(() => {
    const c = read(CONFIG.custKey, {} as Record<string, string>);
    setCust({ name: c.name || "", phone: c.phone || "", addr: c.addr || "" });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) write(CONFIG.custKey, cust);
  }, [cust, loaded]);

  useEffect(() => {
    if (count > 0) {
      setBump(true);
      const id = setTimeout(() => setBump(false), 400);
      return () => clearTimeout(id);
    }
  }, [count]);

  /* Body scroll lock while drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onCheckout = useCallback(() => {
    const c = {
      name: cust.name.trim(),
      phone: cust.phone.trim(),
      addr: cust.addr.trim(),
    };
    if (!cart.length) return;
    if (!c.name || !c.phone || !c.addr) {
      toast(t(lang, "missingFields"));
      return;
    }
    const lines = cart.map((l) => {
      const p = lookup(l.k)!;
      return { name: p.name, qty: l.qty, price: p.price };
    });
    const msg = buildMessage(c, lines, total, cur);
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    if (!window.open(url, "_blank")) window.location.href = url;
  }, [cart, cust, total, cur, lang, lookup, toast]);

  return (
    <>
      <button
        id="cartBtn"
        aria-label={t(lang, "cartTitle")}
        className={bump ? "bump" : ""}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 7H6" />
        </svg>
        <span id="count">{ad(count)}</span>
      </button>

      <div className={"veil" + (open ? " open" : "")} onClick={() => setOpen(false)} aria-hidden={!open} />

      <aside className={"drawer" + (open ? " open" : "")} aria-label={t(lang, "cartTitle")} aria-hidden={!open}>
        <div className="dh">
          <h2>{t(lang, "cartTitle")}</h2>
          <button className="x" onClick={() => setOpen(false)} aria-label={t(lang, "close")}>
            &times;
          </button>
        </div>

        <div id="items">
          {cart.length ? (
            cart.map((l) => {
              const p = lookup(l.k);
              if (!p) return null;
              const pic = p.img ? (
                <img className="thumb" src={p.img} alt="" />
              ) : (
                <div className="em">{p.emoji}</div>
              );
              return (
                <div className="item" key={l.k}>
                  {pic}
                  <div>
                    <h4>{p.name}</h4>
                    <small>{ad(p.price)} {cur}</small>
                    <div className="ctl">
                      <button onClick={() => changeQty(l.k, -1)} aria-label="أقل">−</button>
                      <b>{ad(l.qty)}</b>
                      <button onClick={() => changeQty(l.k, 1)} aria-label="أكثر">+</button>
                      <b className="lt">{ad(p.price * l.qty)} {cur}</b>
                      <button className="rm" onClick={() => removeLine(l.k)}>
                        {lang === "ar" ? "حذف" : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="empty">{t(lang, "emptyCart")}</p>
          )}
        </div>

        <div className="cust">
          <input
            value={cust.name}
            onChange={(e) => setCust({ ...cust, name: e.target.value })}
            placeholder={t(lang, "name")}
            autoComplete="name"
          />
          <input
            type="tel"
            value={cust.phone}
            onChange={(e) => setCust({ ...cust, phone: e.target.value })}
            placeholder={t(lang, "phone")}
            autoComplete="tel"
          />
          <textarea
            rows={2}
            value={cust.addr}
            onChange={(e) => setCust({ ...cust, addr: e.target.value })}
            placeholder={t(lang, "addr")}
          />
        </div>

        <div className="sum">
          <div className="tot">
            <span>{t(lang, "total")}</span>
            <span>{ad(total)} {cur}</span>
          </div>
          <button className="chk" disabled={!cart.length} onClick={onCheckout}>
            {t(lang, "checkout")}
          </button>
        </div>
      </aside>
    </>
  );
}
