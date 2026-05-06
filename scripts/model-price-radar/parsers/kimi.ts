import type { SourceParseResult, ParsedModelPrice } from '../types.js'
import { normalizeModelPrice, hashText, computeVerifyStatus, inferModelCapabilities, DEFAULT_CAPABILITIES } from '../normalize.js'
import { loadSnapshot } from '../snapshot.js'

const VENDOR = 'Kimi'
const VENDOR_SLUG = 'kimi'
const PARSER_NAME = 'kimi'
const PARSER_VERSION = '1.7.1'

const PRICE_URL = 'https://platform.kimi.ai/docs/pricing/chat'

interface KimiModelConfig {
  apiModelId: string
  modelName: string
  modelType: 'text'
  contextLength: string
  inputKey: string
  outputKey: string
  aliases?: string[]
}

const MODEL_CONFIGS: KimiModelConfig[] = [
  {
    apiModelId: 'moonshot-v1-8k',
    modelName: 'moonshot-v1-8k',
    modelType: 'text',
    contextLength: '8K',
    inputKey: 'moonshot-v1-8k-input',
    outputKey: 'moonshot-v1-8k-output',
    aliases: ['moonshot-v1-8k', 'kimi-8k']
  },
  {
    apiModelId: 'moonshot-v1-32k',
    modelName: 'moonshot-v1-32k',
    modelType: 'text',
    contextLength: '32K',
    inputKey: 'moonshot-v1-32k-input',
    outputKey: 'moonshot-v1-32k-output',
    aliases: ['moonshot-v1-32k', 'kimi-32k']
  },
  {
    apiModelId: 'moonshot-v1-128k',
    modelName: 'moonshot-v1-128k',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'moonshot-v1-128k-input',
    outputKey: 'moonshot-v1-128k-output',
    aliases: ['moonshot-v1-128k', 'kimi-128k', 'moonshot-v1', 'kimi']
  },
  {
    apiModelId: 'moonshot-v1-128k',
    modelName: 'kimi-k2.5',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'kimi-k2.5-input',
    outputKey: 'kimi-k2.5-output',
    aliases: ['kimi-k2.5', 'moonshot-v1']
  },
  {
    apiModelId: 'moonshot-v1-128k',
    modelName: 'kimi-k2.6',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'kimi-k2.6-input',
    outputKey: 'kimi-k2.6-output',
    aliases: ['kimi-k2.6', 'kimi-k2']
  }
]

const API_ACCESS = {
  baseUrl: 'https://api.moonshot.cn/v1',
  endpoint: '/chat/completions',
  compatibleWithOpenAI: true,
  authType: 'bearer' as const,
  authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
  docsUrl: 'https://platform.kimi.ai/docs',
  consoleUrl: 'https://platform.kimi.ai/'
}

function extractPrice(text: string, key: string): number | undefined {
  const patterns = [
    new RegExp(`${key}[^\\d]*([\\d.]+)\\s*(?:元|/百万|/1M|tokens)`, 'i'),
    new RegExp(`([\\d.]+)\\s*元.*${key}`, 'i')
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const price = parseFloat(match[1])
      if (!isNaN(price) && price > 0 && price < 10000) return price
    }
  }
  return undefined
}

async function fetchKimi(snapshotFile?: string): Promise<SourceParseResult> {
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
    snapshotFile
  }

  const snapshot = loadSnapshot(snapshotFile)
  if (!snapshot) {
    result.parserError = `无法加载快照文件: ${snapshotFile}`
    result.success = false
    result.parserStatus = 'failed'
    return result
  }

  const { text, tables } = snapshot
  const textLower = text.toLowerCase()

  let rawTextHash = ''
  if (text.length > 0) {
    rawTextHash = hashText(text.slice(0, 5000))
  }

  let totalPricesExtracted = 0
  let modelsWithPrices = 0

  for (const config of MODEL_CONFIGS) {
    const inputKey = config.inputKey.toLowerCase()
    const outputKey = config.outputKey.toLowerCase()

    let inputPrice: number | undefined
    let outputPrice: number | undefined

    inputPrice = extractPrice(text, config.inputKey)
    if (inputPrice === undefined) {
      inputPrice = extractPrice(text, inputKey)
    }

    outputPrice = extractPrice(text, config.outputKey)
    if (outputPrice === undefined) {
      outputPrice = extractPrice(text, outputKey)
    }

    const hasInput = inputPrice !== undefined
    const hasOutput = outputPrice !== undefined
    const hasPrices = hasInput || hasOutput

    if (hasPrices) {
      totalPricesExtracted += hasInput ? 1 : 0
      totalPricesExtracted += hasOutput ? 1 : 0
      modelsWithPrices++
    }

    const capabilities = inferModelCapabilities(config.modelName, config.modelType)
    const fetchStatus = hasPrices ? 'success' : 'parse_failed'
    const hasCompletePrices = hasInput && hasOutput

    let parserError: string | undefined
    if (!hasPrices) {
      parserError = `未能从快照提取${config.modelName}的价格信息，请检查快照内容是否包含价格数据`
    } else if (!hasCompletePrices) {
      parserError = `仅提取到部分价格信息（输入:${hasInput ? '✓' : '✗'} 输出:${hasOutput ? '✓' : '✗'}），建议人工核验`
    }

    const normalized = normalizeModelPrice({
      vendor: VENDOR,
      modelName: config.modelName,
      modelType: config.modelType,
      contextLength: config.contextLength,
      inputPricePerMillion: inputPrice,
      outputPricePerMillion: outputPrice,
      currency: 'CNY',
      priceUnit: 'per_1m_tokens',
      billingMode: 'pay_as_you_go',
      officialSourceUrl: PRICE_URL,
      fetchedAt: result.fetchedAt,
      lastCheckedAt: result.fetchedAt.slice(0, 10),
      fetchStatus,
      verifyStatus: computeVerifyStatus(fetchStatus),
      parserName: PARSER_NAME,
      parserVersion: PARSER_VERSION,
      rawTextHash,
      apiModelId: config.apiModelId,
      apiAccess: API_ACCESS,
      aliases: config.aliases,
      modelFamily: 'Moonshot',
      capabilities,
      isLatest: hasPrices,
      isLegacy: false,
      confidence: hasCompletePrices ? 100 : hasPrices ? 50 : 0,
      parserError,
      sourceType: hasPrices ? 'official_auto' : undefined,
      note: !hasCompletePrices && hasPrices ? '部分价格缺失，请人工核验' : undefined
    })

    result.models.push(normalized)
  }

  result.modelsExtracted = result.models.length
  result.pricesExtracted = totalPricesExtracted
  result.rawTextHash = rawTextHash

  const hasAnyPrices = modelsWithPrices > 0

  if (!hasAnyPrices) {
    result.success = false
    result.parserStatus = 'failed'
    result.fetchStatus = 'parse_failed'
    result.parserError = `无法从快照文件提取任何价格信息。请检查快照文件 ${snapshotFile} 是否包含有效的价格数据。`
    result.confidence = 0
    return result
  }

  result.success = true
  result.parserStatus = 'success'
  result.fetchStatus = totalPricesExtracted >= result.models.length * 2 ? 'success' : 'partial'
  result.confidence = Math.round((modelsWithPrices / result.models.length) * 100)

  return result
}

export { fetchKimi }
export default fetchKimi