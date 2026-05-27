# YY Design · 动画指南

## 动画哲学

YY Design 的动画遵循「微动原则」：
- **克制**：动画是点缀，不是主角
- **目的性**：每个动画都有信息传递功能
- **精确**：时间、缓动、路径都经过计算
- **性能**：60fps，不卡顿

## 禁止的动画

| ❌ 禁止 | 原因 |
|--------|------|
| 弹跳进入 | 过于活泼，不符合理性气质 |
| 旋转展示 | 花哨，干扰信息 |
| 闪烁/脉冲过强 | 视觉疲劳 |
| 随机飘动 | 无目的，像装饰 |
| 过长的过渡 | 用户等待，效率低下 |

## 推荐的动画

### 1. 淡入（Fade In）

```css
@keyframes yy-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

- 时长：300-500ms
- 缓动：ease-out
- 用途：内容出现、页面切换

### 2. 上滑淡入（Slide Up Fade）

```css
@keyframes yy-slide-up {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
```

- 时长：400-600ms
- 缓动：cubic-bezier(0.16, 1, 0.3, 1)
- 用途：列表项、卡片

### 3. 节点脉冲（Node Pulse）

```css
@keyframes yy-pulse {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.8; 
  }
  50% { 
    transform: scale(1.2); 
    opacity: 1; 
  }
}
```

- 时长：2000-4000ms
- 缓动：ease-in-out
- 用途：网络节点、状态指示

### 4. 数据流动（Data Flow）

```css
@keyframes yy-flow {
  from { 
    stroke-dashoffset: 100; 
  }
  to { 
    stroke-dashoffset: 0; 
  }
}
```

- 时长：1000-3000ms
- 缓动：linear
- 用途：连接线、数据传输

### 5. 打字机（Typewriter）

```javascript
// 逐字显示
function typewriter(element, text, speed = 50) {
  let i = 0;
  const timer = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}
```

- 速度：30-80ms/字
- 用途：代码展示、标题

### 6. 微光扫过（Shimmer）

```css
@keyframes yy-shimmer {
  from { 
    background-position: -200% 0; 
  }
  to { 
    background-position: 200% 0; 
  }
}
```

- 时长：2000-3000ms
- 缓动：linear
- 用途：加载状态、高亮

## 时间规范

| 场景 | 时长 | 缓动 |
|------|------|------|
| 微交互（hover） | 150-200ms | ease |
| 内容出现 | 300-500ms | ease-out |
| 页面切换 | 400-600ms | cubic-bezier(0.16, 1, 0.3, 1) |
| 背景动画 | 8000-20000ms | linear |
| 循环动画 | 4000-8000ms | ease-in-out |

## 缓动函数

```css
:root {
  --yy-ease-default: ease;
  --yy-ease-out: ease-out;
  --yy-ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
  --yy-ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --yy-ease-linear: linear;
}
```

## 性能优化

1. **使用 transform 和 opacity**：避免触发 layout/paint
2. **will-change**：对频繁动画的元素使用
3. **requestAnimationFrame**：JS 动画使用 RAF
4. **减少同时动画**：最多 3-5 个同时进行的动画
5. **prefers-reduced-motion**：尊重用户偏好

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
