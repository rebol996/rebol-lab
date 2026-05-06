import * as cheerio from 'cheerio'
import type { SourceParseResult, ParsedModelPrice, ModelType } from '../types.js'
import { normalizeModelPrice, hashText, computeVerifyStatus, inferModelCapabilities } from '../normalize.js'

const VENDOR = '智谱 GLM'
const VENDOR_SLUG = 'zhipu'
const PRICE_URL = 'https://bigmodel.cn/pricing'
const PARSER_NAME = 'zhipu'
const PARSER_VERSION = '1.7'

const API_ACCESS_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'
const API_ACCESS_ENDPOINT = '/chat/completions'

interface ZhipuModelConfig {
  apiModelId: string
  modelName: string
  modelType: ModelType
  contextLength: string
  aliases?: string[]
  isVision?: boolean
}

const MODEL_CONFIGS: ZhipuModelConfig[] = [
  {
    apiModelId: 'glm-4-flash',
    modelName: 'GLM-4-Flash',
    modelType: 'text',
    contextLength: '128K',
    aliases: ['glm-4-flash', 'glm4-flash', 'glm4flash']
  },
  {
    apiModelId: 'glm-4-plus',
    modelName: 'GLM-4-Plus',
    modelType: 'text',
    contextLength: '128K',
    aliases: ['glm-4-plus', 'glm4-plus', 'glm4plus']
  },
  {
    apiModelId: 'glm-4',
    modelName: 'GLM-4',
    modelType: 'text',
    contextLength: '128K',
    aliases: ['glm-4', 'glm4']
  },
  {
    apiModelId: 'glm-4v',
    modelName: 'GLM-4V',
    modelType: 'vision',
    contextLength: '128K',
    aliases: ['glm-4v', 'glm4v', 'glm-4v-plus', 'glm4v-plus']
  }
]

function createApiAccess() {
  return {
    authType: 'bearer' as const,
    authHeaderExample: 'Authorization: Bearer <API_KEY>',
    compatibleWithOpenAI: true,
    docsUrl: 'https://docs.bigmodel.cn/cn/coding-plan/overview',
    consoleUrl: 'https://open.bigmodel.cn/',
    baseUrl: API_ACCESS_BASE_URL,
    endpoint: API_ACCESS_ENDPOINT
  }
}

