import { getChatMessages } from "@/app/lib/chat-messages";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const messages = await getChatMessages();

  return (
    <div className="flex flex-col gap-[clamp(20px,4vw,32px)]">
      <div className="flex flex-col gap-[6px]">
        <span className="font-display text-[12px] uppercase tracking-[0.34em] text-gold">
          Chat
        </span>
        <h1 className="m-0 font-display text-[clamp(26px,3.4vw,40px)] font-normal leading-[1.05] tracking-[-0.02em]">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </h1>
      </div>
      {messages.length === 0 ? (
        <p className="rounded-[10px] bg-panel p-[28px] text-[15px] text-ink-soft">
          No chat messages yet. Guest questions appear here once{" "}
          <code className="text-[13px]">DATABASE_URL</code> is set and{" "}
          <code className="text-[13px]">npm run db:init</code> has been run.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-ink/10">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-panel text-left font-display text-[11px] uppercase tracking-[0.12em] text-muted">
                <th className="px-[14px] py-[12px] font-medium">When</th>
                <th className="px-[14px] py-[12px] font-medium">Guest asked</th>
                <th className="px-[14px] py-[12px] font-medium">Reply</th>
                <th className="px-[14px] py-[12px] font-medium">Intent</th>
                <th className="px-[14px] py-[12px] font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((row) => (
                <tr key={row.id} className="border-t border-ink/10 align-top">
                  <td className="whitespace-nowrap px-[14px] py-[12px] text-ink-soft">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="max-w-[220px] px-[14px] py-[12px] font-medium text-ink">
                    {row.user_message}
                  </td>
                  <td className="max-w-[320px] whitespace-pre-line px-[14px] py-[12px] text-ink-soft">
                    {row.assistant_reply}
                  </td>
                  <td className="px-[14px] py-[12px] text-ink-soft">{row.intent}</td>
                  <td className="px-[14px] py-[12px] text-ink-soft">{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}