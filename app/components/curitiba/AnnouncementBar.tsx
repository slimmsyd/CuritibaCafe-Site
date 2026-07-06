import { siteData } from "@/app/lib/site-data";

export default function AnnouncementBar() {
  if (!siteData.announcement.show) return null;

  return (
    <div className="bg-ink px-4 py-2.5 text-center text-[10px] uppercase tracking-[0.14em] text-white sm:px-6 sm:py-[10px] sm:text-[11px] sm:tracking-[0.16em]">
      {siteData.announcement.text}
    </div>
  );
}