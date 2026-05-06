<template>
  <div class="project-detail-container">
    <!-- Header -->
    <div class="project-header tech-card">
      <div class="header-content">
        <div class="header-left">
          <div class="project-icon">▣</div>
          <div class="header-text">
            <h1 class="gradient-text">Rebol Lab</h1>
            <p class="project-subtitle">个人 AI 学习与求职实验室</p>
          </div>
        </div>
        <div class="header-right">
          <el-tag type="success" size="large">v1.5 Showcase Edition</el-tag>
          <el-tag size="large">持续迭代中</el-tag>
        </div>
      </div>

      <div class="header-tags">
        <el-tag v-for="t in ['Vue 3', 'TypeScript', 'Vite', 'Element Plus', 'SCSS', 'GitHub Actions']" :key="t" effect="plain" type="primary">{{ t }}</el-tag>
      </div>

      <div class="header-links">
        <el-button type="primary" @click="$router.push('/tools')">
          进入工具实验室
        </el-button>
        <el-button @click="$router.push('/')">
          返回首页
        </el-button>
        <el-button @click="$router.push('/about')">
          关于作者
        </el-button>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Left Column -->
      <div class="content-left">

        <!-- Project Background -->
        <section class="detail-section tech-card">
          <h2><el-icon><Document /></el-icon> 项目背景</h2>
          <p>
            作为一名软件工程应届生，我面临一个常见问题：学了很多前端技术，但不知道如何系统地展示自己的能力。
            简历上的项目描述同质化严重，无法让面试官快速了解我的技术深度和工程思维。
          </p>
          <p>
            Rebol Lab 由此诞生。它不是简单地把课程作业堆砌起来，而是一个<strong>从需求分析到工具落地</strong>的完整实践。
            我选择从测试视角出发，因为我相信优秀的工程师不仅要能写出好代码，更要具备测试思维 —— 从用户视角发现需求、从工程视角保障质量。
          </p>
          <div class="highlight-box">
            <strong>一句话概括</strong>：Rebol Lab 是一个面向软件工程学习者的 AI 学习与求职实验室，展示从需求分析到工具落地的完整能力。
          </div>
        </section>

        <!-- Project Positioning -->
        <section class="detail-section tech-card">
          <h2><el-icon><Location /></el-icon> 项目定位</h2>
          <div class="positioning-grid">
            <div class="position-item">
              <h4>面向人群</h4>
              <p>面试官了解我的前端技术栈、项目经验；求职者参考项目结构；初学者学习 Vue 3 + TypeScript 实践</p>
            </div>
            <div class="position-item">
              <h4>解决什么问题</h4>
              <p>学习成果零散无法展示 → 系统化的工具集；项目经验同质化 → 从测试视角出发设计独特工具；缺乏完整经历 → 从需求分析到部署上线的全流程</p>
            </div>
            <div class="position-item">
              <h4>核心差异</h4>
              <p>不只是展示页面，而是包含 4 个可演示的实际工具；AI 模型价格雷达展示数据可靠性设计能力；GitHub Actions 展示自动化思维</p>
            </div>
          </div>
        </section>

        <!-- Tech Stack -->
        <section class="detail-section tech-card">
          <h2><el-icon><Monitor /></el-icon> 技术栈</h2>
          <div class="tech-stack-grid">
            <div class="tech-category">
              <h4>前端核心</h4>
              <div class="tech-tags">
                <el-tag effect="dark" type="primary">Vue 3 Composition API</el-tag>
                <el-tag effect="dark" type="primary">TypeScript 类型约束</el-tag>
                <el-tag effect="dark" type="primary">Vite 构建工具</el-tag>
                <el-tag effect="dark" type="primary">Element Plus</el-tag>
                <el-tag effect="dark" type="primary">SCSS 主题管理</el-tag>
              </div>
            </div>
            <div class="tech-category">
              <h4>状态与路由</h4>
              <div class="tech-tags">
                <el-tag effect="plain">Pinia 状态管理</el-tag>
                <el-tag effect="plain">Vue Router 懒加载</el-tag>
              </div>
            </div>
            <div class="tech-category">
              <h4>工程化</h4>
              <div class="tech-tags">
                <el-tag effect="plain">Git 版本管理</el-tag>
                <el-tag effect="plain">GitHub Actions CI/CD</el-tag>
                <el-tag effect="plain">ESLint 代码规范</el-tag>
              </div>
            </div>
            <div class="tech-category">
              <h4>工具开发</h4>
              <div class="tech-tags">
                <el-tag effect="plain">tsx Node 脚本</el-tag>
                <el-tag effect="plain">cheerio HTML 解析</el-tag>
                <el-tag effect="plain">localStorage 持久化</el-tag>
              </div>
            </div>
          </div>
        </section>

        <!-- Feature Architecture -->
        <section class="detail-section tech-card">
          <h2><el-icon><Grid /></el-icon> 功能架构</h2>
          <div class="architecture-tree">
            <div class="arch-root">
              <strong>Rebol Lab</strong>
              <span>（5 大模块）</span>
            </div>
            <div class="arch-children">
              <div class="arch-item">
                <div class="arch-label">工具实验室</div>
                <div class="arch-children">
                  <div class="arch-sub-item">测试用例生成器</div>
                  <div class="arch-sub-item">Bug 报告生成器</div>
                  <div class="arch-sub-item">项目包装助手</div>
                  <div class="arch-sub-item">AI 模型价格雷达</div>
                </div>
              </div>
              <div class="arch-item">
                <div class="arch-label">作品展示厅</div>
                <div class="arch-children">
                  <div class="arch-sub-item">Rebol Lab 项目详情</div>
                  <div class="arch-sub-item">AI TestPilot（学习项目）</div>
                  <div class="arch-sub-item">Job Portfolio（学习项目）</div>
                </div>
              </div>
              <div class="arch-item">
                <div class="arch-label">技能成长图</div>
                <div class="arch-children">
                  <div class="arch-sub-item">7 阶段进阶路线</div>
                </div>
              </div>
              <div class="arch-item">
                <div class="arch-label">关于我</div>
                <div class="arch-children">
                  <div class="arch-sub-item">个人简介 / 技术栈 / 求职意向</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Core Modules -->
        <section class="detail-section tech-card">
          <h2><el-icon><Odometer /></el-icon> 核心模块</h2>
          <div class="modules-list">
            <div class="module-item" v-for="m in coreModules" :key="m.name">
              <div class="module-header">
                <span class="module-name">{{ m.name }}</span>
                <el-tag size="small" :type="m.statusType">{{ m.status }}</el-tag>
              </div>
              <p class="module-desc">{{ m.desc }}</p>
              <div class="module-tech">{{ m.tech }}</div>
            </div>
          </div>
        </section>

      </div>

      <!-- Right Column -->
      <div class="content-right">

        <!-- AI Model Price Radar -->
        <section class="detail-section tech-card highlight-section">
          <h2><el-icon><DataLine /></el-icon> AI 模型价格雷达</h2>
          <p class="section-intro">
            这是本项目最具技术深度的工具，展示了数据可靠性设计能力和自动化思维。
          </p>

          <div class="radar-features">
            <div class="radar-feature">
              <el-icon><Link /></el-icon>
              <div>
                <strong>数据来源透明</strong>
                <p>每条数据标注 officialSourceUrl 和 sourceNote，缺失显示「来源待补充」</p>
              </div>
            </div>
            <div class="radar-feature">
              <el-icon><Timer /></el-icon>
              <div>
                <strong>数据新鲜度</strong>
                <p>显示 lastCheckedAt 和 freshnessDays，避免把旧数据当成最新价格</p>
              </div>
            </div>
            <div class="radar-feature">
              <el-icon><CircleCheck /></el-icon>
              <div>
                <strong>核验状态分级</strong>
                <p>verified / needs_review / stale / deprecated / unknown</p>
              </div>
            </div>
            <div class="radar-feature">
              <el-icon><Warning /></el-icon>
              <div>
                <strong>成本估算安全</strong>
                <p>仅在 priceUnit=元/百万tokens 且 currency=CNY/USD 时提供估算</p>
              </div>
            </div>
            <div class="radar-feature">
              <el-icon><Refresh /></el-icon>
              <div>
                <strong>自动数据管道</strong>
                <p>GitHub Actions 定时抓取公开页面，生成 JSON，前端优先读取</p>
              </div>
            </div>
          </div>

          <div class="disclaimer-box">
            <strong>免责声明</strong>
            <p>模型价格可能随时变动，实际费用请以各厂商官方价格页、控制台账单和最新公告为准。本工具不保证数据实时性和准确性。</p>
          </div>

          <el-button type="primary" @click="$router.push('/tools/model-price-radar')">
            进入 AI 模型价格雷达
          </el-button>
        </section>

        <!-- Data Reliability -->
        <section class="detail-section tech-card">
          <h2><el-icon><Lock /></el-icon> 数据可靠性设计</h2>
          <div class="data-design">
            <div class="design-item">
              <h4>不是实时爬虫</h4>
              <p>数据来源于公开官方页面 + 人工核验 + 自动定时检查（每天 08:00 UTC）</p>
            </div>
            <div class="design-item">
              <h4>每条数据有身份</h4>
              <p>vendor, modelName, officialSourceUrl, sourceNote, lastCheckedAt, verificationStatus, freshnessDays</p>
            </div>
            <div class="design-item">
              <h4>前端降级策略</h4>
              <p>优先读取生成的 JSON，缺失则回退到手动维护的备用数据</p>
            </div>
            <div class="design-item">
              <h4>成本计算安全</h4>
              <p>检查 priceUnit 和 currency，非支持范围显示明确提示，不猜测价格</p>
            </div>
          </div>
        </section>

        <!-- Security -->
        <section class="detail-section tech-card">
          <h2><el-icon><Lock /></el-icon> 安全说明</h2>
          <div class="security-list">
            <div class="security-item">
              <el-icon><Folder /></el-icon>
              <div>
                <strong>数据存储</strong>
                <p>所有数据存储在浏览器 localStorage，不涉及服务器上传，不收集用户隐私</p>
              </div>
            </div>
            <div class="security-item">
              <el-icon><Key /></el-icon>
              <div>
                <strong>API Key 安全</strong>
                <p>不要在前端保存真实密钥。如需接入 AI API，建议通过后端代理保护 Key</p>
              </div>
            </div>
            <div class="security-item">
              <el-icon><Warning /></el-icon>
              <div>
                <strong>价格仅供参考</strong>
                <p>模型价格以各厂商官方价格页和控制台账单为准，本工具不承担任何责任</p>
              </div>
            </div>
            <div class="security-item">
              <el-icon><CircleCheck /></el-icon>
              <div>
                <strong>无认证机制</strong>
                <p>项目为公开作品集，无登录或认证机制，不涉及敏感操作</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Known Limits -->
        <section class="detail-section tech-card">
          <h2><el-icon><InfoFilled /></el-icon> 已知限制</h2>
          <div class="limits-list">
            <div class="limit-item">
              <span class="limit-num">1</span>
              <div>
                <strong>工具生成逻辑为本地规则</strong>
                <p>不是真实 AI 生成，是基于模板的本地辅助工具</p>
              </div>
            </div>
            <div class="limit-item">
              <span class="limit-num">2</span>
              <div>
                <strong>数据存储在浏览器 localStorage</strong>
                <p>刷新页面会保留历史记录，清除浏览器数据会丢失</p>
              </div>
            </div>
            <div class="limit-item">
              <span class="limit-num">3</span>
              <div>
                <strong>无后端服务</strong>
                <p>纯前端项目，不涉及数据上传或云同步</p>
              </div>
            </div>
            <div class="limit-item">
              <span class="limit-num">4</span>
              <div>
                <strong>部分工具仍在开发中</strong>
                <p>部分标记为"开发中"或"计划中"的功能尚未完成</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Future Plans -->
        <section class="detail-section tech-card">
          <h2><el-icon><Guide /></el-icon> 后续计划</h2>
          <div class="plans-list">
            <div class="plan-item" v-for="p in futurePlans" :key="p.title" :class="p.priority">
              <span class="plan-tag">{{ p.tag }}</span>
              <div>
                <strong>{{ p.title }}</strong>
                <p>{{ p.desc }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Interview Summary -->
        <section class="detail-section tech-card interview-section">
          <h2><el-icon><ChatDotRound /></el-icon> 面试讲解摘要</h2>
          <div class="interview-content">
            <div class="interview-block">
              <h4>1 分钟：项目背景</h4>
              <p>Rebol Lab 是一个本地辅助工具集，也是一个前端开发求职作品集。我从测试视角出发，构建了 4 个实用工具，展示了从需求分析到工具落地的完整能力。</p>
            </div>
            <div class="interview-block">
              <h4>1 分钟：技术栈</h4>
              <p>Vue 3 + TypeScript + Vite + Element Plus + SCSS。TypeScript 类型约束、Composition API、Pinia 状态管理、Vue Router 懒加载、SCSS 变量主题管理。</p>
            </div>
            <div class="interview-block">
              <h4>30 秒：核心工具</h4>
              <p>测试用例生成器覆盖 7 类测试维度；Bug 报告生成器标准化复现步骤；项目包装助手生成简历描述；AI 模型价格雷达展示数据可靠性设计。</p>
            </div>
            <div class="interview-block">
              <h4>30 秒：AI 模型价格雷达的技术深度</h4>
              <p>数据管道：GitHub Actions 定时抓取公开页面，生成 JSON；每条数据有 verificationStatus 和 freshnessDays；成本计算检查 priceUnit 和 currency，非支持范围显示明确提示。</p>
            </div>
          </div>
          <div class="interview-note">
            <el-icon><InfoFilled /></el-icon>
            <span>详见 docs/demo-script.md</span>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Document, Location, Monitor, Grid, Odometer, DataLine,
  Link, Timer, CircleCheck, Warning, Refresh, Lock,
  Folder, Key, InfoFilled, Guide, ChatDotRound
} from '@element-plus/icons-vue'

