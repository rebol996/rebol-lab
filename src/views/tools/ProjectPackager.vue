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
          <h1 class="gradient-text">项目包装助手</h1>
          <p class="description">把普通项目包装成适合简历、作品集和面试表达的高质量项目描述。</p>
        </div>
      </div>
    </div>

    <div class="gen-layout">
      <div class="input-panel">
        <div class="tech-card input-card">
          <div class="panel-title">
            <el-icon><Edit /></el-icon>
            <span>项目信息</span>
          </div>

          <div class="form-group">
            <label class="form-label">项目名称 <span class="required">*</span></label>
            <el-input v-model="form.projectName" placeholder="例如：Rebol Lab" class="input-area" />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">项目类型</label>
              <el-select v-model="form.projectType" placeholder="选择类型" class="input-area">
                <el-option label="个人项目" value="个人项目" />
                <el-option label="课程项目" value="课程项目" />
                <el-option label="求职项目" value="求职项目" />
                <el-option label="实战项目" value="实战项目" />
              </el-select>
            </div>
            <div class="form-group flex-1">
              <label class="form-label">目标岗位</label>
              <el-select v-model="form.targetRole" placeholder="选择岗位" class="input-area">
                <el-option label="软件测试" value="软件测试" />
                <el-option label="前端开发" value="前端开发" />
                <el-option label="Web 开发" value="Web 开发" />
                <el-option label="全栈开发" value="全栈开发" />
              </el-select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">技术栈 <span class="required">*</span></label>
            <el-input v-model="form.techStack" placeholder="例如：Vue 3, TypeScript, Pinia, Element Plus" class="input-area" />
          </div>

          <div class="form-group">
            <label class="form-label">项目简介 <span class="required">*</span></label>
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="2"
              placeholder="简要介绍这是一个什么项目"
              class="input-area"
            />
          </div>

          <div class="form-group">
            <label class="form-label">核心功能 <span class="required">*</span></label>
            <el-input
              v-model="form.features"
              type="textarea"
              :rows="2"
              placeholder="用逗号或换行分隔，例如：&#10;测试用例自动生成, Bug 报告生成, 项目包装"
              class="input-area"
            />
          </div>

          <div class="form-group">
            <label class="form-label">我的职责 <span class="required">*</span></label>
            <el-input
              v-model="form.responsibilities"
              type="textarea"
              :rows="2"
              placeholder="你在项目中负责了什么"
              class="input-area"
            />
          </div>

          <div class="form-group">
            <label class="form-label">项目难点</label>
            <el-input
              v-model="form.difficulties"
              type="textarea"
              :rows="2"
              placeholder="遇到的技术难点或挑战"
              class="input-area"
            />
          </div>

          <div class="form-group">
            <label class="form-label">项目成果</label>
            <el-input
              v-model="form.achievements"
              type="textarea"
              :rows="2"
              placeholder="量化的成果数据"
              class="input-area"
            />
          </div>

          <div class="input-actions">
            <el-button type="primary" :disabled="!canGenerate || generating" @click="generate">
              <el-icon class="el-icon--left"><Lightning /></el-icon>
              {{ generating ? '包装中...' : '生成项目包装' }}
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
              <el-icon :size="20"><Document /></el-icon>
              <span>生成后将包含</span>
            </div>
            <div class="preview-list">
              <div class="preview-item" v-for="item in previewItems" :key="item.label">
                <el-tag size="small" :type="item.type">{{ item.num }}</el-tag>
                <span>{{ item.label }}</span>
              </div>
            </div>
            <p class="preview-hint">在左侧填写项目信息，点击「生成项目包装」即可获得优化后的项目描述。</p>
          </div>
        </div>

        <template v-if="result">
          <div class="result-toolbar">
            <span class="result-label">包装结果</span>
            <div class="toolbar-actions">
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
                <el-tag class="section-badge" type="primary">一句话</el-tag>
                <h3>项目一句话介绍</h3>
              </div>
              <p class="section-text highlight-text">{{ result.oneLiner }}</p>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="primary">简历</el-tag>
                <h3>简历项目描述</h3>
                <el-tag size="small" effect="plain" type="success">优化后</el-tag>
              </div>
              <div class="resume-box">
                <div class="resume-header">
                  <span class="resume-title">{{ result.resumeTitle }}</span>
                  <span class="resume-tech">{{ result.techStack }}</span>
                </div>
                <ul class="resume-list">
                  <li v-for="(item, i) in result.resumeBullets" :key="i">{{ item }}</li>
                </ul>
              </div>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="success">亮点</el-tag>
                <h3>项目亮点</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.highlights" :key="i">{{ item }}</li>
              </ul>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="warning">难点</el-tag>
                <h3>技术难点</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.techChallenges" :key="i">{{ item }}</li>
              </ul>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="info">职责</el-tag>
                <h3>我的职责表达</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.responsibilityStatements" :key="i">{{ item }}</li>
              </ul>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="primary">面试</el-tag>
                <h3>面试讲解稿</h3>
              </div>
              <div class="script-content">
                <p v-for="(para, i) in result.interviewScript" :key="i" class="script-paragraph">{{ para }}</p>
              </div>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="danger">追问</el-tag>
                <h3>面试官可能追问</h3>
              </div>
              <div class="qa-list">
                <div v-for="(item, i) in result.followUpQuestions" :key="i" class="qa-item">
                  <div class="q">Q{{ i + 1 }}: {{ item.question }}</div>
                  <div class="a">A: {{ item.answer }}</div>
                </div>
              </div>
            </div>

            <div class="tech-card section-card">
              <div class="section-header">
                <el-tag class="section-badge" type="info">优化</el-tag>
                <h3>项目优化方向</h3>
              </div>
              <ul class="section-list">
                <li v-for="(item, i) in result.optimizationSuggestions" :key="i">{{ item }}</li>
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
  CopyDocument, Delete
} from '@element-plus/icons-vue'

