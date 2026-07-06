"use client";

import { useId, useRef, useState } from "react";

export type ImageAssets = { images: string[] };

function fileToDataUrl(file: File, maxW = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === "image/svg+xml") {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error("Could not read file"));
      r.readAsDataURL(file);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width || 1);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unsupported"));
      ctx.drawImage(img, 0, 0, w, h);
      const type =
        file.type === "image/png" || file.type === "image/webp"
          ? "image/webp"
          : "image/jpeg";
      resolve(canvas.toDataURL(type, quality));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = URL.createObjectURL(file);
  });
}

const inputClass =
  "w-full rounded-[8px] border border-[rgba(26,23,20,0.22)] bg-paper px-[12px] py-[9px] font-body text-[14px] text-ink outline-none transition-colors focus:border-gold";

export default function ImageField({
  label,
  value,
  onChange,
  assets,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  assets: ImageAssets;
}) {
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const isData = value.startsWith("data:");

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      onChange(await fileToDataUrl(file));
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  return (
    <label className="flex flex-col gap-[6px] text-[12px] text-muted">
      <span>{label}</span>
      <div className="flex items-start gap-[12px]">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-ink/15 bg-paper">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted">none</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-[6px]">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex cursor-pointer items-center justify-center rounded-[8px] border border-dashed px-[12px] py-[10px] text-center text-[12px] transition-colors ${
              drag
                ? "border-gold bg-gold/[0.08] text-ink"
                : "border-ink/25 text-muted hover:border-gold/60"
            }`}
          >
            {busy
              ? "Processing…"
              : drag
                ? "Drop to upload"
                : "Drag an image here, or click to upload"}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            className={inputClass}
            list={listId}
            placeholder="/artists/photo.jpg"
            value={isData ? "" : value}
            onChange={(e) => onChange(e.target.value)}
          />
          <datalist id={listId}>
            {assets.images.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
          {isData ? (
            <span className="text-[11px] text-muted">
              Image embedded.{" "}
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-gold underline"
              >
                clear
              </button>
            </span>
          ) : null}
        </div>
      </div>
    </label>
  );
}