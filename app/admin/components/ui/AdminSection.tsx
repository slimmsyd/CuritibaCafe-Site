import type { ReactNode } from "react";

export default function AdminSection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="admin-section flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f0efeb] pb-5">
        <div className="flex max-w-xl flex-col gap-1.5">
          <h2 className="m-0 font-display text-[18px] font-medium tracking-[-0.01em] text-ink">
            {title}
          </h2>
          {description ? (
            <p className="m-0 admin-hint">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}