const coreModules = [
  {
    name: '测试用例生成器',
    status: '已完成',
    statusType: 'success',
    desc: '根据需求描述生成 7 类测试维度的测试点，支持 Markdown 导出和历史记录。',
    tech: 'Vue 3 Composition API / localStorage 持久化 / Markdown 导出'
  },
  {
    name: 'Bug 报告生成器',
    status: '已完成',
    statusType: 'success',
    desc: '标准化复现步骤、环境信息收集、期望结果与实际结果对比，一键复制。',
    tech: '响应式表单 / clipboard API / 结构化数据'
  },
  {
    name: '项目包装助手',
    status: '已完成',
    statusType: 'success',
    desc: '基于 STAR 法则生成简历描述、面试讲解稿、追问预判。',
    tech: '模板引擎思维 / 多格式输出'
  },
  {
    name: 'AI 模型价格雷达',
    status: '已完成',
    statusType: 'success',
    desc: '对比模型价格、支持数据新鲜度与核验状态显示、自动数据管道。',
    tech: '数据可靠性设计 / GitHub Actions / cheerio 解析 / 前端降级策略'
  }
]

const futurePlans = [
  {
    tag: '计划中',
    title: '接入真实 AI API',
    desc: '如需接入 AI API，建议通过后端代理保护 Key，不在前端保存真实密钥。',
    priority: 'planned'
  },
  {
    tag: '计划中',
    title: '简历项目描述生成器',
    desc: '基于 STAR 法则生成高质量项目描述，支持简历精修。',
    priority: 'planned'
  },
  {
    tag: '计划中',
    title: '项目部署上线',
    desc: '部署到 Vercel / Netlify / GitHub Pages，面试时可直接演示。',
    priority: 'planned'
  }
]
</script>

