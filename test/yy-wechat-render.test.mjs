import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseArgs, VI, ALLOWED_COLORS } from '../scripts/yy-wechat-render.mjs';

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
