import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin · Sign in" };
export const dynamic = "force-dynamic";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const nextPath = searchParams.next || "/admin/27348";
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <div className="w-full max-w-sm glass-panel hairline rounded-sm p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
          ◇ Admin Console
        </div>
        <h1 className="mt-3 font-display text-2xl tracking-tight text-ink">
          Restricted area
        </h1>
        <p className="mt-2 text-sm text-ink-mute">
          Enter the admin password to edit portfolio content.
        </p>
        <div className="mt-6">
          <LoginForm nextPath={nextPath} />
        </div>
      </div>
    </main>
  );
}
