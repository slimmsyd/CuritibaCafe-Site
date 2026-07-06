"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <div className="border border-white px-8 py-[15px] text-center text-[13px] uppercase tracking-[0.16em] text-white sm:px-[42px]">
        You&apos;re on the list
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[460px] flex-col gap-4 sm:flex-row sm:gap-0">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="EMAIL ADDRESS"
        className="min-h-11 flex-1 border-b border-muted bg-transparent px-0.5 py-3.5 font-[family-name:var(--font-hanken)] text-[16px] tracking-[0.1em] text-white outline-none sm:text-[13px]"
      />
      <button
        type="button"
        onClick={() => setSubscribed(true)}
        className="min-h-11 cursor-pointer border-none bg-white px-8 py-3.5 font-[family-name:var(--font-hanken)] text-[12px] font-semibold uppercase tracking-[0.16em] text-ink sm:ml-5 sm:px-[34px]"
      >
        Subscribe
      </button>
    </div>
  );
}