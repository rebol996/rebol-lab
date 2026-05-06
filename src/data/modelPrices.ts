/**
 * AI 模型价格数据 - Fallback 静态数据
 *
 * 数据来源：各厂商官方价格页面（人工整理）
 * 最后更新：2025-05
 *
 * 说明：
 * 1. 本文件作为 fallback 数据，仅在自动抓取数据不可用时使用
 * 2. fallback 数据必须标记 isLegacy=true，表示非最新自动获取数据
 * 3. 所有数据均需以厂商官方价格页、控制台账单和最新公告为准
 */

export type ModelType = 'text' | 'code' | 'vision' | 'audio' | 'video' | 'embedding' | 'reasoning' | 'other'
export type BillingMode = 'pay_as_you_go' | 'subscription' | 'resource_pack' | 'free' | 'mixed'
export type SourceType = 'official' | 'manual' | 'community'
export type RecommendTag = 'code' | 'long_context' | 'low_cost' | 'multimodal' | 'opencode' | 'trea' | 'claude_code'
export type Currency = 'CNY' | 'USD' | 'UNKNOWN'
export type PriceUnit = 'per_1m_tokens' | 'per_1k_tokens' | 'per_request' | 'per_month' | 'per_year' | 'credit' | 'unknown'
export type VerificationStatus = 'verified' | 'needs_review' | 'stale' | 'deprecated' | 'unknown' | 'auto_fetched'
export type PriceFetchStatus = 'success' | 'partial' | 'failed' | 'manual_required' | 'source_unavailable' | 'parse_failed'
export type AuthType = 'bearer' | 'api-key' | 'signature' | 'unknown'

export interface ApiAccess {
  baseUrl: string
  endpoint: string
  compatibleWithOpenAI: boolean
  authType: AuthType
  authHeaderExample: string
  docsUrl: string
  consoleUrl: string
}

export interface ModelCapabilities {
  supportsText: boolean
  supportsVision: boolean
  supportsAudio: boolean
  supportsVideo: boolean
  supportsEmbedding: boolean
  supportsReasoning: boolean
  supportsToolCalling: boolean
  supportsJsonMode: boolean
  supportsOpenAICompatible: boolean
  suitableForCoding: boolean
  suitableForLongContext: boolean
  suitableForAgent: boolean
  suitableForLowCost: boolean
  suitableForMultimodal: boolean
  suitableForOpenCode: boolean
  suitableForTrea: boolean
}

export interface ModelPriceItem {
  id: string
  vendor: string
  modelName: string
  modelType: ModelType
  contextLength?: string
  inputPricePerMillion?: number
  outputPricePerMillion?: number
  cacheReadPricePerMillion?: number
  cacheWritePricePerMillion?: number
  billingMode: BillingMode
  freeQuota?: string
  planName?: string
  planPrice?: string
  scenario?: string
  sourceUrl: string
  sourceType: SourceType
  lastCheckedAt: string
  updatedAt: string
  note?: string
  recommendTags?: RecommendTag[]
  currency: Currency
  priceUnit: PriceUnit
  verificationStatus: VerificationStatus
  officialSourceUrl: string
  sourceNote: string
  deprecatedReason?: string
  freshnessDays?: number
  apiModelId?: string
  apiAccess?: ApiAccess
  capabilities?: ModelCapabilities
  isLatest?: boolean
  isLegacy?: boolean
  legacyReason?: string
  confidence?: number
}

export interface ModelPlanItem {
  id: string
  vendor: string
  planName: string
  price: string
  quota: string
  period?: string
  suitableFor?: string
  sourceUrl: string
  lastCheckedAt: string
  note?: string
  verificationStatus: VerificationStatus
  officialSourceUrl: string
  sourceNote: string
  currency: Currency
  priceUnit: PriceUnit
}

export interface VendorSource {
  vendor: string
  priceUrl: string
  consoleUrl?: string
  docsUrl?: string
  note?: string
  lastVerifiedAt?: string
  verificationStatus: VerificationStatus
}

export const modelTypeLabels: Record<ModelType, string> = {
  text: '文本',
  code: '代码',
  vision: '视觉',
  audio: '音频',
  video: '视频',
  embedding: 'Embedding',
  reasoning: '推理',
  other: '其他'
}

