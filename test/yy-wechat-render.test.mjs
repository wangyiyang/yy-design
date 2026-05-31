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

import { renderMermaidToSvg, countSvgNodes } from '../scripts/lib/svg-render.mjs';

describe('svg-render', () => {
  it('renders simple flowchart to SVG', async () => {
    const svg = await renderMermaidToSvg('graph TD; A-->B;');
    assert(svg);
    assert(svg.startsWith('<svg'));
  });

  it('returns null for invalid mermaid', async () => {
    const svg = await renderMermaidToSvg('invalid %% syntax');
    assert.strictEqual(svg, null);
  });

  it('counts SVG nodes', () => {
    const svg = '<svg><rect/><rect/><circle/></svg>';
    assert.strictEqual(countSvgNodes(svg), 3);
  });
});

import { postProcess } from '../scripts/lib/post-process.mjs';

describe('post-process', () => {
  it('replaces external links with vermillion spans', () => {
    const html = '<p><a href="https://example.com" data-external="true">Example</a></p>';
    const result = postProcess(html);
    assert(!result.includes('<a'));
    assert(result.includes('color:#C0392B'));
    assert(result.includes('Example'));
  });

  it('adds references section for external links', () => {
    const html = '<p><a href="https://a.com" data-external="true">A</a></p>';
    const result = postProcess(html);
    assert(result.includes('引用'));
    assert(result.includes('https://a.com'));
  });

  it('adds footer and author card by default', () => {
    const result = postProcess('<p>text</p>');
    assert(result.includes('翊行代码'));
    assert(result.includes('wangyiyang.cc'));
  });

  it('wraps in root section', () => {
    const result = postProcess('<p>text</p>');
    assert(result.startsWith('<section'));
    assert(result.includes('max-width:680px'));
  });

  it('respects --no-footer and --no-author-card', () => {
    const result = postProcess('<p>text</p>', { includeFooter: false, includeAuthorCard: false });
    assert(!result.includes('翊行代码'));
    assert(!result.includes('wangyiyang.cc'));
  });
});

import { lint } from '../scripts/lib/linter.mjs';

describe('linter', () => {
  it('warns on too many vermillion spans', () => {
    const html = '<p><span style="color:#C0392B;">1</span></p>'.repeat(7);
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('朱红') && w.includes('7')));
  });

  it('warns on too many strong tags', () => {
    const html = '<strong>1</strong>'.repeat(5);
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('加粗')));
  });

  it('reports unauthorized colors', () => {
    const html = '<p style="color:#FF5733;">text</p>';
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('未授权颜色')));
  });

  it('warns on paragraphs without margin', () => {
    const html = '<p>no margin</p>';
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('margin')));
  });

  it('warns on complex mermaid SVG', () => {
    const nodes = '<rect/>'.repeat(60);
    const html = `<svg>${nodes}</svg>`;
    const warnings = lint(html);
    assert(warnings.some(w => w.includes('mermaid') && w.includes('拥挤')));
  });

  it('passes clean HTML', () => {
    const html = '<p style="margin:0 0 1em;color:#0A0A0A;">Clean</p>';
    const warnings = lint(html);
    assert.strictEqual(warnings.length, 0);
  });
});
