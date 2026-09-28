import { useId } from 'react';
import type { PaletteColor } from '@/content';
import styles from './Brush.module.css';

/** Hand-painted brush stroke shapes (SVG + displacement filter for ragged edges). */
const SHAPES = [
  // diagonal zig-zag scribble
  { d: 'M70 150 L250 55 L85 250 L330 110 L130 345 L345 235', w: 72 },
  // two parallel diagonal sweeps
  { d: 'M40 300 L220 150 L345 55 M95 365 L250 235 L365 180', w: 82 },
  // tall vertical stroke
  { d: 'M205 35 C 160 120, 250 190, 190 280 S 215 350, 205 375', w: 160 },
  // horizontal back-and-forth scribble
  { d: 'M115 75 L300 70 L95 175 L325 165 L110 285 L305 325', w: 82 },
] as const;

export interface BrushProps {
  color: PaletteColor;
  /** Pick a shape (0–3); any number is wrapped. */
  variant?: number;
  className?: string;
}

export function Brush({ color, variant = 0, className }: BrushProps) {
  const id = `brush${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const shape = SHAPES[Math.abs(variant) % SHAPES.length]!;
  return (
    <svg className={`${styles.brush} ${className ?? ''}`} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <filter id={id} filterUnits="userSpaceOnUse" x="-60" y="-60" width="520" height="520">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed={variant + 3} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="30" result="warped" />
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.9" numOctaves="3" seed={variant + 7} result="grain" />
          <feDisplacementMap in="warped" in2="grain" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path
        d={shape.d}
        filter={`url(#${id})`}
        style={{ stroke: `var(--palette-${color})`, fill: 'none' }}
        strokeWidth={shape.w}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
