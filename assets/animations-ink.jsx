/**
 * animations-ink.jsx — 水墨动效预设
 *
 * 依赖 animations.jsx 提供的：
 *   Stage, Sprite, useTime, useSprite, Easing, interpolate
 *
 * 用法：inline 进 HTML <script type="text/babel">，放在 animations.jsx 之后。
 *       通过 window.InkAnimations 访问组件。
 */

(function() {
  const Animations = window.Animations || {};
  const { useTime, useSprite, Easing, interpolate } = Animations;

  if (!useTime) {
    console.error('animations-ink.jsx requires animations.jsx to be loaded first');
    return;
  }

  // ── InkReveal · 墨晕开 ──────────────────────────
  function InkReveal({ children, duration = 2, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = Easing.easeOut(t);
    const scale = 0.8 + 0.2 * eased;
    const opacity = eased;
    const blur = (1 - eased) * 8;

    return (
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        transition: 'none',
      }}>
        {children}
      </div>
    );
  }

  // ── BrushStroke · 笔迹绘制 ──────────────────────
  function BrushStroke({ children, duration = 1.5, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = Easing.expoOut(t);

    return (
      <div style={{
        clipPath: `inset(0 ${100 - eased * 100}% 0 0)`,
        transition: 'none',
      }}>
        {children}
      </div>
    );
  }

  // ── SealStamp · 印章落下 ────────────────────────
  function SealStamp({ children, duration = 0.8, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = t < 0.6
      ? Easing.expoOut(t / 0.6) * 1.1
      : 1 + 0.1 * Math.sin((t - 0.6) / 0.4 * Math.PI);
    const opacity = Math.min(1, t / 0.3);

    return (
      <div style={{
        opacity,
        transform: `scale(${eased})`,
        transition: 'none',
      }}>
        {children}
      </div>
    );
  }

  // ── PaperFade · 宣纸翻页 ────────────────────────
  function PaperFade({ children, duration = 1, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = Easing.easeInOut(t);
    const opacity = t < 0.5 ? eased * 2 : 2 - eased * 2;
    const translateY = (1 - eased) * 20;

    return (
      <div style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: 'none',
      }}>
        {children}
      </div>
    );
  }

  // ── EnsoDraw · 禅圆一笔 ─────────────────────────
  function EnsoDraw({ size = 80, strokeWidth = 3, duration = 2, delay = 0 }) {
    const time = useTime();
    const t = Math.max(0, Math.min(1, (time - delay) / duration));
    const eased = Easing.expoOut(t);
    const circumference = 2 * Math.PI * (size / 2 - strokeWidth);
    const dashoffset = circumference * (1 - eased * 0.92);

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          fill="none"
          stroke="#0A0A0A"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'none' }}
        />
        {/* 朱红单点在缺口处 */}
        <circle
          cx={size / 2}
          cy={strokeWidth + 4}
          r={3}
          fill="#C0392B"
          opacity={eased > 0.9 ? 1 : 0}
        />
      </svg>
    );
  }

  window.InkAnimations = {
    InkReveal,
    BrushStroke,
    SealStamp,
    PaperFade,
    EnsoDraw,
  };
})();
