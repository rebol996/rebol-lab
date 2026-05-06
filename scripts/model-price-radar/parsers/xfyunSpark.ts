import * as cheerio from 'cheerio'
import type { SourceParseResult, ParsedModelPrice } from '../types.js'
import { normalizeModelPrice, hashText, computeVerifyStatus, inferModelCapabilities } from '../normalize.js'

const VENDOR = '讯飞星火'
const VENDOR_SLUG = 'xfyun-spark'
const PRICE_URL = 'https://xinghuo.xfyun.cn/sparkapi'
const PARSER_NAME = 'xfyunSpark'
const PARSER_VERSION = '1.7'

interface SparkModelConfig {
  apiModelId: string
  modelName: string
  modelType: 'text'
  contextLength: string
  aliases: string[]
}

const MODEL_CONFIGS: SparkModelConfig[] = [
  {
    apiModelId: 'spark-4.0',
    modelName: 'Spark V4.0',
    modelType: 'text',
    contextLength: '128K',
    aliases: ['spark-4.0', '星火大模型V4.0', 'spark-max']
  },
  {
    apiModelId: 'spark-3.5',
    modelName: 'Spark V3.5',
    modelType: 'text',
    contextLength: '32K',
    aliases: ['spark-3.5', '星火大模型V3.5', 'spark-pro']
  },
  {
    apiModelId: 'spark-3.0',
    modelName: 'Spark V3.0',
    modelType: 'text',
    contextLength: '8K',
    aliases: ['spark-3.0', '星火大模型V3.0', 'spark-lite']
  },
  {
    apiModelId: 'spark-2.0',
    modelName: 'Spark V2.0',
    modelType: 'text',
    contextLength: '8K',
    aliases: ['spark-2.0', '星火大模型V2.0']
  }
]

const API_ACCESS = {
  baseUrl: 'https://spark-api.xf-yun.com',
  endpoint: '/v3.1/chat',
  compatibleWithOpenAI: false,
  authType: 'bearer' as const,
  authHeaderExample: 'Authorization: Bearer <API_KEY>',
  docsUrl: 'https://www.xfyun.cn/doc/spark/',
  consoleUrl: 'https://xinghuo.xfyun.cn/'
}

function extractPricesFromTable($: cheerio.CheerioAPI, modelPatterns: RegExp[]): { input?: number; output?: number } {
  let inputPrice: number | undefined
  let outputPrice: number | undefined

  $('table').each((_, table) => {
    const rows: string[][] = []
    $(table).find('tr').each((_, tr) => {
      const cells: string[] = []
      $(tr).find('td, th').each((__, cell) => {
        cells.push($(cell).text().trim())
      })
      if (cells.length > 0) rows.push(cells)
    })

    for (const row of rows) {
      const rowText = row.join(' ')
      const rowMatches = modelPatterns.some(p => p.test(rowText))
      if (!rowMatches) continue

      for (const cell of row) {
        const cellNum = parseFloat(cell.replace(/[^0-9.]/g, ''))
        if (isNaN(cellNum) || cellNum <= 0) continue

        if (cell.includes('输入') || cell.includes('input')) {
          inputPrice = cellNum
        } else if (cell.includes('输出') || cell.includes('output')) {
          outputPrice = cellNum
        }
      }
    }
  })

  return { input: inputPrice, output: outputPrice }
}

function modelExistsOnPage($: cheerio.CheerioAPI, modelPatterns: RegExp[]): boolean {
  const pageText = $('body').text()
  return modelPatterns.some(p => p.test(pageText))
}

