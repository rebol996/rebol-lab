import type { ParsedModelPrice, ParsedPlan, PriceFetchStatus, PriceVerifyStatus, ModelCapabilities } from './types.js'

export const DEFAULT_CAPABILITIES: ModelCapabilities = {
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

export function normalizeModelPrice(data: Partial<ParsedModelPrice> & { vendor: string; modelName: string }): ParsedModelPrice {
  const hasValidPrice = data.inputPricePerMillion !== undefined && data.outputPricePerMillion !== undefined

  return {
    vendor: data.vendor,
    modelName: data.modelName,
    modelType: data.modelType ?? 'text',
    contextLength: data.contextLength,
    inputPricePerMillion: data.inputPricePerMillion,
    outputPricePerMillion: data.outputPricePerMillion,
    cacheReadPricePerMillion: data.cacheReadPricePerMillion,
    cacheWritePricePerMillion: data.cacheWritePricePerMillion,
    currency: data.currency ?? 'UNKNOWN',
    priceUnit: data.priceUnit ?? 'unknown',
    billingMode: data.billingMode ?? 'pay_as_you_go',
    planName: data.planName,
    planPrice: data.planPrice,
    freeQuota: data.freeQuota,
    officialSourceUrl: data.officialSourceUrl ?? '',
    fetchedAt: data.fetchedAt ?? new Date().toISOString(),
    lastCheckedAt: data.lastCheckedAt ?? new Date().toISOString().slice(0, 10),
    fetchStatus: data.fetchStatus ?? 'failed',
    verifyStatus: data.verifyStatus ?? computeVerifyStatus(data.fetchStatus ?? 'failed'),
    parserName: data.parserName ?? 'unknown',
    parserVersion: data.parserVersion ?? '1.0',
    rawTextHash: data.rawTextHash,
    note: data.note,
    apiModelId: data.apiModelId,
    apiAccess: data.apiAccess,
    aliases: data.aliases,
    modelFamily: data.modelFamily,
    deploymentScope: data.deploymentScope,
    capabilities: data.capabilities ?? DEFAULT_CAPABILITIES,
    isLatest: data.isLatest ?? false,
    isLegacy: data.isLegacy ?? false,
    legacyReason: data.legacyReason,
    confidence: data.confidence ?? 0,
    parserError: data.parserError,
    sourceUpdatedAt: data.sourceUpdatedAt,
    sourceType: data.sourceType ?? 'official_auto',
    rawLinesMatched: data.rawLinesMatched ?? []
  }
}

export function normalizePlan(data: Partial<ParsedPlan> & { vendor: string; planName: string }): ParsedPlan {
  return {
    vendor: data.vendor,
    planName: data.planName,
    price: data.price ?? '',
    quota: data.quota ?? '',
    period: data.period,
    suitableFor: data.suitableFor,
    officialSourceUrl: data.officialSourceUrl ?? '',
    fetchedAt: data.fetchedAt ?? new Date().toISOString(),
    lastCheckedAt: data.lastCheckedAt ?? new Date().toISOString().slice(0, 10),
    fetchStatus: data.fetchStatus ?? 'failed',
    verifyStatus: data.verifyStatus ?? 'unknown',
    parserName: data.parserName ?? 'unknown',
    parserVersion: data.parserVersion ?? '1.0',
    note: data.note
  }
}

export function calcFreshnessDays(lastCheckedAt: string): number {
  if (!lastCheckedAt) return -1
  const checked = new Date(lastCheckedAt)
  const now = new Date()
  const diff = now.getTime() - checked.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getFreshnessLabel(lastCheckedAt: string, verifyStatus: PriceVerifyStatus): string {
  if (verifyStatus === 'deprecated') return '已废弃'
  if (verifyStatus === 'needs_review') return '需人工核验'
  if (verifyStatus === 'stale') return '可能已过期'

  const days = calcFreshnessDays(lastCheckedAt)

  if (!lastCheckedAt) return '未核验'
  if (days < 0) return '未核验'
  if (days <= 7) return '近期核验'
  if (days <= 30) return '可用但建议复查'
  if (days <= 90) return '可能过期'
  return '严重过期'
}

export function computeVerifyStatus(fetchStatus: PriceFetchStatus): PriceVerifyStatus {
  switch (fetchStatus) {
    case 'success': return 'auto_fetched'
    case 'partial': return 'needs_review'
    case 'failed':
    case 'manual_required':
    case 'source_unavailable':
    case 'parse_failed':
      return 'unknown'
  }
}

export function hashText(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

export function parsePriceString(priceStr: string): number | undefined {
  if (!priceStr) return undefined
  const cleaned = priceStr.replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? undefined : parsed
}

export function formatPrice(price: number | undefined): string {
  if (price === undefined || price === 0) return '未获取到'
  if (price < 0.01) return price.toFixed(3)
  if (price < 1) return price.toFixed(2)
  return price.toFixed(1)
}

export function inferModelCapabilities(modelName: string, modelType: string): ModelCapabilities {
  const caps: ModelCapabilities = { ...DEFAULT_CAPABILITIES }
  const name = modelName.toLowerCase()

  if (name.includes('vision') || name.includes('vl') || name.includes('多模态')) {
    caps.supportsVision = true
    caps.suitableForMultimodal = true
  }
  if (name.includes('code') || name.includes('coder') || name.includes('编程')) {
    caps.suitableForCoding = true
  }
  if (name.includes('embedding') || name.includes('文本向量')) {
    caps.supportsEmbedding = true
  }
  if (name.includes('reason') || name.includes('r1') || name.includes('推理')) {
    caps.supportsReasoning = true
  }
  if (name.includes('long') || name.includes('128k') || name.includes('256k') || name.includes('1m')) {
    caps.suitableForLongContext = true
  }
  if (name.includes('4k') || name.includes('8k') || name.includes('32k')) {
    caps.suitableForLowCost = true
  }
  if (modelType === 'vision') {
    caps.supportsVision = true
    caps.suitableForMultimodal = true
  }
  if (modelType === 'code') {
    caps.suitableForCoding = true
  }
  if (modelType === 'embedding') {
    caps.supportsEmbedding = true
  }
  if (modelType === 'reasoning') {
    caps.supportsReasoning = true
  }

  return caps
}