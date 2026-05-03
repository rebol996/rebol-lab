<template>
  <div class="about-container">
    <div class="tech-card about-main-card">
      <div class="about-hero">
        <div class="hero-content">
          <h1 class="gradient-text">关于我</h1>
          <p class="tagline">软件工程应届生 | 前端开发 & 测试工具方向</p>
          <div class="hero-badges">
            <span class="badge">2026 届应届生</span>
            <span class="badge">前端开发</span>
            <span class="badge">软件测试</span>
            <span class="badge">求职中</span>
          </div>
        </div>
      </div>
      
      <div class="about-grid">
        <div class="about-left">
          <section class="about-section">
            <h3><el-icon><User /></el-icon> 个人简介</h3>
            <p>
              我是一名 2026 届软件工程应届生，专注于前端开发与测试工具方向。
              我相信优秀的工程师不仅要能写出好代码，更要具备测试思维 —— 从用户视角发现需求、从工程视角保障质量。
            </p>
            <p>
              通过 Rebol Lab 这个项目，我将 Vue 3 + TypeScript 技术栈与测试思维结合，
              独立构建了测试用例生成、Bug 报告生成等实用工具，展示了从需求分析到工具落地的完整能力。
            </p>
          </section>

          <section class="about-section">
            <h3><el-icon><Monitor /></el-icon> 技术方向</h3>
            <div class="direction-cards">
              <div class="direction-card">
                <h4>前端开发</h4>
                <p>Vue 3 + TypeScript + Vite 技术栈，注重组件化、类型安全和工程化实践</p>
              </div>
              <div class="direction-card">
                <h4>测试思维</h4>
                <p>将测试方法论融入工具设计，覆盖功能测试、边界值、异常流和安全测试</p>
              </div>
              <div class="direction-card">
                <h4>工具开发</h4>
                <p>构建实用的开发辅助工具，提升团队效率，解决实际工作痛点</p>
              </div>
            </div>
          </section>

          <section class="about-section">
            <h3><el-icon><Aim /></el-icon> 求职意向</h3>
            <p>
              目标岗位：前端开发工程师 / 软件测试工程师 / 测试开发工程师
            </p>
            <p>
              我希望加入一个重视工程质量和用户体验的团队，将我的前端技能和测试思维转化为实际价值。
            </p>
          </section>
        </div>

        <div class="about-right">
          <div class="tech-stack-box tech-card">
            <h4>技术栈</h4>
            <div class="tech-category">
              <span class="category-label">前端核心</span>
              <div class="tech-tags">
                <el-tag v-for="t in frontendTechs" :key="t" effect="plain" type="primary">{{ t }}</el-tag>
              </div>
            </div>
            <div class="tech-category">
              <span class="category-label">测试工具</span>
              <div class="tech-tags">
                <el-tag v-for="t in testingTechs" :key="t" effect="plain" type="success">{{ t }}</el-tag>
              </div>
            </div>
            <div class="tech-category">
              <span class="category-label">工程化</span>
              <div class="tech-tags">
                <el-tag v-for="t in engineeringTechs" :key="t" effect="plain" type="warning">{{ t }}</el-tag>
              </div>
            </div>
          </div>

          <div class="contact-box tech-card">
            <h4>联系与连接</h4>
            <div class="contact-links">
              <a href="#" class="contact-link">
                <el-icon><Link /></el-icon> GitHub
              </a>
              <a href="#" class="contact-link">
                <el-icon><Message /></el-icon> Email
              </a>
              <a href="#" class="contact-link">
                <el-icon><ChatDotRound /></el-icon> 微信
              </a>
            </div>
          </div>

          <div class="lab-info tech-card">
            <h4>实验室状态</h4>
            <div class="info-row">
              <span class="label">当前版本</span>
              <span class="value">v1.2.0-beta</span>
            </div>
            <div class="info-row">
              <span class="label">最后更新</span>
              <span class="value">2026-04-29</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Monitor, Aim, Link, Message, ChatDotRound } from '@element-plus/icons-vue'

const frontendTechs = ['Vue 3', 'TypeScript', 'Vite', 'Element Plus', 'SCSS', 'Pinia']
const testingTechs = ['Postman', 'Playwright', '测试用例设计', 'Bug 报告']
const engineeringTechs = ['Git', 'npm', 'ESLint', 'Prettier']
</script>

<style scoped lang="scss">
.about-container {
  max-width: 1000px;
  margin: 0 auto;
}

.about-main-card {
  padding: 0;
  overflow: hidden;
}

.about-hero {
  background: linear-gradient(135deg, rgba(88, 166, 255, 0.1) 0%, rgba(13, 17, 23, 0.9) 100%);
  padding: 60px 40px;
  border-bottom: 1px solid var(--border-color);
  text-align: center;
  
  .hero-content {
    h1 { font-size: 3rem; margin: 0 0 16px; }
    .tagline { color: var(--primary-color); font-size: 1.2rem; font-weight: 500; margin-bottom: 20px; }
    
    .hero-badges {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      
      .badge {
        padding: 6px 16px;
        background: rgba(88, 166, 255, 0.1);
        border: 1px solid rgba(88, 166, 255, 0.3);
        border-radius: 20px;
        font-size: 0.85rem;
        color: var(--primary-color);
        font-weight: 500;
      }
    }
  }
}

.about-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
  padding: 40px;
  
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
}

.about-section {
  margin-bottom: 40px;
  h3 {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.3rem;
    color: var(--text-color);
    margin: 0 0 20px;
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-color);
    }
  }
  p {
    line-height: 1.8;
    color: var(--text-color);
    font-size: 1.05rem;
    opacity: 0.9;
    margin-bottom: 16px;
  }
  
  .direction-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .direction-card {
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      border-left: 3px solid var(--primary-color);
      
      h4 {
        margin: 0 0 8px;
        font-size: 1rem;
        color: var(--text-color);
      }
      
      p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.6;
      }
    }
  }
}

.about-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  h4 {
    margin: 0 0 16px;
    font-size: 0.9rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.tech-stack-box {
  padding: 24px;
  
  .tech-category {
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .category-label {
      display: block;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

.contact-box {
  padding: 24px;
  .contact-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .contact-link {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-color);
      text-decoration: none;
      font-size: 0.95rem;
      padding: 8px 12px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.03);
      transition: all 0.2s;
      &:hover {
        background: rgba(88, 166, 255, 0.1);
        color: var(--primary-color);
      }
    }
  }
}

.lab-info {
  padding: 24px;
  .info-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    margin-bottom: 8px;
    &:last-child { margin-bottom: 0; }
    .label { color: var(--text-muted); }
    .value { color: var(--text-color); font-family: monospace; }
  }
}
</style>
