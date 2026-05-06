<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg-pattern"></div>
      <div class="hero-content">
        <div class="identity-badge">
          <span class="pulse-dot"></span>
          SHOWCASE EDITION v1.5
        </div>
        <h1 class="gradient-text main-title">Rebol Lab</h1>
        <p class="subtitle">个人 AI 学习与求职实验室</p>

        <div class="intro-text">
          面向软件工程学习者的 AI 驱动型个人成长与项目管理实验室。<br />
          统一管理学习路线、项目作品、测试辅助工具、AI 模型选型与求职展示内容。
        </div>

        <div class="identity-tags">
          <span class="tag-item">Vue 3 + TypeScript</span>
          <span class="tag-item">本地数据存储</span>
          <span class="tag-item">数据可信度设计</span>
          <span class="tag-item">2026 应届求职</span>
        </div>

        <div class="hero-actions">
          <el-button type="primary" size="large" @click="$router.push('/tools')">
            进入 Lab
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
          <el-button size="large" @click="$router.push('/projects/rebol-lab')">
            项目详情
          </el-button>
        </div>
      </div>
    </section>

    <!-- Three Core Capabilities -->
    <section class="capability-section">
      <div class="section-header">
        <el-icon><Monitor /></el-icon>
        <span>三大核心能力</span>
      </div>
      <div class="capability-grid">
        <div class="capability-card tech-card">
          <div class="cap-icon">📚</div>
          <h3>学习路线与进度管理</h3>
          <p>可视化技能树进度与里程碑，追踪从 Web 基础到 AI 工具开发的 7 阶段进阶路线</p>
          <div class="cap-status">
            <el-tag size="small" type="success">已掌握：Web 基础、Vue 前端开发</el-tag>
            <el-tag size="small" type="warning">进行中：软件测试基础</el-tag>
          </div>
        </div>

        <div class="capability-card tech-card">
          <div class="cap-icon">💼</div>
          <h3>项目作品与求职展示</h3>
          <p>系统化沉淀项目经验，展示从需求分析到工具落地的完整能力，支持面试讲解</p>
          <div class="cap-status">
            <el-tag size="small" type="success">3 个项目已展示</el-tag>
            <el-tag size="small" type="success">项目详情页</el-tag>
          </div>
        </div>

        <div class="capability-card tech-card">
          <div class="cap-icon">🤖</div>
          <h3>AI 模型选型与成本分析</h3>
          <p>整理主流模型的价格、套餐、免费额度、数据来源与核验状态，辅助模型选型与成本估算</p>
          <div class="cap-status">
            <el-tag size="small" type="success">10+ 厂商</el-tag>
            <el-tag size="small" type="success">数据新鲜度机制</el-tag>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Showcase -->
    <section class="features-section">
      <div class="section-header">
        <el-icon><Grid /></el-icon>
        <span>重点功能</span>
      </div>

      <div class="feature-cards">
        <div class="feature-card tech-card" @click="$router.push('/tools/model-price-radar')">
          <div class="feature-header">
            <div class="feature-icon ai"><el-icon><DataLine /></el-icon></div>
            <el-tag size="small" type="danger">重点工具</el-tag>
          </div>
          <h3>AI 模型价格雷达</h3>
          <p>对比模型价格、套餐额度与调用成本，整理数据来源、核验状态与新鲜度，辅助模型选型与成本估算。</p>
          <div class="feature-meta">
            <span>10+ 厂商</span>
            <span>数据来源透明</span>
            <span>成本估算</span>
          </div>
        </div>

        <div class="feature-card tech-card" @click="$router.push('/tools/test-case-generator')">
          <div class="feature-header">
            <div class="feature-icon test"><el-icon><Document /></el-icon></div>
          </div>
          <h3>测试用例生成器</h3>
          <p>根据需求描述生成 7 类测试维度的测试点：功能测试、边界测试、异常测试、安全测试、接口测试、性能测试、UI/交互测试。</p>
          <div class="feature-meta">
            <span>7 类测试维度</span>
            <span>Markdown 导出</span>
          </div>
        </div>

        <div class="feature-card tech-card" @click="$router.push('/tools/bug-report-generator')">
          <div class="feature-header">
            <div class="feature-icon test"><el-icon><Connection /></el-icon></div>
          </div>
          <h3>Bug 报告生成器</h3>
          <p>标准化复现步骤、环境信息收集、期望结果与实际结果对比，一键生成 Markdown 格式 Bug 报告。</p>
          <div class="feature-meta">
            <span>Markdown 格式</span>
            <span>一键复制</span>
          </div>
        </div>

        <div class="feature-card tech-card" @click="$router.push('/tools/project-packager')">
          <div class="feature-header">
            <div class="feature-icon career"><el-icon><Briefcase /></el-icon></div>
          </div>
          <h3>项目包装助手</h3>
          <p>挖掘项目亮点，将技术语言转换为业务价值，生成简历描述、面试讲解稿、追问预判。</p>
          <div class="feature-meta">
            <span>STAR 法则</span>
            <span>多格式输出</span>
          </div>
        </div>

        <div class="feature-card tech-card" @click="$router.push('/roadmap')">
          <div class="feature-header">
            <div class="feature-icon study"><el-icon><Guide /></el-icon></div>
          </div>
          <h3>技能成长图</h3>
          <p>从 Web 基础到 AI 工具开发的 7 阶段进阶路线，已掌握 / 正在攻克 / 下一步目标清晰标注。</p>
          <div class="feature-meta">
            <span>7 阶段</span>
            <span>进度可视化</span>
          </div>
        </div>

        <div class="feature-card tech-card" @click="$router.push('/projects')">
          <div class="feature-header">
            <div class="feature-icon portfolio"><el-icon><Collection /></el-icon></div>
          </div>
          <h3>作品展示厅</h3>
          <p>3 个项目的完整介绍：项目背景、解决问题、核心功能、我学到了什么、项目亮点。</p>
          <div class="feature-meta">
            <span>3 个项目</span>
            <span>面试讲解素材</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack & Highlights -->
    <section class="tech-section">
      <div class="section-header">
        <el-icon><Tools /></el-icon>
        <span>技术栈与项目亮点</span>
      </div>
      <div class="tech-grid">
        <div class="tech-card-large">
          <h3>技术栈</h3>
          <div class="tech-tags">
            <el-tag effect="dark" type="primary">Vue 3</el-tag>
            <el-tag effect="dark" type="primary">TypeScript</el-tag>
            <el-tag effect="dark" type="primary">Vite</el-tag>
            <el-tag effect="dark" type="primary">Element Plus</el-tag>
            <el-tag effect="dark" type="primary">SCSS</el-tag>
            <el-tag effect="plain">Pinia</el-tag>
            <el-tag effect="plain">Vue Router</el-tag>
            <el-tag effect="plain">GitHub Actions</el-tag>
          </div>
        </div>
        <div class="tech-card-large">
          <h3>工程化亮点</h3>
          <ul class="highlight-list">
            <li>Composition API + TypeScript 类型约束</li>
            <li>SCSS 变量统一管理深色科技风格主题</li>
            <li>组件化设计，路由懒加载</li>
            <li>GitHub Actions 定时自动更新价格数据</li>
          </ul>
        </div>
        <div class="tech-card-large">
          <h3>测试思维亮点</h3>
          <ul class="highlight-list">
            <li>测试用例生成器覆盖 7 类测试维度</li>
            <li>Bug 报告生成器标准化复现步骤</li>
            <li>AI 模型价格雷达数据可信度设计</li>
            <li>展示从测试视角出发的工具设计能力</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Security & Limits -->
    <section class="info-section">
      <div class="section-header">
        <el-icon><Lock /></el-icon>
        <span>安全说明与已知限制</span>
      </div>
      <div class="info-grid">
        <div class="info-card tech-card">
          <h3><el-icon><Lock /></el-icon> 数据安全</h3>
          <ul>
            <li>所有数据存储在浏览器 localStorage，不上传服务器</li>
            <li>清除浏览器数据会丢失，无云端同步</li>
            <li>不要在前端保存真实 API Key 或账号密码</li>
          </ul>
        </div>
        <div class="info-card tech-card">
          <h3><el-icon><Warning /></el-icon> 价格数据说明</h3>
          <ul>
            <li>AI 模型价格雷达不是绝对实时价格系统</li>
            <li>数据来源于公开官方页面 + 人工核验 + 自动定时检查</li>
            <li>实际费用以各厂商官方价格页、控制台账单和最新公告为准</li>
          </ul>
        </div>
        <div class="info-card tech-card">
          <h3><el-icon><InfoFilled /></el-icon> 已知限制</h3>
          <ul>
            <li>当前版本为前端展示版，无后端账号系统</li>
            <li>工具生成逻辑为本地规则，非真实 AI 生成</li>
            <li>价格数据需要人工核验，请勿将示例数据当作官方报价</li>
          </ul>
        </div>
        <div class="info-card tech-card">
          <h3><el-icon><Guide /></el-icon> 后续升级方向</h3>
          <ul>
            <li>Node.js + MySQL 后端版本</li>
            <li>用户登录与多设备同步</li>
            <li>模型价格定时任务与趋势图</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Quick Entry -->
    <section class="quick-entry">
      <div class="quick-card tech-card">
        <h3>快速入口</h3>
        <div class="quick-links">
          <el-button @click="$router.push('/tools')">工具实验室</el-button>
          <el-button @click="$router.push('/projects/rebol-lab')">项目详情</el-button>
          <el-button @click="$router.push('/projects')">作品展示</el-button>
          <el-button @click="$router.push('/roadmap')">技能路线</el-button>
          <el-button @click="$router.push('/about')">关于作者</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight, Monitor, Grid, DataLine, Document, Connection,
  Briefcase, Guide, Collection, Tools, Lock, Warning, InfoFilled
} from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.home-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

