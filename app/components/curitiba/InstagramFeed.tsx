import Link from "next/link";
import type { InstagramFeedData } from "@/app/lib/instagram";
import { siteData } from "@/app/lib/site-data";

function captionAlt(caption: string, handle: string) {
  const line = caption.split("\n")[0].trim();
  return line.slice(0, 120) || `Post by @${handle}`;
}

export default function InstagramFeed({ data }: { data: InstagramFeedData }) {
  const { title, body } = siteData.instagram;

  return (
    <section id="instagram" className="px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[110px]">
      <h2 className="mb-3 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
        {title}
      </h2>
      <p className="mx-auto mb-16 max-w-[560px] text-pretty text-center text-[15px] leading-[1.6] text-muted">
        {body}
      </p>

      {data.posts.length > 0 ? (
        <div className="mx-auto grid max-w-[1560px] grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={captionAlt(post.caption, data.handle)}
              className="group relative block aspect-square overflow-hidden bg-placeholder"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt={captionAlt(post.caption, data.handle)}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
              {(post.mediaType === "VIDEO" || post.mediaType === "REELS") && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[11px] text-ink shadow-sm"
                >
                  &#9654;
                </span>
              )}
            </a>
          ))}
        </div>
      ) : null}

      <div className={`flex justify-center ${data.posts.length > 0 ? "mt-14" : ""}`}>
        <Link
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-ink px-[34px] py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted"
        >
          Follow @{data.handle}
        </Link>
      </div>
    </section>
  );
}