interface ProjectForm {
  projectName: string
  projectType: string
  targetRole: string
  techStack: string
  description: string
  features: string
  responsibilities: string
  difficulties: string
  achievements: string
}

interface QAItem {
  question: string
  answer: string
}

interface PackResult {
  oneLiner: string
  resumeTitle: string
  techStack: string
  resumeBullets: string[]
  highlights: string[]
  techChallenges: string[]
  responsibilityStatements: string[]
  interviewScript: string[]
  followUpQuestions: QAItem[]
  optimizationSuggestions: string[]
}

interface HistoryItem {
  id: number
  title: string
  form: ProjectForm
  result: PackResult
  createdAt: string
}

const router = useRouter()
const generating = ref(false)
const copied = ref(false)
const mdCopied = ref(false)
const result = ref<PackResult | null>(null)
const history = reactive<HistoryItem[]>([])

const HISTORY_KEY = 'rebol_project_packager_history'

const form = reactive<ProjectForm>({
  projectName: '',
  projectType: '',
  targetRole: '',
  techStack: '',
  description: '',
  features: '',
  responsibilities: '',
  difficulties: '',
  achievements: ''
})

const previewItems = [
  { num: '一句', label: '项目一句话介绍', type: 'primary' },
  { num: '简历', label: '简历项目描述', type: 'primary' },
  { num: '亮点', label: '项目亮点', type: 'success' },
  { num: '难点', label: '技术难点', type: 'warning' },
  { num: '职责', label: '我的职责表达', type: 'info' },
  { num: '面试', label: '面试讲解稿', type: 'primary' },
  { num: '追问', label: '面试官可能追问', type: 'danger' },
  { num: '优化', label: '项目优化方向', type: 'info' }
]

const canGenerate = computed(() => {
  return form.projectName.trim() && form.techStack.trim() &&
    form.description.trim() && form.features.trim() && form.responsibilities.trim()
})

