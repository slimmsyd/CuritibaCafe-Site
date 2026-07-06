export default function LocationMap({
  query,
  className = "",
}: {
  query: string;
  className?: string;
}) {
  // Keyless embed - no API key or billing required for the interactive map.
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  return (
    <iframe
      title={`Map to ${query}`}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className={`block h-full w-full border-0 bg-placeholder ${className}`}
    />
  );
}
