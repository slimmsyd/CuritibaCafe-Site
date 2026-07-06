import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminPageHeader({
  backHref,
  backLabel,
  eyebrow,
  title,
  description,
  badge,
  actions,
}: {
  backHref?: string;
  backLabel?: string;
  eyebrow: string;
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-[#ebeae5] pb-8">
      {backHref ? (
        <Link
          href={backHref}
          className="w-fit text-[13px] font-medium text-gold hover:text-ink"
        >
          ← {backLabel ?? "Back"}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            {eyebrow}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="m-0 font-display text-[clamp(28px,4vw,36px)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
              {title}
            </h1>
            {badge}
          </div>
          {description ? (
            <p className="m-0 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
    </header>
  );
}