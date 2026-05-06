<template>
  <div class="generator-container">
    <div class="generator-header">
      <el-button link class="back-btn" @click="$router.push('/tools')">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回工具集</span>
      </el-button>
      <div class="header-divider"></div>
      <div>
        <h1 class="gradient-text">Git 提交信息生成器</h1>
        <p class="description">生成规范化的 Conventional Commits 格式提交信息</p>
      </div>
    </div>

    <div class="generator-layout">
      <div class="input-section tech-card">
        <h3><el-icon><Edit /></el-icon> 输入提交信息</h3>

        <div class="form-group">
          <label class="form-label">提交类型</label>
          <div class="type-grid">
            <div
              v-for="t in commitTypes"
              :key="t.value"
              class="type-item"
              :class="{ active: form.type === t.value }"
              @click="form.type = t.value"
            >
              <span class="type-icon">{{ t.icon }}</span>
              <span class="type-name">{{ t.label }}</span>
              <span class="type-desc">{{ t.description }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">修改范围（可选）</label>
          <el-input v-model="form.scope" placeholder="例如：auth, user, api" />
        </div>

        <div class="form-group">
          <label class="form-label">提交描述（简短）</label>
          <el-input v-model="form.message" placeholder="例如：添加用户登录功能" />
        </div>

        <div class="form-group">
          <label class="form-label">详细说明（可选）</label>
          <el-input v-model="form.body" type="textarea" :rows="3" placeholder="补充本次提交的详细说明" />
        </div>

        <div class="form-group">
          <label class="form-label">关联 Issue（可选）</label>
          <el-input v-model="form.breaking" placeholder="例如：Closes #123, Fixes #456" />
        </div>

        <div class="form-actions">
          <el-button type="primary" @click="generate" :disabled="!form.type || !form.message">
            生成提交信息
          </el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>

      <div class="output-section">
        <div v-if="!result" class="output-placeholder tech-card">
          <el-icon :size="48"><Finished /></el-icon>
          <p>选择类型并输入描述后，点击"生成提交信息"</p>
        </div>

        <div v-else class="output-card tech-card">
          <div class="output-header">
            <h3>Conventional Commits 格式</h3>
            <el-button size="small" @click="copyText(result)" link>
              <el-icon><CopyDocument /></el-icon> 复制
            </el-button>
          </div>
          <div class="output-text">{{ result }}</div>
        </div>

        <div v-if="result" class="tips-card tech-card">
          <h4><el-icon><Warning /></el-icon> 使用提示</h4>
          <ul>
            <li>type 必填：feat、fix、docs、style、refactor、test、chore</li>
            <li>scope 可选：表示本次提交影响的功能模块</li>
            <li>description 必填：不超过 50 字符</li>
            <li>body 可选：详细说明，可分多行</li>
            <li>breaking change：描述前加 <code>!</code>，或 footer 写 <code>BREAKING CHANGE:</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, Finished, CopyDocument, Warning } from '@element-plus/icons-vue'

const form = reactive({
  type: '',
  scope: '',
  message: '',
  body: '',
  breaking: ''
})

const result = ref<string | null>(null)

const commitTypes = [
  { value: 'feat', label: 'feat', icon: '✨', description: '新功能' },
  { value: 'fix', label: 'fix', icon: '🐛', description: 'Bug 修复' },
  { value: 'docs', label: 'docs', icon: '📝', description: '文档变更' },
  { value: 'style', label: 'style', icon: '💄', description: '代码格式' },
  { value: 'refactor', label: 'refactor', icon: '♻️', description: '重构' },
  { value: 'test', label: 'test', icon: '🧪', description: '测试相关' },
  { value: 'chore', label: 'chore', icon: '🔧', description: '构建/工具' }
]

function generate() {
  if (!form.type || !form.message) {
    ElMessage.warning('请选择类型并输入描述')
    return
  }

  let commit = form.type
  if (form.scope) {
    commit += `(${form.scope})`
  }
  if (form.breaking) {
    commit += '!'
  }
  commit += `: ${form.message}`

  if (form.body) {
    commit += '\n\n' + form.body
  }

  if (form.breaking) {
    commit += '\n\n' + form.breaking
  }

  result.value = commit
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function reset() {
  form.type = ''
  form.scope = ''
  form.message = ''
  form.body = ''
  form.breaking = ''
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

.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary-color);
  }

  &.active {
    background: rgba(88, 166, 255, 0.1);
    border-color: var(--primary-color);
  }

  .type-icon { font-size: 1.5rem; }
  .type-name { font-family: monospace; font-weight: bold; margin: 4px 0; }
  .type-desc { font-size: 0.75rem; color: var(--text-muted); }
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
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    white-space: pre-wrap;
    color: var(--text-color);
    background: rgba(88, 166, 255, 0.05);
    padding: 12px;
    border-radius: 6px;
  }
}

.tips-card {
  padding: 16px;

  h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 12px;
    font-size: 0.95rem;
    color: var(--primary-color);
  }

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 6px;
      line-height: 1.5;

      code {
        background: rgba(255, 255, 255, 0.1);
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 0.8rem;
      }
    }
  }
}
</style>