async function fetchXfyunSpark(): Promise<SourceParseResult> {
  const result: SourceParseResult = {
    vendor: VENDOR,
    vendorSlug: VENDOR_SLUG,
    success: false,
    fetchStatus: 'failed',
    models: [],
    plans: [],
    fetchedAt: new Date().toISOString(),
    officialSourceUrl: PRICE_URL
  }

  let pageContent = ''
  let isPageAvailable = false

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(PRICE_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RebolLabPriceFetcher/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9'
      }
    })

    clearTimeout(timeout)

    if (!response.ok) {
      result.errorMessage = `HTTP ${response.status}`
      result.fetchStatus = response.status === 404 ? 'source_unavailable' : 'failed'
      return result
    }

    pageContent = await response.text()
    isPageAvailable = true
    result.rawTextHash = hashText(pageContent.slice(0, 5000))

  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        result.errorMessage = '请求超时（15秒）'
        result.fetchStatus = 'source_unavailable'
      } else {
        result.errorMessage = err.message
        result.fetchStatus = 'failed'
      }
    } else {
      result.errorMessage = '未知错误'
      result.fetchStatus = 'failed'
    }
    return result
  }

  const $ = cheerio.load(pageContent)
  const bodyText = $('body').text()

  let totalPricesExtracted = 0
  let hasAnyPrice = false
  let modelsFoundOnPage = 0

  for (const config of MODEL_CONFIGS) {
    const modelPatterns = [
      new RegExp(`${config.apiModelId}[^\\d]*([\\d.]+)`, 'i'),
      new RegExp(`${config.modelName.replace('.', '[,.]')}[^\\d]*([\\d.]+)`, 'i'),
      ...config.aliases.map(a => new RegExp(`${a}[^\\d]*([\\d.]+)`, 'i'))
    ]

    const prices = extractPricesFromTable($, modelPatterns)
    const isLatest = modelExistsOnPage($, modelPatterns)

    if (prices.input !== undefined || prices.output !== undefined) {
      totalPricesExtracted++
      hasAnyPrice = true
    }

    if (isLatest) modelsFoundOnPage++

    const hasInput = prices.input !== undefined
    const hasOutput = prices.output !== undefined
    const priceCount = (hasInput ? 1 : 0) + (hasOutput ? 1 : 0)

    let confidence = 0
    let fetchStatus: 'success' | 'parse_failed' | 'partial'
    let parserError: string | undefined

    if (!hasInput && !hasOutput) {
      fetchStatus = 'parse_failed'
      parserError = `未能从页面提取 ${config.modelName} 的价格信息，页面结构可能已变更`
      confidence = 0.1
    } else if (priceCount === 1) {
      fetchStatus = 'partial'
      parserError = hasInput ? '仅获取到输入价格，输出价格未找到' : '仅获取到输出价格，输入价格未找到'
      confidence = 0.6
    } else {
      fetchStatus = 'success'
      confidence = 0.95
    }

    const capabilities = inferModelCapabilities(config.modelName, config.modelType)

    const model: ParsedModelPrice = {
      vendor: VENDOR,
      modelName: config.modelName,
      modelType: config.modelType,
      contextLength: config.contextLength,
      inputPricePerMillion: prices.input,
      outputPricePerMillion: prices.output,
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
      rawTextHash: result.rawTextHash,
      apiModelId: config.apiModelId,
      apiAccess: {
        ...API_ACCESS
      },
      aliases: config.aliases,
      modelFamily: 'Spark',
      capabilities,
      isLatest,
      isLegacy: false,
      confidence,
      parserError
    }

    result.models.push(normalizeModelPrice(model))
  }

  result.modelsExtracted = modelsFoundOnPage
  result.pricesExtracted = totalPricesExtracted

  if (!hasAnyPrice) {
    result.success = false
    result.fetchStatus = 'parse_failed'
    result.parserError = '未能从讯飞星火定价页面提取到任何有效价格信息，页面结构可能已变更'
    result.confidence = 0
    return result
  }

  result.success = true
  result.fetchStatus = result.models.some(m => m.fetchStatus === 'success') ? 'success' : 'partial'
  result.confidence = calculateOverallConfidence(modelsFoundOnPage, totalPricesExtracted, MODEL_CONFIGS.length)

  return result
}

function calculateOverallConfidence(modelsFound: number, totalPrices: number, totalModels: number): number {
  const modelRatio = modelsFound / totalModels
  const priceRatio = totalPrices / (totalModels * 2)
  return Math.round(((modelRatio * 50) + (priceRatio * 50)) * 100) / 100
}

export { fetchXfyunSpark }
export default fetchXfyunSpark
