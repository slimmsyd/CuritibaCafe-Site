"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import ImageField, { type ImageAssets } from "@/app/admin/components/ImageField";
import AdminField from "@/app/admin/components/ui/AdminField";
import AdminSection from "@/app/admin/components/ui/AdminSection";
import AdminToggle from "@/app/admin/components/ui/AdminToggle";
import {
  deleteArtistAction,
  saveArtistAction,
  type ArtistSaveState,
} from "@/app/admin/artist-actions";
import { copyToInput, DEFAULT_ARTIST_COPY, type ArtistPageCopy } from "@/app/lib/artist-copy";
import type { ArtistWithWorks } from "@/app/lib/artists-db";

type WorkDraft = {
  title: string;
  price: string;
  placeholder: string;
  imageUrl: string;
  sold: boolean;
  sortOrder: number;
};

type ArtistDraft = {
  id?: number;
  slug: string;
  name: string;
  firstName: string;
  medium: string;
  workSummary: string;
  price: string;
  placeholder: string;
  portraitPlaceholder: string;
  portraitImage: string;
  shelfImage: string;
  bio: string;
  quote: string;
  portfolioLink: string;
  onShelfSince: string;
  copy: ArtistPageCopy;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  works: WorkDraft[];
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blankWork(order: number): WorkDraft {
  return {
    title: "",
    price: "",
    placeholder: "",
    imageUrl: "",
    sold: false,
    sortOrder: order,
  };
}

function toDraft(artist?: ArtistWithWorks): ArtistDraft {
  if (!artist) {
    return {
      slug: "",
      name: "",
      firstName: "",
      medium: "",
      workSummary: "",
      price: "",
      placeholder: "",
      portraitPlaceholder: "",
      portraitImage: "",
      shelfImage: "",
      bio: "",
      quote: "",
      portfolioLink: "#",
      onShelfSince: "",
      copy: { ...DEFAULT_ARTIST_COPY },
      featured: false,
      active: true,
      sortOrder: 0,
      works: [blankWork(0)],
    };
  }

  return {
    id: artist.id,
    slug: artist.slug,
    name: artist.name,
    firstName: artist.first_name,
    medium: artist.medium,
    workSummary: artist.work_summary,
    price: artist.price,
    placeholder: artist.placeholder,
    portraitPlaceholder: artist.portrait_placeholder,
    portraitImage: artist.portrait_image,
    shelfImage: artist.shelf_image,
    bio: artist.bio,
    quote: artist.quote,
    portfolioLink: artist.portfolio_link,
    onShelfSince: artist.on_shelf_since,
    copy: copyToInput({
      portfolioCta: artist.portfolio_cta,
      counterLine: artist.counter_line,
      sinceLine: artist.since_line,
      worksHeading: artist.works_heading,
      worksFooter: artist.works_footer,
      soldLabel: artist.sold_label,
      prevArtistLabel: artist.prev_artist_label,
      nextArtistLabel: artist.next_artist_label,
      featuredEyebrow: artist.featured_eyebrow,
      featuredBio: artist.featured_bio,
      featuredCta: artist.featured_cta,
      featuredPriceLine: artist.featured_price_line,
    }),
    featured: artist.featured,
    active: artist.active,
    sortOrder: artist.sort_order,
    works:
      artist.works.length > 0
        ? artist.works.map((work, index) => ({
            title: work.title,
            price: work.price,
            placeholder: work.placeholder,
            imageUrl: work.image_url,
            sold: work.sold,
            sortOrder: work.sort_order ?? index,
          }))
        : [blankWork(0)],
  };
}

function Alert({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  const styles =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-green-200 bg-green-50 text-green-800";
  return (
    <p className={`rounded-lg border px-4 py-3 text-[14px] ${styles}`}>{children}</p>
  );
}

export default function ArtistEditor({
  artist,
  assets,
}: {
  artist?: ArtistWithWorks;
  assets: ImageAssets;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ArtistDraft>(() => toDraft(artist));
  const [slugTouched, setSlugTouched] = useState(Boolean(artist?.slug));
  const [state, formAction, pending] = useActionState<ArtistSaveState, FormData>(
    saveArtistAction,
    {},
  );

  useEffect(() => {
    if (state.ok && state.id && !artist) {
      router.push(`/admin/artists/${state.id}`);
    }
  }, [state.ok, state.id, artist, router]);

  const set = <K extends keyof ArtistDraft>(key: K, value: ArtistDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const setCopy = <K extends keyof ArtistPageCopy>(key: K, value: ArtistPageCopy[K]) => {
    setDraft((prev) => ({
      ...prev,
      copy: { ...prev.copy, [key]: value },
    }));
  };

  const setName = (name: string) => {
    setDraft((prev) => ({
      ...prev,
      name,
      firstName: prev.firstName || name.split(" ")[0] || name,
      slug: slugTouched ? prev.slug : slugify(name),
    }));
  };

  const setWork = (index: number, patch: Partial<WorkDraft>) => {
    setDraft((prev) => ({
      ...prev,
      works: prev.works.map((work, i) =>
        i === index ? { ...work, ...patch } : work,
      ),
    }));
  };

  return (
    <form action={formAction} className="flex flex-col gap-8 pb-28">
      <input type="hidden" name="draft" value={JSON.stringify(draft)} readOnly />

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.ok ? <Alert tone="success">Changes saved. The live site is updated.</Alert> : null}

      <AdminSection
        title="Basics"
        description="What guests see on the artist shelf and profile header."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <AdminField label="Artist name" hint="Full name as shown on the site.">
            <input
              className="admin-input"
              value={draft.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Marina Duarte"
              required
            />
          </AdminField>
          <AdminField label="Medium" hint="Ceramics, prints, textiles, etc.">
            <input
              className="admin-input"
              value={draft.medium}
              onChange={(e) => set("medium", e.target.value)}
              placeholder="Ceramics"
            />
          </AdminField>
          <AdminField label="Shelf card line" hint="Short description on the grid.">
            <input
              className="admin-input"
              value={draft.workSummary}
              onChange={(e) => set("workSummary", e.target.value)}
              placeholder="Hand-thrown cups"
            />
          </AdminField>
          <AdminField label="Starting price" hint="Shown as “from $38” style copy.">
            <input
              className="admin-input"
              value={draft.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="from $38"
            />
          </AdminField>
          <AdminField label="On shelf since">
            <input
              className="admin-input"
              value={draft.onShelfSince}
              onChange={(e) => set("onShelfSince", e.target.value)}
              placeholder="January 2026"
            />
          </AdminField>
          <AdminField label="Portfolio link">
            <input
              className="admin-input"
              value={draft.portfolioLink}
              onChange={(e) => set("portfolioLink", e.target.value)}
              placeholder="https://…"
            />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection
        title="Photos"
        description="Portrait shows on the profile page. Shelf image shows in the grid."
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ImageField
            label="Portrait"
            hint="Profile page, left column."
            value={draft.portraitImage}
            onChange={(v) => set("portraitImage", v)}
            assets={assets}
            variant="card"
          />
          <ImageField
            label="Shelf thumbnail"
            hint="Artists page and homepage preview."
            value={draft.shelfImage}
            onChange={(v) => set("shelfImage", v)}
            assets={assets}
            variant="card"
          />
        </div>
      </AdminSection>

      <AdminSection
        title="Story"
        description="Bio and quote appear on the artist profile."
      >
        <div className="flex flex-col gap-5">
          <AdminField label="Bio">
            <textarea
              className="admin-textarea"
              value={draft.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="A short story about the artist and their work."
            />
          </AdminField>
          <AdminField label="Quote" hint="Displayed in italics on their profile.">
            <textarea
              className="admin-textarea min-h-[88px]"
              value={draft.quote}
              onChange={(e) => set("quote", e.target.value)}
              placeholder="A cup should feel like it was always yours."
            />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection
        title="Page copy"
        description="Labels and lines shown on the artist profile and featured block. Use {price}, {since}, and {firstName} where noted."
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <AdminField label="Portfolio button" hint="Profile page CTA.">
            <input
              className="admin-input"
              value={draft.copy.portfolioCta}
              onChange={(e) => setCopy("portfolioCta", e.target.value)}
            />
          </AdminField>
          <AdminField label="Counter line" hint="Use {price} for the starting price.">
            <input
              className="admin-input"
              value={draft.copy.counterLine}
              onChange={(e) => setCopy("counterLine", e.target.value)}
            />
          </AdminField>
          <AdminField label="On shelf line" hint="Use {since} for the date.">
            <input
              className="admin-input"
              value={draft.copy.sinceLine}
              onChange={(e) => setCopy("sinceLine", e.target.value)}
            />
          </AdminField>
          <AdminField label="Works section heading">
            <input
              className="admin-input"
              value={draft.copy.worksHeading}
              onChange={(e) => setCopy("worksHeading", e.target.value)}
            />
          </AdminField>
          <AdminField label="Sold label" hint="Shown next to sold pieces.">
            <input
              className="admin-input"
              value={draft.copy.soldLabel}
              onChange={(e) => setCopy("soldLabel", e.target.value)}
            />
          </AdminField>
          <AdminField label="Previous artist label">
            <input
              className="admin-input"
              value={draft.copy.prevArtistLabel}
              onChange={(e) => setCopy("prevArtistLabel", e.target.value)}
            />
          </AdminField>
          <AdminField label="Next artist label">
            <input
              className="admin-input"
              value={draft.copy.nextArtistLabel}
              onChange={(e) => setCopy("nextArtistLabel", e.target.value)}
            />
          </AdminField>
          <div className="sm:col-span-2">
            <AdminField
              label="Works footer"
              hint="Use {firstName} for the artist’s first name."
            >
              <textarea
                className="admin-textarea min-h-[88px]"
                value={draft.copy.worksFooter}
                onChange={(e) => setCopy("worksFooter", e.target.value)}
              />
            </AdminField>
          </div>
        </div>

        <div className="mt-8 border-t border-[#ebeae5] pt-8">
          <h3 className="m-0 mb-5 text-[14px] font-medium uppercase tracking-[0.12em] text-ink-soft">
            Featured block
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <AdminField label="Featured eyebrow" hint="Only when this artist is featured.">
              <input
                className="admin-input"
                value={draft.copy.featuredEyebrow}
                onChange={(e) => setCopy("featuredEyebrow", e.target.value)}
              />
            </AdminField>
            <AdminField label="Featured CTA" hint="Button on the Artists page.">
              <input
                className="admin-input"
                value={draft.copy.featuredCta}
                onChange={(e) => setCopy("featuredCta", e.target.value)}
              />
            </AdminField>
            <AdminField label="Featured price line" hint="Use {price}.">
              <input
                className="admin-input"
                value={draft.copy.featuredPriceLine}
                onChange={(e) => setCopy("featuredPriceLine", e.target.value)}
              />
            </AdminField>
            <div className="sm:col-span-2">
              <AdminField
                label="Featured bio"
                hint="Longer blurb for the featured section. Leave blank to use the main bio."
              >
                <textarea
                  className="admin-textarea"
                  value={draft.copy.featuredBio}
                  onChange={(e) => setCopy("featuredBio", e.target.value)}
                  placeholder={draft.bio || "Uses the main bio when empty."}
                />
              </AdminField>
            </div>
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="Works on the shelf"
        description="Each piece can have its own photo, price, and sold status."
        action={
          <button
            type="button"
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                works: [...prev.works, blankWork(prev.works.length)],
              }))
            }
            className="admin-btn-secondary min-h-9 px-4 py-2 text-[13px]"
          >
            + Add work
          </button>
        }
      >
        <div className="flex flex-col gap-5">
          {draft.works.map((work, index) => (
            <div
              key={`work-${index}`}
              className="rounded-lg border border-[#ebeae5] bg-paper p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="m-0 text-[15px] font-medium text-ink">
                  {work.title || `Work ${index + 1}`}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      works:
                        prev.works.length > 1
                          ? prev.works.filter((_, i) => i !== index)
                          : [blankWork(0)],
                    }))
                  }
                  className="cursor-pointer text-[13px] text-ink-soft hover:text-ink"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr]">
                <ImageField
                  label="Photo"
                  value={work.imageUrl}
                  onChange={(v) => setWork(index, { imageUrl: v })}
                  assets={assets}
                  variant="compact"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <AdminField label="Title">
                    <input
                      className="admin-input"
                      value={work.title}
                      onChange={(e) => setWork(index, { title: e.target.value })}
                      placeholder="Demitasse pair"
                    />
                  </AdminField>
                  <AdminField label="Price">
                    <input
                      className="admin-input"
                      value={work.price}
                      onChange={(e) => setWork(index, { price: e.target.value })}
                      placeholder="$38"
                    />
                  </AdminField>
                  <AdminField label="Image alt text" hint="Describes the photo if it fails to load.">
                    <input
                      className="admin-input"
                      value={work.placeholder}
                      onChange={(e) => setWork(index, { placeholder: e.target.value })}
                      placeholder="Demitasse pair - photo"
                    />
                  </AdminField>
                  <div className="sm:col-span-2">
                    <AdminToggle
                      label="Mark as sold"
                      description="Shows “sold” on the public artist page."
                      checked={work.sold}
                      onChange={(sold) => setWork(index, { sold })}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminSection>

      <AdminSection title="Visibility" description="Control how this artist appears on the site.">
        <div className="flex flex-col gap-3">
          <AdminToggle
            label="Featured artist"
            description="Highlights this artist at the top of the Artists page."
            checked={draft.featured}
            onChange={(featured) => set("featured", featured)}
          />
          {draft.id ? (
            <AdminToggle
              label="Visible on site"
              description="Turn off to hide without deleting their record."
              checked={draft.active}
              onChange={(active) => set("active", active)}
            />
          ) : null}
        </div>
      </AdminSection>

      <details className="admin-section">
        <summary className="cursor-pointer list-none text-[15px] font-medium text-ink">
          Advanced settings
        </summary>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <AdminField label="URL slug" hint="Used in /artists/your-slug">
            <input
              className="admin-input"
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value.toLowerCase());
              }}
              placeholder="marina"
              required
            />
          </AdminField>
          <AdminField label="Sort order" hint="Lower numbers appear first.">
            <input
              className="admin-input"
              type="number"
              value={draft.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
            />
          </AdminField>
          <AdminField label="Image alt text (shelf)">
            <input
              className="admin-input"
              value={draft.placeholder}
              onChange={(e) => set("placeholder", e.target.value)}
            />
          </AdminField>
          <AdminField label="Image alt text (portrait)">
            <input
              className="admin-input"
              value={draft.portraitPlaceholder}
              onChange={(e) => set("portraitPlaceholder", e.target.value)}
            />
          </AdminField>
        </div>
      </details>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ebeae5] bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-8 lg:left-[240px]">
        <div className="mx-auto flex max-w-[820px] flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={pending} className="admin-btn-primary">
              {pending ? "Saving…" : "Save changes"}
            </button>
            {artist ? (
              <a
                href={`/artists/${artist.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn-secondary"
              >
                Preview
              </a>
            ) : null}
          </div>
          {artist ? (
            <button
              type="button"
              onClick={async () => {
                if (
                  confirm(
                    `Hide ${artist.name} from the site? You can turn them back on later.`,
                  )
                ) {
                  await deleteArtistAction(artist.id, artist.slug);
                }
              }}
              className="cursor-pointer text-[13px] font-medium text-red-700 hover:underline"
            >
              Remove from shelf
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}