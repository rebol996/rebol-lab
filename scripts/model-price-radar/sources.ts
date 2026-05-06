export type RegionPriority = 'CN_FIRST' | 'GLOBAL' | 'HK' | 'INTERNATIONAL'
export type CurrencyPriority = 'CNY_FIRST' | 'USD_ONLY' | 'MIXED'
export type DeploymentScope = '中国内地' | '中国区' | '全球' | '国际' | '中国香港' | '未知'

export interface PriceSource {
  vendor: string
  vendorSlug: string
  sourceName: string
  pricePageUrl: string
  docsPageUrl?: string
  consoleUrl?: string
  note: string
  parserFile: string
  requiresPlaywright?: boolean
  fallbackUrls?: string[]
  language: 'zh-CN' | 'en'
  regionPriority: RegionPriority
  currencyPriority: CurrencyPriority
  deploymentScope: DeploymentScope
  isDefaultForChina: boolean
  fallbackOnly: boolean
}

export const priceSources: PriceSource[] = [
  {
    vendor: 'DeepSeek',
    vendorSlug: 'deepseek',
    sourceName: 'DeepSeek 中文官方价格页',
    pricePageUrl: 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing',
    docsPageUrl: 'https://platform.deepseek.com/api-docs/',
    consoleUrl: 'https://platform.deepseek.com/',
    note: 'DeepSeek 官方 API 文档价格页（中文）',
    parserFile: 'deepseek.ts',
    language: 'zh-CN',
    regionPriority: 'GLOBAL',
    currencyPriority: 'USD_ONLY',
    deploymentScope: '全球',
    isDefaultForChina: true,
    fallbackOnly: false
  },
  {
    vendor: 'MiniMax',
    vendorSlug: 'minimax',
    sourceName: 'MiniMax 中国区中文开放平台',
    pricePageUrl: 'https://platform.minimaxi.com/docs/guides/pricing-paygo',
    docsPageUrl: 'https://platform.minimaxi.com/docs/guides/pricing-token-plan',
    consoleUrl: 'https://platform.minimaxi.com/',
    note: 'MiniMax 中国区中文开放平台（注意：国际站为 platform.minimax.io）',
    parserFile: 'minimax.ts',
    language: 'zh-CN',
    regionPriority: 'CN_FIRST',
    currencyPriority: 'CNY_FIRST',
    deploymentScope: '中国内地',
    isDefaultForChina: true,
    fallbackOnly: false
  },
  {
    vendor: '阿里云百炼',
    vendorSlug: 'aliyun-bailian',
    sourceName: '阿里云百炼中文模型价格页',
    pricePageUrl: 'https://help.aliyun.com/zh/model-studio/model-pricing',
    docsPageUrl: 'https://help.aliyun.com/zh/model-studio/',
    consoleUrl: 'https://bailian.console.aliyun.com/',
    note: '阿里云百炼（通义千问）官方模型价格页（中文）',
    parserFile: 'aliyunBailian.ts',
    requiresPlaywright: true,
    language: 'zh-CN',
    regionPriority: 'CN_FIRST',
    currencyPriority: 'CNY_FIRST',
    deploymentScope: '中国内地',
    isDefaultForChina: true,
    fallbackOnly: false
  },
  {
    vendor: '豆包',
    vendorSlug: 'volcengine-doubao',
    sourceName: '火山方舟 / 豆包中文价格页',
    pricePageUrl: 'https://www.volcengine.com/docs/82379/1544106',
    docsPageUrl: 'https://www.volcengine.com/docs/82379/',
    consoleUrl: 'https://console.volcengine.com/ark/',
    note: '火山引擎（豆包）官方模型价格页（中文）',
    parserFile: 'volcengineDoubao.ts',
    language: 'zh-CN',
    regionPriority: 'CN_FIRST',
    currencyPriority: 'CNY_FIRST',
    deploymentScope: '中国内地',
    isDefaultForChina: true,
    fallbackOnly: false
  },
  {
    vendor: '智谱 GLM',
    vendorSlug: 'zhipu',
    sourceName: '智谱 GLM 中文价格页',
    pricePageUrl: 'https://bigmodel.cn/pricing',
    docsPageUrl: 'https://docs.bigmodel.cn/',
    consoleUrl: 'https://open.bigmodel.cn/',
    note: '智谱 GLM 官方价格页（中文）',
    parserFile: 'zhipu.ts',
    language: 'zh-CN',
    regionPriority: 'CN_FIRST',
    currencyPriority: 'CNY_FIRST',
    deploymentScope: '中国内地',
    isDefaultForChina: true,
    fallbackOnly: false
  },
  {
    vendor: 'Kimi',
    vendorSlug: 'kimi',
    sourceName: 'Kimi / Moonshot 中文价格页',
    pricePageUrl: 'https://platform.kimi.ai/docs/pricing/chat',
    docsPageUrl: 'https://platform.kimi.ai/docs',
    consoleUrl: 'https://platform.kimi.ai/',
    note: 'Kimi（Moonshot）官方价格页（中文）',
    parserFile: 'kimi.ts',
    language: 'zh-CN',
    regionPriority: 'CN_FIRST',
    currencyPriority: 'CNY_FIRST',
    deploymentScope: '中国内地',
    isDefaultForChina: true,
    fallbackOnly: false
  },
  {
    vendor: '腾讯混元',
    vendorSlug: 'tencent-hunyuan',
    sourceName: '腾讯混元中文计费页',
    pricePageUrl: 'https://cloud.tencent.com/document/product/1729/97731',
    docsPageUrl: 'https://cloud.tencent.com/document/product/1729',
    consoleUrl: 'https://console.cloud.tencent.com/hunyuan/',
    note: '腾讯云混元大模型官方计费页（中文）',
    parserFile: 'tencentHunyuan.ts',
    language: 'zh-CN',
    regionPriority: 'CN_FIRST',
    currencyPriority: 'CNY_FIRST',
    deploymentScope: '中国内地',
    isDefaultForChina: true,
    fallbackOnly: false
  },
  {
    vendor: '百度千帆',
    vendorSlug: 'baidu-qianfan',
    sourceName: '百度千帆中文计费页',
    pricePageUrl: 'https://cloud.baidu.com/doc/qianfan/s/wmh4sv6ya',
    docsPageUrl: 'https://cloud.baidu.com/doc/qianfan/',
    consoleUrl: 'https://console.bce.baidu.com/qianfan/',
    note: '百度千帆（文心）官方计费页（中文）',
    parserFile: 'baiduQianfan.ts',
    requiresPlaywright: true,
    language: 'zh-CN',
    regionPriority: 'CN_FIRST',
    currencyPriority: 'CNY_FIRST',
    deploymentScope: '中国内地',
    isDefaultForChina: true,
    fallbackOnly: false
  },
  {
    vendor: '讯飞星火',
    vendorSlug: 'xfyun-spark',
    sourceName: '讯飞星火中文 API 页',
    pricePageUrl: 'https://xinghuo.xfyun.cn/sparkapi',
    docsPageUrl: 'https://www.xfyun.cn/doc/spark/',
    consoleUrl: 'https://xinghuo.xfyun.cn/',
    note: '讯飞星火官方 API 价格页（中文）',
    parserFile: 'xfyunSpark.ts',
    language: 'zh-CN',
    regionPriority: 'CN_FIRST',
    currencyPriority: 'CNY_FIRST',
    deploymentScope: '中国内地',
    isDefaultForChina: true,
    fallbackOnly: false
  },
  {
    vendor: '小米 MiMo',
    vendorSlug: 'xiaomi-mimo',
    sourceName: '小米 MiMo 中文平台',
    pricePageUrl: 'https://mimo.mi.com/',
    docsPageUrl: 'https://mimo.mi.com/',
    consoleUrl: 'https://mimo.mi.com/',
    note: '小米 MiMo 官方平台（中文 Web 应用）',
    parserFile: 'xiaomiMimo.ts',
    language: 'zh-CN',
    regionPriority: 'CN_FIRST',
    currencyPriority: 'CNY_FIRST',
    deploymentScope: '中国内地',
    isDefaultForChina: true,
    fallbackOnly: false
  }
]

export function getSourceByVendor(vendorSlug: string): PriceSource | undefined {
  return priceSources.find(s => s.vendorSlug === vendorSlug)
}

export function getSourceByParser(parserFile: string): PriceSource | undefined {
  return priceSources.find(s => s.parserFile === parserFile)
}

export function getChinaDefaultSources(): PriceSource[] {
  return priceSources.filter(s => s.isDefaultForChina && !s.fallbackOnly)
}

export function getInternationalFallbackSources(): PriceSource[] {
  return priceSources.filter(s => s.fallbackOnly)
}
