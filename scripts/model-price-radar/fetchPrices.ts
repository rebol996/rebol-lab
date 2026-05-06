import { priceSources } from './sources.js'
import { writeLatestJson, readLatestJson, extractApiProviders, computeCapabilitySummary, OUTPUT_FILE } from './writeLatestJson.js'
import { printValidationSummary } from './validate.js'
import { fetchPageSnapshot } from './snapshot.js'
import type { SourceParseResult, FailedSource, ParsedModelPrice } from './types.js'
import { chinaModelSeed } from '../../src/data/chinaModelSeed.js'

import { fetchDeepSeek } from './parsers/deepseek.js'
import { fetchMiniMax } from './parsers/minimax.js'
import { fetchAliyunBailian } from './parsers/aliyunBailian.js'
import { fetchVolcengineDoubao } from './parsers/volcengineDoubao.js'
import { fetchZhipu } from './parsers/zhipu.js'
import { fetchKimi } from './parsers/kimi.js'
import { fetchTencentHunyuan } from './parsers/tencentHunyuan.js'
import { fetchBaiduQianfan } from './parsers/baiduQianfan.js'
import { fetchXfyunSpark } from './parsers/xfyunSpark.js'
import { fetchXiaomiMimo } from './parsers/xiaomiMimo.js'

const PARSER_MAP: Record<string, (snapshotFile?: string) => Promise<SourceParseResult>> = {
  'deepseek.ts': fetchDeepSeek,
  'minimax.ts': fetchMiniMax,
  'aliyunBailian.ts': fetchAliyunBailian,
  'volcengineDoubao.ts': fetchVolcengineDoubao,
  'zhipu.ts': fetchZhipu,
  'kimi.ts': fetchKimi,
  'tencentHunyuan.ts': fetchTencentHunyuan,
  'baiduQianfan.ts': fetchBaiduQianfan,
  'xfyunSpark.ts': fetchXfyunSpark,
  'xiaomiMimo.ts': fetchXiaomiMimo
}

const IS_DRY_RUN = process.argv.includes('--dry-run')

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface FetchAllSourcesOptions {
  useCache?: boolean
  saveSnapshots?: boolean
}

export interface FetchAllSourcesResult {
  sources: any[]
  models: any[]
  plans: any[]
  failedSources: FailedSource[]
  apiProviders: any[]
  capabilitySummary: Record<string, number>
  fetchSummary: Record<string, any>
  errors: string[]
}

