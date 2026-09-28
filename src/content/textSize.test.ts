import { describe, expect, it } from 'vitest';
import { textSizeProps } from './textSize';

describe('textSizeProps', () => {
  it('renders nothing for the design size and data-size otherwise', () => {
    expect(textSizeProps(undefined)).toEqual({});
    expect(textSizeProps('lg')).toEqual({ 'data-size': 'lg' });
  });
});
