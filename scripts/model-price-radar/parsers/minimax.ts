import type { SourceParseResult, ParsedModelPrice } from '../types.js'
import { normalizeModelPrice, computeVerifyStatus, inferModelCapabilities, DEFAULT_CAPABILITIES } from '../normalize.js'
import { loadSnapshot } from '../snapshot.js'

const VENDOR = 'MiniMax'
const VENDOR_SLUG = 'minimax'
const PARSER_NAME = 'minimax'
const PARSER_VERSION = '1.7.1'

const API_ACCESS = {
  baseUrl: 'https://api.minimax.chat',
  endpoint: '/v1/text/chatcompletion_v2',
  compatibleWithOpenAI: false,
  authType: 'bearer' as const,
  authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
  docsUrl: 'https://platform.minimax.io/docs/guides/pricing-token-plan',
  consoleUrl: 'https://platform.minimax.io/'
}

interface ModelConfig {
  modelName: string
  modelType: 'text' | 'code' | 'vision'
  contextLength: string
  aliases: string[]
  inputKey: string
  outputKey: string
}

const MODEL_CONFIGS: ModelConfig[] = [
  {
    modelName: 'MiniMax-M2.7',
    modelType: 'text',
    contextLength: '1M',
    aliases: ['minimax-m2.7', 'm2.7'],
    inputKey: 'minimax-m2.7-input',
    outputKey: 'minimax-m2.7-output'
  },
  {
    modelName: 'MiniMax-M2.7-highspeed',
    modelType: 'text',
    contextLength: '1M',
    aliases: ['minimax-m2.7-highspeed', 'm2.7-highspeed'],
    inputKey: 'minimax-m2.7-highspeed-input',
    outputKey: 'minimax-m2.7-highspeed-output'
  },
  {
    modelName: 'MiniMax-M2.5',
    modelType: 'text',
    contextLength: '256K',
    aliases: ['minimax-m2.5', 'm2.5'],
    inputKey: 'minimax-m2.5-input',
    outputKey: 'minimax-m2.5-output'
  },
  {
    modelName: 'MiniMax-M2.5-highspeed',
    modelType: 'text',
    contextLength: '256K',
    aliases: ['minimax-m2.5-highspeed', 'm2.5-highspeed'],
    inputKey: 'minimax-m2.5-highspeed-input',
    outputKey: 'minimax-m2.5-highspeed-output'
  },
  {
    modelName: 'MiniMax-Text-01',
    modelType: 'text',
    contextLength: '4M',
    aliases: ['minimax-text-01', 'text-01'],
    inputKey: 'minimax-text-01-input',
    outputKey: 'minimax-text-01-output'
  }
]

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

async function fetchMiniMax(snapshotFile?: string): Promise<SourceParseResult> {
  const result: SourceParseResult = {
    vendor: VENDOR,
    vendorSlug: VENDOR_SLUG,
    success: false,
    fetchStatus: 'failed',
    parserStatus: 'failed',
    models: [],
    plans: [],
    fetchedAt: new Date().toISOString(),
    officialSourceUrl: API_ACCESS.docsUrl,
    snapshotFile
  }

  const snapshot = loadSnapshot(snapshotFile)
  if (!snapshot) {
    result.parserError = `Snapshot file not found: ${snapshotFile}`
    result.errorMessage = `Failed to load snapshot: ${snapshotFile}`
    return result
  }

  const { text, tables } = snapshot
  const fullText = text + '\n' + tables.flat().join('\n')
  let pricesExtracted = 0
  let anyModelFound = false
  let anyPriceFound = false

  for (const config of MODEL_CONFIGS) {
    let modelFound = false
    let inputPrice: number | undefined
    let outputPrice: number | undefined
    let parserError: string | undefined

    const modelPatterns = [
      new RegExp(config.modelName, 'i'),
      ...config.aliases.map(a => new RegExp(a, 'i'))
    ]

    for (const pattern of modelPatterns) {
      if (pattern.test(fullText)) {
        modelFound = true
        anyModelFound = true
        break
      }
    }

    if (modelFound) {
      inputPrice = extractPrice(fullText, config.inputKey)
      outputPrice = extractPrice(fullText, config.outputKey)

      if (inputPrice !== undefined || outputPrice !== undefined) {
        anyPriceFound = true
        if (inputPrice !== undefined) pricesExtracted++
        if (outputPrice !== undefined) pricesExtracted++
      } else {
        parserError = `Model ${config.modelName} found but no prices extracted for keys: ${config.inputKey}, ${config.outputKey}`
      }
    } else {
      parserError = `Model ${config.modelName} not found in snapshot`
    }

    const hasPrices = inputPrice !== undefined || outputPrice !== undefined
    const sourceType = hasPrices ? 'official_auto' : undefined
    const isLatest = hasPrices

    let fetchStatus: 'success' | 'partial' | 'parse_failed' | 'failed'
    if (hasPrices) {
      fetchStatus = inputPrice !== undefined && outputPrice !== undefined ? 'success' : 'partial'
    } else if (modelFound) {
      fetchStatus = 'parse_failed'
    } else {
      fetchStatus = 'failed'
    }

    const capabilities = inferModelCapabilities(config.modelName, config.modelType)

    result.models.push(normalizeModelPrice({
      vendor: VENDOR,
      modelName: config.modelName,
      modelType: config.modelType,
      contextLength: config.contextLength,
      inputPricePerMillion: inputPrice,
      outputPricePerMillion: outputPrice,
      currency: 'CNY',
      priceUnit: 'per_1m_tokens',
      billingMode: 'pay_as_you_go',
      officialSourceUrl: API_ACCESS.docsUrl,
      fetchedAt: result.fetchedAt,
      lastCheckedAt: new Date().toISOString().slice(0, 10),
      fetchStatus,
      verifyStatus: computeVerifyStatus(fetchStatus),
      parserName: PARSER_NAME,
      parserVersion: PARSER_VERSION,
      apiAccess: API_ACCESS,
      aliases: config.aliases,
      modelFamily: 'MiniMax',
      capabilities,
      isLatest,
      confidence: hasPrices ? 0.9 : (modelFound ? 0.3 : 0.1),
      parserError,
      sourceType,
      parserStatus: hasPrices ? 'success' : 'failed'
    }))
  }

  result.modelsExtracted = result.models.length
  result.pricesExtracted = pricesExtracted
  result.rawLinesMatched = tables.length

  if (!anyModelFound) {
    result.success = false
    result.parserStatus = 'failed'
    result.parserError = 'No MiniMax models found in snapshot'
    result.errorMessage = `Snapshot ${snapshotFile} does not contain any known MiniMax model names`
  } else if (!anyPriceFound) {
    result.success = false
    result.parserStatus = 'failed'
    result.parserError = 'Models found but no prices could be extracted'
    result.errorMessage = `Found model names but price extraction failed for all models`
  } else {
    result.success = true
    result.parserStatus = 'success'
  }

  return result
}

export { fetchMiniMax }
export default fetchMiniMax