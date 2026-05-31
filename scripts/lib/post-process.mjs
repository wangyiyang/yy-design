import { VI } from '../yy-wechat-render.mjs';

export function postProcess(html, options = {}) {
  let result = html;
  const references = [];

  // Extract external links
  const linkRegex = /<a href="([^"]+)" data-external="true"[^>]*>([^<]*)<\/a>/g;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    references.push({ href: match[1], text: match[2] });
  }

  // Replace links with vermillion spans
  result = result.replace(
    /<a href="([^"]+)" data-external="true"[^>]*>([^<]*)<\/a>/g,
    `<span style="color:${VI.colors.vermillion};">$2</span>`
  );

  // Add references section
  if (references.length > 0) {
    const refSection = buildReferencesSection(references);
    result += '\n' + refSection;
  }

  // Add footer
  if (options.includeFooter !== false) {
    result += '\n' + buildFooter();
  }

  // Add author card
  if (options.includeAuthorCard !== false) {
    result += '\n' + buildAuthorCard();
  }

  // Wrap in root section
  result = `<section style="max-width:680px;margin:0 auto;padding:2em 1.5em;background:#FFFFFF;color:${VI.colors.sumiBlack};font-family:${VI.fonts.sans};font-size:${VI.sizes.body};line-height:${VI.lineHeights.body};">\n${result}\n</section>`;

  return result;
}

function buildReferencesSection(refs) {
  const items = refs.map((ref, i) =>
    `<p style="margin:0.3em 0;font-size:${VI.sizes.small};color:rgba(10,10,10,0.6);">[${i + 1}] ${ref.text}: ${ref.href}</p>`
  ).join('\n');
  return `<section style="margin:2em 0 0;">\n<h3 style="font-size:${VI.sizes.h3};font-family:${VI.fonts.serif};margin:1em 0 0.5em;">引用</h3>\n${items}\n</section>`;
}

function buildFooter() {
  return `<section style="margin:2em 0 0;text-align:center;color:${VI.colors.sumiBlack};font-family:${VI.fonts.sans};">\n<hr style="border:none;border-top:1px solid rgba(10,10,10,0.1);margin:1.5em 0;"/>\n<p style="margin:0.6em 0 0;font-weight:600;">翊行代码 · YY</p>\n<p style="margin:0.2em 0;color:rgba(10,10,10,0.6);font-size:${VI.sizes.small};">Code, one stroke at a time.</p>\n</section>`;
}

function buildAuthorCard() {
  return `<section style="margin:1em 0 0;text-align:center;color:${VI.colors.sumiBlack};font-family:${VI.fonts.sans};">\n<p style="margin:0.4em 0;font-size:${VI.sizes.small};">▸ 博客: wangyiyang.cc</p>\n<p style="margin:0.2em 0;font-size:${VI.sizes.small};">▸ GitHub: github.com/wangyiyang</p>\n</section>`;
}
