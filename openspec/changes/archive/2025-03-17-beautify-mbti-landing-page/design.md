## Context

当前首页过于简单，只有一个标题和按钮，无法向用户传达 MBTI 测试的价值和科学性。本次设计目标是将首页改造成一个具有视觉吸引力、信息丰富的落地页，帮助用户了解 MBTI 并引导他们开始测试。

**设计系统来源**: ui-ux-pro-max 技能推荐
- **模式**: Scroll-Triggered Storytelling
- **风格**: Vibrant & Block-based（大胆、活力、几何、高对比度）
- **字体**: Outfit / Work Sans（几何现代感）
- **主色调**: 蓝色系 (#2563EB, #3B82F6)，CTA 橙色 (#F97316)

## Goals / Non-Goals

**Goals:**
- 创建视觉冲击力强的 Hero 区域，包含标题、副标题和品牌介绍
- 设计 MBTI 介绍模块，解释其科学背景和价值
- 以交互卡片形式展示四个维度（E/I, S/N, T/F, J/P）
- 实现玻璃拟态 (Glassmorphism) 现代视觉效果
- 支持深色模式切换
- 优化移动端体验

**Non-Goals:**
- 不修改 MBTI 测试逻辑和题库
- 不添加用户系统或数据持久化
- 不实现后端 API

## Decisions

### 1. 技术栈选择
- **框架**: Next.js 15 + React 19 + TypeScript
- **样式**: Tailwind CSS 3.4（项目已有）
- **图标**: Lucide React（轻量、一致性强）
- **动画**: CSS transitions + Framer Motion（预留扩展）

**理由**: 与现有技术栈保持一致，减少依赖；Tailwind 支持 glassmorphism 效果。

### 2. 页面结构设计
采用单页滚动叙事结构：

1. **Hero 区域** - 全屏视觉冲击，渐变背景 + 浮动几何元素
2. **MBTI 简介** - 卡片式介绍 MBTI 历史和应用
3. **四维度展示** - 2x2 网格卡片，悬停展开详情
4. **特色亮点** - 3列图标展示测试优势
5. **CTA 底部** - 再次引导用户开始测试

**理由**: Scroll-Triggered Storytelling 模式提升用户停留时间和转化率。

### 3. 视觉风格
- **Glassmorphism**: 半透明毛玻璃卡片 + 模糊背景
- **渐变**: Hero 区域使用蓝紫渐变（from-blue-600 to-purple-600）
- **阴影**: 柔和多层阴影营造深度感
- **深色模式**: 使用 slate 色系（bg-slate-900, text-slate-100）

**理由**: Glassmorphism 现代感强，适合心理学/自我探索类应用。

### 4. 响应式策略
- **Mobile First**: 375px → 768px → 1024px → 1440px
- Hero 区域在小屏幕简化动画
- 四维度卡片在小屏幕改为垂直堆叠

**理由**: 符合 WCAG 无障碍标准，确保触控目标 ≥44px。

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| Glassmorphism 在低性能设备上卡顿 | 使用 CSS backdrop-filter 配合降级方案；添加 `prefers-reduced-motion` 支持 |
| 深色模式对比度不足 | 使用 WCAG 对比度检查工具验证；主文本 ≥4.5:1 |
| 首屏加载时间增加 | 使用 Next.js 图片优化；延迟加载非首屏内容 |
| 动画干扰注意力 | 动画仅用于装饰性元素；关键信息不使用动画依赖 |

## Migration Plan

1. **阶段 1**: 创建新首页组件和样式
2. **阶段 2**: 在本地开发环境验证响应式和深色模式
3. **阶段 3**: 对比度检查和性能测试
4. **阶段 4**: 替换 `app/page.tsx`

**回滚策略**: 保留旧页面备份，可快速恢复。
