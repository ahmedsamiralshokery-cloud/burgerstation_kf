"use client";

import { type ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import { Toast } from "./Toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toast />
    </CartProvider>
  );
}
