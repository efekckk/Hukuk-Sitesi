import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuditLogClient } from "./audit-log-client";

export default async function AuditLogPage() {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  return <AuditLogClient />;
}
