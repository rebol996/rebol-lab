import * as cheerio from 'cheerio'
import type { SourceParseResult, ParsedModelPrice } from '../types.js'
import { normalizeModelPrice, hashText, computeVerifyStatus, inferModelCapabilities, DEFAULT_CAPABILITIES } from '../normalize.js'

const VENDOR = '豆包'
const VENDOR_SLUG = 'volcengine-doubao'
const PRICE_URL = 'https://www.volcengine.com/docs/82379/1544106'
const PARSER_NAME = 'volcengineDoubao'
const PARSER_VERSION = '1.7'

interface DoubaoModelConfig {
  apiModelId: string
  modelName: string
  modelType: 'text' | 'vision'
  contextLength: string
  aliases: string[]
}

const KNOWN_MODELS: DoubaoModelConfig[] = [
  {
    apiModelId: 'doubao-pro',
    modelName: 'Doubao-Pro',
    modelType: 'text',
    contextLength: '256K',
    aliases: ['doubao-pro', 'doubao-pro-32k']
  },
  {
    apiModelId: 'doubao-lite',
    modelName: 'Doubao-Lite',
    modelType: 'text',
    contextLength: '32K',
    aliases: ['doubao-lite']
  }
]

const API_ACCESS = {
  baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
  endpoint: '/chat/completions',
  compatibleWithOpenAI: true,
  authType: 'bearer' as const,
  authHeaderExample: 'Authorization: Bearer <API_KEY>',
  docsUrl: 'https://www.volcengine.com/docs/82379/',
  consoleUrl: 'https://console.volcengine.com/ark/'
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

async function fetchVolcengineDoubao(): Promise<SourceParseResult> {
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

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(PRICE_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RebolLabPriceFetcher/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/json',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    })

    clearTimeout(timeout)

    if (!response.ok) {
      result.errorMessage = `HTTP ${response.status}`
      result.fetchStatus = response.status === 404 ? 'source_unavailable' : 'failed'
      return result
    }

    const html = await response.text()
    result.rawTextHash = hashText(html.slice(0, 5000))
    const $ = cheerio.load(html)
    const pageText = $('body').text()

    let totalPricesExtracted = 0
    let hasAnyPrice = false

    for (const config of KNOWN_MODELS) {
      const modelPatterns = [
        new RegExp(`${config.apiModelId}[^\\d]*([\\d.]+)`, 'i'),
        new RegExp(`${config.modelName.replace('-', '[- ]')}[^\\d]*([\\d.]+)`, 'i'),
        ...config.aliases.map(a => new RegExp(`${a}[^\\d]*([\\d.]+)`, 'i'))
      ]

      const prices = extractPricesFromTable($, modelPatterns)
      const isLatest = modelExistsOnPage($, modelPatterns)

      if (prices.input !== undefined || prices.output !== undefined) {
        totalPricesExtracted++
        hasAnyPrice = true
      }

      const hasInput = prices.input !== undefined
      const hasOutput = prices.output !== undefined
      const priceCount = (hasInput ? 1 : 0) + (hasOutput ? 1 : 0)

      let confidence = 0
      let fetchStatus: 'success' | 'parse_failed' | 'partial'
      let parserError: string | undefined

      if (!hasInput && !hasOutput) {
        fetchStatus = 'parse_failed'
        parserError = `未能从页面提取 ${config.modelName} 的价格信息，请检查页面结构是否变化`
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
        lastCheckedAt: new Date().toISOString().slice(0, 10),
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
        modelFamily: 'Doubao',
        capabilities,
        isLatest,
        confidence,
        parserError
      }

      result.models.push(normalizeModelPrice(model))
    }

    if (!hasAnyPrice) {
      result.success = false
      result.fetchStatus = 'parse_failed'
      result.parserError = '未能从豆包定价页面提取到任何有效价格信息，页面结构可能已变更'
      result.confidence = 0
      return result
    }

    result.success = true
    result.fetchStatus = result.models.some(m => m.fetchStatus === 'success') ? 'success' : 'partial'
    result.confidence = totalPricesExtracted / KNOWN_MODELS.length

  } catch (err: unknown) {
    result.errorMessage = err instanceof Error ? err.message : '未知错误'
    result.fetchStatus = err instanceof Error && err.name === 'AbortError' ? 'source_unavailable' : 'failed'
    result.parserError = result.errorMessage
  }

  return result
}

export { fetchVolcengineDoubao }
export default fetchVolcengineDoubao