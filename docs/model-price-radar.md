# AI 模型价格雷达 - 数据更新管道

## 概述

AI 模型价格雷达通过「官方来源定时检查 + 自动生成最新价格 JSON + 页面展示数据新鲜度」的数据管道，辅助保持价格数据的时效性。

**重要原则**：
- 不是实时爬虫系统，数据来源于公开官方页面
- 如果页面无法稳定解析，标记为「解析失败 / 需人工核验」
- 不编造价格，不把未知价格显示为 0
- 所有价格带来源链接、更新时间和解析状态

---

## 数据管道结构

```
scripts/model-price-radar/
├── sources.ts              # 官方来源 URL 配置（10 个厂商）
├── types.ts                # 类型定义：PriceFetchStatus、PriceVerifyStatus 等
├── normalize.ts            # 数据标准化和新鲜度计算
├── validate.ts             # 数据验证和摘要打印
├── writeLatestJson.ts      # 生成 model-prices.latest.json
├── fetchPrices.ts          # 主入口：依次执行所有 parser
└── parsers/
    ├── deepseek.ts
    ├── minimax.ts
    ├── aliyunBailian.ts
    ├── volcengineDoubao.ts
    ├── zhipu.ts
    ├── kimi.ts
    ├── tencentHunyuan.ts
    ├── baiduQianfan.ts
    ├── xfyunSpark.ts
    └── xiaomiMimo.ts
```

---

## 官方来源配置

| 厂商 | 价格页 URL |
|------|-----------|
| DeepSeek | https://api-docs.deepseek.com/quick_start/pricing |
| MiniMax | https://platform.minimax.io/docs/pricing/overview |
| 阿里云百炼 | https://help.aliyun.com/zh/model-studio/model-pricing |
| 豆包 | https://www.volcengine.com/docs/82379/1544106 |
| 智谱 GLM | https://bigmodel.cn/pricing |
| Kimi | https://platform.kimi.ai/docs/pricing/chat |
| 腾讯混元 | https://cloud.tencent.com/document/product/1729/97731 |
| 百度千帆 | https://cloud.baidu.com/doc/qianfan/s/wmh4sv6ya |
| 讯飞星火 | https://xinghuo.xfyun.cn/sparkapi |
| 小米 MiMo | https://mimo.mi.com/ |

---

## 数据状态

### PriceFetchStatus（抓取状态）

| 状态 | 说明 |
|------|------|
| `success` | 成功抓取并解析 |
| `partial` | 抓取成功但可能不完整，建议人工核验 |
| `failed` | 抓取失败（网络错误、页面不存在等） |
| `manual_required` | 页面结构无法自动解析，需人工查看 |
| `source_unavailable` | 来源暂时不可用（超时等） |

### PriceVerifyStatus（核验状态）

| 状态 | 说明 |
|------|------|
| `auto_fetched` | 自动抓取的数据 |
| `manual_verified` | 已人工核验 |
| `needs_review` | 需要人工核验 |
| `stale` | 数据可能过期 |
| `deprecated` | 模型已废弃 |
| `unknown` | 状态未知 |

---

## 新鲜度判断规则

| 条件 | 显示 |
|------|------|
| `verificationStatus === 'deprecated'` | 已废弃 |
| `verificationStatus === 'needs_review'` | 需人工核验 |
| `verificationStatus === 'stale'` | 可能已过期 |
| freshnessDays ≤ 7 | 近期核验 |
| freshnessDays 8-30 | 可用但建议复查 |
| freshnessDays 31-90 | 可能过期 |
| freshnessDays > 90 | 严重过期 |

---

## 使用方法

### 手动运行更新

```bash
npm run prices:update
```

### 仅检查现有数据（不抓取）

```bash
npm run prices:check
```

### 查看最新生成的数据文件

```
src/data/generated/model-prices.latest.json
```

---

## 自动更新（GitHub Actions）

