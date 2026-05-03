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
          <h1 class="gradient-text">测试用例生成器</h1>
          <p class="description">输入功能需求描述，生成覆盖功能、异常、边界、安全与接口的测试用例。</p>
        </div>
      </div>
    </div>

    <div class="gen-layout">
      <div class="input-panel">
        <div class="tech-card input-card">
          <div class="panel-title">
            <el-icon><Edit /></el-icon>
            <span>功能需求描述</span>
          </div>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="8"
            placeholder="请输入功能需求，例如：&#10;用户登录功能，支持邮箱和密码登录，包含验证码校验，失败超过5次锁定账号30分钟。"
            class="input-area"
          />
          <div class="char-count">{{ inputText.length }} / 1000</div>
          <div class="input-actions">
            <el-button type="primary" :disabled="!inputText.trim() || generating" @click="generate">
              <el-icon class="el-icon--left"><Lightning /></el-icon>
              {{ generating ? '生成中...' : '生成测试用例' }}
            </el-button>
            <el-button :disabled="!inputText.trim()" @click="clearInput">
              清空输入
            </el-button>
            <el-button @click="fillExample">
              填入示例
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
              <div class="history-text">{{ item.input }}</div>
              <div class="history-time">{{ item.createdAt }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="result-panel">
        <div v-if="!result" class="tech-card placeholder-card">
          <div class="placeholder-content">
            <div class="preview-header">
              <el-icon :size="20"><Document /></el-icon>
              <span>生成后将包含</span>
            </div>
            <div class="preview-list">
              <div class="preview-item">
                <el-tag size="small" type="primary">1</el-tag>
                <span>功能点分析</span>
              </div>
              <div class="preview-item">
                <el-tag size="small" type="success">2</el-tag>
                <span>正常测试用例</span>
              </div>
              <div class="preview-item">
                <el-tag size="small" type="warning">3</el-tag>
                <span>异常测试用例</span>
              </div>
              <div class="preview-item">
                <el-tag size="small" type="info">4</el-tag>
                <span>边界值测试</span>
              </div>
              <div class="preview-item">
                <el-tag size="small" type="danger">5</el-tag>
                <span>安全测试点</span>
              </div>
              <div class="preview-item">
                <el-tag size="small" type="primary">6</el-tag>
                <span>接口测试建议</span>
              </div>
              <div class="preview-item">
                <el-tag size="small" type="danger">7</el-tag>
                <span>可能出现的 Bug</span>
              </div>
            </div>
            <p class="preview-hint">在左侧输入功能需求描述，点击「生成测试用例」即可获取完整报告。</p>
          </div>
        </div>

        <template v-if="result">
          <div class="result-toolbar">
            <span class="result-label">生成结果</span>
            <div class="toolbar-actions">
              <span class="result-tokens">{{ result.tokenCount }} 条测试点</span>
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

          <div class="result-sections" ref="resultRef">
            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="primary">1</el-tag>
                <h3>功能点分析</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.featureAnalysis" :key="i">{{ item }}</li>
              </ul>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="success">2</el-tag>
                <h3>正常测试用例</h3>
              </div>
              <div class="case-table">
                <div class="case-row header">
                  <span class="col-id">编号</span>
                  <span class="col-name">用例名称</span>
                  <span class="col-steps">操作步骤</span>
                  <span class="col-expected">预期结果</span>
                </div>
                <div v-for="item in result.normalCases" :key="item.id" class="case-row">
                  <span class="col-id">{{ item.id }}</span>
                  <span class="col-name">{{ item.name }}</span>
                  <span class="col-steps">{{ item.steps }}</span>
                  <span class="col-expected">{{ item.expected }}</span>
                </div>
              </div>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="warning">3</el-tag>
                <h3>异常测试用例</h3>
              </div>
              <div class="case-table">
                <div class="case-row header">
                  <span class="col-id">编号</span>
                  <span class="col-name">用例名称</span>
                  <span class="col-steps">操作步骤</span>
                  <span class="col-expected">预期结果</span>
                </div>
                <div v-for="item in result.abnormalCases" :key="item.id" class="case-row">
                  <span class="col-id">{{ item.id }}</span>
                  <span class="col-name">{{ item.name }}</span>
                  <span class="col-steps">{{ item.steps }}</span>
                  <span class="col-expected">{{ item.expected }}</span>
                </div>
              </div>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="info">4</el-tag>
                <h3>边界值测试</h3>
              </div>
              <div class="case-table">
                <div class="case-row header">
                  <span class="col-id">编号</span>
                  <span class="col-name">测试点</span>
                  <span class="col-steps">输入值</span>
                  <span class="col-expected">预期结果</span>
                </div>
                <div v-for="item in result.boundaryTests" :key="item.id" class="case-row">
                  <span class="col-id">{{ item.id }}</span>
                  <span class="col-name">{{ item.name }}</span>
                  <span class="col-steps">{{ item.input }}</span>
                  <span class="col-expected">{{ item.expected }}</span>
                </div>
              </div>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="danger">5</el-tag>
                <h3>安全测试点</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.securityPoints" :key="i">{{ item }}</li>
              </ul>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="primary">6</el-tag>
                <h3>接口测试建议</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.apiSuggestions" :key="i">{{ item }}</li>
              </ul>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="danger">7</el-tag>
                <h3>可能出现的 Bug</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.possibleBugs" :key="i">{{ item }}</li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Edit, Lightning, Clock, Document,
  CopyDocument, Delete
} from '@element-plus/icons-vue'

