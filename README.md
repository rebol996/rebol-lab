# Rebol Lab

> **软件工程应届生 · 前端开发 · 求职作品集**

![Vue 3](https://img.shields.io/badge/Vue_3-Composition_API-4FC08D?logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)
![MIT](https://img.shields.io/badge/License-MIT-green)

**[在线预览](#在线预览) · [功能模块](#功能模块) · [技术栈](#技术栈) · [本地运行](#本地运行) · [项目结构](#项目结构) · [测试说明](#测试说明) · [面试讲解](#面试讲解)**

---

## 在线预览

> **占位链接**：部署后更新为实际 URL

```
https://your-name.vercel.app
```

或本地运行：

```bash
npm install
npm run dev
# 访问 http://localhost:5173
```

---

## 项目简介

Rebol Lab 是一个面向软件工程学习者的 **AI 学习与求职实验室**。

它解决了一个常见问题：学习成果零散、无法系统展示前端能力和测试思维。

**核心定位**：
- 面向面试官：展示前端技术栈、项目经验和测试思维
- 面向求职者：参考项目结构、技术选型和求职作品集展示方式
- 面向初学者：学习 Vue 3 + TypeScript + Vite 技术栈的实践项目

> **重要说明**：当前工具均为本地辅助工具，所有生成逻辑基于本地规则，不是真实 AI 生成。AI 模型价格雷达的数据来源于公开官方页面的人工核验，不是实时价格系统。

---

## 功能模块

### 可用工具（9个）

| 工具 | 路由 | 功能 | 状态 |
|------|------|------|------|
| 测试用例生成器 | `/tools/test-case-generator` | 根据需求描述生成 7 类测试维度的测试点 | ✅ 已完成 |
| Bug 报告生成器 | `/tools/bug-report-generator` | 标准化复现步骤，生成 Markdown 报告 | ✅ 已完成 |
| 项目包装助手 | `/tools/project-packager` | 生成简历描述、面试讲解稿、追问预判 | ✅ 已完成 |
| AI 模型价格雷达 | `/tools/model-price-radar` | 对比模型价格、套餐额度，支持 API 接入信息展示 | ✅ 已完成 |
| 简历项目描述生成器 | `/tools/resume-project-generator` | 基于 STAR 法则生成高质量项目描述 | ✅ 已完成 |
| 面试问题生成器 | `/tools/interview-question-generator` | 根据岗位和技术栈生成面试问题 | ✅ 已完成 |
| README 生成器 | `/tools/readme-generator` | 快速生成规范的开源项目 README | ✅ 已完成 |
| Git 提交信息生成器 | `/tools/git-commit-generator` | 生成 Conventional Commits 格式提交信息 | ✅ 已完成 |
| 问题记录本 | `/tools/problem-notebook` | 记录问题和解决方案，支持 localStorage 持久化 | ✅ 已完成 |

### 规划中工具（6个）

| 工具 | 功能 | 状态 |
|------|------|------|
| 接口测试检查清单 | 覆盖异常流、安全性的接口测试 Checklist | 🔄 规划中 |
| 网站质量体检工具 | 检测页面响应、链接有效性及 SEO | 🔄 规划中 |
| 自我介绍生成器 | 定制不同风格的自我介绍 | 🔄 规划中 |
| API 文档生成器 | 基于 Swagger/OpenAPI 自动生成精美文档 | 🔄 规划中 |
| 代码注释助手 | 解析函数逻辑并生成标准化 JSDoc 注释 | 🔄 规划中 |
| 每日复盘生成器 | 记录收获与待办，生成每日工作流 | 🔄 规划中 |

### 公开页面

| 页面 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 项目概览、技术栈标签、快速入口 |
| 项目详情 | `/projects/rebol-lab` | Rebol Lab 项目完整介绍 |
| 作品展示厅 | `/projects` | 3 个项目的详细介绍 |
| 技能成长图 | `/roadmap` | 前端学习成长路线（7 阶段） |
| 关于我 | `/about` | 个人简介、求职方向、技术栈 |

---

## 技术栈

| 分类 | 技术 |
|------|------|
| 前端框架 | Vue 3 (Composition API) |
| 类型语言 | TypeScript |
| 构建工具 | Vite |
| 状态管理 | Pinia |
| 路由管理 | Vue Router |
| UI 组件 | Element Plus |
| 样式方案 | SCSS (CSS 变量 + 深色主题) |
| 图标 | @element-plus/icons-vue |
| Node 脚本 | tsx, cheerio |
| CI/CD | GitHub Actions |

---

## 本地运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 更新 AI 模型价格数据（可选）

```bash
npm run prices:check   # 检查现有数据状态
npm run prices:update   # 实际抓取官方价格页
```

---

## 项目结构

```
src
├── data/
│   ├── modelPrices.ts              # 手动维护的模型价格数据（备用）
│   └── generated/
│       └── model-prices.latest.json  # 自动抓取的最新价格 JSON
├── layouts/
│   └── MainLayout.vue              # 侧边栏 + 顶栏布局
├── router/
│   └── index.ts                    # 路由配置
├── styles/
│   └── main.scss                   # CSS 变量、tech-card 样式
├── views/
│   ├── home/HomeView.vue           # 首页（v1.5 重写）
│   ├── tools/
│   │   ├── ToolsView.vue           # 工具入口页
│   │   ├── TestCaseGenerator.vue
│   │   ├── BugReportGenerator.vue
│   │   ├── ProjectPackager.vue
│   │   └── ModelPriceRadar.vue     # AI 模型价格雷达
│   ├── projects/
│   │   ├── ProjectsView.vue        # 作品展示厅
│   │   └── ProjectDetailView.vue   # 项目详情页（新增）
│   ├── roadmap/RoadmapView.vue
│   └── about/AboutView.vue
└── App.vue

scripts/
└── model-price-radar/              # 价格数据自动更新脚本
    ├── sources.ts                  # 官方来源 URL 配置
    ├── fetchPrices.ts              # 主入口
    ├── parsers/                    # 各厂商解析器
    ├── normalize.ts
    ├── validate.ts
    └── writeLatestJson.ts

.github/
└── workflows/
    └── update-model-prices.yml     # GitHub Actions 定时更新

docs/
├── model-price-radar.md            # 数据管道文档
├── testing.md                      # 测试说明（新增）
└── demo-script.md                 # 面试演示稿（新增）
```

---

## AI 模型价格雷达的特殊说明

AI 模型价格雷达是一个**辅助选型工具**，不是实时价格系统。

### 核心设计

1. **数据来源透明**：每条数据标注 officialSourceUrl 和 sourceNote，缺失显示「来源待补充」
2. **数据新鲜度**：显示距上次核验天数，避免把旧数据当成最新价格
3. **核验状态分级**：verified / needs_review / stale / deprecated / unknown
4. **成本估算安全**：仅在 priceUnit=元/百万tokens 且 currency=CNY/USD 时提供估算，其他情况显示明确提示
5. **自动数据管道**：GitHub Actions 定时抓取公开页面，生成 JSON，前端优先读取

### 免责声明

> 模型价格可能随时变动，实际费用请以各厂商官方价格页、控制台账单和最新公告为准。本工具不保证数据实时性和准确性。

---

## 数据说明

1. **工具数据**：存储在浏览器 localStorage，刷新页面保留，清除浏览器数据丢失
2. **价格数据**：示例数据（标注为 needs_review），实际费用以官方页面为准
3. **无后端服务**：纯前端项目，不涉及数据上传或云同步

---

## 安全说明

1. **数据存储**：所有数据存储在本地浏览器，不涉及服务器上传，不收集用户隐私
2. **无登录机制**：项目为公开作品集，无登录或认证机制
3. **API Key 安全**：不要在前端保存真实密钥。如需接入 AI API，建议通过后端代理保护
4. **价格仅供参考**：模型价格以各厂商官方价格页和控制台账单为准

---

## 测试说明

详见 [docs/testing.md](docs/testing.md)。

### 测试范围

- [x] 所有页面路由正常
- [x] 所有工具功能正常
- [x] 响应式布局（桌面端/平板端/移动端）
- [x] 构建通过（`npm run build`）
- [x] 类型检查通过（`vue-tsc -b`）

### 已知问题

| 问题 | 影响 | 缓解措施 |
|------|------|----------|
| 价格数据为示例数据 | 用户不应将价格作为实际参考 | 页面标注「实际费用以官方为准」，价格缺失显示「待核验」 |
| localStorage 5MB 限制 | 大量历史记录可能溢出 | 自动清除最早的记录（最多 5 条） |
| 工具为本地规则，非 AI 生成 | 生成结果可能不够智能 | 已在说明中标注 |

---

## 面试讲解

详见 [docs/demo-script.md](docs/demo-script.md)。

### 快速演示路径

1. 首页 → 介绍项目背景
2. 工具实验室 → 展示 4 个工具
3. AI 模型价格雷达 → 展示数据可靠性设计（重点）
4. 项目详情 → 技术栈和架构
5. 关于我 → 个人背景和求职意向

### 面试官 FAQ

**Q: 这个项目和别的求职作品集有什么区别？**

A: Rebol Lab 不只是展示页面，还包含 4 个实际可用的工具。测试用例生成器展示了对测试方法的理解；AI 模型价格雷达展示了数据可靠性设计能力；Bug 报告生成器和项目包装助手展示了从实际痛点出发设计工具的能力。

**Q: 数据新鲜度是怎么实现的？**

A: GitHub Actions 每天 08:00 UTC 执行 `npm run prices:update`，抓取公开官方价格页面，生成 JSON。前端优先读取生成的 JSON，每条数据有 `lastCheckedAt` 和 `verificationStatus`，前端计算 `freshnessDays` 并分级显示。

---

## 项目亮点

### 1. 完整的前端工程化实践

- Vue 3 Composition API + TypeScript 类型约束
- Vite 构建工具，支持快速开发和热更新
- Pinia 状态管理，Vue Router 懒加载
- SCSS 变量统一主题管理

### 2. 测试思维融入工具设计

- 测试用例生成器覆盖 7 类测试维度
- 工具设计从测试工程师视角出发
- 展示需求分析到工具落地的完整能力

### 3. AI 模型价格雷达的数据可靠性设计

- 不是实时爬虫：人工核验 + 官方来源链接
- 每条数据有 verificationStatus 和 freshnessDays
- 成本估算检查 priceUnit 和 currency，非支持范围显示明确提示
- 自动数据管道：GitHub Actions 定时更新

### 4. 响应式布局

- 支持桌面端和移动端浏览
- 深色科技风格 UI 设计

---

## 后续计划

- [ ] 接入真实 AI API（通过后端代理保护 Key）
- [ ] 简历项目描述生成器
- [ ] 项目部署上线（Vercel / Netlify / GitHub Pages）

---

## 已知限制

1. **工具生成逻辑为本地规则**：不是真实 AI 生成，是基于模板的本地辅助工具
2. **数据存储在浏览器 localStorage**：刷新页面会保留，清除浏览器数据会丢失
3. **无后端服务**：纯前端项目，不涉及数据上传或云同步
4. **部分工具仍在开发中**：标记为"开发中"或"计划中"的功能尚未完成

---

## 作者

**Rebol** — 2026 届软件工程应届生

- 📧 Email: your.email@example.com *(替换为真实邮箱)*
- 💬 微信: rebol_lab *(替换为真实微信)*
- 🐙 GitHub: @rebol *(替换为真实 GitHub)*

- 方向：前端开发 / 软件测试 / 测试开发
- 技术栈：Vue 3 + TypeScript + 测试工具开发
- 状态：求职中

---

## License

[MIT License](./LICENSE)