const hasInput = computed(() => {
  return form.projectName.trim() || form.description.trim()
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

function saveToHistory(res: PackResult) {
  const item: HistoryItem = {
    id: Date.now(),
    title: res.resumeTitle,
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
  Object.assign(form, item.form)
  result.value = item.result
}

function goBack() {
  router.push('/tools')
}

function fillExample() {
  form.projectName = 'Rebol Lab'
  form.projectType = '个人项目'
  form.targetRole = '软件测试'
  form.techStack = 'Vue 3, TypeScript, Pinia, Element Plus, SCSS'
  form.description = '一个面向软件测试方向的个人开发者实验室，集成了测试用例生成、Bug 报告生成、项目包装等工具，同时包含作品展示和学习路线。'
  form.features = 'AI 测试用例生成器, Bug 报告生成器, 项目包装助手, 个人作品集展示, 学习路线追踪'
  form.responsibilities = '项目架构设计, 核心工具开发, 页面交互实现, 测试工具逻辑开发, 项目部署维护'
  form.difficulties = '工具类页面的通用布局设计、Mock 数据生成规则的灵活性和可扩展性、历史记录与 localStorage 的持久化管理'
  form.achievements = '完成 3 个核心工具开发、项目构建通过率 100%、页面交互流畅 0 卡顿'
}

function clearInput() {
  form.projectName = ''
  form.projectType = ''
  form.targetRole = ''
  form.techStack = ''
  form.description = ''
  form.features = ''
  form.responsibilities = ''
  form.difficulties = ''
  form.achievements = ''
}

function clearResult() {
  result.value = null
}

function formatResultAsText(res: PackResult): string {
  const lines: string[] = []
  lines.push('=== 项目包装报告 ===')
  lines.push('')
  lines.push(`【一句话介绍】`)
  lines.push(res.oneLiner)
  lines.push('')
  lines.push('【简历项目描述】')
  lines.push(`项目名称: ${res.resumeTitle}`)
  lines.push(`技术栈: ${res.techStack}`)
  res.resumeBullets.forEach(b => lines.push(`  - ${b}`))
  lines.push('')
  lines.push('【项目亮点】')
  res.highlights.forEach(h => lines.push(`  - ${h}`))
  lines.push('')
  lines.push('【技术难点】')
  res.techChallenges.forEach(c => lines.push(`  - ${c}`))
  lines.push('')
  lines.push('【我的职责表达】')
  res.responsibilityStatements.forEach(s => lines.push(`  - ${s}`))
  lines.push('')
  lines.push('【面试讲解稿】')
  res.interviewScript.forEach(p => lines.push(`  ${p}`))
  lines.push('')
  lines.push('【面试官可能追问】')
  res.followUpQuestions.forEach(q => {
    lines.push(`  Q: ${q.question}`)
    lines.push(`  A: ${q.answer}`)
  })
  lines.push('')
  lines.push('【项目优化方向】')
  res.optimizationSuggestions.forEach(s => lines.push(`  - ${s}`))
  lines.push('')
  lines.push('---')
  lines.push('由 Rebol Lab 项目包装助手生成')
  return lines.join('\n')
}

function formatResultAsMarkdown(res: PackResult): string {
  const lines: string[] = []
  lines.push('# 项目包装报告')
  lines.push('')
  lines.push(`> 生成时间：${new Date().toLocaleString('zh-CN')}`)
  lines.push('')
  lines.push('## 一句话介绍')
  lines.push('')
  lines.push(res.oneLiner)
  lines.push('')
  lines.push('## 简历项目描述')
  lines.push('')
  lines.push(`- **项目名称**: ${res.resumeTitle}`)
  lines.push(`- **技术栈**: ${res.techStack}`)
  lines.push('')
  res.resumeBullets.forEach(b => lines.push(`- ${b}`))
  lines.push('')
  lines.push('## 项目亮点')
  lines.push('')
  res.highlights.forEach(h => lines.push(`- ${h}`))
  lines.push('')
  lines.push('## 技术难点')
  lines.push('')
  res.techChallenges.forEach(c => lines.push(`- ${c}`))
  lines.push('')
  lines.push('## 我的职责表达')
  lines.push('')
  res.responsibilityStatements.forEach(s => lines.push(`- ${s}`))
  lines.push('')
  lines.push('## 面试讲解稿')
  lines.push('')
  res.interviewScript.forEach(p => lines.push(`${p}`))
  lines.push('')
  lines.push('## 面试官可能追问')
  lines.push('')
  res.followUpQuestions.forEach((q, i) => {
    lines.push(`### Q${i + 1}: ${q.question}`)
    lines.push('')
    lines.push(q.answer)
    lines.push('')
  })
  lines.push('## 项目优化方向')
  lines.push('')
  res.optimizationSuggestions.forEach(s => lines.push(`- ${s}`))
  lines.push('')
  lines.push('---')
  lines.push('*由 Rebol Lab 项目包装助手生成*')
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
  }, 900)
}

function mockGenerate(): PackResult {
  const name = form.projectName
  const type = form.projectType || '个人项目'
  const role = form.targetRole || '软件测试'
  const tech = form.techStack
  const feats = form.features.split(/[,，\n]/).map(s => s.trim()).filter(Boolean)
  const duties = form.responsibilities.split(/[,，\n]/).map(s => s.trim()).filter(Boolean)
  const diffs = form.difficulties ? form.difficulties.split(/[,，\n]/).map(s => s.trim()).filter(Boolean) : []
  const achievements = form.achievements

  const oneLiner = `「${name}」是一个面向${role}方向的${type}，基于 ${tech} 技术栈构建，实现了${feats.slice(0, 2).join('、')}等核心功能，旨在提升${role}场景下的工作效率与作品展示效果。`

  const resumeBullets = [
    `基于 ${tech} 搭建${type}「${name}」，独立完成项目架构设计与核心功能开发`,
    `实现 ${feats.slice(0, 3).join('、')} 等功能模块，覆盖${role}场景下的关键工作流程`,
    ...(achievements ? [`${achievements}`] : []),
    ...(diffs.length > 0 ? [`解决 ${diffs.slice(0, 1).join('、')} 等技术难题，优化了项目架构的可维护性`] : [])
  ]

  const highlights = [
    `从 0 到 1 独立完成「${name}」的完整开发，包含需求分析、架构设计、编码实现与部署上线`,
    `采用 ${tech} 技术栈，确保项目的可扩展性和代码质量`,
    ...(feats.length > 2 ? [`核心功能 ${feats[0]} 和 ${feats[1]} 覆盖了 ${role} 工作的高频场景`] : []),
    ...(achievements ? [`项目取得显著成果：${achievements}`] : [])
  ]

  const techChallenges = diffs.length > 0
    ? diffs.map(d => `在项目开发中遇到 ${d}，通过查阅技术文档和反复调试最终解决`)
    : [
        `在「${name}」开发过程中，通过合理的技术选型和架构设计，确保了项目的稳定性和可维护性`,
        `针对 ${role} 场景的特殊需求，设计了灵活的数据处理流程`
      ]

  const responsibilityStatements = duties.map(d => {
    const actionMap: Record<string, string> = {
      '架构设计': '负责项目整体架构设计，采用模块化分层思想，确保各功能模块低耦合高内聚',
      '核心工具': '主导核心工具模块开发，从需求分析到功能实现全流程跟进',
      '页面': '负责前端页面交互实现，关注用户体验与界面一致性',
      '测试': '负责测试工具的逻辑开发，确保生成结果的准确性和实用性',
      '部署': '负责项目部署与持续维护，保障线上环境稳定运行',
      '开发': `负责${d}相关功能开发，保证代码质量和交付进度`
    }
    for (const [key, val] of Object.entries(actionMap)) {
      if (d.includes(key)) return val
    }
    return `负责${d}，高效完成任务并确保质量`
  })

  const scriptParagraphs = [
    `我独立开发了「${name}」这个项目。这是一个面向${role}方向的${type}，使用 ${tech} 技术栈构建。`,
    `项目的核心功能包括 ${feats.slice(0, 3).join('、')}。我从项目架构设计开始，逐步实现了各个功能模块。`,
    ...(diffs.length > 0 ? [`在开发过程中，我遇到了${diffs.slice(0, 2).join('、')}等技术挑战。通过深入分析问题根源，我采用了合理的技术方案解决了这些问题，也提升了我的问题排查能力。`] : []),
    `通过这个项目，我不仅巩固了 ${tech} 技术栈的实践能力，还培养了从测试视角思考产品质量的习惯。`
  ]

  const followUpQuestions: QAItem[] = [
    {
      question: `为什么选择 ${tech} 这套技术栈？`,
      answer: `选择 ${tech} 主要是考虑到项目定位是 ${type}，需要快速迭代和良好的开发体验。选型时综合考量了社区生态、团队熟悉度和项目需求。`
    },
    {
      question: `项目中你遇到的最大挑战是什么？`,
      answer: diffs.length > 0
        ? `最大的挑战是${diffs[0]}。我通过查阅官方文档、参考开源方案和反复实验，最终找到了合适的解决思路。`
        : `项目整体推进比较顺利，但在确保各模块之间的协作和数据一致性上投入了较多精力进行优化。`
    },
    {
      question: `这个项目对你应聘${role}岗位有什么帮助？`,
      answer: `通过这个项目，我展示了${role}方向所需的技术能力和项目实践。项目中遇到的测试场景分析和工具开发经历，与${role}岗位的日常工作高度相关。`
    },
    {
      question: `如果继续迭代，你计划增加什么功能？`,
      answer: `未来计划增加更多自动化工具模块，考虑接入 AI API 提升工具智能程度，同时优化移动端体验。`
    }
  ]

  const optimizationSuggestions = [
    `接入真实 AI API（如 OpenAI、DeepSeek），提升工具生成内容的质量和多样性`,
    `增加用户自定义模板功能，允许用户保存和复用项目包装格式`,
    `增加 PDF / Word 格式导出，方便直接用于简历投递`,
    `增加项目对比功能，帮助用户评估不同包装版本的效果`
  ]

  return {
    oneLiner,
    resumeTitle: name,
    techStack: tech,
    resumeBullets,
    highlights,
    techChallenges,
    responsibilityStatements,
    interviewScript: scriptParagraphs,
    followUpQuestions,
    optimizationSuggestions
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

.highlight-text {
  color: var(--primary-color);
  font-weight: 500;
  padding: 12px 16px;
  background: rgba(88, 166, 255, 0.05);
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
}

.resume-box {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;

  .resume-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border-color);

    .resume-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .resume-tech {
      font-size: 0.75rem;
      color: var(--primary-color);
      font-family: var(--font-mono);
    }
  }
}

.resume-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    position: relative;
    padding: 10px 16px 10px 32px;
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--text-color);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    &:last-child { border-bottom: none; }

    &::before {
      content: '•';
      position: absolute;
      left: 16px;
      color: var(--primary-color);
      font-weight: bold;
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

.script-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.script-paragraph {
  font-size: 0.88rem;
  line-height: 1.8;
  color: var(--text-color);
  margin: 0;
  text-indent: 2em;
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.qa-item {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  border: 1px solid var(--border-color);

  .q {
    font-size: 0.88rem;
    font-weight: 600;
    color: #d29922;
    margin-bottom: 8px;
  }

  .a {
    font-size: 0.85rem;
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

:deep(.el-input.input-area) {
  .el-input__wrapper {
    background: rgba(0, 0, 0, 0.3);
    border-color: var(--border-color);
    box-shadow: none;

    &:hover {
      border-color: var(--primary-color);
    }

    &.is-focus {
      border-color: var(--primary-color);
    }
  }

  .el-input__inner {
    color: var(--text-color);
    font-size: 0.88rem;

    &::placeholder {
      color: rgba(139, 148, 158, 0.5);
    }
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
