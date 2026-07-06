import { getSiteContent } from "@/app/lib/content";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const site = await getSiteContent();
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-[400px] rounded-xl border border-[#ebeae5] bg-white p-8 shadow-[0_8px_30px_rgba(17,17,17,0.06)]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Curitiba CRM
        </span>
        <h1 className="mb-6 mt-2 font-display text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
          Sign in
        </h1>
        <p className="mb-6 text-[14px] text-ink-soft">
          Manage {site.brand.siteName} — artists, chat, and site content.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}