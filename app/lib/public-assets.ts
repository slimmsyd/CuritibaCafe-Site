import { readdirSync, type Dirent } from "node:fs";
import path from "node:path";

const IMG = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

export function listPublicImages(): string[] {
  const root = path.join(process.cwd(), "public");
  const images: string[] = [];

  const walk = (dir: string, prefix: string, depth: number) => {
    let entries: Dirent[];
    try {
      entries = readdirSync(dir, { withFileTypes: true }) as Dirent[];
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const rel = `${prefix}/${e.name}`;
      if (e.isDirectory()) {
        if (depth < 2) walk(path.join(dir, e.name), rel, depth + 1);
      } else if (IMG.test(e.name)) {
        images.push(rel);
      }
    }
  };

  walk(root, "", 0);
  return images.sort();
}