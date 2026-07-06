"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  getAnswerForIntent,
  getLocalChatReply,
} from "@/app/lib/cafe-knowledge";
import { siteData } from "@/app/lib/site-data";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const { chat } = siteData;

function ChatIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default function ChatBot() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: chat.greeting },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 500 + Math.min(trimmed.length * 18, 700);
    window.setTimeout(async () => {
      let reply: string;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });
        if (res.ok) {
          const data = (await res.json()) as { reply: string };
          reply = data.reply;
        } else {
          const local = getLocalChatReply(trimmed);
          reply = local.reply || getAnswerForIntent("unknown");
        }
      } catch {
        const local = getLocalChatReply(trimmed);
        reply =
          local.reply ||
          getAnswerForIntent("unknown") ||
          "Something went wrong — try again, or ask at the counter.";
      }

      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", text: reply },
      ]);
      setTyping(false);
    }, delay);
  }, [typing]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div
          role="dialog"
          aria-labelledby={titleId}
          aria-modal="false"
          className="pointer-events-auto flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden border border-hairline bg-white shadow-[0_18px_50px_rgba(17,17,17,0.14)] motion-safe:animate-[chat-in_220ms_ease-out]"
        >
          <header className="flex items-center justify-between border-b border-hairline bg-sand px-4 py-3.5">
            <div>
              <p
                id={titleId}
                className="m-0 text-[13px] font-semibold uppercase tracking-[0.2em] text-ink"
              >
                {chat.title}
              </p>
              <p className="m-0 mt-0.5 text-[12px] tracking-[0.02em] text-muted">
                {chat.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-transparent text-ink transition-colors hover:border-hairline hover:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <CloseIcon />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex max-h-[min(52vh,420px)] min-h-[280px] flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "user"
                    ? "ml-8 self-end rounded-sm bg-ink px-3.5 py-2.5 text-[14px] leading-[1.55] text-white"
                    : "mr-4 self-start whitespace-pre-line border border-hairline bg-sand px-3.5 py-2.5 text-[14px] leading-[1.55] text-ink"
                }
              >
                {msg.text}
              </div>
            ))}

            {typing ? (
              <div
                className="mr-4 flex w-fit items-center gap-1.5 self-start border border-hairline bg-sand px-3.5 py-3"
                aria-live="polite"
                aria-label="Assistant is typing"
              >
                <span className="motion-safe:animate-[chat-dot_1.1s_ease-in-out_infinite] h-1.5 w-1.5 rounded-full bg-muted [animation-delay:0ms]" />
                <span className="motion-safe:animate-[chat-dot_1.1s_ease-in-out_infinite] h-1.5 w-1.5 rounded-full bg-muted [animation-delay:160ms]" />
                <span className="motion-safe:animate-[chat-dot_1.1s_ease-in-out_infinite] h-1.5 w-1.5 rounded-full bg-muted [animation-delay:320ms]" />
              </div>
            ) : null}

            {messages.length === 1 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {chat.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="cursor-pointer border border-hairline bg-white px-3 py-2 text-left text-[12px] tracking-[0.02em] text-ink transition-colors hover:border-ink hover:bg-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            className="border-t border-hairline px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <p className="m-0 mb-2 text-[10px] uppercase tracking-[0.14em] text-faint">
              {chat.disclaimer}
            </p>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={chat.placeholder}
                disabled={typing}
                className="min-h-11 flex-1 border-b border-hairline bg-transparent px-0.5 py-2 text-[14px] text-ink outline-none transition-colors placeholder:text-faint focus:border-ink disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-ink bg-ink text-white transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:border-hairline disabled:bg-hairline disabled:text-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        aria-label={open ? "Close chat" : "Open chat"}
        className="pointer-events-auto flex h-14 w-14 cursor-pointer items-center justify-center border border-ink bg-ink text-white shadow-[0_10px_30px_rgba(17,17,17,0.22)] transition-[transform,background-color] duration-200 hover:bg-muted motion-safe:hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}