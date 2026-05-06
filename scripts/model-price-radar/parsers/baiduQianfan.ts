import type { SourceParseResult, ParsedModelPrice } from '../types.js'
import { loadSnapshot } from '../snapshot.js'
import { normalizeModelPrice } from '../normalize.js'

const VENDOR = '百度千帆'
const VENDOR_SLUG = 'baidu-qianfan'
const PRICE_URL = 'https://cloud.baidu.com/doc/qianfan/s/wmh4sv6ya'
const PARSER_NAME = 'baiduQianfan'
const PARSER_VERSION = '1.7.1'

interface QianfanModelConfig {
  apiModelId: string
  modelName: string
  modelType: 'text' | 'vision'
  contextLength: string
  inputKey: string
  outputKey: string
  aliases?: string[]
}

const MODEL_CONFIGS: QianfanModelConfig[] = [
  {
    apiModelId: 'ernie-4.0-8k',
    modelName: 'ERNIE-4.0-8K',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'ernie-4.0-8k-input',
    outputKey: 'ernie-4.0-8k-output'
  },
  {
    apiModelId: 'ernie-4.0-32k',
    modelName: 'ERNIE-4.0-32K',
    modelType: 'text',
    contextLength: '32K',
    inputKey: 'ernie-4.0-32k-input',
    outputKey: 'ernie-4.0-32k-output'
  },
  {
    apiModelId: 'ernie-4.0-turbo-8k',
    modelName: 'ERNIE-4.0-Turbo-8K',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'ernie-4.0-turbo-8k-input',
    outputKey: 'ernie-4.0-turbo-8k-output'
  },
  {
    apiModelId: 'ernie-3.5-8k',
    modelName: 'ERNIE-3.5-8K',
    modelType: 'text',
    contextLength: '8K',
    inputKey: 'ernie-3.5-8k-input',
    outputKey: 'ernie-3.5-8k-output'
  },
  {
    apiModelId: 'ernie-3.5-32k',
    modelName: 'ERNIE-3.5-32K',
    modelType: 'text',
    contextLength: '32K',
    inputKey: 'ernie-3.5-32k-input',
    outputKey: 'ernie-3.5-32k-output'
  },
  {
    apiModelId: 'ernie-speed-128k',
    modelName: 'ERNIE-Speed-128K',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'ernie-speed-128k-input',
    outputKey: 'ernie-speed-128k-output'
  },
  {
    apiModelId: 'ernie-lite-8k',
    modelName: 'ERNIE-Lite-8K',
    modelType: 'text',
    contextLength: '8K',
    inputKey: 'ernie-lite-8k-input',
    outputKey: 'ernie-lite-8k-output'
  }
]

const API_ACCESS = {
  baseUrl: 'https://qianfan.baidubce.com/v2',
  endpoint: '/chat/completions',
  compatibleWithOpenAI: true,
  authType: 'bearer' as const,
  authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
  docsUrl: 'https://cloud.baidu.com/doc/qianfan/',
  consoleUrl: 'https://console.bce.baidu.com/qianfan/'
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

async function fetchBaiduQianfan(snapshotFile?: string): Promise<SourceParseResult> {
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
    parserError: ''
  }

  let text = ''
  let tables: string[][] = []

  if (snapshotFile) {
    const loaded = loadSnapshot(snapshotFile)
    if (loaded) {
      text = loaded.text
      tables = loaded.tables
      result.snapshotFile = snapshotFile
    } else {
      result.parserError = `无法加载快照: ${snapshotFile}`
      return result
    }
  } else {
    result.parserError = '未提供 snapshotFile 参数'
    return result
  }
  const extractedModels: ParsedModelPrice[] = []
  let pricesExtracted = 0

  for (const config of MODEL_CONFIGS) {
    const inputPrice = extractPrice(text, config.inputKey)
    const outputPrice = extractPrice(text, config.outputKey)
    const hasPrice = inputPrice !== undefined || outputPrice !== undefined

    const model: ParsedModelPrice = normalizeModelPrice({
      id: config.apiModelId,
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
      lastCheckedAt: new Date().toISOString().slice(0, 10),
      fetchStatus: hasPrice ? 'success' : 'parse_failed',
      verifyStatus: inputPrice !== undefined && outputPrice !== undefined ? 'auto_fetched' : 'needs_review',
      parserName: PARSER_NAME,
      parserVersion: PARSER_VERSION,
      apiModelId: config.apiModelId,
      apiAccess: API_ACCESS,
      aliases: config.aliases,
      modelFamily: 'ERNIE',
      capabilities: {
        supportsText: true,
        supportsVision: false,
        supportsAudio: false,
        supportsVideo: false,
        supportsEmbedding: false,
        supportsReasoning: false,
        supportsToolCalling: false,
        supportsJsonMode: true,
        supportsOpenAICompatible: true,
        suitableForCoding: false,
        suitableForLongContext: config.contextLength.includes('128'),
        suitableForAgent: false,
        suitableForLowCost: inputPrice !== undefined && inputPrice < 5,
        suitableForMultimodal: false,
        suitableForOpenCode: true,
        suitableForTrea: false
      },
      isLatest: hasPrice,
      isLegacy: false,
      sourceType: hasPrice ? 'official_auto' : undefined,
      confidence: inputPrice !== undefined && outputPrice !== undefined ? 1.0 : inputPrice !== undefined || outputPrice !== undefined ? 0.5 : 0,
      parserError: !hasPrice ? `未能在快照中找到 ${config.modelName} 的价格信息 (inputKey: ${config.inputKey}, outputKey: ${config.outputKey})` : undefined
    })

    if (hasPrice) {
      pricesExtracted++
    }

    extractedModels.push(model)
  }

  result.models = extractedModels
  result.modelsExtracted = extractedModels.length
  result.pricesExtracted = pricesExtracted

  if (pricesExtracted > 0) {
    result.success = true
    result.fetchStatus = pricesExtracted === extractedModels.length * 2 ? 'success' : 'partial'
    result.parserStatus = pricesExtracted === extractedModels.length * 2 ? 'success' : 'partial'
    result.parserError = ''
  } else {
    result.success = false
    result.fetchStatus = 'parse_failed'
    result.parserStatus = 'failed'
    result.parserError = '未能从百度千帆官方定价页面提取到任何模型的价格信息。页面结构可能已变更，请访问 https://cloud.baidu.com/doc/qianfan/s/wmh4sv6ya 查看最新价格。'
  }

  return result
}

export { fetchBaiduQianfan }
export default fetchBaiduQianfan