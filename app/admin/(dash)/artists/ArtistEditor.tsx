"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import ImageField, { type ImageAssets } from "@/app/admin/components/ImageField";
import {
  deleteArtistAction,
  saveArtistAction,
  type ArtistSaveState,
} from "@/app/admin/artist-actions";
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
  featured: boolean;
  active: boolean;
  sortOrder: number;
  works: WorkDraft[];
};

const inputClass =
  "w-full rounded-[8px] border border-[rgba(26,23,20,0.22)] bg-paper px-[12px] py-[9px] font-body text-[14px] text-ink outline-none transition-colors focus:border-gold";
const labelClass = "flex flex-col gap-[5px] text-[12px] text-muted";

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

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className={labelClass}>
      <span>{label}</span>
      {children}
    </label>
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

  const setWork = (index: number, patch: Partial<WorkDraft>) => {
    setDraft((prev) => ({
      ...prev,
      works: prev.works.map((work, i) =>
        i === index ? { ...work, ...patch } : work,
      ),
    }));
  };

  return (
    <form action={formAction} className="flex flex-col gap-[22px]">
      <input type="hidden" name="draft" value={JSON.stringify(draft)} readOnly />

      {state.error ? (
        <p className="rounded-[8px] border border-red-200 bg-red-50 px-[14px] py-[10px] text-[14px] text-red-800">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-[8px] border border-green-200 bg-green-50 px-[14px] py-[10px] text-[14px] text-green-800">
          Saved.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        <Field label="Name">
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </Field>
        <Field label="First name (for copy)">
          <input
            className={inputClass}
            value={draft.firstName}
            onChange={(e) => set("firstName", e.target.value)}
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            className={inputClass}
            value={draft.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
            placeholder="marina-duarte"
            required
          />
        </Field>
        <Field label="Medium">
          <input
            className={inputClass}
            value={draft.medium}
            onChange={(e) => set("medium", e.target.value)}
          />
        </Field>
        <Field label="Work summary (shelf card)">
          <input
            className={inputClass}
            value={draft.workSummary}
            onChange={(e) => set("workSummary", e.target.value)}
          />
        </Field>
        <Field label="Starting price">
          <input
            className={inputClass}
            value={draft.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="from $38"
          />
        </Field>
        <Field label="On shelf since">
          <input
            className={inputClass}
            value={draft.onShelfSince}
            onChange={(e) => set("onShelfSince", e.target.value)}
          />
        </Field>
        <Field label="Portfolio link">
          <input
            className={inputClass}
            value={draft.portfolioLink}
            onChange={(e) => set("portfolioLink", e.target.value)}
          />
        </Field>
        <Field label="Sort order">
          <input
            className={inputClass}
            type="number"
            value={draft.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Placeholder label (accessibility)">
          <input
            className={inputClass}
            value={draft.placeholder}
            onChange={(e) => set("placeholder", e.target.value)}
          />
        </Field>
        <Field label="Portrait placeholder label">
          <input
            className={inputClass}
            value={draft.portraitPlaceholder}
            onChange={(e) => set("portraitPlaceholder", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        <ImageField
          label="Portrait image"
          value={draft.portraitImage}
          onChange={(v) => set("portraitImage", v)}
          assets={assets}
        />
        <ImageField
          label="Shelf grid image"
          value={draft.shelfImage}
          onChange={(v) => set("shelfImage", v)}
          assets={assets}
        />
      </div>

      <Field label="Bio">
        <textarea
          className={`${inputClass} min-h-[120px] resize-y`}
          value={draft.bio}
          onChange={(e) => set("bio", e.target.value)}
        />
      </Field>
      <Field label="Quote">
        <textarea
          className={`${inputClass} min-h-[80px] resize-y`}
          value={draft.quote}
          onChange={(e) => set("quote", e.target.value)}
        />
      </Field>

      <div className="flex flex-wrap gap-[18px] text-[14px] text-ink">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured on artists page
        </label>
        {draft.id ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => set("active", e.target.checked)}
            />
            Active on site
          </label>
        ) : null}
      </div>

      <div className="flex flex-col gap-[14px]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 font-display text-[18px] text-ink">Works on the shelf</h2>
          <button
            type="button"
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                works: [...prev.works, blankWork(prev.works.length)],
              }))
            }
            className="cursor-pointer rounded-full border border-ink/20 px-[14px] py-[6px] text-[12px] text-ink hover:bg-ink/[0.05]"
          >
            Add work
          </button>
        </div>

        {draft.works.map((work, index) => (
          <div
            key={`work-${index}`}
            className="rounded-[10px] border border-ink/10 bg-panel p-[18px]"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-display text-[14px] text-ink">Work {index + 1}</span>
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
                className="text-[12px] text-muted hover:text-ink"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
              <Field label="Title">
                <input
                  className={inputClass}
                  value={work.title}
                  onChange={(e) => setWork(index, { title: e.target.value })}
                />
              </Field>
              <Field label="Price">
                <input
                  className={inputClass}
                  value={work.price}
                  onChange={(e) => setWork(index, { price: e.target.value })}
                />
              </Field>
              <Field label="Placeholder label">
                <input
                  className={inputClass}
                  value={work.placeholder}
                  onChange={(e) => setWork(index, { placeholder: e.target.value })}
                />
              </Field>
              <label className="flex items-center gap-2 self-end pb-2 text-[14px] text-ink">
                <input
                  type="checkbox"
                  checked={work.sold}
                  onChange={(e) => setWork(index, { sold: e.target.checked })}
                />
                Sold
              </label>
            </div>
            <div className="mt-3">
              <ImageField
                label="Work photo"
                value={work.imageUrl}
                onChange={(v) => setWork(index, { imageUrl: v })}
                assets={assets}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-[12px]">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-full bg-ink px-[22px] py-[10px] font-display text-[13px] text-white hover:bg-ink/90 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save artist"}
        </button>
        {artist ? (
          <a
            href={`/artists/${artist.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-gold hover:text-ink"
          >
            Preview on site ↗
          </a>
        ) : null}
      </div>

      {artist ? (
        <button
          type="button"
          onClick={async () => {
            if (
              confirm(
                `Remove ${artist.name} from the site? They will be hidden, not permanently deleted.`,
              )
            ) {
              await deleteArtistAction(artist.id, artist.slug);
            }
          }}
          className="cursor-pointer text-left text-[13px] text-red-700 hover:underline"
        >
          Remove artist from shelf
        </button>
      ) : null}
    </form>
  );
}