<style scoped lang="scss">
.project-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.project-header {
  padding: 40px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 20px;

    .header-left {
      display: flex;
      gap: 20px;
      align-items: center;

      .project-icon {
        font-size: 3rem;
        opacity: 0.6;
      }

      h1 { margin: 0; font-size: 2.5rem; }
      .project-subtitle { margin: 8px 0 0; color: var(--text-muted); font-size: 1rem; }
    }

    .header-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .header-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .header-links {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
}

.content-left, .content-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  padding: 28px;

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
    margin: 0 0 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);

    .el-icon { color: var(--primary-color); }
  }

  p {
    line-height: 1.8;
    color: var(--text-color);
    margin-bottom: 16px;
  }

  .highlight-box {
    background: rgba(88, 166, 255, 0.05);
    border: 1px dashed rgba(88, 166, 255, 0.3);
    border-radius: 8px;
    padding: 16px;
    font-size: 0.95rem;
    strong { color: var(--primary-color); }
  }
}

// Positioning Grid
.positioning-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .position-item {
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    border-left: 3px solid var(--primary-color);

    h4 { margin: 0 0 8px; font-size: 0.95rem; color: var(--text-color); }
    p { margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }
  }
}

// Tech Stack Grid
.tech-stack-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .tech-category {
    h4 {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .tech-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  }
}

