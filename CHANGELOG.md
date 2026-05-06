# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v1.6.0] - 2026-05-04

### Added

- **AI 模型价格雷达 v1.6 重构**
  - 10 个厂商 parser 升级为真实价格抓取
  - 新增 `model-prices.latest.json` 自动生成管道
  - 价格缺失显示"待核验"而非 0
  - 新增 API Model ID、Base URL、Endpoint 等接入信息
  - GitHub Actions 定时更新工作流

### Added

- **简历项目描述生成器** `/tools/resume-project-generator`
  - 基于 STAR 法则生成简历描述
  - 输出简洁版、STAR 展开版、面试讲解版
  - 支持 Markdown 复制

### Added

- **面试问题生成器** `/tools/interview-question-generator`
  - 根据岗位和技术栈生成面试问题
  - 覆盖技术基础、前端框架、类型系统、项目相关、测试思维、HR 面

### Added

- **README 生成器** `/tools/readme-generator`
  - 输入项目信息生成标准 README.md
  - 支持技术栈、功能模块、运行命令、部署方式

### Added

- **Git 提交信息生成器** `/tools/git-commit-generator`
  - Conventional Commits 格式
  - 支持 7 种类型：feat/fix/docs/style/refactor/test/chore
  - 附带使用提示

### Added

- **问题记录本** `/tools/problem-notebook`
  - 记录问题、解决方案、标签
  - localStorage 持久化
  - 支持搜索和 JSON 导出

### Changed

- **工具页重构**
  - 可用工具优先展示
  - 规划中工具单独分区
  - 工具数量更新为 9 个可用 + 6 个规划中

---

## [v1.5.0] - 2026-05-04

### Added

- **项目详情页** `/projects/rebol-lab`
  - 完整的项目介绍：背景、定位、技术栈、功能架构、核心模块
  - AI 模型价格雷达详细说明
  - 数据可靠性设计解析
  - 安全说明和已知限制
  - 面试讲解摘要

### Added

- **首页重写** `HomeView.vue`
  - 新增「这个项目解决什么问题」模块
  - 新增核心模块 4 卡片入口
  - 新增工具亮点展示区
  - 新增「项目状态」任务队列
  - 工具数量从 3 更新为 4

### Added

- **测试文档** `docs/testing.md`
  - 测试范围和测试环境
  - UI/UX 测试用例方向
  - 工具功能测试清单
  - 异常输入测试
  - 已知问题说明

### Added

- **面试演示稿** `docs/demo-script.md`
  - 3 分钟项目介绍讲稿
  - 分段介绍：背景、技术栈、核心工具、项目限制
  - 面试官 FAQ 预判
  - 快速演示路径

### Changed

- **工具入口整理** `ToolsView.vue`
  - 移除未实现的工具占位符（接口测试检查清单、简历项目描述生成器等）
  - 移除无效 fallback 跳转逻辑
  - 所有工具名称和描述统一

### Changed

- **README 正式化**
  - 新增徽章（Vue 3 / TypeScript / Vite / MIT）
  - 新增在线预览占位链接
  - 新增「AI 模型价格雷达的特殊说明」
  - 新增「数据说明」和「测试说明」章节
  - 新增面试官 FAQ 和项目亮点（面试讲解用）

### Changed

- **About 页面更新**
  - 版本号 v1.3.0-beta → v1.5.0-beta

### Changed

- **Layout 更新**
  - 版本号 v1.3（与 About 页面一致）
  - 新增 `PROJECT_DETAIL` 路由标题

---

## [v1.3.0] - 2026-05-04

### Added

- **AI 模型价格雷达 v3 自动数据管道**
  - 新增 `scripts/model-price-radar/`（10 个厂商 parser）
  - 新增 `npm run prices:update` 命令
  - 新增 `npm run prices:check` 命令
  - 新增 GitHub Actions 工作流
  - 生成 `src/data/generated/model-prices.latest.json`

### Added

- **AI 模型价格雷达数据可靠性升级**
  - 新增 `currency`、`priceUnit`、`verificationStatus`、`officialSourceUrl`、`sourceNote` 字段
  - 新增数据新鲜度判断
  - 新增核验状态分级
  - 新增数据来源管理区（10 个厂商）
  - 新增增强筛选
  - 成本计算器安全处理

---

## [v1.2.0] - 2026-05-02

### Added

- **AI 模型价格雷达**
  - 多模型成本计算器
  - 套餐 Plan 展示区
  - 价格快照与更新记录
  - JSON 导入/导出
  - 推荐场景标签

---

## [v1.1.0] - 2026-04-30

### Added

- **测试用例生成器**
- **Bug 报告生成器**

---

## [v1.0.0] - 2026-04-29

### Added

- 项目初始化：Vue 3 + TypeScript + Vite
- 首页、作品集、技能路线、关于我页面
- 深色科技风格 UI 主题

---

## Upcoming

- [ ] 接入真实 AI API（通过后端代理保护 Key）
- [ ] 简历项目描述生成器
- [ ] 项目部署上线（Vercel）