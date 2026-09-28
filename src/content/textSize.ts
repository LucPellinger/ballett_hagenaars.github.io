import type { TextSize } from './types';

/**
 * Spread onto a component's root element to apply the editor's per-component text size:
 * `<section {...textSizeProps(item.textSize)}>`. Nothing is rendered when it is not set.
 */
export function textSizeProps(size: TextSize | undefined): { 'data-size'?: TextSize } {
  return size ? { 'data-size': size } : {};
}