// Architecture Tree
.architecture-tree {
  font-size: 0.9rem;

  .arch-root {
    font-size: 1rem;
    margin-bottom: 16px;
    span { color: var(--text-muted); margin-left: 8px; }
  }

  .arch-children {
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .arch-item {
    .arch-label {
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 4px;
    }

    .arch-children {
      padding-left: 16px;
    }
  }

  .arch-sub-item {
    font-size: 0.85rem;
    color: var(--text-muted);
    padding: 4px 0;
  }
}

// Modules List
.modules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .module-item {
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    border: 1px solid var(--border-color);

    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .module-name { font-weight: 600; color: var(--text-color); }
    }

    .module-desc { margin: 0 0 8px; font-size: 0.85rem; color: var(--text-muted); }
    .module-tech { font-size: 0.75rem; color: var(--primary-color); font-family: monospace; }
  }
}

// Highlight Section
.highlight-section {
  background: linear-gradient(135deg, rgba(88, 166, 255, 0.05) 0%, var(--card-bg) 100%);
  border-color: rgba(88, 166, 255, 0.3);

  .section-intro {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin-bottom: 20px;
  }
}

.radar-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;

  .radar-feature {
    display: flex;
    gap: 12px;
    align-items: flex-start;

    .el-icon {
      font-size: 1.2rem;
      color: var(--primary-color);
      flex-shrink: 0;
      margin-top: 2px;
    }

    strong { display: block; font-size: 0.9rem; margin-bottom: 4px; }
    p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
  }
}

