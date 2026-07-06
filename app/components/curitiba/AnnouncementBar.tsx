import { siteData } from "@/app/lib/site-data";

export default function AnnouncementBar() {
  if (!siteData.announcement.show) return null;

  return (
    <div className="bg-ink px-6 py-[10px] text-center text-[11px] uppercase tracking-[0.16em] text-white">
      {siteData.announcement.text}
    </div>
  );
}