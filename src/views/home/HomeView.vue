<template>
  <div class="home-container">
    <!-- Hero Section: Laboratory Identity -->
    <section class="hero-section">
      <div class="hero-bg-pattern"></div>
      <div class="hero-content">
        <div class="identity-badge">
          <span class="pulse-dot"></span>
          SOFTWARE ENGINEER PORTFOLIO
        </div>
        <h1 class="gradient-text main-title">Rebol Lab</h1>
        <p class="subtitle">软件工程应届生 | 前端开发 & 测试工具方向</p>
        
        <div class="intro-text">
          我是一名软件工程应届生，专注于 <span class="highlight">前端开发</span> 与 <span class="highlight">测试工具</span> 方向。
          通过 Rebol Lab 这个项目，我将 Vue 3 + TypeScript 技术栈与测试思维结合，
          独立构建了测试用例生成、Bug 报告生成等实用工具，展示了从需求分析到工具落地的完整能力。
        </div>

        <div class="identity-tags">
          <span class="tag-item"># Vue 3 + TypeScript</span>
          <span class="tag-item"># 测试工具开发</span>
          <span class="tag-item"># 前端工程化</span>
          <span class="tag-item"># 2026 应届求职</span>
        </div>
      </div>
    </section>

    <!-- Workbench Grid: Core Entry Points -->
    <section class="workbench-section">
      <div class="section-header">
        <el-icon><Monitor /></el-icon>
        <span>核心模块 / Modules</span>
      </div>
      
      <div class="workbench-grid">
        <div class="work-card" @click="$router.push('/tools')">
          <div class="card-glow"></div>
          <div class="card-icon testing"><el-icon><Odometer /></el-icon></div>
          <div class="card-info">
            <h3>测试工具集</h3>
            <p>用例生成、Bug 报告、项目包装</p>
            <span class="status-label">3 TOOLS</span>
          </div>
        </div>

        <div class="work-card" @click="$router.push('/projects')">
          <div class="card-glow"></div>
          <div class="card-icon projects"><el-icon><Collection /></el-icon></div>
          <div class="card-info">
            <h3>项目作品</h3>
            <p>核心项目展示与技术沉淀</p>
            <span class="status-label">PORTFOLIO</span>
          </div>
        </div>

        <div class="work-card" @click="$router.push('/roadmap')">
          <div class="card-glow"></div>
          <div class="card-icon roadmap"><el-icon><Guide /></el-icon></div>
          <div class="card-info">
            <h3>技术栈</h3>
            <p>Vue 3 / TypeScript / 测试思维</p>
            <span class="status-label">SKILLS</span>
          </div>
        </div>

        <div class="work-card highlight-card" @click="$router.push('/about')">
          <div class="card-glow"></div>
          <div class="card-icon career"><el-icon><Briefcase /></el-icon></div>
          <div class="card-info">
            <h3>关于我</h3>
            <p>软件工程应届生 · 求职中</p>
            <span class="status-label">HIRING</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Status & Activity: Console Log Style -->
    <div class="status-grid">
      <div class="console-card">
        <div class="card-header">
          <el-icon><Timer /></el-icon>
          <span>当前任务队列 / Current Tasks</span>
        </div>
        <div class="console-body">
          <div class="log-item done">
            <span class="timestamp">[DONE]</span>
            <span class="msg">Vue 3 + TypeScript 单页应用开发</span>
          </div>
          <div class="log-item done">
            <span class="timestamp">[DONE]</span>
            <span class="msg">测试用例生成器 / Bug 报告生成器</span>
          </div>
          <div class="log-item process">
            <span class="timestamp">[WIP]</span>
            <span class="msg">接入 AI API 提升工具智能化</span>
          </div>
          <div class="log-item pending">
            <span class="timestamp">[NEXT]</span>
            <span class="msg">前端开发 / 软件测试岗位投递</span>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="card-header">
          <el-icon><DataLine /></el-icon>
          <span>实验数据统计 / Lab Stats</span>
        </div>
        <div class="stats-content">
          <div class="stat-box">
            <div class="stat-val">03</div>
            <div class="stat-label">TOOL MODULES</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">08</div>
            <div class="stat-label">PAGES</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">3K+</div>
            <div class="stat-label">LINES OF CODE</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Odometer, Collection, Guide, Briefcase, 
  Timer, DataLine, Monitor 
} from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

