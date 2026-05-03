<template>
  <div class="projects-container">
    <div class="projects-header">
      <h1 class="gradient-text">项目作品集</h1>
      <p class="description">这里展示了我从测试视角出发，结合开发与 AI 技术的实践成果。</p>
    </div>

    <div class="projects-list">
      <div 
        v-for="project in projects" 
        :key="project.id" 
        class="tech-card project-detailed-card"
      >
        <div class="project-main">
          <div class="project-info">
            <div class="title-row">
              <h2 class="project-title">{{ project.name }}</h2>
              <div class="status-tag">{{ project.status }}</div>
            </div>
            <p class="project-intro">{{ project.description }}</p>
            
            <div class="detail-section">
              <div class="detail-item">
                <span class="label">项目状态:</span>
                <span class="content">{{ project.status }}</span>
              </div>
              <div class="detail-item">
                <span class="label">解决问题:</span>
                <span class="content">{{ project.problemSolved }}</span>
              </div>
              <div class="detail-item">
                <span class="label">核心功能:</span>
                <span class="content">{{ project.coreFeatures }}</span>
              </div>
              <div class="detail-item">
                <span class="label">我的职责:</span>
                <span class="content">{{ project.responsibility }}</span>
              </div>
            </div>

            <div class="learned-box">
              <h4 class="box-title">我学到了什么</h4>
              <p class="learned-content">{{ project.whatILearned }}</p>
            </div>

            <div class="highlights-box">
              <h4 class="box-title">项目亮点</h4>
              <ul class="highlights-list">
                <li v-for="(highlight, index) in project.highlights" :key="index">
                  {{ highlight }}
                </li>
              </ul>
            </div>

            <div class="tech-stack">
              <el-tag
                v-for="tech in project.techStack"
                :key="tech"
                size="small"
                effect="dark"
                class="tech-tag"
              >
                {{ tech }}
              </el-tag>
            </div>
          </div>

          <div class="project-visual">
            <div class="visual-placeholder" :class="project.id === 1 ? 'lab' : (project.id === 2 ? 'pilot' : 'job')">
              <span class="visual-icon">{{ project.id === 1 ? '▣' : (project.id === 2 ? '◈' : '✦') }}</span>
              <span class="visual-text">{{ project.name }}</span>
            </div>
            <div class="project-actions">
              <el-button type="primary" :disabled="!project.demoUrl" @click="openLink(project.demoUrl)">访问 Demo</el-button>
              <el-button :disabled="!project.githubUrl" @click="openLink(project.githubUrl)">GitHub</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const projects = ref([
  {
    id: 1,
    name: 'Rebol Lab',
    description: '我的核心求职作品集项目，一个集成了测试工具和作品展示的个人实验室。',
    problemSolved: '解决了学习成果零散、无法系统展示前端能力和测试思维的问题。',
    coreFeatures: '测试用例生成器、Bug 报告生成器、项目包装助手、响应式布局。',
    responsibility: '独立完成需求分析、UI 设计、前端架构及全量代码实现。',
    whatILearned: '深入掌握了 Vue 3 组合式 API、TypeScript 类型约束、SCSS 深色主题设计和组件化开发。',
    highlights: [
      '基于 Vue 3 + TypeScript + Vite 构建的完整单页应用',
      '独立开发 3 个本地辅助工具，展示了测试思维和前端工程化能力',
      '响应式布局，支持桌面端和移动端浏览'
    ],
    techStack: ['Vue 3', 'Vite', 'TypeScript', 'Element Plus', 'SCSS'],
    status: '持续迭代中',
    githubUrl: 'https://github.com/rebol/rebol-lab',
    demoUrl: ''
  },
  {
    id: 2,
    name: 'AI TestPilot（学习项目）',
    description: '学习 AI 辅助测试时设想的工具原型，当前处于技术调研阶段。',
    problemSolved: '探索如何将 LLM API 应用于测试用例生成的场景。',
    coreFeatures: '需求转用例、Bug 报告润色、接口异常流生成（构想中）。',
    responsibility: '技术调研和原型设计。',
    whatILearned: '了解了 Prompt Engineering 基础和 LLM API 集成方式。',
    highlights: [
      '学习使用 OpenAI API 和 Prompt 设计',
      '探索 AI 在测试场景的应用边界'
    ],
    techStack: ['React', 'Next.js', 'OpenAI SDK', 'Tailwind CSS'],
    status: '技术调研阶段',
    githubUrl: '',
    demoUrl: ''
  },
  {
    id: 3,
    name: 'Job Portfolio（学习项目）',
    description: '学习简历制作和作品集展示时的练习项目，核心功能已完成。',
    problemSolved: '学习如何系统化包装项目经历和面试表达。',
    coreFeatures: 'STAR 法则模板、技术栈展示、Q&A 库（学习用）。',
    responsibility: '前端开发和功能实现。',
    whatILearned: '理解了面试官关注点和项目包装思路。',
    highlights: [
      '实践了 Vue 3 + Pinia 状态管理',
      '学习 Puppeteer 做 PDF 导出（探索阶段）'
    ],
    techStack: ['Vue 3', 'Pinia', 'Node.js', 'Puppeteer'],
    status: '功能完成，待整理',
    githubUrl: '',
    demoUrl: ''
  }
])

