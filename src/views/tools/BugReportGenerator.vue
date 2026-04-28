<template>
  <div class="gen-container">
    <div class="gen-header">
      <div class="header-left">
        <el-button link class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回工具集</span>
        </el-button>
        <div class="header-divider"></div>
        <div>
          <h1 class="gradient-text">Bug 报告生成器</h1>
          <p class="description">根据问题描述自动生成标准化的 Bug 报告，包含严重程度、优先级与排查建议。</p>
        </div>
      </div>
    </div>

    <div class="gen-layout">
      <div class="input-panel">
        <div class="tech-card input-card">
          <div class="panel-title">
            <el-icon><Edit /></el-icon>
            <span>问题信息</span>
          </div>

          <div class="form-group">
            <label class="form-label">问题描述 <span class="required">*</span></label>
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="简要描述问题的表现"
              class="input-area"
            />
          </div>

          <div class="form-group">
            <label class="form-label">复现步骤 <span class="required">*</span></label>
            <el-input
              v-model="form.steps"
              type="textarea"
              :rows="3"
              placeholder="1. 打开页面&#10;2. 点击 XX 按钮&#10;3. 输入 XX 内容"
              class="input-area"
            />
          </div>

          <div class="form-group">
            <label class="form-label">实际结果 <span class="required">*</span></label>
            <el-input
              v-model="form.actualResult"
              type="textarea"
              :rows="2"
              placeholder="实际发生了什么"
              class="input-area"
            />
          </div>

          <div class="form-group">
            <label class="form-label">期望结果 <span class="required">*</span></label>
            <el-input
              v-model="form.expectedResult"
              type="textarea"
              :rows="2"
              placeholder="期望的正确行为"
              class="input-area"
            />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">测试环境</label>
              <el-select v-model="form.environment" placeholder="选择环境" class="input-area">
                <el-option label="生产环境 (Production)" value="生产环境 (Production)" />
                <el-option label="测试环境 (Staging)" value="测试环境 (Staging)" />
                <el-option label="开发环境 (Development)" value="开发环境 (Development)" />
                <el-option label="本地环境 (Local)" value="本地环境 (Local)" />
              </el-select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">浏览器/设备</label>
              <el-input
                v-model="form.device"
                placeholder="如 Chrome 120, iPhone 15"
                class="input-area"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">严重程度</label>
              <el-select v-model="form.severity" placeholder="选择严重程度" class="input-area">
                <el-option label="致命 (Critical)" value="致命 (Critical)" />
                <el-option label="严重 (Major)" value="严重 (Major)" />
                <el-option label="一般 (Minor)" value="一般 (Minor)" />
                <el-option label="建议 (Suggestion)" value="建议 (Suggestion)" />
              </el-select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">优先级</label>
              <el-select v-model="form.priority" placeholder="选择优先级" class="input-area">
                <el-option label="P0 - 立即修复" value="P0 - 立即修复" />
                <el-option label="P1 - 高优先级" value="P1 - 高优先级" />
                <el-option label="P2 - 正常修复" value="P2 - 正常修复" />
                <el-option label="P3 - 低优先级" value="P3 - 低优先级" />
              </el-select>
            </div>
          </div>

          <div class="input-actions">
            <el-button type="primary" :disabled="!canGenerate || generating" @click="generate">
              <el-icon class="el-icon--left"><Lightning /></el-icon>
              {{ generating ? '生成中...' : '生成 Bug 报告' }}
            </el-button>
            <el-button @click="fillExample">
              填入示例
            </el-button>
            <el-button :disabled="!hasInput" @click="clearInput">
              清空输入
            </el-button>
          </div>
        </div>

        <div class="tech-card history-card" v-if="history.length > 0">
          <div class="panel-title">
            <el-icon><Clock /></el-icon>
            <span>最近记录</span>
          </div>
          <div class="history-list">
            <div
              v-for="item in history"
              :key="item.id"
              class="history-item"
              @click="loadHistory(item)"
            >
              <div class="history-text">{{ item.title }}</div>
              <div class="history-time">{{ item.createdAt }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="result-panel">
        <div v-if="!result" class="tech-card placeholder-card">
          <div class="placeholder-content">
            <div class="preview-header">
              <el-icon :size="20"><WarningFilled /></el-icon>
              <span>生成后将包含</span>
            </div>
            <div class="preview-list">
              <div class="preview-item" v-for="item in previewItems" :key="item.label">
                <el-tag size="small" :type="item.type">{{ item.num }}</el-tag>
                <span>{{ item.label }}</span>
              </div>
            </div>
            <p class="preview-hint">在左侧填写问题信息，点击「生成 Bug 报告」即可获取标准化报告。</p>
          </div>
        </div>

        <template v-if="result">
          <div class="result-toolbar">
            <span class="result-label">Bug 报告</span>
            <div class="toolbar-actions">
              <span class="result-tokens">#{{ result.id }}</span>
              <el-button size="small" @click="copyResult">
                <el-icon class="el-icon--left"><CopyDocument /></el-icon>
                {{ copied ? '已复制' : '复制文本' }}
              </el-button>
              <el-button size="small" @click="copyAsMarkdown">
                <el-icon class="el-icon--left"><Document /></el-icon>
                {{ mdCopied ? '已复制' : '复制 Markdown' }}
              </el-button>
              <el-button size="small" @click="clearResult">
                <el-icon class="el-icon--left"><Delete /></el-icon>
                清空结果
              </el-button>
            </div>
          </div>

          <div class="result-sections">
            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="danger">Bug</el-tag>
                <h3>{{ result.title }}</h3>
              </div>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="primary">摘要</el-tag>
                <h3>问题摘要</h3>
              </div>
              <p class="section-text">{{ result.summary }}</p>
            </div>

            <div class="meta-grid">
              <div class="tech-card meta-item">
                <span class="meta-label">测试环境</span>
                <span class="meta-value">{{ result.environment }}</span>
              </div>
              <div class="tech-card meta-item">
                <span class="meta-label">严重程度</span>
                <span class="meta-value" :class="severityClass(result.severity)">{{ result.severity }}</span>
              </div>
              <div class="tech-card meta-item">
                <span class="meta-label">优先级</span>
                <span class="meta-value" :class="priorityClass(result.priority)">{{ result.priority }}</span>
              </div>
              <div class="tech-card meta-item">
                <span class="meta-label">报告编号</span>
                <span class="meta-value mono">#{{ result.id }}</span>
              </div>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="info">步骤</el-tag>
                <h3>复现步骤</h3>
              </div>
              <ol class="ordered-list">
                <li v-for="(step, i) in result.stepsList" :key="i">{{ step }}</li>
              </ol>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="warning">实际</el-tag>
                <h3>实际结果</h3>
              </div>
              <p class="section-text">{{ result.actualResult }}</p>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="success">期望</el-tag>
                <h3>期望结果</h3>
              </div>
              <p class="section-text">{{ result.expectedResult }}</p>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="primary">分析</el-tag>
                <h3>初步原因分析</h3>
              </div>
              <p class="section-text">{{ result.rootCause }}</p>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="primary">排查</el-tag>
                <h3>建议排查方向</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.investigation" :key="i">{{ item }}</li>
              </ul>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="info">备注</el-tag>
                <h3>补充说明</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.notes" :key="i">{{ item }}</li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Edit, Lightning, Clock, Document,
  CopyDocument, Delete, WarningFilled
} from '@element-plus/icons-vue'