.disclaimer-box {
  background: rgba(210, 153, 34, 0.05);
  border: 1px solid rgba(210, 153, 34, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;

  strong { font-size: 0.85rem; color: #d29922; display: block; margin-bottom: 4px; }
  p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
}

// Data Design
.data-design {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .design-item {
    h4 { margin: 0 0 4px; font-size: 0.9rem; color: var(--text-color); }
    p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
  }
}

// Security List
.security-list, .limits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .security-item, .limit-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;

    .el-icon { font-size: 1.1rem; color: var(--primary-color); flex-shrink: 0; margin-top: 2px; }

    strong { font-size: 0.9rem; display: block; margin-bottom: 4px; }
    p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
  }

  .limit-item {
    .limit-num {
      width: 24px;
      height: 24px;
      background: rgba(88, 166, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
      color: var(--primary-color);
      flex-shrink: 0;
    }
  }
}

// Plans List
.plans-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .plan-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;

    .plan-tag {
      font-size: 0.7rem;
      padding: 2px 8px;
      background: rgba(88, 166, 255, 0.1);
      color: var(--primary-color);
      border-radius: 4px;
      white-space: nowrap;

      &.planned { background: rgba(210, 153, 34, 0.1); color: #d29922; }
    }

    strong { font-size: 0.9rem; display: block; margin-bottom: 4px; }
    p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
  }
}

// Interview Section
.interview-section {
  background: linear-gradient(135deg, rgba(63, 185, 80, 0.05) 0%, var(--card-bg) 100%);
  border-color: rgba(63, 185, 80, 0.2);
}

.interview-content {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .interview-block {
    h4 { margin: 0 0 8px; font-size: 0.9rem; color: var(--accent-color); }
    p { margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }
  }
}

.interview-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>