// Hero Section
.hero-section {
  position: relative;
  padding: 80px 40px;
  border-radius: 20px;
  background: rgba(22, 27, 34, 0.4);
  border: 1px solid var(--border-color);
  overflow: hidden;
  text-align: center;

  .hero-bg-pattern {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(circle at 2px 2px, rgba(88, 166, 255, 0.05) 1px, transparent 0);
    background-size: 24px 24px;
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 1;
  }

  .identity-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: rgba(88, 166, 255, 0.1);
    border: 1px solid rgba(88, 166, 255, 0.2);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--primary-color);
    margin-bottom: 24px;

    .pulse-dot {
      width: 6px;
      height: 6px;
      background: var(--primary-color);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--primary-color);
      animation: pulse 2s infinite;
    }
  }

  .main-title {
    font-size: 3rem;
    margin: 0;
    line-height: 1;
    letter-spacing: -1px;
  }

  @media (max-width: 768px) {
    .main-title {
      font-size: 2.2rem;
      letter-spacing: 0;
    }
  }

  .subtitle {
    font-size: 1.5rem;
    color: var(--text-color);
    margin: 16px 0 32px;
    font-weight: 500;
  }

  .intro-text {
    max-width: 800px;
    margin: 0 auto 40px;
    font-size: 1.15rem;
    line-height: 1.8;
    color: var(--text-muted);

    .highlight {
      color: var(--text-color);
      font-weight: 500;
      border-bottom: 1px solid var(--primary-color);
    }
  }

  .identity-tags {
    display: flex;
    justify-content: center;
    gap: 20px;
    .tag-item {
      font-size: 0.9rem;
      color: var(--primary-color);
      opacity: 0.8;
      font-weight: 500;
    }
  }
}

// Workbench Grid
.workbench-section {
  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-muted);
    font-family: monospace;
  }
}

.workbench-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.work-card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 30px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-5px);
    .card-glow { opacity: 1; }
    .card-icon { transform: scale(1.1); }
  }

  &.highlight-card {
    background: linear-gradient(135deg, rgba(88, 166, 255, 0.05) 0%, rgba(22, 27, 34, 1) 100%);
    border-color: rgba(88, 166, 255, 0.3);
  }

  .card-glow {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(88, 166, 255, 0.1), transparent 40%);
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }

  .card-icon {
    font-size: 2.5rem;
    margin-bottom: 20px;
    transition: transform 0.3s;
    
    &.testing { color: #f85149; }
    &.projects { color: #d29922; }
    &.roadmap { color: #3fb950; }
    &.career { color: #58a6ff; }
  }

  .card-info {
    h3 { margin: 0 0 8px; font-size: 1.2rem; }
    p { margin: 0 0 16px; font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; }
    .status-label {
      font-family: monospace;
      font-size: 0.7rem;
      padding: 2px 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      color: var(--text-muted);
    }
  }
}

// Status Grid
.status-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
  @media (max-width: 850px) { grid-template-columns: 1fr; }
}

.console-card, .stats-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;

  .card-header {
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: monospace;
    color: var(--text-muted);
  }
}

.console-body {
  padding: 20px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  
  .log-item {
    margin-bottom: 12px;
    display: flex;
    gap: 16px;
    
    .timestamp { color: var(--text-muted); }
    
    &.done { .msg { color: var(--accent-color); } }
    &.process { .msg { color: var(--primary-color); } }
    &.pending { .msg { color: var(--text-muted); opacity: 0.6; } }
  }
}

.stats-content {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  text-align: center;

  .stat-box {
    .stat-val { font-size: 2rem; font-weight: bold; font-family: monospace; }
    .stat-label { font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; }
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
