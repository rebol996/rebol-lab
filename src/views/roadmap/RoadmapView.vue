<template>
  <div class="roadmap-container">
    <div class="roadmap-header">
      <h1 class="gradient-text">成长地图</h1>
      <p class="description">从零开始，构建“测试 + 开发 + AI”复合型技术栈的进阶历程。</p>
    </div>

    <div class="growth-map">
      <div 
        v-for="(phase, index) in phases" 
        :key="index" 
        class="phase-card"
        :class="phase.status"
      >
        <div class="phase-sidebar">
          <div class="phase-number">{{ index + 1 }}</div>
          <div class="phase-line" v-if="index < phases.length - 1"></div>
        </div>
        
        <div class="phase-content tech-card">
          <div class="phase-header-row">
            <h3 class="phase-title">{{ phase.title }}</h3>
            <div class="phase-status-badge">
              <el-icon v-if="phase.status === 'completed'"><CircleCheck /></el-icon>
              <el-icon v-else-if="phase.status === 'active'"><Loading class="is-loading" /></el-icon>
              {{ statusText[phase.status] }}
            </div>
          </div>

          <div class="phase-body">
            <div class="skills-section">
              <h4 class="sub-title">核心技能点</h4>
              <div class="skills-grid">
                <div v-for="skill in phase.skills" :key="skill" class="skill-tag">
                  {{ skill }}
                </div>
              </div>
            </div>

            <div class="project-milestone" v-if="phase.project">
              <h4 class="sub-title">阶段性练习/项目</h4>
              <div class="milestone-box">
                <el-icon><Flag /></el-icon>
                <span>{{ phase.project }}</span>
              </div>
            </div>
          </div>

          <div class="phase-footer" v-if="phase.status === 'active'">
            <div class="progress-info">
              <span>当前进度</span>
              <el-progress :percentage="phase.progress" :stroke-width="8" striped striped-flow />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck, Loading, Flag } from '@element-plus/icons-vue'

const statusText: Record<string, string> = {
  completed: '已掌握',
  active: '学习中',
  pending: '下一步目标'
}

const phases = [
  {
    title: 'Web 基础',
    status: 'completed',
    skills: ['HTML5 语义化', 'CSS3 Flex/Grid 布局', 'JavaScript ES6+', '浏览器工作原理'],
    project: '响应式个人简历静态页',
    progress: 100
  },
  {
    title: 'Vue 前端开发',
    status: 'completed',
    skills: ['Vue 3 Composition API', 'Vue Router 路由管理', 'Pinia 状态管理', 'Vite 构建配置'],
    project: 'Rebol Lab 1.0 (本项目)',
    progress: 100
  },
  {
    title: '软件测试基础',
    status: 'active',
    skills: ['测试用例设计方法', '缺陷生命周期管理', '测试文档编写', '黑盒测试实践'],
    project: '电商平台测试计划书撰写',
    progress: 75
  },
  {
    title: '接口测试与 Postman',
    status: 'active',
    skills: ['HTTP/HTTPS 协议深度理解', 'Postman 断言与脚本', 'Mock Server', 'Newman 命令行执行'],
    project: '天气预报 API 自动化测试脚本集',
    progress: 40
  },
  {
    title: '自动化测试',
    status: 'pending',
    skills: ['Playwright 自动化框架', 'Page Object Model 设计模式', 'Pytest 测试框架', 'UI 自动化最佳实践'],
    project: '企业级后台管理系统 UI 自动化测试',
    progress: 0
  },
  {
    title: 'AI 工具开发',
    status: 'pending',
    skills: ['Prompt Engineering', 'LLM API 集成', 'RAG 检索增强生成', 'AI 驱动的测试用例自动生成'],
    project: 'AI TestPilot 原型开发',
    progress: 0
  },
  {
    title: '求职项目整理',
    status: 'pending',
    skills: ['简历项目包装 (STAR)', '面试常见问题库', '个人作品集精修', '模拟面试复盘'],
    project: 'Job Portfolio 生成器',
    progress: 0
  }
]
</script>

<style scoped lang="scss">
.roadmap-container {
  max-width: 900px;
  margin: 0 auto;
}

.roadmap-header {
  margin-bottom: 48px;
  h1 { font-size: 2.5rem; margin: 0 0 12px; }
  .description { color: var(--text-muted); font-size: 1.1rem; }
  
  @media (max-width: 768px) {
    h1 { font-size: 1.8rem; }
    margin-bottom: 32px;
  }
}

.growth-map {
  display: flex;
  flex-direction: column;
}

.phase-card {
  display: flex;
  gap: 24px;
  margin-bottom: 0;
  
  &.completed {
    .phase-number { background: var(--accent-color); color: var(--bg-color); border-color: var(--accent-color); }
    .phase-line { background: var(--accent-color); }
    .phase-status-badge { color: var(--accent-color); background: rgba(126, 231, 135, 0.1); }
  }
  
  &.active {
    .phase-number { background: var(--primary-color); border-color: var(--primary-color); }
    .phase-line { background: linear-gradient(to bottom, var(--primary-color), var(--border-color)); }
    .phase-status-badge { color: var(--primary-color); background: rgba(88, 166, 255, 0.1); }
  }
  
  &.pending {
    opacity: 0.6;
    .phase-status-badge { color: var(--text-muted); background: rgba(255, 255, 255, 0.05); }
  }
}

.phase-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  
  .phase-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-family: monospace;
    z-index: 2;
    background: var(--bg-color);
  }
  
  .phase-line {
    flex: 1;
    width: 2px;
    background: var(--border-color);
    margin: 4px 0;
  }
}

.phase-content {
  flex: 1;
  margin-bottom: 40px;
  padding: 24px;
  
  .phase-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .phase-title { margin: 0; font-size: 1.4rem; color: var(--text-color); }
    .phase-status-badge {
      font-size: 0.8rem;
      padding: 4px 12px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
}

.sub-title {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  
  .skill-tag {
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.85rem;
    color: var(--text-color);
  }
}

.milestone-box {
  background: rgba(88, 166, 255, 0.05);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--primary-color);
  font-size: 0.95rem;
  border: 1px dashed rgba(88, 166, 255, 0.3);
}

.phase-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  
  .progress-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    span { font-size: 0.8rem; color: var(--text-muted); }
  }
}
</style>
