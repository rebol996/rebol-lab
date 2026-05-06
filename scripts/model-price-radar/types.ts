export type PriceFetchStatus =
  | 'success'
  | 'partial'
  | 'failed'
  | 'manual_required'
  | 'source_unavailable'
  | 'parse_failed'

export type ParserStatus = 'success' | 'partial' | 'failed'

export type PriceVerifyStatus =
  | 'auto_fetched'
  | 'manual_verified'
  | 'needs_review'
  | 'stale'
  | 'deprecated'
  | 'unknown'

export type SourceType = 'official_auto' | 'official_manual_verified' | 'legacy_fallback' | 'manual'

export type ModelType = 'text' | 'code' | 'vision' | 'audio' | 'video' | 'embedding' | 'reasoning' | 'other'
export type BillingMode = 'pay_as_you_go' | 'subscription' | 'resource_pack' | 'free' | 'mixed'
export type Currency = 'CNY' | 'USD' | 'UNKNOWN'
export type PriceUnit = 'per_1m_tokens' | 'per_1k_tokens' | 'per_request' | 'per_month' | 'per_year' | 'credit' | 'unknown'
export type DeploymentScope = '中国内地' | '中国区' | '全球' | '国际' | '中国香港' | '未知'

export interface PriceTier {
  tokenRange?: string
  inputPricePerMillion?: number
  outputPricePerMillion?: number
  inputPricePerThousand?: number
  outputPricePerThousand?: number
  pricePerUnit?: number
  unit?: string
}

export interface ApiAccess {
  baseUrl: string
  endpoint: string
  compatibleWithOpenAI: boolean
  authType: 'bearer' | 'api-key' | 'signature' | 'unknown'
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

export interface ParsedModelPrice {
  id: string
  vendor: string
  modelName: string
  modelType: ModelType
  contextLength?: string
  inputPricePerMillion?: number
  outputPricePerMillion?: number
  cacheReadPricePerMillion?: number
  cacheWritePricePerMillion?: number
  priceTiers?: PriceTier[]
  currency: Currency
  priceUnit: PriceUnit
  billingMode: BillingMode
  planName?: string
  planPrice?: string
  freeQuota?: string
  officialSourceUrl: string
  fetchedAt: string
  lastCheckedAt: string
  fetchStatus: PriceFetchStatus
  verifyStatus: PriceVerifyStatus
  parserName: string
  parserVersion: string
  rawTextHash?: string
  note?: string
  apiModelId?: string
  apiAccess?: ApiAccess
  aliases?: string[]
  modelFamily?: string
  deploymentScope?: DeploymentScope
  capabilities?: ModelCapabilities
  isLatest?: boolean
  isLegacy?: boolean
  legacyReason?: string
  confidence?: number
  parserError?: string
  parserStatus?: ParserStatus
  sourceUpdatedAt?: string
  sourceType?: SourceType
  rawLinesMatched?: string[]
  sourceQuote?: string
  lastManualVerifiedAt?: string
}

export interface ParsedPlan {
  vendor: string
  planName: string
  price: string
  quota: string
  period?: string
  suitableFor?: string
  officialSourceUrl: string
  fetchedAt: string
  lastCheckedAt: string
  fetchStatus: PriceFetchStatus
  verifyStatus: PriceVerifyStatus
  parserName: string
  parserVersion: string
  note?: string
}

export interface FailedSource {
  vendor: string
  vendorSlug: string
  sourceUrl: string
  fetchStatus: PriceFetchStatus
  errorMessage?: string
  parserError?: string
  attemptedAt: string
}

export interface SourceParseResult {
  vendor: string
  vendorSlug: string
  success: boolean
  fetchStatus: PriceFetchStatus
  parserStatus: ParserStatus
  models: ParsedModelPrice[]
  plans: ParsedPlan[]
  fetchedAt: string
  officialSourceUrl: string
  errorMessage?: string
  rawTextHash?: string
  note?: string
  parserError?: string
  confidence?: number
  modelsExtracted?: number
  pricesExtracted?: number
  rawLinesMatched?: string[]
  snapshotFile?: string
}

export interface FetchSummary {
  totalSources: number
  successSources: number
  partialSources: number
  failedSources: number
  manualRequiredSources: number
  modelsExtracted: number
  pricesExtracted: number
  legacyModelsUsed: number
}

export interface ApiProvider {
  vendor: string
  vendorSlug: string
  baseUrl: string
  endpoint: string
  authType: string
  authHeaderExample: string
  compatibleWithOpenAI: boolean
  docsUrl: string
  consoleUrl: string
  models: string[]
  notes?: string
}

export interface GeneratedPriceData {
  tool: string
  version: string
  generatedAt: string
  sources: SourceParseResult[]
  models: ParsedModelPrice[]
  plans: ParsedPlan[]
  failedSources: FailedSource[]
  apiProviders: ApiProvider[]
  capabilitySummary: Record<string, number>
  fetchSummary: FetchSummary
  disclaimer: string
}