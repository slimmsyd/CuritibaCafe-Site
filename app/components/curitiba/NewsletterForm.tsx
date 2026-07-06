"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <div className="border border-white px-[42px] py-[15px] text-[13px] uppercase tracking-[0.16em] text-white">
        You&apos;re on the list
      </div>
    );
  }

  return (
    <div className="flex w-[460px] gap-0">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="EMAIL ADDRESS"
        className="flex-1 border-b border-muted bg-transparent px-0.5 py-3.5 font-[family-name:var(--font-hanken)] text-[13px] tracking-[0.1em] text-white outline-none"
      />
      <button
        type="button"
        onClick={() => setSubscribed(true)}
        className="ml-5 cursor-pointer border-none bg-white px-[34px] py-3.5 font-[family-name:var(--font-hanken)] text-[12px] font-semibold uppercase tracking-[0.16em] text-ink"
      >
        Subscribe
      </button>
    </div>
  );
}