export async function fetchAllSources(options: FetchAllSourcesOptions = {}): Promise<FetchAllSourcesResult> {
  const { saveSnapshots = true } = options

  console.log('🔍 AI 模型价格雷达 v1.8 - Live Model Intelligence Radar')
  console.log(`⏰ 开始时间: ${new Date().toLocaleString('zh-CN')}`)
  console.log('')

  console.log(`🌐 共 ${priceSources.length} 个来源待抓取...\n`)

  const results: SourceParseResult[] = []
  const failedSources: FailedSource[] = []
  const errors: string[] = []

  for (let i = 0; i < priceSources.length; i++) {
    const source = priceSources[i]
    const parser = PARSER_MAP[source.parserFile]

    process.stdout.write(`[${i + 1}/${priceSources.length}] ${source.vendor}... `)

    if (!parser) {
      console.log('⏭️  无 parser，跳过')
      continue
    }

    let snapshotFile: string | undefined

    try {
      console.log('')
      if (saveSnapshots) {
        console.log(`   📸 正在获取页面快照...`)
        const snapshot = await fetchPageSnapshot(source.vendor, source.vendorSlug, source.pricePageUrl)
        snapshotFile = snapshot.snapshotFile
        console.log(`   📄 快照已保存: ${snapshot.snapshotFile}`)
        console.log(`   📊 文本长度: ${snapshot.textLength} | 表格: ${snapshot.tableCount} | 链接: ${snapshot.linkCount}`)
      }

      const result = await parser(snapshotFile)
      results.push(result)

      if (result.success) {
        const priceCount = result.models.filter(m => m.inputPricePerMillion !== undefined || m.outputPricePerMillion !== undefined).length
        console.log(`   ✅ ${result.models.length} 个模型 | ${priceCount} 个有价格`)
      } else if (result.fetchStatus === 'partial') {
        const priceCount = result.models.filter(m => m.inputPricePerMillion !== undefined || m.outputPricePerMillion !== undefined).length
        console.log(`   ⚠️  部分解析: ${result.models.length} 个模型 | ${priceCount} 个有价格`)
        console.log(`   📝 ${result.parserError || result.errorMessage || '部分数据缺失'}`)
      } else {
        console.log(`   ❌ 解析失败: ${result.parserError || result.errorMessage || result.fetchStatus}`)
        errors.push(`${source.vendor}: ${result.parserError || result.errorMessage || result.fetchStatus}`)
        failedSources.push({
          vendor: source.vendor,
          vendorSlug: source.vendorSlug,
          sourceUrl: source.pricePageUrl,
          fetchStatus: result.fetchStatus,
          errorMessage: result.errorMessage,
          parserError: result.parserError,
          attemptedAt: new Date().toISOString()
        })
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : '未知错误'
      console.log(`   ❌ 抓取异常: ${errorMsg}`)
      errors.push(`${source.vendor}: ${errorMsg}`)
      failedSources.push({
        vendor: source.vendor,
        vendorSlug: source.vendorSlug,
        sourceUrl: source.pricePageUrl,
        fetchStatus: 'failed',
        errorMessage: errorMsg,
        parserError: errorMsg,
        attemptedAt: new Date().toISOString()
      })
    }

    if (i < priceSources.length - 1) {
      await sleep(2000)
    }

    console.log('')
  }

  printValidationSummary(results, failedSources)

  const seedAsParsed: ParsedModelPrice[] = chinaModelSeed.map(seed => ({
    id: seed.id,
    vendor: seed.vendor,
    modelName: seed.modelName,
    modelType: seed.modelType,
    contextLength: seed.contextLength,
    inputPricePerMillion: seed.inputPricePerMillion,
    outputPricePerMillion: seed.outputPricePerMillion,
    cacheReadPricePerMillion: seed.cacheReadPricePerMillion,
    cacheWritePricePerMillion: seed.cacheWritePricePerMillion,
    priceTiers: seed.priceTiers,
    currency: seed.currency,
    priceUnit: seed.priceUnit,
    billingMode: seed.billingMode,
    freeQuota: seed.freeQuota,
    officialSourceUrl: seed.officialSourceUrl,
    fetchedAt: new Date().toISOString(),
    lastCheckedAt: seed.lastManualVerifiedAt,
    fetchStatus: 'success' as const,
    verifyStatus: 'manual_verified' as const,
    parserName: 'china-seed',
    parserVersion: '1.8.2',
    apiModelId: seed.apiModelId,
    apiAccess: seed.apiAccess,
    aliases: seed.aliases,
    modelFamily: seed.modelFamily,
    deploymentScope: seed.deploymentScope,
    capabilities: seed.capabilities,
    isLatest: true,
    isLegacy: false,
    planName: (seed as any).planName,
    planPrice: (seed as any).plan_price,
    sourceType: 'official_manual_verified' as const,
    confidence: seed.confidence,
    sourceQuote: seed.sourceQuote,
    lastManualVerifiedAt: seed.lastManualVerifiedAt,
    note: seed.note
  }))

  const outputPath = writeLatestJson(results, failedSources, seedAsParsed)
  console.log(`\n💾 已生成: ${outputPath}`)

  const totalModels = results.reduce((acc, r) => acc + r.models.filter(m => m.inputPricePerMillion !== undefined || m.outputPricePerMillion !== undefined).length, 0)
  const seedCount = seedAsParsed.length
  console.log(`   自动解析有价格: ${totalModels} | Seed 校准: ${seedCount}`)

  if (failedSources.length > 0) {
    console.log('\n⚠️  以下来源解析失败:')
    failedSources.forEach(f => {
      console.log(`   - ${f.vendor}: ${f.parserError || f.errorMessage || f.fetchStatus}`)
    })
  }

  console.log('\n✅ 管道执行完毕')

  const generatedPath = OUTPUT_FILE
  const generated = readLatestJson()

  return {
    sources: results,
    models: generated?.models || [],
    plans: generated?.plans || [],
    failedSources,
    apiProviders: generated?.apiProviders || [],
    capabilitySummary: generated?.capabilitySummary || {},
    fetchSummary: generated?.fetchSummary || {},
    errors
  }
}

async function run(): Promise<void> {
  if (IS_DRY_RUN) {
    const existing = readLatestJson()
    if (existing) {
      console.log('📦 已有的生成数据:')
      console.log(`   生成时间: ${existing.generatedAt}`)
      console.log(`   模型数量: ${existing.models.length}`)
      console.log(`   来源数量: ${existing.sources.length}`)
      console.log(`   版本: ${existing.version}`)
      printValidationSummary(existing.sources, existing.failedSources)
    } else {
      console.log('⚠️  暂无生成数据，请先运行 npm run prices:update')
    }
    return
  }

  await fetchAllSources({ saveSnapshots: true })
}

run().catch(err => {
  console.error('💥 管道执行异常:', err)
  process.exit(1)
})
