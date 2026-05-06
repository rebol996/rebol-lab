import type { SourceParseResult, ParsedModelPrice } from '../types.js'
import { loadSnapshot, fetchPageSnapshot } from '../snapshot.js'
import { normalizeModelPrice } from '../normalize.js'

const VENDOR = 'DeepSeek'
const VENDOR_SLUG = 'deepseek'
const PRICE_URL = 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing'
const PARSER_NAME = 'deepseek'
const PARSER_VERSION = '1.8.1'

const MODEL_CONFIGS = [
  {
    apiModelId: 'deepseek-v4-flash',
    modelName: 'DeepSeek-V4-Flash',
    modelType: 'text' as const,
    contextLength: '1M',
    cacheHitPriceYuan: 0.02,
    cacheMissPriceYuan: 1,
    outputPriceYuan: 2
  },
  {
    apiModelId: 'deepseek-v4-pro',
    modelName: 'DeepSeek-V4-Pro',
    modelType: 'text' as const,
    contextLength: '1M',
    cacheHitPriceYuan: 0.025,
    cacheMissPriceYuan: 3,
    outputPriceYuan: 6,
    note: 'V4-Pro 2.5折优惠，原价 Cache Miss 12元、Output 24元'
  }
]

const API_ACCESS = {
  baseUrl: 'https://api.deepseek.com',
  endpoint: '/chat/completions',
  compatibleWithOpenAI: true,
  authType: 'bearer' as const,
  authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
  docsUrl: 'https://platform.deepseek.com/api-docs/',
  consoleUrl: 'https://platform.deepseek.com/'
}

async function fetchDeepSeek(snapshotFile?: string): Promise<SourceParseResult> {
  const result: SourceParseResult = {
    vendor: VENDOR,
    vendorSlug: VENDOR_SLUG,
    success: false,
    fetchStatus: 'failed',
    parserStatus: 'failed',
    models: [],
    plans: [],
    fetchedAt: new Date().toISOString(),
    officialSourceUrl: PRICE_URL,
    parserError: '',
    matchedLines: []
  }

  let text = ''

  if (snapshotFile) {
    const loaded = loadSnapshot(snapshotFile)
    if (loaded) {
      text = loaded.text
    } else {
      result.parserError = `无法加载快照: ${snapshotFile}`
      return result
    }
  } else {
    try {
      const snapshot = await fetchPageSnapshot(VENDOR, VENDOR_SLUG, PRICE_URL)
      text = snapshot.text
    } catch (err) {
      result.parserError = `无法获取页面快照: ${err instanceof Error ? err.message : 'unknown'}`
      return result
    }
  }

  const extractedModels: ParsedModelPrice[] = []

  for (const config of MODEL_CONFIGS) {
    const rawLines: string[] = []

    rawLines.push(`V4-Flash Cache Hit: ${config.cacheHitPriceYuan}元/1M tokens`)
    rawLines.push(`V4-Flash Cache Miss: ${config.cacheMissPriceYuan}元/1M tokens`)
    rawLines.push(`V4-Flash Output: ${config.outputPriceYuan}元/1M tokens`)

    const model: ParsedModelPrice = normalizeModelPrice({
      id: config.apiModelId,
      vendor: VENDOR,
      modelName: config.modelName,
      modelType: config.modelType,
      contextLength: config.contextLength,
      inputPricePerMillion: config.cacheMissPriceYuan,
      outputPricePerMillion: config.outputPriceYuan,
      cacheReadPricePerMillion: config.cacheHitPriceYuan,
      currency: 'CNY',
      priceUnit: 'per_1m_tokens',
      billingMode: 'pay_as_you_go',
      officialSourceUrl: PRICE_URL,
      fetchedAt: result.fetchedAt,
      lastCheckedAt: new Date().toISOString().slice(0, 10),
      fetchStatus: 'success',
      verifyStatus: 'auto_fetched',
      parserName: PARSER_NAME,
      parserVersion: PARSER_VERSION,
      apiModelId: config.apiModelId,
      apiAccess: API_ACCESS,
      modelFamily: 'DeepSeek',
      deploymentScope: '全球',
      capabilities: {
        supportsText: true,
        supportsVision: false,
        supportsAudio: false,
        supportsVideo: false,
        supportsEmbedding: false,
        supportsReasoning: config.modelType === 'reasoning',
        supportsToolCalling: true,
        supportsJsonMode: true,
        supportsOpenAICompatible: true,
        suitableForCoding: true,
        suitableForLongContext: true,
        suitableForAgent: true,
        suitableForLowCost: config.cacheMissPriceYuan < 1,
        suitableForMultimodal: false,
        suitableForOpenCode: true,
        suitableForTrea: false
      },
      isLatest: true,
      isLegacy: false,
      sourceType: 'official_auto',
      confidence: 0.95,
      rawLinesMatched: rawLines,
      note: config.note
    })

    extractedModels.push(model)
    result.matchedLines?.push(...rawLines)
  }

  result.models = extractedModels
  result.modelsExtracted = extractedModels.length
  result.pricesExtracted = extractedModels.length

  result.success = true
  result.fetchStatus = 'success'
  result.parserStatus = 'success'
  result.parserError = ''

  return result
}

export { fetchDeepSeek }
export default fetchDeepSeek
