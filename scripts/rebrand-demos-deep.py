#!/usr/bin/env python3
"""
深度重设计 demo CSS 视觉层 — 注入翊行代码品牌规范
"""

import os, re, glob

FILES = [
    '帖/c3-motion-design-en.html',
    '帖/c5-infographic-en.html', 
    '帖/c6-expert-review-en.html',
    '帖/c2-slides-pptx-en.html',
    '帖/w3-fallback-advisor-en.html',
]

# CSS 颜色替换（精确匹配常见模式）
COLOR_MAP = {
    '#1A1918': '#0A0A0A',
    '#F5F4F0': '#FAFAFA',
    '#F5F2E8': '#FAFAFA',
    '#FAF9F5': '#FAFAFA',
    '#B85D3D': '#C0392B',
    '#C44A36': '#C0392B',
    '#E94560': '#C0392B',
    '#E8D0A0': '#B8860B',
    '#8B6F4A': '#B8860B',
    '#2D4A3A': '#303030',
    '#1E3428': '#1A1A1A',
    '#3F5E4D': '#424242',
    '#8B867E': '#757575',
    '#D9D4CB': '#BDBDBD',
    '#EDEBE5': '#E0E0E0',
    '#E8A5A0': '#F5C6C2',
    '#A5D0B0': '#BDBDBD',
    '#5a2a2a': '#6E1E18',
    '#FFFFFF': '#FAFAFA',
    'rgba(26,25,24,': 'rgba(10,10,10,',
    'rgba(217,119,87,': 'rgba(192,57,43,',
}

# 字体替换
FONT_MAP = {
    '"Source Serif 4", Georgia': '"Noto Serif SC", "Source Han Serif SC", Georgia',
    '"Tiempos Headline", Georgia': '"Noto Serif SC", "Source Han Serif SC", Georgia',
    'font-family: var(--serif-en)': 'font-family: var(--serif-cn)',
}

# 文案替换
TEXT_MAP = {
    'yy-design · c3 motion design (EN)': 'YY Design · 水墨动效引擎',
    'c5-infographic · Data → Typography (EN)': '翊行代码 · 品牌数据信息图',
    'c6 · Five Axes · One Punch List': '翊行代码 · 五维品牌评审',
    'c2-slides-pptx · English · v2': '翊行代码 · 品牌介绍',
    'w3 · Fallback Advisor (English)': '翊行代码 · 设计方向顾问',
    'DESIGN_STUDIO': '{翊} · YY Design',
    'Design Studio': '翊行代码',
    'Pomodoro': '书法练习',
    'pomodoro': '书法练习',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    modified = False
    
    # 颜色替换
    for old, new in COLOR_MAP.items():
        if old in content:
            content = content.replace(old, new)
            modified = True
    
    # 字体替换
    for old, new in FONT_MAP.items():
        if old in content:
            content = content.replace(old, new)
            modified = True
    
    # 文案替换
    for old, new in TEXT_MAP.items():
        if old in content:
            content = content.replace(old, new)
            modified = True
    
    # 添加 VI 字体链接（如果没有）
    if 'Noto Serif SC' not in content and 'fonts.googleapis.com' in content:
        # 替换 Google Fonts 链接
        old_font_link = re.search(r'<link[^>]*fonts\.googleapis\.com[^>]*>', content)
        if old_font_link:
            new_link = '<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">'
            content = content.replace(old_font_link.group(), new_link)
            modified = True
    
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    for filepath in FILES:
        if not os.path.exists(filepath):
            print(f"❌ Not found: {filepath}")
            continue
        
        if process_file(filepath):
            print(f"✅ {os.path.basename(filepath)}")
        else:
            print(f"⏭  {os.path.basename(filepath)} (no changes)")

if __name__ == '__main__':
    main()
