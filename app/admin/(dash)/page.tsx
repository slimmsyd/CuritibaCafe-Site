import Link from "next/link";
import { getContentUpdatedAt } from "@/app/lib/content";
import { getOrderCount } from "@/app/lib/orders";
import { getArtistCount, getArtistWorkCount } from "@/app/lib/artists-db";
import { getChatMessageCount } from "@/app/lib/chat-messages";
import { getSubscriberCount } from "@/app/lib/subscribers";
import AdminPageHeader from "@/app/admin/components/ui/AdminPageHeader";

export const dynamic = "force-dynamic";

const cards = [
  { href: "/admin/artists", title: "Artists", key: "artists" as const },
  { href: "/admin/chat", title: "Chat", key: "chat" as const },
  { href: "/admin/orders", title: "Orders", key: "orders" as const },
  { href: "/admin/subscribers", title: "Subscribers", key: "subs" as const },
  { href: "/admin/content", title: "Content", key: "content" as const },
];

export default async function AdminDashboard() {
  const [updatedAt, orders, subs, chats, artists, works] = await Promise.all([
    getContentUpdatedAt(),
    getOrderCount(),
    getSubscriberCount(),
    getChatMessageCount(),
    getArtistCount(),
    getArtistWorkCount(),
  ]);

  const meta: Record<string, string> = {
    artists: `${artists} artists · ${works} works`,
    chat: `${chats} guest questions`,
    orders: `${orders} recorded`,
    subs: `${subs} on the list`,
    content: updatedAt ? `Edited ${updatedAt.toLocaleString()}` : "Using defaults",
  };

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Manage your site"
        description="Pick a section to update the café site, track chat, or manage the artist shelf."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="admin-section flex flex-col gap-2 transition-colors hover:border-gold/30"
          >
            <span className="font-display text-[18px] font-medium text-ink">
              {card.title}
            </span>
            <span className="text-[14px] text-ink-soft">{meta[card.key]}</span>
            <span className="mt-1 text-[13px] font-medium text-gold">Open →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}