import "server-only";
import type { CafeIntent, ChatReplySource } from "./cafe-knowledge";
import { dbEnabled, sql } from "./db";

export type ChatMessageRow = {
  id: number;
  user_message: string;
  assistant_reply: string;
  intent: string;
  source: string;
  created_at: string;
};

type RecordChatMessageInput = {
  userMessage: string;
  assistantReply: string;
  intent: CafeIntent;
  source: ChatReplySource;
};

/** Persist a chat exchange. No-op when DATABASE_URL is unset. */
export async function recordChatMessage(
  input: RecordChatMessageInput,
): Promise<void> {
  if (!dbEnabled) return;

  await sql`
    INSERT INTO chat_messages (user_message, assistant_reply, intent, source)
    VALUES (
      ${input.userMessage},
      ${input.assistantReply},
      ${input.intent},
      ${input.source}
    )
  `;
}

export async function getChatMessages(limit = 500): Promise<ChatMessageRow[]> {
  if (!dbEnabled) return [];
  const rows = await sql`
    SELECT id, user_message, assistant_reply, intent, source, created_at
    FROM chat_messages
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows as ChatMessageRow[];
}

export async function getChatMessageCount(): Promise<number> {
  if (!dbEnabled) return 0;
  const rows = await sql`SELECT count(*)::int AS count FROM chat_messages`;
  return (rows[0]?.count as number) ?? 0;
}