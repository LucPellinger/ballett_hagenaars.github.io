import type { ImageAsset } from './schema';

/**
 * Content images live in src/assets/content/<folder>/<file> and are referenced in the JSON
 * data by their relative path (e.g. "gallery/sommerfest-1.webp").
 * Vite picks them all up here, optimises and fingerprints them at build time.
 */
const files = import.meta.glob<string>('../assets/content/**/*.{png,jpg,jpeg,webp,svg,gif,avif}', {
  eager: true,
  import: 'default',
});

const PREFIX = '../assets/content/';

export function imageUrl(src: string): string {
  const url = files[PREFIX + src];
  if (!url && import.meta.env.DEV) console.warn(`[content] image not found: ${src}`);
  return url ?? '';
}

export function imageExists(src: string): boolean {
  return PREFIX + src in files;
}

/** Replace the relative `src` of an image by its final URL. */
export function resolveImage<T extends ImageAsset | undefined>(img: T): T {
  return (img ? { ...img, src: imageUrl(img.src) } : img) as T;
}
