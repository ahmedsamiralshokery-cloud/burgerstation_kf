import { redirect } from "next/navigation";

/* Root path → default locale */
export default function Home() {
  redirect("/ar");
}
