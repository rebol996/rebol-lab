import * as cheerio from 'cheerio'
import type { SourceParseResult, ParsedModelPrice } from '../types.js'
import { normalizeModelPrice, hashText, computeVerifyStatus, inferModelCapabilities } from '../normalize.js'

const VENDOR = '小米 MiMo'
const VENDOR_SLUG = 'xiaomi-mimo'
const PRICE_URL = 'https://mimo.mi.com/'
const PARSER_NAME = 'xiaomiMimo'
const PARSER_VERSION = '1.7'

interface XiaomiModelConfig {
  apiModelId: string
  modelName: string
  modelType: 'text' | 'vision'
  contextLength: string
  aliases?: string[]
}

const MODEL_CONFIGS: XiaomiModelConfig[] = [
  {
    apiModelId: 'mimo-vl',
    modelName: 'MiMo-VL',
    modelType: 'vision',
    contextLength: '128K',
    aliases: ['mimo-vl', 'MiMo-VL-32K']
  },
  {
    apiModelId: 'mimo-7b',
    modelName: 'MiMo-7B',
    modelType: 'text',
    contextLength: '32K',
    aliases: ['mimo-7b']
  }
]

const API_ACCESS = {
  baseUrl: 'https://mimo.mi.com',
  endpoint: '/v1/chat/completions',
  compatibleWithOpenAI: false,
  authType: 'bearer' as const,
  authHeaderExample: 'Authorization: Bearer <API_KEY>',
  docsUrl: 'https://mimo.mi.com/',
  consoleUrl: 'https://mimo.mi.com/'
}

async function fetchXiaomiMimo(): Promise<SourceParseResult> {
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

    const priceMap = new Map<string, { input?: number; output?: number }>()
    let extractedAny = false

    for (const config of MODEL_CONFIGS) {
      const modelPatterns = [
        new RegExp(`${config.apiModelId}[^\\d]*([\\d.]+)`, 'i'),
        new RegExp(`${config.modelName}[^\\d]*([\\d.]+)`, 'i'),
        ...(config.aliases?.map(a => new RegExp(`${a}[^\\d]*([\\d.]+)`, 'i')) || [])
      ]

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
          for (const pattern of modelPatterns) {
            if (pattern.test(rowText)) {
              for (const cell of row) {
                const cellNum = parseFloat(cell.replace(/[^0-9.]/g, ''))
                if (!isNaN(cellNum) && cellNum > 0) {
                  if (cell.toLowerCase().includes('input')) {
                    inputPrice = cellNum
                  } else if (cell.toLowerCase().includes('output')) {
                    outputPrice = cellNum
                  }
                }
              }
            }
          }
        }
      })

      const pageText = $('body').text()
      if (inputPrice === undefined) {
        for (const pattern of modelPatterns) {
          if (inputPrice === undefined) {
            const match = pageText.match(pattern)
            if (match) {
              inputPrice = parseFloat(match[1])
            }
          }
        }
      }

      if (inputPrice !== undefined || outputPrice !== undefined) {
        priceMap.set(config.apiModelId, { input: inputPrice, output: outputPrice })
        extractedAny = true
      }
    }

    if (!extractedAny) {
      result.fetchStatus = 'parse_failed'
      result.parserError = '页面为 Web 应用，无法提取静态价格信息，请访问控制台查看实际定价'
      result.confidence = 0
      return result
    }

    for (const config of MODEL_CONFIGS) {
      const prices = priceMap.get(config.apiModelId)
      const hasPrices = prices && (prices.input !== undefined || prices.output !== undefined)

      const parsed: Partial<ParsedModelPrice> & { vendor: string; modelName: string } = {
        vendor: VENDOR,
        modelName: config.modelName,
        modelType: config.modelType,
        contextLength: config.contextLength,
        inputPricePerMillion: prices?.input,
        outputPricePerMillion: prices?.output,
        currency: 'CNY',
        priceUnit: 'per_1m_tokens',
        billingMode: 'free',
        officialSourceUrl: PRICE_URL,
        fetchedAt: result.fetchedAt,
        lastCheckedAt: new Date().toISOString().slice(0, 10),
        fetchStatus: hasPrices ? 'success' : 'partial',
        verifyStatus: computeVerifyStatus(hasPrices ? 'success' : 'partial'),
        parserName: PARSER_NAME,
        parserVersion: PARSER_VERSION,
        apiModelId: config.apiModelId,
        apiAccess: API_ACCESS,
        aliases: config.aliases,
        modelFamily: 'MiMo',
        capabilities: inferModelCapabilities(config.modelName, config.modelType),
        isLatest: true,
        confidence: hasPrices ? 80 : 40,
        note: !prices ? '未找到价格信息，请人工核验' : (prices.input === undefined || prices.output === undefined ? '部分价格缺失' : undefined)
      }

      result.models.push(normalizeModelPrice(parsed))
    }

    result.success = true
    result.fetchStatus = result.models.some(m => m.fetchStatus === 'success') ? 'success' : 'partial'

  } catch (err: unknown) {
    result.errorMessage = err instanceof Error ? err.message : '未知错误'
    result.fetchStatus = err instanceof Error && err.name === 'AbortError' ? 'source_unavailable' : 'failed'
    result.confidence = 0
  }

  return result
}

export { fetchXiaomiMimo }
export default fetchXiaomiMimo