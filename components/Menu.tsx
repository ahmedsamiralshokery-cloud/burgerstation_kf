"use client";

import { useState } from "react";
import type { Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { useCart } from "@/lib/cart-context";

export function Menu({ lang }: { lang: Locale }) {
  const { menu, addToCart, toast, lookup } = useCart();
  const [activeCat, setActiveCat] = useState(menu.categories[0]?.id);

  const cat =
    menu.categories.find((c) => c.id === activeCat) || menu.categories[0];
  const rows = menu.items.filter((i) => i.cat === cat.id);

  const head = cat.sized ? (
    <div className="row hdr">
      <span />
      <span className="pr">
        <b className="p">{t(lang, "single")}</b>
        <b className="p">{t(lang, "double")}</b>
      </span>
      <span />
    </div>
  ) : null;

  const onAdd = (k: string, e: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(k);
    toast(t(lang, "added"));
    const p = lookup(k);
    if (p) {
      /* flying dot */
      const btn = e.currentTarget;
      const fly = document.createElement("div");
      fly.className = "fly";
      const r = btn.getBoundingClientRect();
      const c = document.getElementById("cartBtn")?.getBoundingClientRect();
      if (c) {
        fly.style.left = r.left + r.width / 2 + "px";
        fly.style.top = r.top + "px";
        document.body.appendChild(fly);
        fly
          .animate(
            [
              { transform: "translate(0,0) scale(1)", opacity: 1 },
              {
                transform: `translate(${c.left + 18 - r.left - r.width / 2}px,${
                  c.top + 18 - r.top
                }px) scale(.3)`,
                opacity: .4,
              },
            ],
            { duration: 650, easing: "ease-in" },
          )
          .onfinish = () => fly.remove();
      } else fly.remove();
    }
  };

  return (
    <>
      <div className="tabs" role="tablist" aria-label={t(lang, "menu")}>
        {menu.categories.map((c) => (
          <button
            key={c.id}
            className={c.id === activeCat ? "on" : ""}
            role="tab"
            aria-selected={c.id === activeCat}
            onClick={() => setActiveCat(c.id)}
          >
            {c.ar}
          </button>
        ))}
      </div>
      <div id="menu">
        {head}
        {rows.length ? (
          rows.map((i) => (
            <div className="row" key={i.id}>
              <span className="nm">
                {i.img ? <img className="thumb" src={i.img} alt="" loading="lazy" /> : null}
                <span>{i.ar}</span>
              </span>
              <span className="pr">
                <button className="p pb" onClick={(e) => onAdd(i.id + "|s", e)} aria-label={`Add ${i.en}`}>
                  {i.p1}
                </button>
                {cat.sized && i.p2 != null ? (
                  <button className="p pb" onClick={(e) => onAdd(i.id + "|d", e)} aria-label={`Add double ${i.en}`}>
                    {i.p2}
                  </button>
                ) : null}
              </span>
              <span className="en" dir="ltr">{i.en}</span>
            </div>
          ))
        ) : (
          <p className="empty">{t(lang, "emptyMenu")}</p>
        )}
      </div>
    </>
  );
}
