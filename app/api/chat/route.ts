/**
 * POST /api/chat
 *
 * Body: { message: string }
 *
 * Deterministic FAQ answers from site-data. Keyword matching first; optional
 * DeepSeek intent classification when local confidence is low.
 */

import { NextResponse } from "next/server";
import {
  getChatReplyFromIntent,
  getLocalChatReply,
  type CafeIntent,
} from "@/app/lib/cafe-knowledge";
import { classifyIntentWithDeepSeek } from "@/app/lib/deepseek-intent";
import { recordChatMessage } from "@/app/lib/chat-messages";
import type { ChatReply } from "@/app/lib/cafe-knowledge";

export async function POST(req: Request) {
  let body: { message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (message.length > 500) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  let reply: ChatReply;

  const local = getLocalChatReply(message);
  if (local.reply) {
    reply = local;
  } else {
    let intent: CafeIntent = "unknown";
    let source: "deepseek" | "fallback" = "fallback";

    const classified = await classifyIntentWithDeepSeek(message);
    if (classified && classified !== "unknown") {
      intent = classified;
      source = "deepseek";
    }

    reply = getChatReplyFromIntent(intent, source);
  }

  try {
    await recordChatMessage({
      userMessage: message,
      assistantReply: reply.reply,
      intent: reply.intent,
      source: reply.source,
    });
  } catch (err) {
    console.error("[chat] failed to save message", err);
  }

  return NextResponse.json(reply);
}