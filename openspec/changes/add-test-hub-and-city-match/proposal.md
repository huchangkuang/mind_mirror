## Why

当前 Mind Mirror 项目只有一个 MBTI 测试，但项目名称并未限定为 MBTI，意味着从一开始就是为多测试场景设计的。为了让用户能够发现和访问各类测试，需要一个中央导航首页来展示所有可用的测试项目。同时，扩展测试类型可以增加用户粘性和使用场景，性格匹配城市测试是一个有趣且实用的方向。

## What Changes

- **新增测试导航首页** (`/`): 将现有的 MBTI 专属首页替换为测试合集导航页，展示所有可用的测试项目
- **新增性格匹配城市测试**: 完整的新测试模块，包括：
  - 测试介绍页 (`/city-match`)
  - 测试题目页 (`/city-match/test`)
  - 测试结果页 (`/city-match/result`)
  - 历史记录页 (`/city-match/history`)
- **MBTI 路由调整**: 保持现有 MBTI 功能完整，路由从 `/` 调整为 `/mbti`
- **统一的导航体验**: 从首页通过卡片式入口点击进入各测试

## Capabilities

### New Capabilities
- `test-hub-homepage`: 测试合集导航首页，展示所有可用测试的卡片式入口
- `city-match-test`: 性格匹配城市测试完整功能，包括题库、评分算法、结果展示和历史记录

### Modified Capabilities
- `mbti-homepage`: 将现有的首页内容移至 `/mbti` 路由，保持功能完整但改变入口位置

## Impact

- **路由变更**: 首页 `/` 变为测试导航页，原 MBTI 内容移至 `/mbti`
- **新增文件**: 
  - `app/page.tsx` (重写为导航页)
  - `app/city-match/` 目录及其所有页面
  - `stores/city-match-store.ts`
  - `lib/city-match/` 目录
  - `data/city-match/questions.json`
- **复用组件**: 复用现有的 `Button`, `Card`, `ProgressBar` 等 UI 组件
- **样式一致**: 保持与现有 MBTI 测试一致的设计语言（毛玻璃效果、渐变色、动画）
