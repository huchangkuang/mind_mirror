## Why

当前首页仅显示标题和一个按钮，缺乏对 MBTI 人格测试的介绍和价值主张，无法有效吸引用户参与测试。通过美化首页，展示 MBTI 的科学背景、四个维度解析以及测试价值，可以显著提升用户信任度和参与度。

## What Changes

- **Hero 区域**: 添加视觉冲击力强的标题、副标题和品牌介绍
- **MBTI 介绍模块**: 介绍 MBTI 的历史背景、科学性和应用领域
- **四维度展示**: 以卡片形式展示 E/I、S/N、T/F、J/P 四个维度
- **特色亮点**: 展示测试的优势（科学性、快速性、免费等）
- **CTA 区域**: 优化进入测试的按钮设计和位置
- **视觉风格**: 采用玻璃拟态 (Glassmorphism) 现代风格，支持深色模式

## Capabilities

### New Capabilities
- `mbti-landing-hero`: 首页 Hero 区域设计与实现
- `mbti-introduction`: MBTI 介绍模块展示
- `mbti-dimensions`: 四维度交互展示卡片
- `mbti-features`: 测试特色亮点展示

### Modified Capabilities
- 无现有能力需要修改

## Impact

- **文件**: `app/page.tsx` - 完全重写
- **新组件**: 可能需要在 `app/components/` 创建可复用组件
- **样式**: 使用 Tailwind CSS，可能添加自定义动画
- **图标**: 需要 Lucide 图标库
