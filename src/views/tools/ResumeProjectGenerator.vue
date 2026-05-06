<template>
  <div class="generator-container">
    <div class="generator-header">
      <el-button link class="back-btn" @click="$router.push('/tools')">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回工具集</span>
      </el-button>
      <div class="header-divider"></div>
      <div>
        <h1 class="gradient-text">简历项目描述生成器</h1>
        <p class="description">基于 STAR 法则，将项目经历转化为高质量简历描述</p>
      </div>
    </div>

    <div class="generator-layout">
      <div class="input-section tech-card">
        <h3><el-icon><Edit /></el-icon> 输入项目信息</h3>

        <div class="form-group">
          <label class="form-label">项目名称</label>
          <el-input v-model="form.projectName" placeholder="例如：用户管理系统" />
        </div>

        <div class="form-group">
          <label class="form-label">技术栈</label>
          <el-input v-model="form.techStack" placeholder="例如：Vue 3 + TypeScript + Node.js" />
        </div>

        <div class="form-group">
          <label class="form-label">项目背景</label>
          <el-input v-model="form.background" type="textarea" :rows="2" placeholder="例如：解决团队协作效率低的问题" />
        </div>

        <div class="form-group">
          <label class="form-label">核心功能（用逗号分隔）</label>
          <el-input v-model="form.coreFeatures" type="textarea" :rows="2" placeholder="例如：用户注册登录、权限管理、数据统计" />
        </div>

        <div class="form-group">
          <label class="form-label">个人职责</label>
          <el-input v-model="form.responsibility" type="textarea" :rows="2" placeholder="例如：独立完成前端架构设计、组件开发、接口联调" />
        </div>

        <div class="form-group">
          <label class="form-label">项目亮点（用逗号分隔）</label>
          <el-input v-model="form.highlights" type="textarea" :rows="2" placeholder="例如：首屏加载优化 60%、采用 TDD 开发模式" />
        </div>

        <div class="form-actions">
          <el-button type="primary" @click="generate" :loading="generating">
            生成描述
          </el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>

      <div class="output-section">
        <div v-if="!result" class="output-placeholder tech-card">
          <el-icon :size="48"><Document /></el-icon>
          <p>填写项目信息后，点击"生成描述"获取简历描述</p>
        </div>

        <div v-else class="output-content">
          <div class="output-card tech-card">
            <div class="output-header">
              <h3>简历描述（简洁版）</h3>
              <el-button size="small" @click="copyText(result.simple)" link>
                <el-icon><CopyDocument /></el-icon> 复制
              </el-button>
            </div>
            <div class="output-text">{{ result.simple }}</div>
          </div>

          <div class="output-card tech-card">
            <div class="output-header">
              <h3>STAR 法则展开版</h3>
              <el-button size="small" @click="copyText(result.star)" link>
                <el-icon><CopyDocument /></el-icon> 复制
              </el-button>
            </div>
            <div class="output-text">{{ result.star }}</div>
          </div>

          <div class="output-card tech-card">
            <div class="output-header">
              <h3>面试讲解版</h3>
              <el-button size="small" @click="copyText(result.interview)" link>
                <el-icon><CopyDocument /></el-icon> 复制
              </el-button>
            </div>
            <div class="output-text">{{ result.interview }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, Document, CopyDocument } from '@element-plus/icons-vue'

const generating = ref(false)

const form = reactive({
  projectName: '',
  techStack: '',
  background: '',
  coreFeatures: '',
  responsibility: '',
  highlights: ''
})

const result = ref<{ simple: string; star: string; interview: string } | null>(null)

function generate() {
  if (!form.projectName || !form.techStack) {
    ElMessage.warning('请至少填写项目名称和技术栈')
    return
  }

  generating.value = true

  setTimeout(() => {
    const features = form.coreFeatures.split(/[,，]/).filter(f => f.trim())
    const highlights = form.highlights.split(/[,，]/).filter(h => h.trim())

    const simple = `${form.projectName} | ${form.techStack}\n采用前后端分离架构，${form.background}。核心功能：${features.join('、')}。${form.responsibility}。${highlights.length > 0 ? '项目亮点：' + highlights.join('、') + '。' : ''}`

    const star = `【Situation】${form.background}\n【Task】需要开发${form.projectName}，技术栈为${form.techStack}，核心功能包括${features.join('、')}\n【Action】${form.responsibility}\n【Result】${highlights.length > 0 ? '项目成果：' + highlights.join('；') : '提升了开发效率和代码质量'}`

    const interview = `${form.projectName}是一个${form.techStack}开发的项目，主要解决${form.background}。我在项目中负责${form.responsibility}。\n\n核心功能包括：${features.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n项目亮点：${highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}`

    result.value = { simple, star, interview }
    generating.value = false
  }, 500)
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function reset() {
  form.projectName = ''
  form.techStack = ''
  form.background = ''
  form.coreFeatures = ''
  form.responsibility = ''
  form.highlights = ''
  result.value = null
}
</script>

<style scoped lang="scss">
.generator-container {
  max-width: 1200px;
  margin: 0 auto;
}

.generator-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;

  .back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-muted);
  }

  .header-divider {
    width: 1px;
    height: 40px;
    background: var(--border-color);
  }

  h1 { font-size: 2rem; margin: 0; }
  .description { color: var(--text-muted); margin: 4px 0 0; }
}

.generator-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.input-section {
  padding: 24px;

  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 20px;
    font-size: 1.1rem;
  }
}

.form-group {
  margin-bottom: 16px;

  .form-label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.9rem;
    color: var(--text-muted);
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.output-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.output-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  color: var(--text-muted);

  p { margin-top: 16px; }
}

.output-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.output-card {
  padding: 20px;

  .output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h3 { margin: 0; font-size: 1rem; }
  }

  .output-text {
    font-size: 0.9rem;
    line-height: 1.7;
    white-space: pre-wrap;
    color: var(--text-color);
    background: rgba(255, 255, 255, 0.03);
    padding: 12px;
    border-radius: 6px;
  }
}
</style>