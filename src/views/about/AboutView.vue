<template>
  <div class="about-container">
    <div class="tech-card about-main-card">
      <div class="about-hero">
        <div class="hero-content">
          <h1 class="gradient-text">关于 Rebol & Lab</h1>
          <p class="tagline">从软件测试出发，向全栈与 AI 演进的学习实践者</p>
        </div>
      </div>
      
      <div class="about-grid">
        <div class="about-left">
          <section class="about-section">
            <h3><el-icon><User /></el-icon> 个人定位</h3>
            <p>
              我是一个正在从软件测试方向出发，逐步学习前端开发、接口测试、自动化测试和 AI 工具开发的学习者。
              我不满足于仅仅发现 Bug，更希望通过技术手段提升测试效率，甚至构建能解决实际问题的工具。
            </p>
          </section>

          <section class="about-section">
            <h3><el-icon><Monitor /></el-icon> 为什么建立 Rebol Lab？</h3>
            <p>
              Rebol Lab 是我的长期项目，它既是个人主页，也是工具集、学习记录、项目展示和求职作品集。
              我希望通过这个项目，把零散的学习内容变成可以展示、可以使用、可以持续迭代的真实作品。
              在这里，每一行代码都是成长的脚印。
            </p>
          </section>

          <section class="about-section">
            <h3><el-icon><Aim /></el-icon> 未来愿景</h3>
            <p>
              构建一个真正“懂测试”的 AI 助手，将繁琐的回归测试、用例编写和报告整理自动化。
              同时，通过这个实验室，连接更多志同道合的开发者与测试工程师。
            </p>
          </section>
        </div>

        <div class="about-right">
          <div class="tech-stack-box tech-card">
            <h4>当前技术栈</h4>
            <div class="tech-tags">
              <el-tag v-for="t in techs" :key="t" effect="plain">{{ t }}</el-tag>
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

const techs = [
  'Vue 3', 'TypeScript', 'Vite', 'Element Plus', 
  'Postman', 'Playwright', 'Python', 'LLM Prompt'
]
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
    .tagline { color: var(--primary-color); font-size: 1.2rem; font-weight: 500; }
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
  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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
