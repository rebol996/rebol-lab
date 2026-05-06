import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getCache, getCacheMetadata, isCacheValid, setCache, getCacheAge, type CacheData } from '../scripts/model-price-radar/cache'
import { fetchAllSources } from '../scripts/model-price-radar/fetchPrices'

const CACHE_TTL_HOURS = 6

export interface ModelPricesResponse {
  generatedAt: string
  cacheTtlHours: number
  cacheAgeMinutes: number | null
  cacheHit: boolean
  isExpired: boolean
  sources: any[]
  models: any[]
  plans: any[]
  apiProviders: any[]
  capabilitySummary: Record<string, number>
  fetchSummary: Record<string, any>
  warnings: string[]
  errors?: string[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const forceRefresh = req.query.refresh === 'true'
  const meta = getCacheMetadata()

  if (!forceRefresh && isCacheValid()) {
    const cache = getCache()
    if (cache) {
      const response: ModelPricesResponse = {
        generatedAt: cache.generatedAt,
        cacheTtlHours: CACHE_TTL_HOURS,
        cacheAgeMinutes: getCacheAge(),
        cacheHit: true,
        isExpired: false,
        sources: cache.sources,
        models: cache.models,
        plans: cache.plans,
        apiProviders: cache.apiProviders,
        capabilitySummary: cache.capabilitySummary,
        fetchSummary: cache.fetchSummary,
        warnings: cache.warnings || []
      }
      return res.status(200).json(response)
    }
  }

  try {
    const result = await fetchAllSources({ useCache: !forceRefresh, saveSnapshots: true })

    if (result.errors.length > 0 && result.models.length === 0) {
      const oldCache = getCache()
      if (oldCache) {
        const response: ModelPricesResponse = {
          generatedAt: oldCache.generatedAt,
          cacheTtlHours: CACHE_TTL_HOURS,
          cacheAgeMinutes: getCacheAge(),
          cacheHit: false,
          isExpired: true,
          sources: oldCache.sources,
          models: oldCache.models,
          plans: oldCache.plans,
          apiProviders: oldCache.apiProviders,
          capabilitySummary: oldCache.capabilitySummary,
          fetchSummary: oldCache.fetchSummary,
          warnings: [...result.errors, '返回过期缓存，因重新抓取失败'],
          errors: result.errors
        }
        return res.status(200).json(response)
      }

      return res.status(500).json({
        error: 'Failed to fetch prices and no cache available',
        details: result.errors
      })
    }

    setCache({
      sources: result.sources,
      models: result.models,
      plans: result.plans,
      failedSources: result.failedSources,
      apiProviders: result.apiProviders,
      capabilitySummary: result.capabilitySummary,
      fetchSummary: result.fetchSummary,
      warnings: result.errors
    })

    const response: ModelPricesResponse = {
      generatedAt: new Date().toISOString(),
      cacheTtlHours: CACHE_TTL_HOURS,
      cacheAgeMinutes: 0,
      cacheHit: false,
      isExpired: false,
      sources: result.sources,
      models: result.models,
      plans: result.plans,
      apiProviders: result.apiProviders,
      capabilitySummary: result.capabilitySummary,
      fetchSummary: result.fetchSummary,
      warnings: result.errors
    }

    return res.status(200).json(response)
  } catch (error: any) {
    const oldCache = getCache()
    if (oldCache) {
      const response: ModelPricesResponse = {
        generatedAt: oldCache.generatedAt,
        cacheTtlHours: CACHE_TTL_HOURS,
        cacheAgeMinutes: getCacheAge(),
        cacheHit: false,
        isExpired: true,
        sources: oldCache.sources,
        models: oldCache.models,
        plans: oldCache.plans,
        apiProviders: oldCache.apiProviders,
        capabilitySummary: oldCache.capabilitySummary,
        fetchSummary: oldCache.fetchSummary,
        warnings: [`抓取出错: ${error.message}`, '返回过期缓存'],
        errors: [error.message]
      }
      return res.status(200).json(response)
    }

    return res.status(500).json({
      error: 'Failed to fetch prices',
      details: error.message
    })
  }
}
