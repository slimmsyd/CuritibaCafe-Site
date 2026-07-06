"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      setSubscribed(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  if (subscribed) {
    return (
      <div className="border border-white px-8 py-[15px] text-center text-[13px] uppercase tracking-[0.16em] text-white sm:px-[42px]">
        You&apos;re on the list
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-[460px] flex-col items-center gap-3"
    >
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="EMAIL ADDRESS"
          className="min-h-11 flex-1 border-b border-muted bg-transparent px-0.5 py-3.5 font-[family-name:var(--font-hanken)] text-[16px] tracking-[0.1em] text-white outline-none sm:text-[13px]"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 cursor-pointer border-none bg-white px-8 py-3.5 font-[family-name:var(--font-hanken)] text-[12px] font-semibold uppercase tracking-[0.16em] text-ink disabled:cursor-not-allowed disabled:opacity-60 sm:ml-5 sm:px-[34px]"
        >
          {pending ? "Sending…" : "Subscribe"}
        </button>
      </div>
      {error ? (
        <p className="m-0 text-[13px] text-newsletter-muted">{error}</p>
      ) : null}
    </form>
  );
}