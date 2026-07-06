"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/auth-server";
import { copyToInput, DEFAULT_ARTIST_COPY, type ArtistPageCopy } from "@/app/lib/artist-copy";
import {
  deactivateArtist,
  saveArtist,
  type ArtistInput,
} from "@/app/lib/artists-db";

export type ArtistSaveState = { ok?: boolean; error?: string; id?: number };

function parseArtistDraft(raw: unknown): ArtistInput {
  if (!raw || typeof raw !== "object") throw new Error("Invalid artist data.");

  const d = raw as Record<string, unknown>;
  const str = (key: string) => String(d[key] ?? "").trim();
  const bool = (key: string) => Boolean(d[key]);
  const num = (key: string, fallback = 0) => {
    const n = Number(d[key]);
    return Number.isFinite(n) ? n : fallback;
  };

  const worksRaw = Array.isArray(d.works) ? d.works : [];
  const works = worksRaw.map((item, index) => {
    const w = (item ?? {}) as Record<string, unknown>;
    return {
      title: String(w.title ?? "").trim(),
      price: String(w.price ?? "").trim(),
      placeholder: String(w.placeholder ?? "").trim(),
      imageUrl: String(w.imageUrl ?? "").trim(),
      sold: Boolean(w.sold),
      sortOrder: Number.isFinite(Number(w.sortOrder)) ? Number(w.sortOrder) : index,
    };
  });

  if (!str("slug")) throw new Error("Slug is required.");
  if (!str("name")) throw new Error("Name is required.");

  const copyRaw = (d.copy ?? {}) as Record<string, unknown>;
  const copyStr = (key: keyof ArtistPageCopy) =>
    String(copyRaw[key] ?? DEFAULT_ARTIST_COPY[key]).trim();
  const copy = copyToInput({
    portfolioCta: copyStr("portfolioCta"),
    counterLine: copyStr("counterLine"),
    sinceLine: copyStr("sinceLine"),
    worksHeading: copyStr("worksHeading"),
    worksFooter: copyStr("worksFooter"),
    soldLabel: copyStr("soldLabel"),
    prevArtistLabel: copyStr("prevArtistLabel"),
    nextArtistLabel: copyStr("nextArtistLabel"),
    featuredEyebrow: copyStr("featuredEyebrow"),
    featuredBio: String(copyRaw.featuredBio ?? "").trim(),
    featuredCta: copyStr("featuredCta"),
    featuredPriceLine: copyStr("featuredPriceLine"),
  });

  return {
    id: d.id ? num("id") : undefined,
    slug: str("slug"),
    name: str("name"),
    firstName: str("firstName") || str("name").split(" ")[0] || str("name"),
    medium: str("medium"),
    workSummary: str("workSummary"),
    price: str("price"),
    placeholder: str("placeholder"),
    portraitPlaceholder: str("portraitPlaceholder"),
    portraitImage: String(d.portraitImage ?? "").trim(),
    shelfImage: String(d.shelfImage ?? "").trim(),
    bio: str("bio"),
    quote: str("quote"),
    portfolioLink: str("portfolioLink") || "#",
    onShelfSince: str("onShelfSince"),
    copy,
    featured: bool("featured"),
    active: d.id ? bool("active") : true,
    sortOrder: num("sortOrder"),
    works: works.filter((w) => w.title),
  };
}

function revalidateArtistPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/artists");
  revalidatePath(`/artists/${slug}`);
  revalidatePath("/admin/artists");
}

export async function saveArtistAction(
  _prev: ArtistSaveState,
  formData: FormData,
): Promise<ArtistSaveState> {
  await requireAdmin();

  let draft: unknown;
  try {
    draft = JSON.parse(String(formData.get("draft") ?? ""));
  } catch {
    return { error: "Could not read the form data." };
  }

  let input: ArtistInput;
  try {
    input = parseArtistDraft(draft);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Invalid artist." };
  }

  try {
    const id = await saveArtist(input);
    revalidateArtistPaths(input.slug);
    return { ok: true, id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save." };
  }
}

export async function saveArtistAndStayAction(
  _prev: ArtistSaveState,
  formData: FormData,
): Promise<ArtistSaveState> {
  const result = await saveArtistAction(_prev, formData);
  return result;
}

export async function deleteArtistAction(id: number, slug: string): Promise<void> {
  await requireAdmin();
  await deactivateArtist(id);
  revalidateArtistPaths(slug);
  redirect("/admin/artists");
}