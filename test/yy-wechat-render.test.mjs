import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseArgs, VI, ALLOWED_COLORS } from '../scripts/yy-wechat-render.mjs';
import { createVIRenderer } from '../scripts/lib/vi-renderer.mjs';
import { marked } from 'marked';

describe('parseArgs', () => {
  it('parses all flags correctly', () => {
    const args = parseArgs(['node', 'script', '--md', 'a.md', '--out', 'b.html', '--title', 'T', '--no-footer']);
    assert.strictEqual(args.md, 'a.md');
    assert.strictEqual(args.out, 'b.html');
    assert.strictEqual(args.title, 'T');
    assert.strictEqual(args.includeFooter, false);
    assert.strictEqual(args.includeAuthorCard, true);
  });

  it('defaults includeFooter and includeAuthorCard to true', () => {
    const args = parseArgs(['node', 'script', '--md', 'x.md']);
    assert.strictEqual(args.includeFooter, true);
    assert.strictEqual(args.includeAuthorCard, true);
  });
});

describe('VI constants', () => {
  it('has expected colors', () => {
    assert.strictEqual(VI.colors.sumiBlack, '#0A0A0A');
    assert.strictEqual(VI.colors.vermillion, '#C0392B');
  });

  it('ALLOWED_COLORS includes alpha variants', () => {
    assert(ALLOWED_COLORS.has('rgba(10,10,10,0.6)'));
    assert(ALLOWED_COLORS.has('rgba(192,57,43,0.5)'));
  });
});

describe('vi-renderer', () => {
  it('renders paragraph with inline styles', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('Hello world', { renderer });
    assert(html.includes('color:#0A0A0A'));
    assert(html.includes('font-size:16px'));
    assert(html.includes("font-family:'Source Han Sans SC'"));
  });

  it('renders h2 with vermillion prefix', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('## Title', { renderer });
    assert(html.includes('▌'));
    assert(html.includes('color:#C0392B'));
    assert(html.includes('font-size:24px'));
  });

  it('renders blockquote with left border', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('> Quote', { renderer });
    assert(html.includes('border-left:4px solid #C0392B'));
    assert(html.includes('background:rgba(10,10,10,0.05)'));
  });

  it('renders code block with dark background', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('```\nconst x = 1;\n```', { renderer });
    assert(html.includes('background:#0A0A0A'));
    assert(html.includes('color:#FAFAFA'));
  });

  it('renders list items with ▸ prefix', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('- Item 1\n- Item 2', { renderer });
    const count = (html.match(/▸/g) || []).length;
    assert.strictEqual(count, 2);
  });

  it('marks external links for post-processing', () => {
    const renderer = createVIRenderer();
    const html = marked.parse('[text](https://example.com)', { renderer });
    assert(html.includes('data-external="true"'));
  });
});