工作流文件：`.github/workflows/update-model-prices.yml`

- **定时运行**：每天 08:00 UTC 自动执行
- **手动触发**：通过 GitHub Actions 页面手动 `workflow_dispatch`
- **自动提交**：如果数据有变化，自动提交到当前分支
- **失败降级**：抓取失败不影响前端构建，输出 `fetchSummary` 记录问题

---

## 解析状态展示

页面展示以下信息：

1. 最新数据生成时间 (`generatedAt`)
2. 自动检查成功数量 (`successSources`)
3. 自动检查失败数量 (`failedSources`)
4. 需要人工核验数量 (`manualRequiredSources`)
5. 每个厂商的抓取状态
6. 每条价格的来源链接 (`officialSourceUrl`)
7. 每条价格的 `fetchedAt` 和 `lastCheckedAt`
8. 数据超过 7 天 → 提示「建议复查」
9. 数据超过 30 天 → 提示「可能过期」
10. parser 失败 → 提示「来源解析失败，需人工核验」

---

## 新增厂商 Parser

1. 在 `sources.ts` 中添加厂商 URL 配置
2. 在 `parsers/` 目录下创建新的 parser 文件，例如 `myvendor.ts`
3. 实现 `fetchMyvendor(): Promise<SourceParseResult>` 函数
4. 在 `fetchPrices.ts` 的 `PARSER_MAP` 中注册

parser 示例结构：

```typescript
async function fetchMyvendor(): Promise<SourceParseResult> {
  const result: SourceParseResult = { vendor, vendorSlug, ... }
  try {
    const response = await fetch(PRICE_URL, { signal, headers })
    const html = await response.text()
    const $ = cheerio.load(html)
    // 解析页面，提取模型价格信息
    if (解析成功) {
      result.success = true
      result.models.push(...)
    } else {
      result.fetchStatus = 'manual_required'
    }
  } catch (err) {
    result.fetchStatus = 'failed'
    result.errorMessage = err.message
  }
  return result
}
```

---

## 查看解析失败原因

运行 `npm run prices:check` 查看：

```
⚠️  抓取失败的来源:
   - DeepSeek: HTTP 403 Forbidden
   - 小米 MiMo: 请求超时（15秒）
```

或查看生成的 JSON 文件中的 `fetchStatus` 和 `errorMessage` 字段。

---

## 免责声明

1. **数据仅供参考**：本工具的价格数据仅供学习与选型参考，不构成任何定价建议
2. **实际费用以官方为准**：模型价格可能随时变动，实际费用请以各厂商官方价格页、控制台账单和最新公告为准
3. **自动解析限制**：页面结构可能变化导致自动解析失败或数据不准确，发现问题请提交 Issue
4. **不保证实时性**：自动更新频率为每天一次，无法保证实时同步官方价格变动

---

## 当前自动解析能力

| 厂商 | 当前状态 | 说明 |
|------|----------|------|
| DeepSeek | ⚠️ partial | 页面可访问但价格结构需人工确认 |
| MiniMax | ⚠️ partial | 页面可访问但价格结构需人工确认 |
| 阿里云百炼 | ⚠️ partial | 页面可访问但价格结构需人工确认 |
| 豆包 | ⚠️ partial | 页面可访问但价格结构需人工确认 |
| 智谱 GLM | ⚠️ partial | 页面可访问但价格结构需人工确认 |
| Kimi | ⚠️ partial | 页面可访问但价格结构需人工确认 |
| 腾讯混元 | ⚠️ partial | 页面可访问但价格结构需人工确认 |
| 百度千帆 | ⚠️ partial | 页面可访问但价格结构需人工确认 |
| 讯飞星火 | ⚠️ partial | 页面可访问但价格结构需人工确认 |
| 小米 MiMo | ⚠️ partial | 页面可访问但价格结构需人工确认 |

> 所有数据均需人工核验，不要将自动解析结果视为最终价格。