export const billingModeLabels: Record<BillingMode, string> = {
  pay_as_you_go: '按量付费',
  subscription: '订阅套餐',
  resource_pack: '资源包',
  free: '免费',
  mixed: '混合'
}

export const sourceTypeLabels: Record<SourceType, string> = {
  official: '官方',
  manual: '人工',
  community: '社区'
}

export const currencyLabels: Record<Currency, string> = {
  CNY: '人民币',
  USD: '美元',
  UNKNOWN: '未知'
}

export const priceUnitLabels: Record<PriceUnit, string> = {
  per_1m_tokens: '元/百万 tokens',
  per_1k_tokens: '元/千 tokens',
  per_request: '元/请求',
  per_month: '元/月',
  per_year: '元/年',
  credit: '积分',
  unknown: '未知'
}

export const verificationStatusLabels: Record<VerificationStatus, string> = {
  verified: '已核验',
  needs_review: '需人工核验',
  stale: '可能过期',
  deprecated: '已废弃',
  unknown: '状态未知',
  auto_fetched: '自动解析成功'
}

export const recommendTagLabels: Record<RecommendTag, string> = {
  code: '适合写代码',
  long_context: '适合长文本',
  low_cost: '适合低成本',
  multimodal: '适合多模态',
  opencode: '适合 OpenCode',
  trea: '适合 Trea',
  claude_code: '适合 Claude Code 类工具'
}

