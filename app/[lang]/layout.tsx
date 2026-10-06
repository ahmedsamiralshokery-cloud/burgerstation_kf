import { notFound } from "next/navigation";
import type { Locale } from "@/lib/config";

export function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  if (lang !== "ar" && lang !== "en") notFound();
  return <>{children}</>;
}
