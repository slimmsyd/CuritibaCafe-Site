"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { siteData } from "@/app/lib/site-data";

function ChevronIcon({ open }: { open: boolean }) {
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
      className={`shrink-0 text-faint transition-transform duration-200 motion-reduce:transition-none ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FaqItem({
  id,
  question,
  answer,
  open,
  onToggle,
}: {
  id: string;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `${id}-panel`;

  return (
    <div className="border-b border-hairline last:border-b-0">
      <h3>
        <button
          type="button"
          id={id}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-[15px] font-medium tracking-[0.02em] text-ink transition-colors hover:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <span className="text-pretty">{question}</span>
          <ChevronIcon open={open} />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={id}
        hidden={!open}
        className="pb-6"
      >
        <p className="m-0 max-w-[640px] text-pretty text-[15px] leading-[1.75] text-muted">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const baseId = useId();
  const { faq } = siteData;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-sand px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[110px]"
    >
      <div className="mx-auto max-w-[720px]">
        <h2 className="mb-3 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
          {faq.title}
        </h2>
        <p className="mx-auto mb-12 max-w-[520px] text-pretty text-center text-[15px] leading-[1.6] text-muted sm:mb-14">
          {faq.body}
        </p>

        <div className="border-t border-hairline bg-white px-5 sm:px-8">
          {faq.items.map((item, index) => (
            <FaqItem
              key={item.id}
              id={`${baseId}-${item.id}`}
              question={item.question}
              answer={item.answer}
              open={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </div>

        <p className="mt-10 text-center text-[14px] leading-[1.7] text-muted">
          {faq.footer}{" "}
          <Link
            href={faq.ctaHref}
            className="border-b border-ink pb-px text-ink transition-colors hover:text-muted"
          >
            {faq.cta}
          </Link>
        </p>
      </div>
    </section>
  );
}