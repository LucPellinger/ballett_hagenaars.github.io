import { useId } from 'react';
import type { BrushVisual, PaletteColor } from '@/content';
import { useLanguage } from '@/i18n';
import { PALETTE_HEX, hexToRgb01 } from '@/styles/palette';
import { Brush } from '../Brush';
import styles from './BrushImage.module.css';

export interface BrushImageProps {
  visual: BrushVisual;
  variant?: number;
  className?: string;
}

/** Photo recoloured as duotone (shadows = tint colour) on top of a painted brush stroke. */
export function BrushImage({ visual, variant = 0, className }: BrushImageProps) {
  const { t } = useLanguage();
  const id = `duo${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const tint: PaletteColor = visual.tint ?? 'black';
  const [r, g, b] = hexToRgb01(PALETTE_HEX[tint]);
  // highlights: 80 % towards white
  const hi = (x: number) => (x + (1 - x) * 0.8).toFixed(3);
  const img = visual.image?.src ? visual.image : undefined;

  return (
    <figure className={`${styles.wrap} ${className ?? ''}`}>
      <Brush color={visual.brush} variant={variant} className={styles.brush} />
      {img && (
        <>
          <svg width="0" height="0" className={styles.defs} aria-hidden="true" focusable="false">
            <filter id={id} colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues={`${r.toFixed(3)} ${hi(r)}`} />
                <feFuncG type="table" tableValues={`${g.toFixed(3)} ${hi(g)}`} />
                <feFuncB type="table" tableValues={`${b.toFixed(3)} ${hi(b)}`} />
              </feComponentTransfer>
            </filter>
          </svg>
          <img
            className={styles.img}
            src={img.src}
            alt={t(img.alt)}
            width={img.width}
            height={img.height}
            loading="lazy"
            decoding="async"
            style={{ filter: `url(#${id})` }}
          />
        </>
      )}
    </figure>
  );
}
