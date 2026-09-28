import type { PaletteColor } from '@/content';

/**
 * Palette as hex values – needed where CSS variables can't be used (SVG filter maths).
 * Keep in sync with `--palette-*` in tokens.css.
 */
export const PALETTE_HEX: Record<PaletteColor, string> = {
  redorange: '#ff4f00',
  orange: '#ffa400',
  tangerine: '#ff8a00',
  yellow: '#ffc400',
  pink: '#ffd1e6',
  lightblue: '#b7d5ff',
  blue: '#2233cc',
  purple: '#6e3590',
  crimson: '#a30000',
  black: '#141414',
  white: '#ffffff',
};

/** Background + readable ink colour (CSS custom properties) for a palette colour. */
export const paletteVars = (c: PaletteColor) => ({
  '--tile-bg': `var(--palette-${c})`,
  '--tile-ink': `var(--on-${c})`,
});

export function hexToRgb01(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
