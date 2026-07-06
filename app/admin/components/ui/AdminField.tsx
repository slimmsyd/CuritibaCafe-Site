import type { ReactNode } from "react";

export default function AdminField({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="admin-label">
        {label}
      </label>
      {hint ? <p className="m-0 admin-hint">{hint}</p> : null}
      {children}
    </div>
  );
}