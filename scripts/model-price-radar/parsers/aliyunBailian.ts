import type { SourceParseResult, ParsedModelPrice } from '../types.js'
import { loadSnapshot } from '../snapshot.js'
import { normalizeModelPrice, hashText } from '../normalize.js'

const VENDOR = '阿里云百炼'
const VENDOR_SLUG = 'aliyun-bailian'
const PRICE_URL = 'https://help.aliyun.com/zh/model-studio/model-pricing'
const PARSER_NAME = 'aliyunBailian'
const PARSER_VERSION = '1.7.1'

interface QwenModelConfig {
  apiModelId: string
  modelName: string
  modelType: 'text'
  contextLength: string
  inputKey: string
  outputKey: string
  aliases?: string[]
}

const MODEL_CONFIGS: QwenModelConfig[] = [
  {
    apiModelId: 'qwen3.6-max-preview',
    modelName: 'qwen3.6-max-preview',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'qwen3.6-max-preview-input',
    outputKey: 'qwen3.6-max-preview-output'
  },
  {
    apiModelId: 'qwen3.6-plus',
    modelName: 'qwen3.6-plus',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'qwen3.6-plus-input',
    outputKey: 'qwen3.6-plus-output'
  },
  {
    apiModelId: 'qwen3.6-flash',
    modelName: 'qwen3.6-flash',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'qwen3.6-flash-input',
    outputKey: 'qwen3.6-flash-output'
  },
  {
    apiModelId: 'qwen3-max',
    modelName: 'qwen3-max',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'qwen3-max-input',
    outputKey: 'qwen3-max-output'
  },
  {
    apiModelId: 'qwen2.5-plus',
    modelName: 'qwen2.5-plus',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'qwen2.5-plus-input',
    outputKey: 'qwen2.5-plus-output'
  },
  {
    apiModelId: 'qwen2.5-turbo',
    modelName: 'qwen2.5-turbo',
    modelType: 'text',
    contextLength: '128K',
    inputKey: 'qwen2.5-turbo-input',
    outputKey: 'qwen2.5-turbo-output'
  }
]

const API_ACCESS = {
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  endpoint: '/chat/completions',
  compatibleWithOpenAI: true,
  authType: 'bearer' as const,
  authHeaderExample: 'Authorization: Bearer <YOUR_API_KEY>',
  docsUrl: 'https://help.aliyun.com/zh/model-studio/',
  consoleUrl: 'https://bailian.console.aliyun.com/'
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

async function fetchAliyunBailian(snapshotFile?: string): Promise<SourceParseResult> {
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
    result.parserError = '未提供快照文件'
    return result
  }

  const extractedModels: ParsedModelPrice[] = []
  let rawLinesMatched = 0

  for (const config of MODEL_CONFIGS) {
    const inputPrice = extractPrice(text, config.inputKey)
    const outputPrice = extractPrice(text, config.outputKey)

    const hasPrice = inputPrice !== undefined || outputPrice !== undefined

    const model: ParsedModelPrice = normalizeModelPrice({
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
      verifyStatus: hasPrice ? 'auto_fetched' : 'needs_review',
      parserName: PARSER_NAME,
      parserVersion: PARSER_VERSION,
      rawTextHash: hashText(text.slice(0, 8000)),
      apiModelId: config.apiModelId,
      apiAccess: API_ACCESS,
      aliases: config.aliases,
      modelFamily: 'Qwen',
      capabilities: {
        supportsText: true,
        supportsVision: false,
        supportsAudio: false,
        supportsVideo: false,
        supportsEmbedding: false,
        supportsReasoning: false,
        supportsToolCalling: true,
        supportsJsonMode: true,
        supportsOpenAICompatible: true,
        suitableForCoding: false,
        suitableForLongContext: true,
        suitableForAgent: true,
        suitableForLowCost: inputPrice !== undefined && inputPrice < 5,
        suitableForMultimodal: false,
        suitableForOpenCode: true,
        suitableForTrea: false
      },
      isLatest: hasPrice,
      sourceType: hasPrice ? 'official_auto' : undefined,
      confidence: inputPrice !== undefined && outputPrice !== undefined ? 1.0 : hasPrice ? 0.5 : 0,
      parserError: !hasPrice ? `未能在快照中找到 ${config.modelName} 的价格信息` : undefined
    })

    if (hasPrice) {
      rawLinesMatched++
    }

    extractedModels.push(model)
  }

  result.models = extractedModels
  result.modelsExtracted = extractedModels.length
  result.pricesExtracted = extractedModels.filter(m => m.inputPricePerMillion !== undefined || m.outputPricePerMillion !== undefined).length
  result.rawLinesMatched = rawLinesMatched

  if (result.pricesExtracted > 0) {
    result.success = true
    result.fetchStatus = result.pricesExtracted === extractedModels.length * 2 ? 'success' : 'partial'
    result.parserStatus = result.pricesExtracted === extractedModels.length * 2 ? 'success' : 'partial'
    result.parserError = ''
  } else {
    result.success = false
    result.fetchStatus = 'parse_failed'
    result.parserStatus = 'failed'
    result.parserError = '未能从阿里云百炼官方定价页面提取到任何模型的价格信息。页面结构可能已变更，请访问 https://help.aliyun.com/zh/model-studio/model-pricing 查看最新价格。'
  }

  return result
}

export { fetchAliyunBailian }
export default fetchAliyunBailian