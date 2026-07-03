## ADDED Requirements

### Requirement: Shared test data MUST live in packages/data
MBTI 与城市匹配等题库 JSON MUST 作为 `@mind-mirror/data` 包的单一数据源维护，不得再依赖 sibling 目录或 `MIND_MIRROR_WEB_ROOT` 环境变量。

#### Scenario: API reads canonical question bank
- **WHEN** `apps/api` 服务加载 MBTI 或 city-match 题库
- **THEN** 系统 SHALL 从 `@mind-mirror/data` 包解析文件路径并读取 JSON
- **THEN** 系统 SHALL NOT 依赖 `../mind_mirror` sibling 路径

#### Scenario: Web static copy for client fetch
- **WHEN** `apps/web` 执行 dev 或 build 前数据同步步骤
- **THEN** 系统 SHALL 将 `@mind-mirror/data` 中 JSON 复制到 `apps/web/public/data/`
- **THEN** 客户端 fetch `/data/mbti/questions.json` 等路径 SHALL 仍可正常工作