async function fetchZhipu(): Promise<SourceParseResult> {
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
    const rawTextHash = hashText(html.slice(0, 5000))
    const $ = cheerio.load(html)

    const foundModelIds = new Set<string>()
    const priceMap = new Map<string, { input?: number; output?: number }>()

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

        for (const config of MODEL_CONFIGS) {
          const modelPatterns = [
            new RegExp(config.apiModelId, 'i'),
            new RegExp(config.modelName, 'i'),
            ...(config.aliases?.map(a => new RegExp(a, 'i')) || [])
          ]

          const matchedPattern = modelPatterns.find(p => p.test(rowText))
          if (matchedPattern) {
            foundModelIds.add(config.apiModelId)

            let inputPrice: number | undefined
            let outputPrice: number | undefined

            for (const cell of row) {
              const cellLower = cell.toLowerCase()
              const cellNum = parseFloat(cell.replace(/[^0-9.]/g, ''))
              if (!isNaN(cellNum) && cellNum > 0) {
                if (cellLower.includes('input') || cellLower.includes('入') || cellLower.includes('输入')) {
                  inputPrice = cellNum
                } else if (cellLower.includes('output') || cellLower.includes('出') || cellLower.includes('输出')) {
                  outputPrice = cellNum
                }
              }
            }

            if (inputPrice !== undefined || outputPrice !== undefined) {
              priceMap.set(config.apiModelId, { input: inputPrice, output: outputPrice })
            }
          }
        }
      }
    })

    const pageText = $('body').text()
    for (const config of MODEL_CONFIGS) {
      if (!priceMap.has(config.apiModelId)) {
        const modelPatterns = [
          new RegExp(`${config.apiModelId}[^\\d]*([\\d.]+)`, 'i'),
          new RegExp(`${config.modelName}[^\\d]*([\\d.]+)`, 'i')
        ]

        for (const pattern of modelPatterns) {
          const match = pageText.match(pattern)
          if (match && match[1]) {
            const price = parseFloat(match[1])
            if (!isNaN(price) && price > 0) {
              const existing = priceMap.get(config.apiModelId) || {}
              priceMap.set(config.apiModelId, { ...existing, input: price })
              break
            }
          }
        }
      }
    }

    let successCount = 0
    let partialCount = 0

    for (const config of MODEL_CONFIGS) {
      const prices = priceMap.get(config.apiModelId)
      const hasInputPrice = prices?.input !== undefined
      const hasOutputPrice = prices?.output !== undefined
      const hasPrice = hasInputPrice || hasOutputPrice

      if (hasPrice) {
        if (hasInputPrice && hasOutputPrice) {
          successCount++
        } else {
          partialCount++
        }
      }
    }

    const totalModels = MODEL_CONFIGS.length
    const confidence = totalModels > 0 ? Math.round(((successCount * 2 + partialCount) / (totalModels * 2)) * 100) / 100 : 0

    if (successCount === 0 && partialCount === 0) {
      result.success = false
      result.fetchStatus = 'parse_failed'
      result.parserError = `无法从页面提取任何价格信息。请检查页面结构是否变更。`
      result.confidence = 0

      for (const config of MODEL_CONFIGS) {
        result.models.push(normalizeModelPrice({
          vendor: VENDOR,
          modelName: config.modelName,
          modelType: config.modelType,
          contextLength: config.contextLength,
          inputPricePerMillion: undefined,
          outputPricePerMillion: undefined,
          currency: 'CNY',
          priceUnit: 'per_1m_tokens',
          billingMode: 'pay_as_you_go',
          officialSourceUrl: PRICE_URL,
          fetchedAt: result.fetchedAt,
          lastCheckedAt: new Date().toISOString().slice(0, 10),
          fetchStatus: 'parse_failed',
          verifyStatus: computeVerifyStatus('parse_failed'),
          parserName: PARSER_NAME,
          parserVersion: PARSER_VERSION,
          rawTextHash,
          apiModelId: config.apiModelId,
          apiAccess: createApiAccess(),
          aliases: config.aliases,
          capabilities: inferModelCapabilities(config.modelName, config.modelType),
          isLatest: foundModelIds.has(config.apiModelId),
          confidence: 0,
          parserError: '页面未找到价格信息，可能页面结构已变更或该模型已下架'
        }))
      }

      return result
    }

    for (const config of MODEL_CONFIGS) {
      const prices = priceMap.get(config.apiModelId)
      const hasInputPrice = prices?.input !== undefined
      const hasOutputPrice = prices?.output !== undefined
      const hasPrice = hasInputPrice || hasOutputPrice

      const fetchStatus = hasPrice ? (hasInputPrice && hasOutputPrice ? 'success' : 'partial') : 'parse_failed'

      let note: string | undefined
      if (!hasPrice) {
        note = '页面未找到价格信息，请人工核实'
      } else if (!hasInputPrice || !hasOutputPrice) {
        note = '部分价格缺失（输入/输出），请人工核实'
      }

      result.models.push(normalizeModelPrice({
        vendor: VENDOR,
        modelName: config.modelName,
        modelType: config.modelType,
        contextLength: config.contextLength,
        inputPricePerMillion: prices?.input,
        outputPricePerMillion: prices?.output,
        currency: 'CNY',
        priceUnit: 'per_1m_tokens',
        billingMode: hasPrice ? 'pay_as_you_go' : 'free',
        officialSourceUrl: PRICE_URL,
        fetchedAt: result.fetchedAt,
        lastCheckedAt: new Date().toISOString().slice(0, 10),
        fetchStatus,
        verifyStatus: computeVerifyStatus(fetchStatus),
        parserName: PARSER_NAME,
        parserVersion: PARSER_VERSION,
        rawTextHash,
        apiModelId: config.apiModelId,
        apiAccess: createApiAccess(),
        aliases: config.aliases,
        capabilities: inferModelCapabilities(config.modelName, config.modelType),
        isLatest: foundModelIds.has(config.apiModelId),
        confidence: hasPrice ? (hasInputPrice && hasOutputPrice ? confidence : confidence * 0.8) : 0,
        parserError: !hasPrice ? '未在页面找到价格' : undefined,
        note
      }))
    }

    result.success = successCount > 0
    result.fetchStatus = successCount > 0 ? (partialCount > 0 ? 'partial' : 'success') : (partialCount > 0 ? 'partial' : 'parse_failed')
    result.confidence = confidence
    result.modelsExtracted = MODEL_CONFIGS.length
    result.pricesExtracted = successCount + partialCount

  } catch (err: unknown) {
    result.errorMessage = err instanceof Error ? err.message : '未知错误'
    result.fetchStatus = err instanceof Error && err.name === 'AbortError' ? 'source_unavailable' : 'failed'
    result.parserError = result.errorMessage
  }

  return result
}

export { fetchZhipu }
export default fetchZhipu