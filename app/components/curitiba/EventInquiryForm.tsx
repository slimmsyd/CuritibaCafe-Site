"use client";

import { useState } from "react";

export default function EventInquiryForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex max-w-[420px] flex-col gap-5">
        <div className="self-start border border-white px-[42px] py-[15px] text-[13px] uppercase tracking-[0.16em] text-white">
          Inquiry received
        </div>
        <p className="m-0 text-[15px] leading-[1.7] text-newsletter-muted">
          Thank you - we read every inquiry and reply within two days with
          availability and a simple quote.
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex max-w-[440px] flex-col gap-[26px]"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="text-[12px] uppercase tracking-[0.18em] text-newsletter-muted">
        Inquire
      </div>
      <input
        type="text"
        placeholder="YOUR NAME"
        className="border-b border-muted bg-transparent px-0.5 py-3.5 font-[family-name:var(--font-hanken)] text-[13px] tracking-[0.1em] text-white outline-none"
      />
      <input
        type="email"
        placeholder="EMAIL ADDRESS"
        className="border-b border-muted bg-transparent px-0.5 py-3.5 font-[family-name:var(--font-hanken)] text-[13px] tracking-[0.1em] text-white outline-none"
      />
      <input
        type="text"
        placeholder="PREFERRED DATE"
        className="border-b border-muted bg-transparent px-0.5 py-3.5 font-[family-name:var(--font-hanken)] text-[13px] tracking-[0.1em] text-white outline-none"
      />
      <textarea
        placeholder="TELL US ABOUT YOUR EVENT"
        rows={3}
        className="resize-none border-b border-muted bg-transparent px-0.5 py-3.5 font-[family-name:var(--font-hanken)] text-[13px] tracking-[0.1em] text-white outline-none"
      />
      <button
        type="submit"
        className="cursor-pointer self-start border-none bg-white px-[42px] py-[15px] font-[family-name:var(--font-hanken)] text-[12px] font-semibold uppercase tracking-[0.16em] text-ink"
      >
        Send inquiry
      </button>
    </form>
  );
}