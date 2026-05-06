import * as cheerio from 'cheerio'
import type { SourceParseResult, ParsedModelPrice } from '../types.js'
import { normalizeModelPrice, hashText, computeVerifyStatus, inferModelCapabilities } from '../normalize.js'

const VENDOR = '腾讯混元'
const VENDOR_SLUG = 'tencent-hunyuan'
const PRICE_URL = 'https://cloud.tencent.com/document/product/1729/97731'
const PARSER_NAME = 'tencentHunyuan'
const PARSER_VERSION = '1.7'

interface TencentModelConfig {
  apiModelId: string
  modelName: string
  modelType: 'text'
  contextLength: string
  aliases: string[]
  isOnPage?: boolean
}

const MODEL_CONFIGS: TencentModelConfig[] = [
  {
    apiModelId: 'hunyuan-latest',
    modelName: 'Hunyuan-Latest',
    modelType: 'text',
    contextLength: '256K',
    aliases: ['hunyuan-latest', '混元-latest', '混元最新']
  },
  {
    apiModelId: 'hunyuan-pro',
    modelName: 'Hunyuan-Pro',
    modelType: 'text',
    contextLength: '256K',
    aliases: ['hunyuan-pro', '混元-pro']
  },
  {
    apiModelId: 'hunyuan-standard',
    modelName: 'Hunyuan-Standard',
    modelType: 'text',
    contextLength: '32K',
    aliases: ['hunyuan-standard', '混元-standard']
  }
]

const API_ACCESS = {
  baseUrl: 'https://hunyuan.cloud.tencent.com/api/v1',
  endpoint: '/chat/completions',
  compatibleWithOpenAI: true,
  authType: 'bearer' as const,
  authHeaderExample: 'Authorization: Bearer <API_KEY>',
  docsUrl: 'https://cloud.tencent.com/document/product/1729',
  consoleUrl: 'https://console.cloud.tencent.com/hunyuan/'
}

async function fetchTencentHunyuan(): Promise<SourceParseResult> {
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

    const html = await response.text()
    result.rawTextHash = hashText(html.slice(0, 5000))
    const $ = cheerio.load(html)
    const pageText = $('body').text()

    const priceMap = new Map<string, { input?: number; output?: number }>()
    const foundModels = new Set<string>()

    $('table').each((_, table) => {
      const rows: string[][] = []
      $(table).find('tr').each((_, tr) => {
        const cells: string[] = []
        $(tr).find('td, th').each((__, cell) => {
          cells.push($(cell).text().trim())
        })
        if (cells.length > 0) rows.push(cells)
      })

      rows.forEach(row => {
        const rowText = row.join(' ')

        MODEL_CONFIGS.forEach(config => {
          const modelPatterns = [
            new RegExp(config.apiModelId, 'i'),
            new RegExp(config.modelName, 'i'),
            ...config.aliases.map(a => new RegExp(a, 'i'))
          ]

          const isModelRow = modelPatterns.some(p => p.test(rowText))
          if (isModelRow) {
            foundModels.add(config.apiModelId)

            row.forEach(cell => {
              const cellLower = cell.toLowerCase()
              const cellNum = parseFloat(cell.replace(/[^0-9.]/g, ''))

              if (!isNaN(cellNum) && cellNum > 0) {
                if (cellLower.includes('输入') || cellLower.includes('input') || cellLower.includes('元/千')) {
                  const existing = priceMap.get(config.apiModelId)
                  const currentInput = existing?.input
                  if (currentInput === undefined || cellNum < currentInput) {
                    priceMap.set(config.apiModelId, { ...existing, input: cellNum })
                  }
                } else if (cellLower.includes('输出') || cellLower.includes('output')) {
                  const existing = priceMap.get(config.apiModelId)
                  const currentOutput = existing?.output
                  if (currentOutput === undefined || cellNum < currentOutput) {
                    priceMap.set(config.apiModelId, { ...existing, output: cellNum })
                  }
                }
              }
            })
          }
        })
      })
    })

    if (foundModels.size === 0) {
      MODEL_CONFIGS.forEach(config => {
        const modelPatterns = [
          new RegExp(config.apiModelId, 'i'),
          new RegExp(config.modelName, 'i'),
          ...config.aliases.map(a => new RegExp(a, 'i'))
        ]

        modelPatterns.forEach(pattern => {
          if (pattern.test(pageText)) {
            foundModels.add(config.apiModelId)
          }
        })
      })
    }

    let totalConfidence = 0
    let modelsWithPrices = 0

    MODEL_CONFIGS.forEach(config => {
      const prices = priceMap.get(config.apiModelId)
      const hasInput = prices?.input !== undefined
      const hasOutput = prices?.output !== undefined
      const hasFullPrice = hasInput && hasOutput
      const hasPartialPrice = hasInput || hasOutput

      let confidence = 0
      let fetchStatus: 'success' | 'partial' | 'parse_failed'
      let parserError: string | undefined
      let note: string | undefined

      if (hasFullPrice) {
        confidence = 1.0
        fetchStatus = 'success'
        modelsWithPrices++
      } else if (hasPartialPrice) {
        confidence = 0.6
        fetchStatus = 'partial'
        note = hasInput ? '缺少输出价格' : '缺少输入价格'
      } else {
        confidence = 0.2
        fetchStatus = 'parse_failed'
        parserError = `未能从页面提取到 ${config.modelName} 的价格信息`
        note = '未找到价格信息，请人工核验'
      }

      totalConfidence += confidence

      const isLatest = foundModels.has(config.apiModelId)

      result.models.push(normalizeModelPrice({
        vendor: VENDOR,
        modelName: config.modelName,
        modelType: config.modelType,
        contextLength: config.contextLength,
        inputPricePerMillion: prices?.input,
        outputPricePerMillion: prices?.output,
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
        apiAccess: API_ACCESS,
        aliases: config.aliases,
        modelFamily: 'Tencent Hunyuan',
        capabilities: inferModelCapabilities(config.modelName, config.modelType),
        isLatest,
        confidence,
        parserError,
        note
      }))
    })

    if (result.models.length > 0) {
      result.confidence = totalConfidence / result.models.length
    }

    if (modelsWithPrices === 0) {
      result.fetchStatus = 'parse_failed'
      result.parserError = '未能从页面提取到任何模型的价格信息，请检查页面结构是否变化'
      result.note = '页面结构无法自动解析，建议人工查看'
      return result
    }

    result.success = modelsWithPrices === result.models.length
    result.fetchStatus = result.success ? 'success' : 'partial'
    result.parserStatus = result.success ? 'success' : 'partial'
    result.modelsExtracted = result.models.length
    result.pricesExtracted = modelsWithPrices

  } catch (err: unknown) {
    result.errorMessage = err instanceof Error ? err.message : '未知错误'
    result.fetchStatus = err instanceof Error && err.name === 'AbortError' ? 'source_unavailable' : 'failed'
    result.parserError = result.errorMessage
  }

  return result
}

export { fetchTencentHunyuan }
export default fetchTencentHunyuan