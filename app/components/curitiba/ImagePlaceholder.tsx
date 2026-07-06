type Aspect = "4/5" | "1/1" | "fill";

const aspectClass: Record<Aspect, string> = {
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  fill: "h-full min-h-[inherit]",
};

export default function ImagePlaceholder({
  label,
  aspect = "4/5",
  className = "",
}: {
  label: string;
  aspect?: Aspect;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full items-center justify-center bg-placeholder px-6 text-center text-[11px] uppercase tracking-[0.14em] text-faint ${aspectClass[aspect]} ${className}`}
      aria-label={label}
      role="img"
    >
      {label}
    </div>
  );
}