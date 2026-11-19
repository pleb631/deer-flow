import { redirect } from "next/navigation";

import { getServerSideUser } from "@/core/auth/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const auth = await getServerSideUser();
  redirect(
    auth.tag === "authenticated" || auth.tag === "needs_setup"
      ? "/workspace"
      : "/login",
  );
}
