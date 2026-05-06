<template>
  <div class="generator-container">
    <div class="generator-header">
      <el-button link class="back-btn" @click="$router.push('/tools')">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回工具集</span>
      </el-button>
      <div class="header-divider"></div>
      <div>
        <h1 class="gradient-text">面试问题生成器</h1>
        <p class="description">根据岗位和项目生成可能的面试考点</p>
      </div>
    </div>

    <div class="generator-layout">
      <div class="input-section tech-card">
        <h3><el-icon><ChatDotRound /></el-icon> 输入信息</h3>

        <div class="form-group">
          <label class="form-label">目标岗位</label>
          <el-input v-model="form.position" placeholder="例如：前端开发工程师" />
        </div>

        <div class="form-group">
          <label class="form-label">技术栈（用逗号分隔）</label>
          <el-input v-model="form.techStack" placeholder="例如：Vue 3, TypeScript, 前端工程化" />
        </div>

        <div class="form-group">
          <label class="form-label">项目经验（用逗号分隔）</label>
          <el-input v-model="form.projects" type="textarea" :rows="2" placeholder="例如：Rebol Lab, 个人博客" />
        </div>

        <div class="form-group">
          <label class="form-label">关注方向（可选）</label>
          <el-select v-model="form.focusAreas" multiple placeholder="选择重点方向" class="focus-select">
            <el-option label="前端框架" value="framework" />
            <el-option label="类型系统" value="typescript" />
            <el-option label="工程化" value="tooling" />
            <el-option label="性能优化" value="performance" />
            <el-option label="测试" value="testing" />
            <el-option label="项目实战" value="project" />
          </el-select>
        </div>

        <div class="form-actions">
          <el-button type="primary" @click="generate" :loading="generating">
            生成问题
          </el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>

      <div class="output-section">
        <div v-if="!result" class="output-placeholder tech-card">
          <el-icon :size="48"><Collection /></el-icon>
          <p>填写信息后，点击"生成问题"获取面试题目</p>
        </div>

        <div v-else class="output-content">
          <div v-for="(section, idx) in result" :key="idx" class="output-card tech-card">
            <div class="output-header">
              <h3>{{ section.title }}</h3>
              <el-button size="small" @click="copyText(section.content)" link>
                <el-icon><CopyDocument /></el-icon> 复制
              </el-button>
            </div>
            <div class="output-text">{{ section.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ChatDotRound, Collection, CopyDocument } from '@element-plus/icons-vue'

const generating = ref(false)

const form = reactive({
  position: '',
  techStack: '',
  projects: '',
  focusAreas: [] as string[]
})

const result = ref<{ title: string; content: string }[] | null>(null)

function generate() {
  if (!form.position || !form.techStack) {
    ElMessage.warning('请至少填写岗位和技术栈')
    return
  }

  generating.value = true

  setTimeout(() => {
    const techs = form.techStack.split(/[,，]/).filter(t => t.trim())
    const projects = form.projects.split(/[,，]/).filter(p => p.trim())

    const sections: { title: string; content: string }[] = []

    sections.push({
      title: '技术基础问题',
      content: [
        '自我介绍：1-2 分钟介绍你的技术背景和项目经验',
        `${techs[0] || 'Vue'} 的核心理念是什么？`,
        `${techs[0] || 'Vue'} 和其他框架（如 React）相比有什么优缺点？`,
        '写代码时遇到过最难的问题是什么？怎么解决的？'
      ].join('\n')
    })

    if (techs.some(t => t.includes('Vue') || t.includes('React'))) {
      sections.push({
        title: '前端框架问题',
        content: [
          '组件通信有哪些方式？适用场景？',
          '如何理解虚拟 DOM？',
          'diff 算法的原理是什么？',
          '如何做性能优化？'
        ].join('\n')
      })
    }

    if (techs.some(t => t.includes('TypeScript'))) {
      sections.push({
        title: '类型系统问题',
        content: [
          'TypeScript 如何进行类型守卫？',
          '什么是泛型？什么时候使用泛型？',
          'any、unknown、never 三者的区别？',
          'interface 和 type 有什么区别？',
          '如何定义一个函数类型？',
          '类型断言有哪些方式？'
        ].join('\n')
      })
    }

    if (projects.length > 0) {
      sections.push({
        title: '项目相关问题',
        content: [
          `介绍一下 ${projects[0]} 这个项目？`,
          '你在项目中的主要职责是什么？',
          '遇到过哪些技术难点？如何解决的？',
          '项目的技术选型是怎么确定的？',
          '如果重新做，会做哪些改进？'
        ].join('\n')
      })
    }

    sections.push({
      title: '测试思维问题',
      content: [
        '如何设计测试用例？',
        '白盒测试和黑盒测试的区别？',
        '如何定位一个 Bug？',
        '什么是边界值测试？有什么例子？'
      ].join('\n')
    })

    sections.push({
      title: 'HR 面常见问题',
      content: [
        '为什么想从事前端开发？',
        '你觉得自己最大的优势是什么？',
        '最有成就感的一件事是什么？',
        '短期和长期的职业规划是什么？',
        '你关注哪些技术趋势？'
      ].join('\n')
    })

    result.value = sections
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
  form.position = ''
  form.techStack = ''
  form.projects = ''
  form.focusAreas = []
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

  .focus-select {
    width: 100%;
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
  }
}
</style>