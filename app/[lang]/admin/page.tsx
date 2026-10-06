import type { Locale } from "@/lib/config";
import { AdminPanel } from "@/components/AdminPanel";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return <AdminPanel lang={lang} />;
}
