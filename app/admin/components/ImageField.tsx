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

export default function ImageField({
  label,
  hint,
  value,
  onChange,
  assets,
  variant = "card",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  assets: ImageAssets;
  variant?: "card" | "compact";
}) {
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPath, setShowPath] = useState(false);
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

  const dropZone = (
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
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition-colors ${
        variant === "card" ? "min-h-[180px] px-4 py-8" : "px-3 py-4"
      } ${
        drag
          ? "border-gold bg-gold/5 text-ink"
          : "border-[#dddcd6] bg-paper text-ink-soft hover:border-gold/50"
      }`}
    >
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className={
            variant === "card"
              ? "mb-3 max-h-[140px] w-full rounded-md object-contain"
              : "mb-2 max-h-[72px] w-full rounded-md object-contain"
          }
        />
      ) : null}
      <span className="text-[13px] font-medium text-ink">
        {busy ? "Processing…" : drag ? "Drop image here" : "Upload image"}
      </span>
      <span className="mt-1 text-[12px] text-ink-soft">
        Drag and drop, or click to browse
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="m-0 admin-label">{label}</p>
        {hint ? <p className="m-0 mt-1 admin-hint">{hint}</p> : null}
      </div>

      {dropZone}

      <div className="flex flex-wrap items-center gap-3 text-[12px]">
        {isData ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="font-medium text-gold hover:underline"
          >
            Remove image
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setShowPath((v) => !v)}
          className="text-ink-soft hover:text-ink"
        >
          {showPath ? "Hide file path" : "Use file path instead"}
        </button>
      </div>

      {showPath ? (
        <input
          className="admin-input"
          list={listId}
          placeholder="/curitiba-logo.png"
          value={isData ? "" : value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
      <datalist id={listId}>
        {assets.images.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>
    </div>
  );
}