interface BugReportForm {
  description: string
  steps: string
  actualResult: string
  expectedResult: string
  environment: string
  device: string
  severity: string
  priority: string
}

interface BugReportResult {
  id: string
  title: string
  summary: string
  environment: string
  device: string
  severity: string
  priority: string
  stepsList: string[]
  actualResult: string
  expectedResult: string
  rootCause: string
  investigation: string[]
  notes: string[]
}

interface HistoryItem {
  id: number
  title: string
  form: BugReportForm
  result: BugReportResult
  createdAt: string
}

const router = useRouter()
const generating = ref(false)
const copied = ref(false)
const mdCopied = ref(false)
const result = ref<BugReportResult | null>(null)
const history = reactive<HistoryItem[]>([])

const HISTORY_KEY = 'rebol_bug_report_history'

const form = reactive<BugReportForm>({
  description: '',
  steps: '',
  actualResult: '',
  expectedResult: '',
  environment: '',
  device: '',
  severity: '',
  priority: ''
})

const previewItems = [
  { num: 'Bug', label: 'Bug 标题', type: 'danger' },
  { num: '摘要', label: '问题摘要', type: 'primary' },
  { num: '环境', label: '测试环境', type: 'info' },
  { num: '严重', label: '严重程度 + 优先级', type: 'danger' },
  { num: '步骤', label: '复现步骤', type: 'info' },
  { num: '实际', label: '实际结果', type: 'warning' },
  { num: '期望', label: '期望结果', type: 'success' },
  { num: '分析', label: '初步原因分析', type: 'primary' },
  { num: '排查', label: '建议排查方向', type: 'primary' },
  { num: '备注', label: '补充说明', type: 'info' }
]

