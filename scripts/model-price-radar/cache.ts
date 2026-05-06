import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const CACHE_DIR = path.resolve(__dirname, '../../.cache/model-price-radar')
const CACHE_FILE = path.join(CACHE_DIR, 'model-prices.cache.json')

export interface CacheData {
  generatedAt: string
  expiresAt: string
  sources: any[]
  models: any[]
  plans: any[]
  failedSources: any[]
  apiProviders: any[]
  capabilitySummary: Record<string, number>
  fetchSummary: Record<string, any>
  warnings: string[]
  version: string
}

export interface CacheMetadata {
  generatedAt: string
  expiresAt: string
  cacheHit: boolean
  isExpired: boolean
  ttlHours: number
}

const DEFAULT_TTL_HOURS = 6

export function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
}

export function getCacheMetadata(): CacheMetadata | null {
  ensureCacheDir()

  if (!fs.existsSync(CACHE_FILE)) {
    return null
  }

  try {
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')) as CacheData
    const ttlHours = DEFAULT_TTL_HOURS
    const expiresAt = new Date(data.expiresAt)
    const now = new Date()
    const isExpired = now >= expiresAt

    return {
      generatedAt: data.generatedAt,
      expiresAt: data.expiresAt,
      cacheHit: true,
      isExpired,
      ttlHours
    }
  } catch {
    return null
  }
}

export function getCache(): CacheData | null {
  ensureCacheDir()

  if (!fs.existsSync(CACHE_FILE)) {
    return null
  }

  try {
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')) as CacheData
    return data
  } catch {
    return null
  }
}

export function setCache(data: Omit<CacheData, 'version'>): CacheData {
  ensureCacheDir()

  const now = new Date()
  const ttlHours = DEFAULT_TTL_HOURS
  const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000)

  const cacheData: CacheData = {
    ...data,
    version: 'v1.8-live-radar',
    generatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2), 'utf-8')

  return cacheData
}

export function isCacheValid(): boolean {
  const meta = getCacheMetadata()
  if (!meta) return false
  return !meta.isExpired
}

export function getCacheAge(): number | null {
  const meta = getCacheMetadata()
  if (!meta) return null

  const generatedAt = new Date(meta.generatedAt)
  const now = new Date()
  return Math.floor((now.getTime() - generatedAt.getTime()) / 1000 / 60)
}
