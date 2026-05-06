import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const SNAPSHOT_DIR = path.resolve(__dirname, '../../src/data/generated/snapshots')

export interface PageSnapshot {
  vendor: string
  vendorSlug: string
  url: string
  fetchedAt: string
  htmlLength: number
  textLength: number
  tableCount: number
  linkCount: number
  snapshotFile: string
}

export interface FetchResult {
  html: string
  text: string
  tables: string[][]
  links: { href: string; text: string }[]
  title: string
}

export function ensureSnapshotDir(): void {
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true })
  }
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function fetchHtml(url: string, timeout = 15000): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.text()
  } finally {
    clearTimeout(timer)
  }
}

async function renderWithPlaywright(url: string, timeout = 30000): Promise<{ text: string; tables: string[][]; links: { href: string; text: string }[]; title: string }> {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout })

    const text = await page.evaluate(() => document.body.innerText)
    const title = await page.title()

    const tables: string[][] = []
    const tableHandles = await page.locator('table').all()
    for (const table of tableHandles) {
      const rows: string[] = []
      const rowHandles = await table.locator('tr').all()
      for (const row of rowHandles) {
        const cells = await row.locator('td, th').allTextContents()
        rows.push(cells.join(' | '))
      }
      if (rows.length > 0) tables.push(rows)
    }

    const links: { href: string; text: string }[] = []
    const linkHandles = await page.locator('a[href]').all()
    for (const link of linkHandles) {
      const href = await link.getAttribute('href')
      const text = await link.textContent()
      if (href && text) {
        links.push({ href, text: text.trim() })
      }
    }

    return { text, tables, links, title }
  } finally {
    await browser.close()
  }
}

export async function fetchPageSnapshot(vendor: string, vendorSlug: string, url: string): Promise<PageSnapshot> {
  ensureSnapshotDir()

  const timestamp = new Date().toISOString().replace(/[:.]+/g, '-').slice(0, 19)
  const baseName = `${slugify(vendorSlug)}-${timestamp}`
  const snapshotFile = path.join(SNAPSHOT_DIR, `${baseName}.txt`)

  let html = ''
  let text = ''
  let tables: string[][] = []
  let links: { href: string; text: string }[] = []
  let title = ''

  try {
    html = await fetchHtml(url)

    const $ = (await import('cheerio')).load(html)
    text = $('body').text()

    $('table').each((_, table) => {
      const rows: string[] = []
      $(table).find('tr').each((__, tr) => {
        const cells = $(tr).find('td, th').map((__, cell) => $(cell).text().trim()).get()
        rows.push(cells.join(' | '))
      })
      if (rows.length > 0) tables.push(rows)
    })

    $('a[href]').each((_, a) => {
      const href = $(a).attr('href')
      const text = $(a).text().trim()
      if (href && text) links.push({ href, text })
    })

    title = $('title').text()
  } catch (htmlErr) {
    console.log(`   HTML fetch failed, trying Playwright...`)
    try {
      const pwResult = await renderWithPlaywright(url)
      text = pwResult.text
      tables = pwResult.tables
      links = pwResult.links
      title = pwResult.title
      html = `[Rendered via Playwright] ${text}`
    } catch (pwErr) {
      throw new Error(`Both HTML and Playwright failed: ${htmlErr instanceof Error ? htmlErr.message : 'unknown'}`)
    }
  }

  const snapshotContent = [
    `=== ${vendor} Page Snapshot ===`,
    `URL: ${url}`,
    `Fetched: ${new Date().toISOString()}`,
    `Title: ${title}`,
    `HTML Length: ${html.length}`,
    `Text Length: ${text.length}`,
    `Table Count: ${tables.length}`,
    `Link Count: ${links.length}`,
    ``,
    `=== HTML Extract (first 5000 chars) ===`,
    html.slice(0, 5000),
    ``,
    `=== Text Content ===`,
    text.slice(0, 10000),
    ``,
    `=== Tables ===`,
    ...tables.map(t => t.join('\n')),
    ``,
    `=== Relevant Links ===`,
    ...links.filter(l => l.href.includes('price') || l.href.includes('pricing') || l.href.includes('api') || l.href.includes('doc')).map(l => `${l.text}: ${l.href}`)
  ].join('\n')

  fs.writeFileSync(snapshotFile, snapshotContent, 'utf-8')

  const snapshot: PageSnapshot = {
    vendor,
    vendorSlug,
    url,
    fetchedAt: new Date().toISOString(),
    htmlLength: html.length,
    textLength: text.length,
    tableCount: tables.length,
    linkCount: links.length,
    snapshotFile: `${baseName}.txt`
  }

  return snapshot
}

export function loadSnapshot(snapshotFile: string): { text: string; tables: string[][] } | null {
  const fullPath = path.join(SNAPSHOT_DIR, snapshotFile)
  if (!fs.existsSync(fullPath)) return null

  const content = fs.readFileSync(fullPath, 'utf-8')
  const lines = content.split('\n')

  let textSection = false
  let tableSection = false
  const textParts: string[] = []
  const tableRows: string[][] = []
  let currentTable: string[] = []

  for (const line of lines) {
    if (line.startsWith('=== Text Content ===')) {
      textSection = true
      continue
    }
    if (line.startsWith('=== Tables ===')) {
      textSection = false
      tableSection = true
      continue
    }
    if (line.startsWith('=== ')) {
      textSection = false
      tableSection = false
      continue
    }

    if (textSection && line.trim()) {
      textParts.push(line)
    }

    if (tableSection) {
      if (line.trim() === '') {
        if (currentTable.length > 0) {
          tableRows.push(currentTable)
          currentTable = []
        }
      } else {
        currentTable.push(line)
      }
    }
  }

  if (currentTable.length > 0) {
    tableRows.push(currentTable)
  }

  return {
    text: textParts.join('\n'),
    tables: tableRows
  }
}

export { SNAPSHOT_DIR }