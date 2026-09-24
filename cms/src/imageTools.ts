/**
 * Prepare an image in the browser before upload: scale down to `maxWidth` and convert to WebP.
 * Keeps uploads small (fast website) without any server-side image tools.
 */
export interface PreparedImage {
  blob: Blob;
  name: string;
  width?: number;
  height?: number;
}

const RASTER = /^image\/(png|jpeg|webp|gif|avif|bmp)$/;

export async function prepareImage(file: File, maxWidth = 1600): Promise<PreparedImage> {
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'bild';
  if (file.type === 'image/svg+xml') return { blob: file, name: `${baseName}.svg` };
  if (!RASTER.test(file.type)) throw new Error('Bitte ein Bild (JPG, PNG, WebP) verwenden.');

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.84));
  if (!blob) throw new Error('Bild konnte nicht umgewandelt werden.');
  return { blob, name: `${baseName}.webp`, width, height };
}

export const isImageFile = (f: File) => f.type.startsWith('image/');
export const isTextFile = (f: File) => f.type.startsWith('text/') || /\.(txt|md|markdown)$/i.test(f.name);

export function readText(file: File): Promise<string> {
  return file.text().then((t) => t.replace(/\r\n/g, '\n').trim());
}
