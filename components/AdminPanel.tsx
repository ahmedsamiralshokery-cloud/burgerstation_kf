"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/config";
import { CONFIG } from "@/lib/config";
import { t } from "@/lib/i18n";
import { useCart } from "@/lib/cart-context";
import type { MenuItem, MenuCategory } from "@/lib/menu-types";

export function AdminPanel({ lang }: { lang: Locale }) {
  const { menu, setMenu, resetMenu, toast } = useCart();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ItemForm | null>(null);
  const [uploaded, setUploaded] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  /* Gate: only allow the panel once authed */
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(CONFIG.adminKey) === "1") setAuthed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback(() => {
    if (pw === CONFIG.adminPassword) {
      try {
        window.sessionStorage.setItem(CONFIG.adminKey, "1");
      } catch {
        /* ignore */
      }
      setAuthed(true);
      setErr("");
    } else {
      setErr("كلمة السر غلط");
    }
  }, [pw]);

  const openForm = useCallback(
    (item?: MenuItem) => {
      const m = menu;
      setEditingId(item?.id ?? null);
      setForm({
        cat: item?.cat || m.categories[0].id,
        ar: item?.ar || "",
        en: item?.en || "",
        p1: item ? String(item.p1) : "",
        p2: item && item.p2 != null ? String(item.p2) : "",
        img: item?.img || "",
      });
      setUploaded("");
      setModalOpen(true);
    },
    [menu],
  );

  const cancelForm = () => {
    setEditingId(null);
    setForm(null);
    setModalOpen(false);
  };

  const save = useCallback(() => {
    if (!form) return;
    const m = JSON.parse(JSON.stringify(menu));
    const cat = m.categories.find((c: { id: string; sized: boolean }) => c.id === form.cat);
    const ar = form.ar.trim();
    const p1 = parseFloat(form.p1);
    if (!ar || isNaN(p1)) {
      alert("اكتب الاسم والسعر");
      return;
    }
    const p2raw = form.p2.trim();
    const it: MenuItem = {
      id: editingId || "x" + Date.now().toString(36),
      cat: cat.id,
      ar,
      en: form.en.trim(),
      p1,
      p2: cat.sized && p2raw !== "" ? parseFloat(p2raw) : null,
      img: uploaded || form.img.trim(),
    };
    const idx = m.items.findIndex((i: MenuItem) => i.id === it.id);
    idx >= 0 ? (m.items[idx] = it) : m.items.push(it);
    if (!setMenu(m)) {
      alert("المساحة ممتلئة: استخدم صور أصغر أو مسار images/");
      return;
    }
    cancelForm();
    toast("تم الحفظ ✓");
  }, [form, editingId, uploaded, menu, setMenu, toast]);

  const del = useCallback(
    (id: string) => {
      if (!confirm("تحذف الصنف ده؟")) return;
      const m = JSON.parse(JSON.stringify(menu));
      m.items = m.items.filter((i: MenuItem) => i.id !== id);
      setMenu(m);
      toast("تم الحذف");
    },
    [menu, setMenu, toast],
  );

  const exportFile = useCallback(() => {
    const txt =
      "import { MenuData } from \"./menu-types\";\n\nexport const DEFAULT_MENU: MenuData = " +
      JSON.stringify(menu, null, 1) +
      ";\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/javascript" }));
    a.download = "menu-data.ts";
    a.click();
  }, [menu]);

  const reset = useCallback(() => {
    if (confirm("ترجع المنيو الأصلي وتمسح تعديلاتك؟")) {
      resetMenu();
      toast("تم الاسترجاع ✓");
    }
  }, [resetMenu, toast]);

  /* ---- file upload + compression (same 600px / jpeg .7 as original) ---- */
  const onFile = useCallback(
    (file: File) => {
      const r = new FileReader();
      r.onload = () => {
        const im = new Image();
        im.onload = () => {
          const s = Math.min(1, 600 / im.width);
          const c = document.createElement("canvas");
          c.width = Math.round(im.width * s);
          c.height = Math.round(im.height * s);
          c.getContext("2d")!.drawImage(im, 0, 0, c.width, c.height);
          setUploaded(c.toDataURL("image/jpeg", 0.7));
          toast("تم رفع الصورة");
        };
        im.src = r.result as string;
      };
      r.readAsDataURL(file);
    },
    [toast],
  );

  /* ============ LOGIN VIEW ============ */
  if (!authed) {
    return (
      <Shell lang={lang}>
        <h2>🔒 {t(lang, "adminTitle")}</h2>
        <input
          type="password"
          placeholder="كلمة السر"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          autoFocus
        />
        <button className="sbtn" onClick={login}>دخول</button>
        <Link className="sbtn" href={`/${lang}`}>إغلاق</Link>
        {err && <p className="note">{err}</p>}
      </Shell>
    );
  }

  /* ============ PANEL VIEW ============ */
  return (
    <Shell lang={lang}>
      <div className="dh" style={{ marginBottom: 12 }}>
        <h2>⚙️ إدارة المنيو</h2>
        <Link className="x" href={`/${lang}`} aria-label={t(lang, "close")}>
          &times;
        </Link>
      </div>

      <div className="atools">
        <button className="sbtn" onClick={() => openForm()}>+ إضافة صنف</button>
        <button className="sbtn" onClick={exportFile}>⬇ تصدير menu-data.ts</button>
        <button className="sbtn del" onClick={reset}>استرجاع الافتراضي</button>
      </div>

      <p className="note">
        التعديلات بتتحفظ على المتصفح ده. عشان تظهر لكل العملاء: اضغط "تصدير" واستبدل ملف
        lib/menu-default.ts.
      </p>

      {form ? (
        <div className="aform">
          <label>القسم</label>
          <select
            value={form.cat}
            onChange={(e) => setForm({ ...form, cat: e.target.value })}
          >
            {menu.categories.map((c: MenuCategory) => (
              <option key={c.id} value={c.id}>{c.ar}</option>
            ))}
          </select>

          <label>الاسم بالعربي</label>
          <input value={form.ar} onChange={(e) => setForm({ ...form, ar: e.target.value })} />

          <label>English name</label>
          <input
            dir="ltr"
            value={form.en}
            onChange={(e) => setForm({ ...form, en: e.target.value })}
          />

          <label>السعر (Single)</label>
          <input
            type="number"
            min="0"
            value={form.p1}
            onChange={(e) => setForm({ ...form, p1: e.target.value })}
          />

          <label>سعر Double (اختياري)</label>
          <input
            type="number"
            min="0"
            value={form.p2}
            onChange={(e) => setForm({ ...form, p2: e.target.value })}
          />

          <label>الصورة: مسار مثل /images/x.jpg، أو ارفع صورة</label>
          <input
            dir="ltr"
            value={form.img}
            placeholder="/images/..."
            onChange={(e) => setForm({ ...form, img: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
          {uploaded && (
            <img src={uploaded} alt="preview" style={{ width: 96, borderRadius: 8 }} />
          )}

          <button className="sbtn" onClick={save}>💾 حفظ</button>
          <button className="sbtn" onClick={cancelForm}>إلغاء</button>
        </div>
      ) : null}

      {menu.categories.map((c: MenuCategory) => {
        const items = menu.items.filter((i) => i.cat === c.id);
        return (
          <div key={c.id}>
            <div className="hd">{c.ar} · {c.en}</div>
            {items.map((i) => (
              <div className="arow" key={i.id}>
                {i.img ? <img className="thumb" src={i.img} alt="" /> : <span style={{ width: 44 }} />}
                <span>
                  {i.ar} <small>{i.en}</small>
                  <br />
                  <b>{i.p1}{i.p2 != null ? " / " + i.p2 : ""} {t(lang, "currency")}</b>
                </span>
                <button className="sbtn" onClick={() => openForm(i)}>تعديل</button>
                <button className="sbtn del" onClick={() => del(i.id)}>حذف</button>
              </div>
            ))}
          </div>
        );
      })}
    </Shell>
  );
}

/* simple page shell so admin page works standalone */
function Shell({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", padding: "20px" }} className="w">
      <div className="mbox" style={{ background: "transparent", padding: 0 }}>{children}</div>
    </div>
  );
}

interface ItemForm {
  cat: string;
  ar: string;
  en: string;
  p1: string;
  p2: string;
  img: string;
}
