import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { SourceParseResult, GeneratedPriceData, FetchSummary, ApiProvider, FailedSource, ParsedModelPrice } from './types.js'
import { SNAPSHOT_DIR } from './snapshot.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const OUTPUT_DIR = path.resolve(__dirname, '../../src/data/generated')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'model-prices.latest.json')

const DISCLAIMER = '本工具聚合中国主流 AI 厂商模型价格、套餐和 API 接入信息，仅供选型参考，实际费用以厂商官方价格页、控制台账单和最新公告为准。'

function hasRealPrice(model: ParsedModelPrice): boolean {
  return (model.inputPricePerMillion !== undefined && model.inputPricePerMillion !== null && !isNaN(model.inputPricePerMillion))
    || (model.outputPricePerMillion !== undefined && model.outputPricePerMillion !== null && !isNaN(model.outputPricePerMillion))
}

function modelHasRealData(model: ParsedModelPrice): boolean {
  if (model.sourceType === 'official_auto') {
    return hasRealPrice(model)
      || (model.fetchStatus === 'success' && model.officialSourceUrl !== '')
  }
  return true
}

export function writeLatestJson(
  results: SourceParseResult[],
  failedSources: FailedSource[],
  seedModels?: ParsedModelPrice[]
): string {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const autoModels: ParsedModelPrice[] = []
  const autoPartialModels: ParsedModelPrice[] = []

  for (const result of results) {
    if (result.success && result.fetchStatus === 'success') {
      autoModels.push(...result.models.filter(m => modelHasRealData(m)))
    } else if (result.fetchStatus === 'partial') {
      autoPartialModels.push(...result.models.filter(m => hasRealPrice(m)))
    }
  }

  const seedData = (seedModels || []) as ParsedModelPrice[]
  const autoModelIds = new Set(autoModels.map(m => m.apiModelId || m.modelName))
  const partialModelIds = new Set(autoPartialModels.map(m => m.apiModelId || m.modelName))
  const supplementalSeed = seedData.filter(m =>
    !autoModelIds.has(m.apiModelId || m.modelName)
    && !partialModelIds.has(m.apiModelId || m.modelName)
  )

  const trustedModels = [...autoModels, ...autoPartialModels, ...supplementalSeed]
  const allPlans = results.flatMap(r => r.plans)

  const apiProviders = extractApiProviders(results, trustedModels)

  const capabilitySummary = computeCapabilitySummary(trustedModels)

  const successSources = results.filter(r => r.success).length
  const partialSources = results.filter(r => r.fetchStatus === 'partial').length
  const failedCount = results.filter(r => !r.success && r.fetchStatus !== 'partial').length

  const summary: FetchSummary = {
    totalSources: results.length + failedSources.length,
    successSources,
    partialSources,
    failedSources: failedCount + failedSources.length,
    manualRequiredSources: 0,
    modelsExtracted: trustedModels.length,
    pricesExtracted: trustedModels.filter(m => hasRealPrice(m)).length,
    legacyModelsUsed: 0
  }

  const data: GeneratedPriceData = {
    tool: 'model-price-radar',
    version: 'v1.8.2-china-trusted',
    generatedAt: new Date().toISOString(),
    sources: results,
    models: trustedModels,
    plans: allPlans,
    failedSources,
    apiProviders,
    capabilitySummary,
    fetchSummary: summary,
    disclaimer: DISCLAIMER
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8')
  return OUTPUT_FILE
}

export function extractApiProviders(results: SourceParseResult[], trustedModels?: ParsedModelPrice[]): ApiProvider[] {
  const providerMap = new Map<string, ApiProvider>()
  const models = trustedModels || results.flatMap(r => r.models)

  for (const model of models) {
    if (model.apiAccess && !providerMap.has(model.vendor)) {
      providerMap.set(model.vendor, {
        vendor: model.vendor,
        vendorSlug: (model as Record<string, any>).vendorSlug || model.vendor,
        baseUrl: model.apiAccess.baseUrl,
        endpoint: model.apiAccess.endpoint,
        authType: model.apiAccess.authType,
        authHeaderExample: model.apiAccess.authHeaderExample,
        compatibleWithOpenAI: model.apiAccess.compatibleWithOpenAI,
        docsUrl: model.apiAccess.docsUrl,
        consoleUrl: model.apiAccess.consoleUrl,
        models: models.filter(m => m.apiAccess && m.vendor === model.vendor).map(m => m.apiModelId || m.modelName),
        notes: (model as Record<string, any>).note
      })
    }
  }

  return Array.from(providerMap.values())
}

export function computeCapabilitySummary(models: ParsedModelPrice[]): Record<string, number> {
  const summary: Record<string, number> = {
    total: models.length,
    withPrices: 0,
    latest: 0,
    legacy: 0,
    supportsVision: 0,
    supportsReasoning: 0,
    suitableForCoding: 0,
    suitableForLongContext: 0,
    compatibleOpenAI: 0
  }

  for (const model of models) {
    if (model.inputPricePerMillion !== undefined || model.outputPricePerMillion !== undefined) {
      summary.withPrices++
    }
    if (model.isLatest) summary.latest++
    if (model.isLegacy) summary.legacy++
    if (model.capabilities?.supportsVision) summary.supportsVision++
    if (model.capabilities?.supportsReasoning) summary.supportsReasoning++
    if (model.capabilities?.suitableForCoding) summary.suitableForCoding++
    if (model.capabilities?.suitableForLongContext) summary.suitableForLongContext++
    if (model.apiAccess?.compatibleWithOpenAI) summary.compatibleOpenAI++
  }

  return summary
}

export function readLatestJson(): GeneratedPriceData | null {
  try {
    if (!fs.existsSync(OUTPUT_FILE)) return null
    const content = fs.readFileSync(OUTPUT_FILE, 'utf-8')
    return JSON.parse(content) as GeneratedPriceData
  } catch {
    return null
  }
}

export { OUTPUT_FILE, DISCLAIMER, SNAPSHOT_DIR }
