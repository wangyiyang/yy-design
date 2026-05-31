#!/usr/bin/env python3
"""
批量替换 demo 中的 huashu/Claude 痕迹为翊行代码品牌
处理 帖/ 目录下所有 HTML demo
"""

import os, re, glob

DEMOS_DIR = "帖"

# 文案替换映射
TEXT_REPLACEMENTS = [
    # 品牌名
    (r'花叔\s*Design', 'YY Design'),
    (r'花叔Design', 'YY Design'),
    (r'Huashu[-\s]?Design', 'YY Design'),
    (r'huashu-design', 'yy-design'),
    (r'花叔', '翊仰'),
    # Claude Design 引用 → 移除或替换
    (r'Claude Design palette', 'YY Design palette'),
    (r'Claude Design', 'YY Design'),
    (r'Anthropic', 'YY Design'),
    (r'crazy ones', 'creators'),
    # Hero 文案
    (r'Here\'s to the Agents', 'Code, one stroke at a time'),
    (r'Not the ones who click', 'Not the ones who rush'),
    (r'Not the ones who drag', 'Not the ones who drag'),
    (r'Not the ones who wait', 'Not the ones who wait'),
    (r'Agent is the new medium', 'Ink is the new medium'),
    # 标签
    (r'terracotta\s*—\s*致敬\s*Anthropic\s*血统', 'vermillion — 翊行代码品牌色'),
    (r'terracotta —', 'vermillion —'),
]

# 颜色替换映射（常见偏差色 → VI 规范色）
COLOR_REPLACEMENTS = [
    ('#1A1918', '#0A0A0A'),
    ('#F5F4F0', '#FAFAFA'),
    ('#F5F2E8', '#FAFAFA'),
    ('#FAF9F5', '#FAFAFA'),
    ('#F9F7F2', '#FAFAFA'),
    ('#B85D3D', '#C0392B'),
    ('#C44A36', '#C0392B'),
    ('#E94560', '#C0392B'),
    ('#E8D0A0', '#B8860B'),
    ('#8B6F4A', '#B8860B'),
    ('#5a4a2a', '#B8860B'),
    ('#2D4A3A', '#303030'),
    ('#1E3428', '#1A1A1A'),
    ('#3F5E4D', '#424242'),
    ('#8B867E', '#757575'),
    ('#D9D4CB', '#BDBDBD'),
    ('#EDEBE5', '#E0E0E0'),
    ('#E8A5A0', '#F5C6C2'),
    ('#A5D0B0', '#BDBDBD'),
    ('#5a2a2a', '#6E1E18'),
    ('#FFFFFF', '#FAFAFA'),
]

# 字体替换映射
FONT_REPLACEMENTS = [
    ('"PingFang SC", "HarmonyOS Sans SC"', '"Noto Sans SC", "PingFang SC", "HarmonyOS Sans SC"'),
    ('"Tiempos Headline", Georgia', '"Noto Serif SC", "Source Han Serif SC", Georgia'),
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 替换文案
    for pattern, repl in TEXT_REPLACEMENTS:
        content = re.sub(pattern, repl, content, flags=re.IGNORECASE)
    
    # 替换颜色
    for old, new in COLOR_REPLACEMENTS:
        content = content.replace(old, new)
        content = content.replace(old.lower(), new)
        content = content.replace(old.upper(), new)
    
    # 替换字体
    for old, new in FONT_REPLACEMENTS:
        content = content.replace(old, new)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    html_files = glob.glob(f'{DEMOS_DIR}/*.html') + glob.glob(f'{DEMOS_DIR}/**/*.html', recursive=True)
    modified = 0
    for filepath in html_files:
        if process_file(filepath):
            print(f"✅ {os.path.basename(filepath)}")
            modified += 1
        else:
            print(f"⏭  {os.path.basename(filepath)} (no changes)")
    
    print(f"\nModified {modified}/{len(html_files)} files")

if __name__ == '__main__':
    main()
