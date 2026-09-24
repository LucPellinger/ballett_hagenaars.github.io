import placeholder1 from '@/assets/images/placeholder-1.svg';
import placeholder2 from '@/assets/images/placeholder-2.svg';
import placeholder3 from '@/assets/images/placeholder-3.svg';
import placeholder4 from '@/assets/images/placeholder-4.svg';
import type { GalleryItem } from './types';

/**
 * Gallery images. Put optimised photos (≤ 1600px, .webp or .jpg) in src/assets/images/gallery/
 * and import them at the top. Always write a meaningful `alt` text.
 * PLACEHOLDER: abstract sample artwork – replace with real photos.
 */
export const gallery: GalleryItem[] = [
  { id: 'sample-1', image: { src: placeholder1, alt: { de: 'Beispielbild 1', en: 'Sample image 1' }, width: 800, height: 600 }, caption: { de: 'Aufführung (Beispiel)', en: 'Performance (sample)' }, status: 'placeholder' },
  { id: 'sample-2', image: { src: placeholder2, alt: { de: 'Beispielbild 2', en: 'Sample image 2' }, width: 800, height: 1000 }, caption: { de: 'Ballettunterricht (Beispiel)', en: 'Ballet class (sample)' }, status: 'placeholder' },
  { id: 'sample-3', image: { src: placeholder3, alt: { de: 'Beispielbild 3', en: 'Sample image 3' }, width: 800, height: 600 }, status: 'placeholder' },
  { id: 'sample-4', image: { src: placeholder4, alt: { de: 'Beispielbild 4', en: 'Sample image 4' }, width: 800, height: 600 }, status: 'placeholder' },
];