const canGenerate = computed(() => {
  return form.description.trim() && form.steps.trim() &&
    form.actualResult.trim() && form.expectedResult.trim()
})

const hasInput = computed(() => {
  return form.description.trim() || form.steps.trim() ||
    form.actualResult.trim() || form.expectedResult.trim()
})

onMounted(() => {
  loadHistoryFromStorage()
})

function loadHistoryFromStorage() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) {
      const items: HistoryItem[] = JSON.parse(stored)
      history.length = 0
      history.push(...items.slice(0, 5))
    }
  } catch {
    // ignore parse errors
  }
}

function saveToHistory(res: BugReportResult) {
  const item: HistoryItem = {
    id: Date.now(),
    title: res.title,
    form: { ...form },
    result: res,
    createdAt: new Date().toLocaleString('zh-CN', {
      month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  }
  history.unshift(item)
  if (history.length > 5) {
    history.length = 5
  }
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // ignore storage errors
  }
}

function loadHistory(item: HistoryItem) {
  form.description = item.form.description
  form.steps = item.form.steps
  form.actualResult = item.form.actualResult
  form.expectedResult = item.form.expectedResult
  form.environment = item.form.environment
  form.device = item.form.device
  form.severity = item.form.severity
  form.priority = item.form.priority
  result.value = item.result
}

function goBack() {
  router.push('/tools')
}

function fillExample() {
  form.description = '用户点击「提交订单」按钮后页面无响应，控制台报 500 错误'
  form.steps = '1. 登录账号进入商品详情页\n2. 选择商品规格并点击「加入购物车」\n3. 进入购物车确认商品信息\n4. 点击「提交订单」按钮'
  form.actualResult = '点击「提交订单」按钮后页面卡死，无任何提示信息。浏览器控制台显示 POST /api/order/create 接口返回 500。'
  form.expectedResult = '点击「提交订单」后应正常跳转到支付页面，或弹出加载中状态提示。'
  form.environment = '测试环境 (Staging)'
  form.device = 'Chrome 120 / Windows 11'
  form.severity = '严重 (Major)'
  form.priority = 'P1 - 高优先级'
}

function clearInput() {
  form.description = ''
  form.steps = ''
  form.actualResult = ''
  form.expectedResult = ''
  form.environment = ''
  form.device = ''
  form.severity = ''
  form.priority = ''
}

function clearResult() {
  result.value = null
}

function severityClass(s: string): string {
  if (s.includes('致命')) return 'severity-critical'
  if (s.includes('严重')) return 'severity-major'
  if (s.includes('一般')) return 'severity-minor'
  return 'severity-suggestion'
}

function priorityClass(p: string): string {
  if (p.includes('P0')) return 'priority-p0'
  if (p.includes('P1')) return 'priority-p1'
  if (p.includes('P2')) return 'priority-p2'
  return 'priority-p3'
}

function formatResultAsText(res: BugReportResult): string {
  const lines: string[] = []
  lines.push(`Bug 报告 #${res.id}`)
  lines.push('='.repeat(40))
  lines.push('')
  lines.push(`标题: ${res.title}`)
  lines.push(`环境: ${res.environment}`)
  lines.push(`严重程度: ${res.severity}`)
  lines.push(`优先级: ${res.priority}`)
  lines.push('')
  lines.push('【问题摘要】')
  lines.push(res.summary)
  lines.push('')
  lines.push('【复现步骤】')
  res.stepsList.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`))
  lines.push('')
  lines.push('【实际结果】')
  lines.push(res.actualResult)
  lines.push('')
  lines.push('【期望结果】')
  lines.push(res.expectedResult)
  lines.push('')
  lines.push('【初步原因分析】')
  lines.push(res.rootCause)
  lines.push('')
  lines.push('【建议排查方向】')
  res.investigation.forEach(s => lines.push(`  - ${s}`))
  lines.push('')
  lines.push('【补充说明】')
  res.notes.forEach(s => lines.push(`  - ${s}`))
  lines.push('')
  lines.push('---')
  lines.push('由 Rebol Lab Bug 报告生成器生成')
  return lines.join('\n')
}

function formatResultAsMarkdown(res: BugReportResult): string {
  const lines: string[] = []
  lines.push(`# Bug 报告 #${res.id}`)
  lines.push('')
  lines.push(`> 生成时间：${new Date().toLocaleString('zh-CN')}`)
  lines.push('')
  lines.push('## 基本信息')
  lines.push('')
  lines.push(`| 字段 | 值 |`)
  lines.push(`|------|-----|`)
  lines.push(`| 标题 | ${res.title} |`)
  lines.push(`| 环境 | ${res.environment} |`)
  lines.push(`| 严重程度 | ${res.severity} |`)
  lines.push(`| 优先级 | ${res.priority} |`)
  lines.push('')
  lines.push('## 问题摘要')
  lines.push('')
  lines.push(res.summary)
  lines.push('')
  lines.push('## 复现步骤')
  lines.push('')
  res.stepsList.forEach((s, i) => lines.push(`${i + 1}. ${s}`))
  lines.push('')
  lines.push('## 实际结果')
  lines.push('')
  lines.push(res.actualResult)
  lines.push('')
  lines.push('## 期望结果')
  lines.push('')
  lines.push(res.expectedResult)
  lines.push('')
  lines.push('## 初步原因分析')
  lines.push('')
  lines.push(res.rootCause)
  lines.push('')
  lines.push('## 建议排查方向')
  lines.push('')
  res.investigation.forEach(s => lines.push(`- ${s}`))
  lines.push('')
  lines.push('## 补充说明')
  lines.push('')
  res.notes.forEach(s => lines.push(`- ${s}`))
  lines.push('')
  lines.push('---')
  lines.push('*由 Rebol Lab Bug 报告生成器生成*')
  return lines.join('\n')
}

async function copyResult() {
  if (!result.value) return
  const text = formatResultAsText(result.value)
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    ElMessage.success('已复制到剪贴板')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

async function copyAsMarkdown() {
  if (!result.value) return
  const text = formatResultAsMarkdown(result.value)
  try {
    await navigator.clipboard.writeText(text)
    mdCopied.value = true
    ElMessage.success('Markdown 已复制到剪贴板')
    setTimeout(() => { mdCopied.value = false }, 2000)
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

function generate() {
  if (!canGenerate.value) return
  generating.value = true

  setTimeout(() => {
    result.value = mockGenerate()
    saveToHistory(result.value)
    generating.value = false
  }, 800)
}

function mockGenerate(): BugReportResult {
  const desc = form.description
  const sev = form.severity || '一般 (Minor)'
  const pri = form.priority || 'P2 - 正常修复'
  const env = form.environment || '未指定'
  const device = form.device || '未指定'

  const severityMap: Record<string, string> = {
    '致命 (Critical)': 'Critical',
    '严重 (Major)': 'Major',
    '一般 (Minor)': 'Minor',
    '建议 (Suggestion)': 'Suggestion'
  }
  const sevLabel = Object.entries(severityMap).find(([k]) => k === sev)?.[1] || 'Minor'

  const id = `BUG-${Date.now().toString(36).toUpperCase()}`

  const summary = `在 ${env} 环境下，${desc}。该问题影响用户正常操作流程，${device !== '未指定' ? `在 ${device} 上可稳定复现，` : ''}需要尽快定位修复。`

  const stepsArray = form.steps.split('\n').filter(s => s.trim())

  const causeOptions = [
    `后端接口 ${sevLabel} 级别异常：请求参数校验不严谨，缺少必要的边界检查，导致非法参数进入核心逻辑后触发 500 错误。`,
    `前端未做空值保护：接口返回异常数据时，前端渲染层未做防御性判断，导致页面崩溃。`,
    `并发竞态条件：在高频操作场景下，多个异步请求的响应顺序不确定，导致状态覆盖或数据不一致。`,
    `数据状态未同步：列表页与详情页之间状态不同步，操作后未刷新上下文数据。`
  ]
  const rootCause = causeOptions[Math.floor(Math.random() * causeOptions.length)]

  const investigationOptions = [
    `检查 ${sevLabel} 相关接口的入参校验逻辑，确认是否缺少对空值、特殊字符的拦截`,
    '查看服务端错误日志，定位具体的异常堆栈信息',
    '确认是否近期有相关代码变更，检查 Git 提交记录',
    '在前端复现路径中添加 console.log 埋点，追踪数据流向',
    '使用 Postman 直接调用接口，排除前端因素',
    '检查浏览器控制台的 Network 面板，确认请求参数和响应体'
  ]

  const noteOptions = [
    `建议在修复后补充 ${sevLabel} 场景的自动化测试用例`,
    '该 Bug 在回归测试中被发现，建议加强该模块的冒烟测试覆盖',
    '与产品确认该行为是否在预期设计范围内，是否需要更新需求文档',
    '建议增加更友好的错误提示，提升用户体验'
  ]

  const shuffledInvestigation = [...investigationOptions].sort(() => Math.random() - 0.5).slice(0, 4)
  const shuffledNotes = [...noteOptions].sort(() => Math.random() - 0.5).slice(0, 2)

  return {
    id,
    title: desc.length > 50 ? desc.slice(0, 50) + '...' : desc,
    summary,
    environment: env,
    device,
    severity: sev,
    priority: pri,
    stepsList: stepsArray,
    actualResult: form.actualResult,
    expectedResult: form.expectedResult,
    rootCause,
    investigation: shuffledInvestigation,
    notes: shuffledNotes
  }
}
</script>

<style scoped lang="scss">
.gen-container {
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 80px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gen-header {
  margin-bottom: 32px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .back-btn {
    color: var(--text-muted);
    font-size: 0.9rem;
    &:hover { color: var(--primary-color); }
  }

  .header-divider {
    width: 1px;
    height: 32px;
    background: var(--border-color);
  }

  h1 {
    font-size: 1.8rem;
    margin: 0 0 4px;
  }

  .description {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0;
  }
}

.gen-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  height: 0;
  flex: 1;
}

.input-panel {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}

.input-card {
  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: var(--text-color);

    .el-icon { font-size: 1.1rem; }
  }
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 6px;

  .required {
    color: #f85149;
  }
}

.form-row {
  display: flex;
  gap: 12px;

  .flex-1 {
    flex: 1;
  }
}

.input-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  .el-button { flex: 1; }
}

// History
.history-card {
  margin-top: 16px;

  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--text-color);

    .el-icon { font-size: 1.1rem; }
  }
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary-color);
    background: rgba(88, 166, 255, 0.05);
  }

  .history-text {
    font-size: 0.82rem;
    color: var(--text-color);
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .history-time {
    font-size: 0.7rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
}

// Result
.result-panel {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
}

.placeholder-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;

  .placeholder-content {
    text-align: center;
    max-width: 360px;

    .preview-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .preview-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 24px;
    }

    .preview-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.03);
      font-size: 0.88rem;
      color: var(--text-color);
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      .el-tag {
        min-width: 40px;
        text-align: center;
      }
    }

    .preview-hint {
      color: var(--text-muted);
      font-size: 0.8rem;
      line-height: 1.5;
      margin: 0;
    }
  }
}

