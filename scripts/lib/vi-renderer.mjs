import { Renderer } from 'marked';
import { VI } from '../yy-wechat-render.mjs';

export function createVIRenderer() {
  const renderer = new Renderer();

  renderer.paragraph = ({ tokens }) => {
    const text = renderer.parser.parseInline(tokens);
    return `<p style="margin:0 0 1em;color:${VI.colors.sumiBlack};font-size:${VI.sizes.body};line-height:${VI.lineHeights.body};font-family:${VI.fonts.sans};">${text}</p>`;
  };

  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens);
    const sizes = { 1: VI.sizes.h1, 2: VI.sizes.h2, 3: VI.sizes.h3 };
    const size = sizes[depth] || VI.sizes.body;
    const margin = depth === 1 ? '1.2em 0 0.6em' : '1.6em 0 0.6em';
    
    if (depth === 2) {
      return `<h2 style="margin:${margin};color:${VI.colors.sumiBlack};font-size:${size};line-height:${VI.lineHeights.heading};font-weight:600;font-family:${VI.fonts.serif};"><span style="color:${VI.colors.vermillion};">▌</span> ${text}</h2>`;
    }
    return `<h${depth} style="margin:${margin};color:${VI.colors.sumiBlack};font-size:${size};line-height:${VI.lineHeights.heading};font-family:${VI.fonts.serif};">${text}</h${depth}>`;
  };

  renderer.blockquote = ({ tokens }) => {
    const body = renderer.parser.parse(tokens);
    return `<blockquote style="margin:1em 0;padding:0.6em 1em;border-left:4px solid ${VI.colors.vermillion};background:rgba(10,10,10,0.05);color:${VI.colors.sumiBlack};font-style:italic;font-size:${VI.sizes.body};line-height:${VI.lineHeights.body};">${body}</blockquote>`;
  };

  renderer.code = ({ text, lang }) => {
    if (lang === 'mermaid') {
      return `<div class="mermaid-raw" data-graph="${escapeHtml(text)}"></div>`;
    }
    const escaped = escapeHtml(text);
    return `<section style="margin:1em 0;background:${VI.colors.sumiBlack};color:${VI.colors.washiWhite};font-family:${VI.fonts.mono};font-size:${VI.sizes.small};line-height:${VI.lineHeights.code};padding:1em;border-radius:6px;overflow-x:auto;"><code>${escaped}</code></section>`;
  };

  renderer.codespan = ({ text }) => {
    return `<code style="background:rgba(10,10,10,0.05);padding:0.1em 0.3em;border-radius:3px;font-family:${VI.fonts.mono};font-size:0.9em;">${escapeHtml(text)}</code>`;
  };

  renderer.list = ({ items }) => {
    return items.map(item => {
      const text = renderer.parser.parseInline(item.tokens);
      return `<p style="margin:0 0 0.5em;color:${VI.colors.sumiBlack};font-size:${VI.sizes.body};line-height:${VI.lineHeights.body};font-family:${VI.fonts.sans};"><span style="color:${VI.colors.vermillion};">▸</span> ${text}</p>`;
    }).join('\n');
  };

  renderer.image = ({ href, title, text }) => {
    const caption = text || title || '';
    return `<figure style="margin:1.2em 0;text-align:center;"><img src="${href}" style="max-width:100%;border-radius:4px;" alt="${escapeHtml(text)}"/>${caption ? `<figcaption style="margin-top:0.4em;color:rgba(10,10,10,0.5);font-size:${VI.sizes.caption};">${escapeHtml(caption)}</figcaption>` : ''}</figure>`;
  };

  renderer.strong = ({ text }) => {
    return `<strong style="font-weight:600;">${text}</strong>`;
  };

  renderer.em = ({ text }) => {
    return `<em style="font-style:italic;">${text}</em>`;
  };

  renderer.link = ({ href, text }) => {
    return `<a href="${href}" data-external="true" style="color:${VI.colors.vermillion};text-decoration:none;">${text}</a>`;
  };

  renderer.hr = () => {
    return `<hr style="border:none;border-top:1px solid rgba(10,10,10,0.1);margin:1.5em 0;"/>`;
  };

  renderer.space = () => '';

  return renderer;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
