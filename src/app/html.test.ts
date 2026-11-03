import { describe, expect, it } from 'vitest';
import { escapeHtml } from './html';

describe('texto seguro', () => {
  it('escapa tags', () => {
    expect(escapeHtml('<b>oi</b>')).toBe('&lt;b&gt;oi&lt;/b&gt;');
  });

  it('escapa aspas e e comercial', () => {
    expect(escapeHtml(`a&b "c" 'd'`)).toBe('a&amp;b &quot;c&quot; &#39;d&#39;');
  });
});