.result-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);

  .result-label {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;

    .result-tokens {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }
  }
}

.result-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 1.05rem;
    }
  }
}

.section-text {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-color);
  margin: 0;
}

// Meta Grid
.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;

  .meta-label {
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .meta-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color);

    &.mono {
      font-family: var(--font-mono);
      color: var(--primary-color);
    }

    &.severity-critical { color: #f85149; }
    &.severity-major { color: #d29922; }
    &.severity-minor { color: var(--text-color); }
    &.severity-suggestion { color: var(--text-muted); }

    &.priority-p0 { color: #f85149; }
    &.priority-p1 { color: #d29922; }
    &.priority-p2 { color: var(--text-color); }
    &.priority-p3 { color: var(--text-muted); }
  }
}

.section-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    position: relative;
    padding: 8px 0 8px 20px;
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--text-color);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    &:last-child { border-bottom: none; }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 16px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--primary-color);
      opacity: 0.6;
    }
  }
}

.ordered-list {
  padding-left: 20px;
  margin: 0;

  li {
    padding: 6px 0;
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--text-color);
  }
}

:deep(.input-area) {
  .el-textarea__inner {
    background: rgba(0, 0, 0, 0.3);
    border-color: var(--border-color);
    color: var(--text-color);
    font-size: 0.88rem;
    line-height: 1.6;
    resize: vertical;

    &:focus {
      border-color: var(--primary-color);
    }

    &::placeholder {
      color: rgba(139, 148, 158, 0.5);
    }
  }
}

:deep(.el-select.input-area) {
  width: 100%;

  .el-select__wrapper {
    background: rgba(0, 0, 0, 0.3);
    border-color: var(--border-color);
    box-shadow: none;

    &:hover {
      border-color: var(--primary-color);
    }

    &.is-focused {
      border-color: var(--primary-color);
    }
  }

  .el-select__placeholder {
    color: rgba(139, 148, 158, 0.5);
  }
}

@media (max-width: 768px) {
  .gen-container {
    height: auto;
    overflow: visible;
  }

  .gen-layout {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
  }

  .input-panel {
    height: auto;
    overflow: visible;
    padding-right: 0;
  }

  .result-panel {
    height: auto;
    overflow: visible;
    padding-right: 0;
  }
}
</style>