// Hero Section
.hero-section {
  position: relative;
  padding: 80px 48px;
  border-radius: 20px;
  background: rgba(22, 27, 34, 0.5);
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
    font-size: 0.75rem;
    color: var(--primary-color);
    margin-bottom: 20px;

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
    font-size: 3.5rem;
    margin: 0 0 12px;
    line-height: 1;
    letter-spacing: -1px;
  }

  .subtitle {
    font-size: 1.2rem;
    color: var(--primary-color);
    margin: 0 0 28px;
    font-weight: 500;
  }

  .intro-text {
    max-width: 640px;
    margin: 0 auto 36px;
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text-muted);
  }

  .identity-tags {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 36px;
    flex-wrap: wrap;

    .tag-item {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
    }
  }

  .hero-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    padding: 48px 24px;
    .main-title { font-size: 2.4rem; }
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

// Section Header
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-muted);
  font-family: monospace;
}

// Capability Section
.capability-section {
  .capability-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .capability-card {
    padding: 28px 24px;
    text-align: center;

    .cap-icon {
      font-size: 2.5rem;
      margin-bottom: 16px;
    }

    h3 {
      margin: 0 0 12px;
      font-size: 1.05rem;
      color: var(--text-color);
    }

    p {
      margin: 0 0 20px;
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .cap-status {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}

// Features Section
.features-section {
  .feature-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .feature-card {
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: var(--primary-color);
      transform: translateY(-3px);
    }

    .feature-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .feature-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;

        &.ai { background: rgba(88, 166, 255, 0.1); color: #58a6ff; }
        &.test { background: rgba(248, 81, 73, 0.1); color: #f85149; }
        &.career { background: rgba(210, 153, 34, 0.1); color: #d29922; }
        &.study { background: rgba(126, 231, 135, 0.1); color: #7ee787; }
        &.portfolio { background: rgba(163, 113, 247, 0.1); color: #a371f7; }
      }
    }

    h3 {
      margin: 0 0 10px;
      font-size: 1rem;
      color: var(--text-color);
    }

    p {
      margin: 0 0 16px;
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .feature-meta {
      display: flex;
      gap: 12px;
      font-size: 0.75rem;
      color: var(--text-muted);
      flex-wrap: wrap;

      span {
        padding: 2px 8px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 4px;
      }
    }
  }
}

// Tech Section
.tech-section {
  .tech-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .tech-card-large {
    padding: 24px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;

    h3 {
      margin: 0 0 16px;
      font-size: 0.9rem;
      color: var(--text-color);
      font-weight: 600;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .highlight-list {
      margin: 0;
      padding-left: 18px;

      li {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 8px;
        line-height: 1.5;
      }
    }
  }
}

// Info Section
.info-section {
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    @media (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }

  .info-card {
    padding: 24px;

    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px;
      font-size: 0.95rem;
      color: var(--text-color);

      .el-icon { color: var(--primary-color); }
    }

    ul {
      margin: 0;
      padding-left: 18px;

      li {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 8px;
        line-height: 1.5;
      }
    }
  }
}

// Quick Entry
.quick-entry {
  .quick-card {
    padding: 28px;
    text-align: center;

    h3 {
      margin: 0 0 20px;
      font-size: 1rem;
      color: var(--text-color);
    }

    .quick-links {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}
</style>