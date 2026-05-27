/**
 * hyperframes_stage.jsx — HyperFrames GSAP 动画工具库
 *
 * 替代 animations.jsx 的 Stage/Sprite 模型，
 * 提供 HyperFrames 兼容的 GSAP timeline 工具。
 *
 * 用法（在 composition index.html 的 <script> 中）：
 *
 *   const { createStage, Ease, stagger, registerTimeline } = HyperStage;
 *
 *   const tl = createStage("main", { duration: 15 });
 *   tl.from("#title", { y: 60, opacity: 0, duration: 0.8, ease: Ease.expoOut }, 0.2);
 *   tl.from("#subtitle", { y: 30, opacity: 0, duration: 0.6, ease: Ease.smooth }, 0.5);
 *   tl.to("#title", { opacity: 0, y: -40, duration: 0.6, ease: Ease.easeIn }, 4);
 *
 * 设计原则：
 *   - 所有 timeline 自动 paused: true（HyperFrames 要求）
 *   - 自动注册到 window.__timelines
 *   - Easing 预设对齐 yy-design VI 运动语言
 *   - 提供 scene 分段工具（对应 narration pipeline 的 cue 系统）
 */

(function() {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.warn('[HyperStage] gsap 未加载，请先引入 GSAP CDN');
    return;
  }

  // ═══════════════════════════════════════════
  // Easing 预设 · 对齐 yy-design 运动语言
  // ═══════════════════════════════════════════
  const Ease = {
    // 主 easing：迅速启动 + 缓慢刹车（Anthropic 级叙事感）
    expoOut: 'expo.out',
    // 平滑通用
    smooth: 'power2.out',
    // 入场弹性
    overshoot: 'back.out(1.7)',
    // 柔和入
    easeIn: 'power2.in',
    // 柔和入出
    easeInOut: 'power2.inOut',
    // 弹簧
    spring: 'elastic.out(1, 0.5)',
    // 线性（罕用）
    linear: 'none',
    // 预期动作（先回拉再弹出）
    anticipation: 'back.inOut(1.7)',
  };

  // ═══════════════════════════════════════════
  // 核心工具
  // ═══════════════════════════════════════════

  /**
   * 创建并注册一个 paused GSAP timeline
   * @param {string} id - composition ID（对应 data-composition-id）
   * @param {object} opts - { duration?, defaults? }
   */
  function createStage(id, opts = {}) {
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: Ease.expoOut,
        duration: 0.8,
        ...opts.defaults,
      },
    });
    registerTimeline(id, tl);
    return tl;
  }

  /**
   * 注册 timeline 到 window.__timelines
   */
  function registerTimeline(id, tl) {
    window.__timelines = window.__timelines || {};
    window.__timelines[id] = tl;
  }

  /**
   * 创建 stagger 入场序列
   * @param {string} selector - CSS 选择器
   * @param {object} from - gsap.from 属性
   * @param {object} opts - { each?, start?, ease? }
   */
  function staggerIn(tl, selector, from, opts = {}) {
    const { each = 0.12, start = 0, ease } = opts;
    tl.from(selector, {
      ...from,
      ease: ease || Ease.expoOut,
      stagger: { each },
    }, start);
    return tl;
  }

  /**
   * 场景工具：在 timeline 上标记场景边界
   * 配合 narration pipeline 的 cue 系统使用
   */
  function addScene(tl, id, startTime, buildFn) {
    tl.addLabel(id, startTime);
    if (buildFn) buildFn(tl, startTime);
    return tl;
  }

  /**
   * 呼吸动画：让静止帧也有微妙运动（铁律第三条）
   * 用于 hero element 的持续存在感
   */
  function breathe(tl, selector, opts = {}) {
    const { scale = 0.012, duration = 3, start = 0 } = opts;
    tl.to(selector, {
      scale: 1 + scale,
      duration,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, start);
    return tl;
  }

  /**
   * 插值工具（兼容旧 API）
   */
  function interpolate(t, input, output, easing) {
    const [inStart, inEnd] = input;
    const [outStart, outEnd] = output;
    if (t <= inStart) return outStart;
    if (t >= inEnd) return outEnd;
    let progress = (t - inStart) / (inEnd - inStart);
    if (easing && typeof easing === 'function') {
      progress = easing(progress);
    }
    return outStart + (outEnd - outStart) * progress;
  }

  // ═══════════════════════════════════════════
  // VI 预设 · yy-design 品牌运动语言
  // ═══════════════════════════════════════════
  const VI = {
    sumi: '#0A0A0A',
    washi: '#FAFAFA',
    vermillion: '#C0392B',
    gold: '#B8860B',
    fontSerif: '"Noto Serif SC", "Source Han Serif SC", serif',
    fontMono: '"JetBrains Mono", "Fira Code", monospace',
    fontSans: '"Noto Sans SC", "Source Han Sans SC", sans-serif',
  };

  // ═══════════════════════════════════════════
  // 导出
  // ═══════════════════════════════════════════
  window.HyperStage = {
    createStage,
    registerTimeline,
    staggerIn,
    addScene,
    breathe,
    interpolate,
    Ease,
    VI,
  };
})();

