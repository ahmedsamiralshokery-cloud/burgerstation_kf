"use client";

import { useCart } from "@/lib/cart-context";

export function Toast() {
  const { toastMsg, toastShow } = useCart();
  return (
    <div id="toast" className={toastShow ? "show" : ""} role="status" aria-live="polite">
      {toastMsg}
    </div>
  );
}