interface TestCaseItem {
  id: string
  name: string
  steps: string
  expected: string
}

interface BoundaryItem {
  id: string
  name: string
  input: string
  expected: string
}

interface TestCaseResult {
  featureAnalysis: string[]
  normalCases: TestCaseItem[]
  abnormalCases: TestCaseItem[]
  boundaryTests: BoundaryItem[]
  securityPoints: string[]
  apiSuggestions: string[]
  possibleBugs: string[]
  tokenCount: number
}

interface HistoryItem {
  id: number
  input: string
  result: TestCaseResult
  createdAt: string
}

const router = useRouter()
const inputText = ref('')
const generating = ref(false)
const copied = ref(false)
const mdCopied = ref(false)
const resultRef = ref<HTMLElement | null>(null)
const result = ref<TestCaseResult | null>(null)

const history = reactive<HistoryItem[]>([])

const HISTORY_KEY = 'rebol_test_case_history'

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

function saveToHistory(input: string, res: TestCaseResult) {
  const item: HistoryItem = {
    id: Date.now(),
    input: input.length > 60 ? input.slice(0, 60) + '...' : input,
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
  result.value = item.result
  inputText.value = item.input
}

function goBack() {
  router.push('/tools')
}

function clearInput() {
  inputText.value = ''
}

function fillExample() {
  inputText.value = '用户登录功能，支持手机号和验证码登录。验证码有效期为60秒，验证码输入错误3次后锁定账号10分钟。'
}

function clearResult() {
  result.value = null
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

function formatResultAsText(res: TestCaseResult): string {
  const lines: string[] = []
  lines.push('=== 测试用例生成报告 ===')
  lines.push('')

  lines.push('【1. 功能点分析】')
  res.featureAnalysis.forEach(f => lines.push(`  - ${f}`))
  lines.push('')

  lines.push('【2. 正常测试用例】')
  res.normalCases.forEach(c => {
    lines.push(`  ${c.id} | ${c.name}`)
    lines.push(`      步骤: ${c.steps}`)
    lines.push(`      预期: ${c.expected}`)
  })
  lines.push('')

  lines.push('【3. 异常测试用例】')
  res.abnormalCases.forEach(c => {
    lines.push(`  ${c.id} | ${c.name}`)
    lines.push(`      步骤: ${c.steps}`)
    lines.push(`      预期: ${c.expected}`)
  })
  lines.push('')

  lines.push('【4. 边界值测试】')
  res.boundaryTests.forEach(b => {
    lines.push(`  ${b.id} | ${b.name}`)
    lines.push(`      输入: ${b.input}`)
    lines.push(`      预期: ${b.expected}`)
  })
  lines.push('')

  lines.push('【5. 安全测试点】')
  res.securityPoints.forEach(s => lines.push(`  - ${s}`))
  lines.push('')

  lines.push('【6. 接口测试建议】')
  res.apiSuggestions.forEach(s => lines.push(`  - ${s}`))
  lines.push('')

  lines.push('【7. 可能出现的 Bug】')
  res.possibleBugs.forEach(b => lines.push(`  - ${b}`))
  lines.push('')

  lines.push('--- 由 Rebol Lab 测试用例生成器生成 ---')
  return lines.join('\n')
}

function formatResultAsMarkdown(res: TestCaseResult): string {
  const lines: string[] = []
  lines.push('# 测试用例生成报告')
  lines.push('')
  lines.push(`> 生成时间：${new Date().toLocaleString('zh-CN')}`)
  lines.push('')

  lines.push('## 1. 功能点分析')
  res.featureAnalysis.forEach(f => lines.push(`- ${f}`))
  lines.push('')

  lines.push('## 2. 正常测试用例')
  lines.push('| 编号 | 用例名称 | 操作步骤 | 预期结果 |')
  lines.push('|------|----------|----------|----------|')
  res.normalCases.forEach(c => {
    lines.push(`| ${c.id} | ${c.name} | ${c.steps} | ${c.expected} |`)
  })
  lines.push('')

  lines.push('## 3. 异常测试用例')
  lines.push('| 编号 | 用例名称 | 操作步骤 | 预期结果 |')
  lines.push('|------|----------|----------|----------|')
  res.abnormalCases.forEach(c => {
    lines.push(`| ${c.id} | ${c.name} | ${c.steps} | ${c.expected} |`)
  })
  lines.push('')

  lines.push('## 4. 边界值测试')
  lines.push('| 编号 | 测试点 | 输入值 | 预期结果 |')
  lines.push('|------|--------|--------|----------|')
  res.boundaryTests.forEach(b => {
    lines.push(`| ${b.id} | ${b.name} | ${b.input} | ${b.expected} |`)
  })
  lines.push('')

  lines.push('## 5. 安全测试点')
  res.securityPoints.forEach(s => lines.push(`- ${s}`))
  lines.push('')

  lines.push('## 6. 接口测试建议')
  res.apiSuggestions.forEach(s => lines.push(`- ${s}`))
  lines.push('')

  lines.push('## 7. 可能出现的 Bug')
  res.possibleBugs.forEach(b => lines.push(`- ${b}`))
  lines.push('')

  lines.push('---')
  lines.push('*由 Rebol Lab 测试用例生成器生成*')
  return lines.join('\n')
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
  if (!inputText.value.trim()) return
  generating.value = true

  setTimeout(() => {
    result.value = mockGenerate(inputText.value.trim())
    saveToHistory(inputText.value.trim(), result.value)
    generating.value = false
    nextTick(() => {
      resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, 800)
}

function mockGenerate(input: string): TestCaseResult {
  const keyword = input.length > 30 ? input.slice(0, 30) + '...' : input

  const features = [
    `用户输入验证：对 "${keyword}" 相关的输入字段进行格式、长度和类型校验`,
    `核心业务流程：实现 "${keyword}" 的主流程闭环，确保数据状态正确流转`,
    `权限控制：不同角色对 "${keyword}" 模块的访问与操作权限隔离`,
    `数据持久化：确保 "${keyword}" 相关的数据准确写入数据库，字段映射完整`,
    `异常兜底：网络中断、服务器超时、数据异常等场景下 "${keyword}" 模块表现稳定`
  ]

  const normalCases: TestCaseItem[] = [
    { id: 'TC-N-01', name: `正常输入 - ${keyword} 完整流程`, steps: `输入完整合法的${keyword}参数，点击提交`, expected: `${keyword}操作成功，返回正确结果，页面刷新展示最新数据` },
    { id: 'TC-N-02', name: `默认参数 - ${keyword} 空状态`, steps: `进入${keyword}模块，不输入任何内容，观察默认状态`, expected: `页面正常渲染，显示空状态提示或默认占位内容，无报错` },
    { id: 'TC-N-03', name: `必填项校验 - ${keyword} 最小必填`, steps: `仅填写${keyword}所有必填字段合法值，提交表单`, expected: `提交成功，跳转至结果页面` },
    { id: 'TC-N-04', name: `数据完整性验证`, steps: `执行${keyword}操作后，查询数据库对应记录`, expected: `数据库记录字段完整，数据格式正确，关联关系一致` },
    { id: 'TC-N-05', name: `重复操作幂等性`, steps: `连续两次执行相同的${keyword}操作`, expected: `第二次操作提示"已存在"或覆盖更新，不产生重复数据` }
  ]

  const abnormalCases: TestCaseItem[] = [
    { id: 'TC-A-01', name: `空输入 - ${keyword} 必填字段为空`, steps: `不填写${keyword}的必填字段，直接提交`, expected: `页面提示"该字段为必填项"，提交被阻止` },
    { id: 'TC-A-02', name: `格式错误 - 非法字符注入`, steps: `在${keyword}输入字段中填入 HTML 标签和特殊字符`, expected: `前端拦截非法字符，提示"输入格式不正确"` },
    { id: 'TC-A-03', name: `超长输入 - 超出最大长度`, steps: `输入超过 500 字符的${keyword}描述`, expected: `截断超长内容或提示"输入超出最大长度限制"` },
    { id: 'TC-A-04', name: `网络中断 - 提交时断网`, steps: `在提交${keyword}前断开网络，点击提交`, expected: `提示"网络连接失败，请检查网络后重试"，数据不丢失` },
    { id: 'TC-A-05', name: `并发冲突 - 同时操作同一数据`, steps: `两个用户同时编辑并提交同一个${keyword}记录`, expected: `后提交者提示"数据已被修改，请刷新后重试"` }
  ]

  const boundaryTests: BoundaryItem[] = [
    { id: 'TC-B-01', name: `${keyword} 输入最小长度边界`, input: `输入 1 个字符`, expected: `如果最小长度为 2，则提示"输入过短"；否则正常通过` },
    { id: 'TC-B-02', name: `${keyword} 输入最大长度边界`, input: `输入恰好等于最大长度的内容`, expected: `正常提交，不截断不报错` },
    { id: 'TC-B-03', name: `${keyword} 输入超过最大长度+1`, input: `输入最大长度 + 1 个字符`, expected: `前端截断或提示超出长度，阻止提交` },
    { id: 'TC-B-04', name: `${keyword} 分页边界 - 第 1 页`, input: `查询第一页数据`, expected: `返回第一页数据，页码高亮为 1` },
    { id: 'TC-B-05', name: `${keyword} 分页边界 - 最后一页`, input: `查询超出总页数的页码`, expected: `返回空数据，页码不超出范围` }
  ]

  const securityPoints = [
    `SQL 注入检测：${keyword} 所有输入字段过滤 SQL 关键字（'、"、--、;）`,
    `XSS 防护：${keyword} 输出内容进行 HTML 转义，防止脚本注入`,
    `CSRF Token 校验：${keyword} 表单提交必须携带有效 Token`,
    `接口频率限制：${keyword} 相关 API 需做限流，防止暴力请求`,
    `敏感数据脱敏：${keyword} 涉及手机号、邮箱等字段在日志和前端展示时脱敏`,
    `未授权访问：未登录用户直接访问 ${keyword} 接口应返回 401`
  ]

  const apiSuggestions = [
    `建议使用 POST 方法提交 ${keyword} 请求，请求体采用 JSON 格式`,
    `响应状态码规范：成功返回 200，参数错误返回 400，未授权返回 401，服务端错误返回 500`,
    `分页接口：${keyword} 列表查询建议支持 page、pageSize、sortBy、order 参数`,
    `超时设置：${keyword} 核心接口超时时间建议设置为 10s，批量操作为 30s`,
    `接口幂等性：${keyword} 创建接口建议使用幂等 Token 防止重复提交`,
    `错误响应格式统一：{ "code": number, "message": string, "data": any }`,
    `建议在 HEADER 中传递 traceId 用于全链路日志追踪`
  ]

  const possibleBugs = [
    `${keyword} 在空数据状态下未展示友好提示，直接显示空白页`,
    `输入超长文本时前端做了截断但后端未校验，导致入库数据不一致`,
    `${keyword} 列表页在快速翻页时出现数据闪烁或重复渲染`,
    `${keyword} 在高并发场景下出现数据库死锁或超时未处理`,
    `浏览器回退后 ${keyword} 页面表单数据未恢复，导致用户重复填写`,
    `${keyword} 权限校验有缓存漏洞，切换角色后仍能访问旧数据`,
    `移动端 ${keyword} 页面布局错位，按钮超出可视区域`
  ]

  const totalCount = normalCases.length + abnormalCases.length + boundaryTests.length

  return {
    featureAnalysis: features,
    normalCases,
    abnormalCases,
    boundaryTests,
    securityPoints,
    apiSuggestions,
    possibleBugs,
    tokenCount: totalCount + features.length + securityPoints.length + apiSuggestions.length + possibleBugs.length
  }
}
</script>

<style scoped lang="scss">
.gen-container {
  max-width: 1400px;
  margin: 0 auto;
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
  align-items: start;
}

.input-panel {
  position: sticky;
  top: 0;
}

.input-card {
  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-color);

    .el-icon { font-size: 1.1rem; }
  }

  .char-count {
    text-align: right;
    font-size: 0.75rem;
    color: var(--text-muted);
    margin: 8px 0;
    font-family: var(--font-mono);
  }

  .input-actions {
    display: flex;
    gap: 12px;

    .el-button { flex: 1; }
  }
}

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

.result-panel {
  min-height: 400px;
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
        min-width: 24px;
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
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 1.1rem;
    }
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

.case-table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.case-row {
  display: grid;
  grid-template-columns: 80px 1fr 1.5fr 1.5fr;
  font-size: 0.82rem;

  &.header {
    background: rgba(255, 255, 255, 0.03);
    font-weight: 600;
    color: var(--text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  span {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    line-height: 1.5;

    &:last-child { border-right: none; }
  }

  &:last-child span { border-bottom: none; }

  .col-id {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .col-name { color: var(--text-color); }
  .col-steps { color: var(--text-color); }
  .col-expected { color: var(--accent-color); }
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
</style>
