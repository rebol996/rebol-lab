import type { ParsedModelPrice, SourceParseResult, FailedSource } from './types.js'
import { calcFreshnessDays } from './normalize.js'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateModelPrice(model: ParsedModelPrice): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!model.vendor) errors.push('vendor is required')
  if (!model.modelName) errors.push('modelName is required')

  if (model.inputPricePerMillion !== undefined && model.inputPricePerMillion < 0) {
    errors.push(`${model.modelName}: inputPricePerMillion cannot be negative`)
  }
  if (model.outputPricePerMillion !== undefined && model.outputPricePerMillion < 0) {
    errors.push(`${model.modelName}: outputPricePerMillion cannot be negative`)
  }

  if (model.inputPricePerMillion === undefined && model.outputPricePerMillion === undefined) {
    warnings.push(`${model.modelName}: both prices are undefined`)
  }

  if (!model.officialSourceUrl) {
    warnings.push(`${model.modelName}: missing officialSourceUrl`)
  }

  if (!model.fetchedAt) {
    errors.push(`${model.modelName}: missing fetchedAt`)
  }

  if (model.confidence !== undefined && (model.confidence < 0 || model.confidence > 1)) {
    errors.push(`${model.modelName}: confidence must be between 0 and 1`)
  }

  return { valid: errors.length === 0, errors, warnings }
}

export function validateParsedData(results: SourceParseResult[], failedSources: FailedSource[]): {
  totalModels: number
  totalPlans: number
  modelsWithPrices: number
  modelsMissingPrice: string[]
  staleModels: string[]
  fetchFailures: string[]
  parseFailures: string[]
  legacyModels: string[]
  latestModels: string[]
  officialAutoModels: number
} {
  const modelsMissingPrice: string[] = []
  const staleModels: string[] = []
  const fetchFailures: string[] = []
  const parseFailures: string[] = []
  const legacyModels: string[] = []
  const latestModels: string[] = []

  for (const result of results) {
    if (!result.success && result.fetchStatus !== 'partial') {
      fetchFailures.push(result.vendor)
    }

    if (result.parserStatus === 'failed' || result.fetchStatus === 'parse_failed') {
      parseFailures.push(`${result.vendor}: ${result.parserError || result.errorMessage || 'parse failed'}`)
    }

    for (const model of result.models) {
      if (model.isLegacy) {
        legacyModels.push(`${model.vendor} - ${model.modelName}`)
      }
      if (model.isLatest && model.sourceType !== 'legacy_fallback') {
        latestModels.push(`${model.vendor} - ${model.modelName}`)
      }

      if (model.inputPricePerMillion === undefined && model.outputPricePerMillion === undefined) {
        modelsMissingPrice.push(`${model.vendor} - ${model.modelName}`)
      }

      const days = calcFreshnessDays(model.lastCheckedAt)
      if (days > 30 || model.verifyStatus === 'stale') {
        staleModels.push(`${model.vendor} - ${model.modelName}`)
      }
    }
  }

  const totalModels = results.reduce((acc, r) => acc + r.models.length, 0)
  const modelsWithPrices = results.reduce((acc, r) => acc + r.models.filter(m => m.inputPricePerMillion !== undefined || m.outputPricePerMillion !== undefined).length, 0)
  const officialAutoModels = results.reduce((acc, r) => acc + r.models.filter(m => m.sourceType === 'official_auto').length, 0)

  return {
    totalModels,
    totalPlans: results.reduce((acc, r) => acc + r.plans.length, 0),
    modelsWithPrices,
    modelsMissingPrice,
    staleModels,
    fetchFailures,
    parseFailures,
    legacyModels,
    latestModels,
    officialAutoModels
  }
}

export function printValidationSummary(results: SourceParseResult[], failedSources: FailedSource[]): void {
  const { totalModels, modelsWithPrices, modelsMissingPrice, staleModels, fetchFailures, parseFailures, legacyModels, latestModels, officialAutoModels } = validateParsedData(results, failedSources)

  const successCount = results.filter(r => r.success).length
  const partialCount = results.filter(r => r.fetchStatus === 'partial').length

  console.log('\n📊 v1.7.1 验证摘要:')
  console.log(`   来源总数: ${results.length + failedSources.length}`)
  console.log(`   成功: ${successCount} | 部分: ${partialCount} | 失败: ${failedSources.length}`)
  console.log(`   模型总数: ${totalModels} (官方自动: ${officialAutoModels} | 最新: ${latestModels.length} | 历史: ${legacyModels.length})`)
  console.log(`   有价格: ${modelsWithPrices} | 无价格: ${modelsMissingPrice.length}`)

  if (fetchFailures.length > 0) {
    console.log('\n⚠️  抓取失败的来源:')
    fetchFailures.forEach(v => console.log(`   - ${v}`))
  }

  if (parseFailures.length > 0) {
    console.log('\n⚠️  解析失败的来源:')
    parseFailures.forEach(v => console.log(`   - ${v}`))
  }

  if (failedSources.length > 0) {
    console.log('\n⚠️  失败的来源详情:')
    failedSources.forEach(f => console.log(`   - ${f.vendor}: ${f.parserError || f.errorMessage || f.fetchStatus}`))
  }

  if (modelsMissingPrice.length > 0) {
    console.log('\n⚠️  价格缺失的模型:')
    modelsMissingPrice.slice(0, 10).forEach(m => console.log(`   - ${m}`))
    if (modelsMissingPrice.length > 10) {
      console.log(`   ... 还有 ${modelsMissingPrice.length - 10} 个`)
    }
  }
}