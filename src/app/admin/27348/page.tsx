import { loadAll } from "@/lib/data";
import { AdminShell } from "./AdminShell";

export const metadata = { title: "Admin · Portfolio editor" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const data = await loadAll();
  return (
    <main className="min-h-screen bg-bg px-4 sm:px-6 md:px-10 py-6 md:py-10">
      <AdminShell initialData={data} />
    </main>
  );
}