function calcFreshnessDays(lastCheckedAt: string): number {
  if (!lastCheckedAt) return -1
  const checked = new Date(lastCheckedAt)
  const now = new Date()
  const diff = now.getTime() - checked.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getFreshnessLabel(lastCheckedAt: string, verificationStatus: VerificationStatus): string {
  if (verificationStatus === 'deprecated') return '已废弃'
  if (verificationStatus === 'needs_review') return '需人工核验'
  if (verificationStatus === 'stale') return '可能已过期'

  const days = calcFreshnessDays(lastCheckedAt)

  if (lastCheckedAt === '' || !lastCheckedAt) return '未核验'
  if (days < 0) return '未核验'
  if (days <= 7) return '近期核验'
  if (days <= 30) return '可用但建议复查'
  if (days <= 90) return '可能过期'
  return '严重过期'
}

export interface ModelStatus {
  statusText: string
  statusType: '' | 'success' | 'warning' | 'danger' | 'info'
  canCalculateCost: boolean
  cannotCalculateReason?: string
}

export function getModelStatus(model: Record<string, any>): ModelStatus {
  const sourceType = model.sourceType as string | undefined
  const parserStatus = model.parserStatus as string | undefined
  const fetchStatus = model.fetchStatus as string | undefined
  const verifyStatus = model.verifyStatus as string | undefined
  const inputPrice = model.inputPricePerMillion
  const outputPrice = model.outputPricePerMillion
  const priceUnit = model.priceUnit as string | undefined
  const currency = model.currency as string | undefined
  const parserError = model.parserError as string | undefined

  const hasValidInputPrice = inputPrice !== undefined && inputPrice !== null && !isNaN(inputPrice)
  const hasValidOutputPrice = outputPrice !== undefined && outputPrice !== null && !isNaN(outputPrice)
  const hasCompletePrices = hasValidInputPrice && hasValidOutputPrice
  const canCalculate = !!(hasCompletePrices && priceUnit === 'per_1m_tokens' && currency)

  if (sourceType === 'legacy_fallback') {
    return {
      statusText: '历史 fallback 数据',
      statusType: 'info',
      canCalculateCost: false,
      cannotCalculateReason: '历史 fallback 数据不参与成本计算'
    }
  }

  if (sourceType === 'manual') {
    return {
      statusText: '手动维护数据',
      statusType: 'info',
      canCalculateCost: canCalculate,
      cannotCalculateReason: !hasCompletePrices ? '价格信息不完整' : !priceUnit ? '价格单位未知' : !currency ? '货币类型未知' : undefined
    }
  }

  if (sourceType === 'official_auto' || sourceType === undefined) {
    if (parserStatus === 'failed' || fetchStatus === 'parse_failed' || fetchStatus === 'failed') {
      return {
        statusText: parserError || '解析失败',
        statusType: 'danger',
        canCalculateCost: false,
        cannotCalculateReason: `解析失败: ${parserError || '未知原因'}`
      }
    }

    if (parserStatus === 'partial') {
      if (!hasCompletePrices) {
        return {
          statusText: '部分解析',
          statusType: 'warning',
          canCalculateCost: false,
          cannotCalculateReason: '部分价格缺失，无法参与成本计算'
        }
      }
      return {
        statusText: '部分解析',
        statusType: 'warning',
        canCalculateCost: canCalculate,
        cannotCalculateReason: !hasCompletePrices ? '价格信息不完整' : undefined
      }
    }

    if (parserStatus === 'success') {
      if (!hasCompletePrices) {
        return {
          statusText: '价格未完整获取',
          statusType: 'warning',
          canCalculateCost: false,
          cannotCalculateReason: '输入或输出价格缺失'
        }
      }
      return {
        statusText: '自动解析成功',
        statusType: 'success',
        canCalculateCost: canCalculate,
        cannotCalculateReason: !hasCompletePrices ? '价格信息不完整' : !priceUnit ? '价格单位不是 per_1m_tokens' : !currency ? '货币类型未知' : undefined
      }
    }

    if (!hasCompletePrices) {
      return {
        statusText: '价格未完整获取',
        statusType: 'warning',
        canCalculateCost: false,
        cannotCalculateReason: '输入或输出价格缺失'
      }
    }

    return {
      statusText: verifyStatus === 'auto_fetched' ? '自动解析成功' : '状态未知',
      statusType: verifyStatus === 'auto_fetched' ? 'success' : 'info',
      canCalculateCost: canCalculate,
      cannotCalculateReason: !hasCompletePrices ? '价格信息不完整' : undefined
    }
  }

  if (!hasCompletePrices) {
    return {
      statusText: '价格未完整获取',
      statusType: 'warning',
      canCalculateCost: false,
      cannotCalculateReason: '输入或输出价格缺失'
    }
  }

  return {
    statusText: verifyStatus ? verificationStatusLabels[verifyStatus as VerificationStatus] || '状态未知' : '状态未知',
    statusType: verifyStatus === 'verified' ? 'success' : verifyStatus === 'needs_review' ? 'warning' : 'info',
    canCalculateCost: canCalculate,
    cannotCalculateReason: !hasCompletePrices ? '价格信息不完整' : undefined
  }
}

export type ParseStatusType = 'success' | 'partial' | 'failed' | 'not_adapted' | 'fallback' | 'unknown'
export type PriceStatusType = 'complete' | 'partial' | 'not_fetched' | 'unit_unconfirmed' | 'unknown'
export type FreshnessType = 'recent' | 'suggest_review' | 'possibly_stale' | 'deprecated' | 'not_applicable'
export type SourceDisplayType = 'official' | 'snapshot' | 'fallback' | 'missing'

export interface ParseStatus {
  label: string
  type: ParseStatusType
}

export interface PriceStatus {
  label: string
  type: PriceStatusType
}

export interface FreshnessStatus {
  label: string
  type: FreshnessType
}

export interface SourceDisplay {
  label: string
  type: SourceDisplayType
  url?: string
}

export function getParseStatus(model: Record<string, any>): ParseStatus {
  const sourceType = model.sourceType as string | undefined
  const parserStatus = model.parserStatus as string | undefined
  const fetchStatus = model.fetchStatus as string | undefined

  if (sourceType === 'legacy_fallback') {
    return { label: 'Fallback 数据', type: 'fallback' }
  }

  if (sourceType === 'manual') {
    return { label: '手动维护', type: 'success' }
  }

  if (fetchStatus === 'parse_failed' || fetchStatus === 'failed') {
    return { label: '解析失败', type: 'failed' }
  }

  if (parserStatus === 'failed') {
    return { label: '解析失败', type: 'failed' }
  }

  if (parserStatus === 'partial') {
    return { label: '部分解析', type: 'partial' }
  }

  if (parserStatus === 'success' || fetchStatus === 'success') {
    return { label: '自动解析成功', type: 'success' }
  }

  if (!model.officialSourceUrl && !sourceType) {
    return { label: '未适配', type: 'not_adapted' }
  }

  return { label: '状态未知', type: 'unknown' }
}

export function getPriceStatus(model: Record<string, any>): PriceStatus {
  const inputPrice = model.inputPricePerMillion
  const outputPrice = model.outputPricePerMillion
  const priceUnit = model.priceUnit as string | undefined
  const currency = model.currency as string | undefined
  const parserError = model.parserError as string | undefined

  const hasInput = inputPrice !== undefined && inputPrice !== null && !isNaN(inputPrice)
  const hasOutput = outputPrice !== undefined && outputPrice !== null && !isNaN(outputPrice)

  if (parserError && !hasInput && !hasOutput) {
    return { label: '未获取到价格', type: 'not_fetched' }
  }

  if (!hasInput && !hasOutput) {
    return { label: '未获取到价格', type: 'not_fetched' }
  }

  if (hasInput && hasOutput) {
    if (!priceUnit || priceUnit === 'unknown') {
      return { label: '单位待确认', type: 'unit_unconfirmed' }
    }
    if (!currency) {
      return { label: '单位待确认', type: 'unit_unconfirmed' }
    }
    return { label: '价格完整', type: 'complete' }
  }

  return { label: '价格部分缺失', type: 'partial' }
}

export function getDataFreshness(model: Record<string, any>): FreshnessStatus {
  const fetchStatus = model.fetchStatus as string | undefined
  const parserStatus = model.parserStatus as string | undefined
  const lastCheckedAt = model.lastCheckedAt as string | undefined
  const verificationStatus = model.verificationStatus as string | undefined
  const fetchedAt = model.fetchedAt as string | undefined

  if (fetchStatus === 'parse_failed' || fetchStatus === 'failed' || parserStatus === 'failed') {
    return { label: '不适用', type: 'not_applicable' }
  }

  if (verificationStatus === 'deprecated') {
    return { label: '已废弃', type: 'deprecated' }
  }

  const checkDate = fetchedAt || lastCheckedAt
  if (!checkDate) {
    return { label: '未获取', type: 'not_applicable' }
  }

  const days = calcFreshnessDays(checkDate)

  if (days < 0) return { label: '未获取', type: 'not_applicable' }
  if (days <= 7) return { label: '近期获取', type: 'recent' }
  if (days <= 30) return { label: '建议复查', type: 'suggest_review' }
  if (days <= 90) return { label: '可能过期', type: 'possibly_stale' }
  return { label: '严重过期', type: 'possibly_stale' }
}

export function getSourceDisplay(model: Record<string, any>): SourceDisplay {
  const sourceType = model.sourceType as string | undefined
  const officialSourceUrl = model.officialSourceUrl as string | undefined

  if (sourceType === 'legacy_fallback') {
    return { label: 'Fallback', type: 'fallback' }
  }

  if (sourceType === 'manual') {
    return { label: '手动', type: 'official' }
  }

  if (!officialSourceUrl) {
    return { label: '来源缺失', type: 'missing' }
  }

  return { label: '官方来源', type: 'official', url: officialSourceUrl }
}

export const vendorSources: VendorSource[] = [
  {
    vendor: 'DeepSeek',
    priceUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
    consoleUrl: 'https://platform.deepseek.com/',
    docsUrl: 'https://platform.deepseek.com/api-docs/',
    note: '国产大模型，性价比高，支持 DeepSeek-V3 和 DeepSeek-R1',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  },
  {
    vendor: 'MiniMax',
    priceUrl: 'https://platform.minimax.io/docs/pricing/overview',
    consoleUrl: 'https://platform.minimax.io/',
    docsUrl: 'https://platform.minimax.io/docs/',
    note: '长文本处理能力强，MiniMax-Text-01 支持 4M 上下文',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  },
  {
    vendor: '阿里云百炼',
    priceUrl: 'https://help.aliyun.com/zh/model-studio/model-pricing',
    consoleUrl: 'https://bailian.console.aliyun.com/',
    docsUrl: 'https://help.aliyun.com/zh/model-studio/',
    note: '通义千问系列，阿里云百炼平台',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  },
  {
    vendor: '豆包',
    priceUrl: 'https://www.volcengine.com/docs/82379/1544106',
    consoleUrl: 'https://console.volcengine.com/ark/',
    docsUrl: 'https://www.volcengine.com/docs/82379/',
    note: '火山引擎，字节跳动旗下',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  },
  {
    vendor: '智谱 GLM',
    priceUrl: 'https://bigmodel.cn/pricing',
    consoleUrl: 'https://open.bigmodel.cn/',
    docsUrl: 'https://docs.bigmodel.cn/',
    note: 'GLM 系列，有免费模型',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  },
  {
    vendor: 'Kimi',
    priceUrl: 'https://platform.kimi.ai/docs/pricing/chat',
    consoleUrl: 'https://platform.kimi.ai/',
    docsUrl: 'https://platform.kimi.ai/docs',
    note: '月之暗面，长文本能力突出',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  },
  {
    vendor: '腾讯混元',
    priceUrl: 'https://cloud.tencent.com/document/product/1729/97731',
    consoleUrl: 'https://console.cloud.tencent.com/hunyuan/',
    docsUrl: 'https://cloud.tencent.com/document/product/1729',
    note: '腾讯云混元大模型',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  },
  {
    vendor: '百度千帆',
    priceUrl: 'https://cloud.baidu.com/doc/qianfan/s/wmh4sv6ya',
    consoleUrl: 'https://console.bce.baidu.com/qianfan/',
    docsUrl: 'https://cloud.baidu.com/doc/qianfan/',
    note: '文心一言系列',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  },
  {
    vendor: '讯飞星火',
    priceUrl: 'https://xinghuo.xfyun.cn/sparkapi',
    consoleUrl: 'https://xinghuo.xfyun.cn/',
    docsUrl: 'https://www.xfyun.cn/doc/spark/',
    note: '科大讯飞，有免费模型',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  },
  {
    vendor: '小米 MiMo',
    priceUrl: 'https://mimo.mi.com/',
    docsUrl: 'https://mimo.mi.com/',
    note: '小米 MiMo 系列，新发布，价格需根据官方 MiMo 平台价格页核验',
    lastVerifiedAt: '2025-05-04',
    verificationStatus: 'needs_review'
  }
]

const DEFAULT_CAPABILITIES: ModelCapabilities = {
  supportsText: true,
  supportsVision: false,
  supportsAudio: false,
  supportsVideo: false,
  supportsEmbedding: false,
  supportsReasoning: false,
  supportsToolCalling: false,
  supportsJsonMode: false,
  supportsOpenAICompatible: true,
  suitableForCoding: false,
  suitableForLongContext: false,
  suitableForAgent: false,
  suitableForLowCost: false,
  suitableForMultimodal: false,
  suitableForOpenCode: true,
  suitableForTrea: false
}

function makeLegacyModel(
  id: string,
  vendor: string,
  modelName: string,
  modelType: ModelType,
  contextLength: string | undefined,
  inputPricePerMillion: number | undefined,
  outputPricePerMillion: number | undefined,
  scenario: string,
  sourceUrl: string,
  lastCheckedAt: string,
  note: string,
  recommendTags: RecommendTag[],
  apiModelId?: string,
  apiAccess?: ApiAccess
): ModelPriceItem {
  return {
    id,
    vendor,
    modelName,
    modelType,
    contextLength,
    inputPricePerMillion,
    outputPricePerMillion,
    billingMode: 'pay_as_you_go',
    scenario,
    sourceUrl,
    sourceType: 'manual',
    lastCheckedAt,
    updatedAt: lastCheckedAt,
    note: `[历史数据] ${note}`,
    recommendTags,
    currency: 'CNY',
    priceUnit: 'per_1m_tokens',
    verificationStatus: 'needs_review',
    officialSourceUrl: sourceUrl,
    sourceNote: '手动整理的历史数据，非自动抓取，请以最新自动抓取数据为准',
    freshnessDays: calcFreshnessDays(lastCheckedAt),
    isLatest: false,
    isLegacy: true,
    legacyReason: '此为旧版手动整理数据，已被标记为历史数据，请参考自动抓取的最新数据',
    confidence: 0.3,
    apiModelId,
    apiAccess,
    capabilities: { ...DEFAULT_CAPABILITIES }
  }
}

export const modelPrices: ModelPriceItem[] = [
  makeLegacyModel(
    'deepseek-chat-v3-legacy',
    'DeepSeek',
    'DeepSeek-V3 (Chat)',
    'text',
    '64K',
    1,
    2,
    '通用对话、文本生成、代码辅助',
    'https://api-docs.deepseek.com/quick_start/pricing',
    '2025-04-20',
    '示例数据，需人工核验',
    ['code', 'low_cost', 'opencode', 'trea'],
    'deepseek-chat',
    {
      baseUrl: 'https://api.deepseek.com',
      endpoint: '/chat/completions',
      compatibleWithOpenAI: true,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://platform.deepseek.com/api-docs/',
      consoleUrl: 'https://platform.deepseek.com/'
    }
  ),
  makeLegacyModel(
    'deepseek-reasoner-legacy',
    'DeepSeek',
    'DeepSeek-R1 (Reasoner)',
    'reasoning',
    '64K',
    4,
    16,
    '复杂推理、数学、代码',
    'https://api-docs.deepseek.com/quick_start/pricing',
    '2025-04-20',
    '示例数据，需人工核验',
    ['code', 'opencode', 'claude_code'],
    'deepseek-reasoner',
    {
      baseUrl: 'https://api.deepseek.com',
      endpoint: '/chat/completions',
      compatibleWithOpenAI: true,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://platform.deepseek.com/api-docs/',
      consoleUrl: 'https://platform.deepseek.com/'
    }
  ),
  makeLegacyModel(
    'minimax-text-01-legacy',
    'MiniMax',
    'MiniMax-Text-01',
    'text',
    '4M',
    1,
    8,
    '长文本处理、通用对话',
    'https://platform.minimax.io/docs/pricing/overview',
    '2025-04-15',
    '示例数据，需人工核验',
    ['long_context', 'low_cost'],
    'MiniMax-Text-01',
    {
      baseUrl: 'https://api.minimax.chat',
      endpoint: '/v1/text/chatcompletion_v2',
      compatibleWithOpenAI: false,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://platform.minimax.io/docs/guides/pricing-token-plan',
      consoleUrl: 'https://platform.minimax.io/'
    }
  ),
  makeLegacyModel(
    'qwen-max-legacy',
    '通义千问',
    'Qwen-Max',
    'text',
    '32K',
    20,
    60,
    '复杂任务、高质量文本生成',
    'https://help.aliyun.com/zh/model-studio/model-pricing',
    '2025-04-10',
    '示例数据，需人工核验',
    ['multimodal'],
    'qwen-max',
    {
      baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      endpoint: '/chat/completions',
      compatibleWithOpenAI: true,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://help.aliyun.com/zh/model-studio/',
      consoleUrl: 'https://bailian.console.aliyun.com/'
    }
  ),
  makeLegacyModel(
    'kimi-moon-v1-128k-legacy',
    'Kimi',
    'moonshot-v1-128k',
    'text',
    '128K',
    60,
    60,
    '长文本理解、文档分析',
    'https://platform.kimi.ai/docs/pricing/chat',
    '2025-04-08',
    '示例数据，需人工核验',
    ['long_context'],
    'moonshot-v1-128k',
    {
      baseUrl: 'https://api.moonshot.cn/v1',
      endpoint: '/chat/completions',
      compatibleWithOpenAI: true,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://platform.kimi.ai/docs',
      consoleUrl: 'https://platform.kimi.ai/'
    }
  ),
  makeLegacyModel(
    'kimi-moon-v1-8k-legacy',
    'Kimi',
    'moonshot-v1-8k',
    'text',
    '8K',
    12,
    12,
    '短文本对话',
    'https://platform.kimi.ai/docs/pricing/chat',
    '2025-04-08',
    '示例数据，需人工核验',
    [],
    'moonshot-v1-8k',
    {
      baseUrl: 'https://api.moonshot.cn/v1',
      endpoint: '/chat/completions',
      compatibleWithOpenAI: true,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://platform.kimi.ai/docs',
      consoleUrl: 'https://platform.kimi.ai/'
    }
  ),
  makeLegacyModel(
    'ernie-4-turbo-legacy',
    '百度千帆',
    'ERNIE-4.0-Turbo',
    'text',
    '128K',
    30,
    90,
    '高质量文本生成、复杂任务',
    'https://cloud.baidu.com/doc/qianfan/s/wmh4sv6ya',
    '2025-04-05',
    '示例数据，需人工核验',
    [],
    'ernie-4.0-turbo',
    {
      baseUrl: 'https://qianfan.baidubce.com/v2',
      endpoint: '/chat/completions',
      compatibleWithOpenAI: true,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://cloud.baidu.com/doc/qianfan/',
      consoleUrl: 'https://console.bce.baidu.com/qianfan/'
    }
  ),
  makeLegacyModel(
    'hunyuan-pro-legacy',
    '腾讯混元',
    'Hunyuan-Pro',
    'text',
    '256K',
    30,
    90,
    '高质量对话、内容创作',
    'https://cloud.tencent.com/document/product/1729/97731',
    '2025-04-05',
    '示例数据，需人工核验',
    [],
    'hunyuan-pro',
    {
      baseUrl: 'https://hunyuan.cloud.tencent.com/api/v1',
      endpoint: '/chat/completions',
      compatibleWithOpenAI: true,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://cloud.tencent.com/document/product/1729',
      consoleUrl: 'https://console.cloud.tencent.com/hunyuan/'
    }
  ),
  makeLegacyModel(
    'spark-max-legacy',
    '讯飞星火',
    'Spark Max',
    'text',
    '128K',
    30,
    90,
    '高性能对话、知识问答',
    'https://xinghuo.xfyun.cn/sparkapi',
    '2025-04-01',
    '示例数据，需人工核验',
    [],
    'spark-max',
    {
      baseUrl: 'https://spark-api.xf-yun.com',
      endpoint: '/v3.1/chat',
      compatibleWithOpenAI: false,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://www.xfyun.cn/doc/spark/',
      consoleUrl: 'https://xinghuo.xfyun.cn/'
    }
  ),
  makeLegacyModel(
    'glm-4-flash-legacy',
    '智谱 GLM',
    'GLM-4-Flash',
    'text',
    '128K',
    0,
    0,
    '免费模型，通用对话',
    'https://bigmodel.cn/pricing',
    '2025-04-01',
    '示例数据，需人工核验',
    ['low_cost'],
    'glm-4-flash',
    {
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
      endpoint: '/chat/completions',
      compatibleWithOpenAI: true,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://docs.bigmodel.cn/',
      consoleUrl: 'https://open.bigmodel.cn/'
    }
  ),
  makeLegacyModel(
    'doubao-pro-legacy',
    '豆包',
    'Doubao-Pro',
    'text',
    '256K',
    undefined,
    undefined,
    '通用对话、内容创作',
    'https://www.volcengine.com/docs/82379/1544106',
    '2025-04-01',
    '示例数据，需人工核验',
    [],
    'doubao-pro',
    {
      baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
      endpoint: '/chat/completions',
      compatibleWithOpenAI: true,
      authType: 'bearer',
      authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
      docsUrl: 'https://www.volcengine.com/docs/82379/',
      consoleUrl: 'https://console.volcengine.com/ark/'
    }
  )
]

export const modelPlans: ModelPlanItem[] = [
  {
    id: 'deepseek-plan-legacy',
    vendor: 'DeepSeek',
    planName: '按量付费',
    price: '无月费，按实际用量计费',
    quota: '按 token 计费',
    period: '无固定周期',
    suitableFor: '开发者、中小企业',
    sourceUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
    lastCheckedAt: '2025-04-20',
    note: '示例数据，需人工核验',
    verificationStatus: 'needs_review',
    officialSourceUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
    sourceNote: '官方价格页，需人工核验最新套餐',
    currency: 'CNY',
    priceUnit: 'per_1m_tokens'
  },
  {
    id: 'minimax-plan-legacy',
    vendor: 'MiniMax',
    planName: '按量付费',
    price: '无月费，按实际用量计费',
    quota: '按 token 计费',
    period: '无固定周期',
    suitableFor: '开发者',
    sourceUrl: 'https://platform.minimax.io/docs/pricing/overview',
    lastCheckedAt: '2025-04-15',
    note: '示例数据，需人工核验',
    verificationStatus: 'needs_review',
    officialSourceUrl: 'https://platform.minimax.io/docs/pricing/overview',
    sourceNote: '官方文档，需人工核验',
    currency: 'CNY',
    priceUnit: 'per_1m_tokens'
  },
  {
    id: 'glm-free-legacy',
    vendor: '智谱 GLM',
    planName: 'GLM-4-Flash 免费',
    price: '免费',
    quota: '免费使用',
    suitableFor: '开发者、学习者',
    sourceUrl: 'https://bigmodel.cn/pricing',
    lastCheckedAt: '2025-04-01',
    note: '免费模型',
    verificationStatus: 'needs_review',
    officialSourceUrl: 'https://bigmodel.cn/pricing',
    sourceNote: '智谱官方定价页，需人工核验',
    currency: 'CNY',
    priceUnit: 'per_1m_tokens'
  }
]