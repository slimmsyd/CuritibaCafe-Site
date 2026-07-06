import ImagePlaceholder from "./ImagePlaceholder";

type Aspect = "4/5" | "1/1" | "fill";

const aspectClass: Record<Aspect, string> = {
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  fill: "h-full min-h-[inherit]",
};

export default function CafeImage({
  src,
  label,
  aspect = "4/5",
  className = "",
}: {
  src?: string;
  label: string;
  aspect?: Aspect;
  className?: string;
}) {
  const image = src?.trim();
  if (image) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-placeholder ${aspectClass[aspect]} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={label}
          className="h-full w-full object-cover"
        />
        {image.startsWith("data:") ? null : (
          <span className="sr-only">{label}</span>
        )}
      </div>
    );
  }

  return (
    <ImagePlaceholder label={label} aspect={aspect} className={className} />
  );
}