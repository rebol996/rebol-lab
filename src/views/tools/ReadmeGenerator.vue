<template>
  <div class="generator-container">
    <div class="generator-header">
      <el-button link class="back-btn" @click="$router.push('/tools')">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回工具集</span>
      </el-button>
      <div class="header-divider"></div>
      <div>
        <h1 class="gradient-text">README 生成器</h1>
        <p class="description">快速生成规范的开源项目 README</p>
      </div>
    </div>

    <div class="generator-layout">
      <div class="input-section tech-card">
        <h3><el-icon><Document /></el-icon> 输入项目信息</h3>

        <div class="form-group">
          <label class="form-label">项目名称</label>
          <el-input v-model="form.projectName" placeholder="例如：my-awesome-project" />
        </div>

        <div class="form-group">
          <label class="form-label">项目简介（一句话）</label>
          <el-input v-model="form.description" placeholder="例如：基于 Vue3 的待办事项管理应用" />
        </div>

        <div class="form-group">
          <label class="form-label">技术栈（用逗号分隔）</label>
          <el-input v-model="form.techStack" placeholder="例如：Vue 3, TypeScript, Vite" />
        </div>

        <div class="form-group">
          <label class="form-label">功能模块（用逗号分隔）</label>
          <el-input v-model="form.features" type="textarea" :rows="2" placeholder="例如：用户认证、任务管理、数据统计" />
        </div>

        <div class="form-group">
          <label class="form-label">运行方式</label>
          <el-input v-model="form.runCommand" placeholder="例如：npm install && npm run dev" />
        </div>

        <div class="form-group">
          <label class="form-label">部署方式（可选）</label>
          <el-input v-model="form.deployCommand" placeholder="例如：npm run build 部署到 Vercel" />
        </div>

        <div class="form-actions">
          <el-button type="primary" @click="generate" :loading="generating">
            生成 README
          </el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>

      <div class="output-section">
        <div v-if="!result" class="output-placeholder tech-card">
          <el-icon :size="48"><Document /></el-icon>
          <p>填写项目信息后，点击"生成 README"获取内容</p>
        </div>

        <div v-else class="output-card tech-card">
          <div class="output-header">
            <h3>README.md 内容</h3>
            <el-button size="small" @click="copyText(result)" link>
              <el-icon><CopyDocument /></el-icon> 复制全部
            </el-button>
          </div>
          <div class="output-text">{{ result }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Document, CopyDocument } from '@element-plus/icons-vue'

const generating = ref(false)

const form = reactive({
  projectName: '',
  description: '',
  techStack: '',
  features: '',
  runCommand: 'npm install && npm run dev',
  deployCommand: ''
})

const result = ref<string | null>(null)

function generate() {
  if (!form.projectName || !form.description || !form.techStack) {
    ElMessage.warning('请至少填写项目名称、简介和技术栈')
    return
  }

  generating.value = true

  setTimeout(() => {
    const techs = form.techStack.split(/[,，]/).filter(t => t.trim())
    const features = form.features.split(/[,，]/).filter(f => f.trim())

    const readme = `# ${form.projectName}

> ${form.description}

## 功能特性

${features.length > 0 ? features.map((f, i) => `${i + 1}. ${f}`).join('\n') : '- 功能开发中'}

## 技术栈

${techs.map(t => `- ${t.trim()}`).join('\n')}

## 快速开始

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 启动开发服务器

\`\`\`bash
${form.runCommand}
\`\`\`

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

${form.deployCommand ? `### 部署

\`\`\`bash
${form.deployCommand}
\`\`\`

` : ''}## 项目结构

\`\`\`
${form.projectName}/
├── src/
│   ├── components/    # 组件
│   ├── views/        # 页面
│   ├── stores/       # 状态管理
│   └── App.vue       # 根组件
├── public/           # 静态资源
└── package.json      # 依赖配置
\`\`\`

## License

MIT
`

    result.value = readme
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
  form.description = ''
  form.techStack = ''
  form.features = ''
  form.runCommand = 'npm install && npm run dev'
  form.deployCommand = ''
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
  max-height: 600px;
  overflow-y: auto;

  .output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    position: sticky;
    top: 0;
    background: var(--card-bg);
    padding-bottom: 12px;

    h3 { margin: 0; font-size: 1rem; }
  }

  .output-text {
    font-size: 0.85rem;
    line-height: 1.6;
    white-space: pre-wrap;
    color: var(--text-color);
    font-family: 'Monaco', 'Menlo', monospace;
  }
}
</style>