const openLink = (url: string) => {
  if (url) window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.projects-container {
  max-width: 1200px;
  margin: 0 auto;
}

.projects-header {
  margin-bottom: 40px;
  h1 { font-size: 2.5rem; margin: 0 0 12px; }
  .description { color: var(--text-muted); font-size: 1.1rem; }
  
  @media (max-width: 768px) {
    h1 { font-size: 1.8rem; }
  }
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.project-detailed-card {
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateX(10px);
    border-color: var(--primary-color);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  }

  .project-main {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    
    @media (max-width: 992px) {
      flex-direction: column;
    }
  }
}

.project-info {
  flex: 1;
  
  .title-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
    .project-title { margin: 0; font-size: 1.8rem; }
    .status-tag {
      font-size: 0.75rem;
      padding: 4px 12px;
      background: rgba(88, 166, 255, 0.1);
      color: var(--primary-color);
      border-radius: 20px;
      border: 1px solid rgba(88, 166, 255, 0.3);
    }
  }
  
  .project-intro {
    font-size: 1.1rem;
    color: var(--text-color);
    margin-bottom: 24px;
    opacity: 0.9;
  }
}

.detail-section {
  margin-bottom: 24px;
  .detail-item {
    margin-bottom: 8px;
    font-size: 0.95rem;
    display: flex;
    gap: 12px;
    .label { color: var(--text-muted); white-space: nowrap; font-weight: 500; }
    .content { color: var(--text-color); }
  }
}

.learned-box {
  background: rgba(88, 166, 255, 0.03);
  border: 1px dashed rgba(88, 166, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;

  .box-title {
    font-size: 0.9rem;
    color: var(--accent-color);
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    &::before {
      content: '💡';
      font-size: 1rem;
    }
  }

  .learned-content {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 0;
    line-height: 1.6;
  }
}

.highlights-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 24px;
  border-left: 3px solid var(--primary-color);
  
  .box-title {
    margin: 0 0 12px;
    font-size: 1rem;
    color: var(--primary-color);
  }
  
  .highlights-list {
    margin: 0;
    padding-left: 18px;
    li {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 6px;
      &:last-child { margin-bottom: 0; }
    }
  }
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  .tech-tag {
    background: #161b22;
    border-color: #30363d;
    color: var(--text-color);
  }
}

.project-visual {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 992px) {
    width: 100%;
  }

  .visual-placeholder {
    height: 200px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    border: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;
    
    &.lab { background: linear-gradient(135deg, #1f6feb 0%, #0d1117 100%); }
    &.pilot { background: linear-gradient(135deg, #238636 0%, #0d1117 100%); }
    &.job { background: linear-gradient(135deg, #8957e5 0%, #0d1117 100%); }
    
    .visual-text {
      font-family: monospace;
      font-size: 1rem;
      opacity: 0.5;
    }

    .visual-icon {
      font-size: 4rem;
      line-height: 1;
      opacity: 0.6;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
    }
  }
  
  .project-actions {
    display: flex;
    gap: 12px;
    .el-button { flex: 1; }
  }
}
</style>
