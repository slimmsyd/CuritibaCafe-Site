import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav from "@/app/admin/components/AdminNav";
import { getSession } from "@/app/lib/auth-server";
import { logoutAction } from "../actions";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await getSession())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-[240px] shrink-0 border-r border-[#ebeae5] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#ebeae5] px-5 py-5">
          <Link
            href="/admin"
            className="font-display text-[15px] font-semibold tracking-[-0.01em] text-ink"
          >
            Curitiba CRM
          </Link>
          <p className="m-0 mt-1 text-[12px] text-ink-soft">Manage your café site</p>
        </div>
        <AdminNav />
        <div className="mt-auto border-t border-[#ebeae5] p-3">
          <Link
            href="/"
            target="_blank"
            className="admin-nav-link text-[13px]"
          >
            View live site ↗
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-[#ebeae5] bg-white lg:hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <Link href="/admin" className="font-display text-[15px] font-semibold text-ink">
              CRM
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" target="_blank" className="text-[13px] text-ink-soft">
                Site ↗
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="admin-btn-secondary min-h-9 px-3 py-1.5 text-[13px]">
                  Log out
                </button>
              </form>
            </div>
          </div>
          <div className="overflow-x-auto border-t border-[#f3f2ee] px-2 py-2">
            <AdminNav />
          </div>
        </header>

        <header className="hidden items-center justify-end gap-3 border-b border-[#ebeae5] bg-white px-8 py-3 lg:flex">
          <form action={logoutAction}>
            <button type="submit" className="admin-btn-secondary min-h-9 px-4 py-2 text-[13px]">
              Log out
            </button>
          </form>
        </header>

        <main className="mx-auto w-full max-w-[820px] flex-1 px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}