"use client";

export default function AdminToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-[#ebeae5] bg-paper px-4 py-3.5 text-left transition-colors hover:border-[#dddcd6]"
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-[14px] font-medium text-ink">{label}</span>
        {description ? (
          <span className="text-[12px] text-ink-soft">{description}</span>
        ) : null}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-gold" : "bg-[#d8d7d2]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}