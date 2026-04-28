<template>
  <div class="tools-container">
    <div class="tools-header">
      <div class="header-info">
        <h1 class="gradient-text">工具实验室</h1>
        <p class="description">按需构建的效率工具集，涵盖测试、开发与求职全流程。</p>
      </div>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索实验工具..."
          class="search-input"
          :prefix-icon="Search"
          clearable
        />
        <div class="category-tabs">
          <div 
            v-for="cat in categories" 
            :key="cat"
            class="tab-item"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </div>
        </div>
      </div>
    </div>

    <el-row :gutter="24" class="tools-grid">
      <el-col
        v-for="tool in filteredTools"
        :key="tool.id"
        :xs="24" :sm="12" :md="8" :lg="8"
        class="tool-col"
      >
        <div class="tech-card tool-card" :class="{ 'featured-tool': tool.featured }">
          <div class="tool-header">
            <div class="tool-icon-box" :class="tool.categoryType">
              <el-icon><component :is="iconMap[tool.icon]" /></el-icon>
            </div>
            <div class="header-right-meta">
              <div v-if="tool.featured" class="featured-badge">CORE</div>
              <div class="tool-status" :class="tool.statusType">
                {{ tool.status }}
              </div>
            </div>
          </div>
          
          <h3 class="tool-name">{{ tool.name }}</h3>
          
          <div class="tool-body">
            <div class="info-row">
              <span class="label">用途:</span>
              <span class="value">{{ tool.purpose }}</span>
            </div>
            <div class="info-row">
              <span class="label">场景:</span>
              <span class="value">{{ tool.scenario }}</span>
            </div>
          </div>

          <div class="tool-footer">
            <el-tag size="small" effect="plain">{{ tool.category }}</el-tag>
            <el-button 
              type="primary" 
              :disabled="tool.status === '计划中'"
              @click="openTool(tool)"
            >
              {{ tool.status === '已完成' ? '进入工具' : '开发中...' }}
              <el-icon class="el-icon--right"><Right /></el-icon>
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, Right, Document, Connection, List, Finished, 
  User, Briefcase, ChatDotRound, Edit, Reading, Calendar, 
  Notebook, CollectionTag 
} from '@element-plus/icons-vue'

const router = useRouter()

const iconMap: Record<string, Component> = {
  Document, Connection, List, Finished,
  User, Briefcase, ChatDotRound, Edit, Reading, Calendar,
  Notebook, CollectionTag
}

const searchQuery = ref('')
const activeCategory = ref('全部')

const categories = ['全部', '软件测试工具', '求职工具', '开发辅助', '学习管理']

const tools = ref([
  // 软件测试工具
  { 
    id: 1, name: 'AI 测试用例生成器', purpose: '根据需求描述自动生成测试点与用例', 
    scenario: '功能测试阶段、需求评审', status: '已完成', statusType: 'done',
    icon: 'Document', category: '软件测试工具', categoryType: 'testing', featured: true 
  },
  { 
    id: 2, name: 'Bug 报告生成器', purpose: '标准化复现步骤，一键生成 Markdown 报告', 
    scenario: '日常提测、回归测试', status: '已完成', statusType: 'done',
    icon: 'Connection', category: '软件测试工具', categoryType: 'testing', featured: true 
  },
  { 
    id: 3, name: '接口测试检查清单', purpose: '覆盖异常流、安全性的接口测试 Checklist', 
    scenario: 'API 测试方案设计', status: '已完成', statusType: 'done',
    icon: 'List', category: '软件测试工具', categoryType: 'testing' 
  },
  { 
    id: 4, name: '网站质量体检工具', purpose: '检测页面响应、链接有效性及 SEO', 
    scenario: '上线前回归测试', status: '计划中', statusType: 'plan',
    icon: 'Finished', category: '软件测试工具', categoryType: 'testing' 
  },
  
  // 求职工具
  { 
    id: 5, name: '项目包装助手', purpose: '挖掘项目亮点，转换技术语言为业务价值', 
    scenario: '简历撰写、项目描述', status: '已完成', statusType: 'done',
    icon: 'Briefcase', category: '求职工具', categoryType: 'career', featured: true 
  },
  { 
    id: 6, name: '简历项目描述生成器', purpose: '基于 STAR 法则生成高质量项目描述', 
    scenario: '简历精修', status: '开发中', statusType: 'working',
    icon: 'User', category: '求职工具', categoryType: 'career' 
  },
  { 
    id: 7, name: '面试问题生成器', purpose: '根据岗位描述生成可能的面试考点', 
    scenario: '模拟面试、复习备考', status: '计划中', statusType: 'plan',
    icon: 'ChatDotRound', category: '求职工具', categoryType: 'career' 
  },
  { 
    id: 8, name: '自我介绍生成器', purpose: '定制不同风格的 1/3/5 分钟自我介绍', 
    scenario: '面试开场准备', status: '已完成', statusType: 'done',
    icon: 'Edit', category: '求职工具', categoryType: 'career' 
  },

  // 开发辅助
  { 
    id: 9, name: 'README 生成器', purpose: '快速构建规范的开源项目 README', 
    scenario: '项目开源、文档维护', status: '已完成', statusType: 'done',
    icon: 'Reading', category: '开发辅助', categoryType: 'dev' 
  },
  { 
    id: 10, name: 'Git 提交信息生成器', purpose: '规范化 Commit Message (Conventional Commits)', 
    scenario: '日常代码提交', status: '已完成', statusType: 'done',
    icon: 'Finished', category: '开发辅助', categoryType: 'dev' 
  },
  { 
    id: 13, name: 'API 文档生成器', purpose: '基于 Swagger/OpenAPI 自动生成精美文档', 
    scenario: '前后端协作、接口交付', status: '计划中', statusType: 'plan',
    icon: 'Document', category: '开发辅助', categoryType: 'dev' 
  },
  { 
    id: 14, name: '代码注释助手', purpose: 'AI 自动解析函数逻辑并生成标准化 JSDoc 注释', 
    scenario: '遗留代码维护、代码规范化', status: '开发中', statusType: 'working',
    icon: 'Edit', category: '开发辅助', categoryType: 'dev' 
  },

  // 学习管理
  { 
    id: 11, name: '学习路线追踪', purpose: '可视化技能树进度与里程碑', 
    scenario: '长期职业规划', status: '已完成', statusType: 'done',
    icon: 'Calendar', category: '学习管理', categoryType: 'study' 
  },
  { 
    id: 12, name: '每日复盘生成器', purpose: '记录收获与待办，生成每日工作流', 
    scenario: '日常复盘、周报准备', status: '已完成', statusType: 'done',
    icon: 'Notebook', category: '学习管理', categoryType: 'study' 
  },
  { 
    id: 15, name: '问题记录本', purpose: '沉淀开发与测试过程中遇到的坑及解决方案', 
    scenario: '知识库建设、错题集', status: '已完成', statusType: 'done',
    icon: 'CollectionTag', category: '学习管理', categoryType: 'study' 
  },
  { 
    id: 16, name: '知识点卡片', purpose: '利用间隔重复原理（SRS）强化核心知识记忆', 
    scenario: '面试备考、技能巩固', status: '计划中', statusType: 'plan',
    icon: 'Reading', category: '学习管理', categoryType: 'study' 
  }
])

const filteredTools = computed(() => {
  return tools.value.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         tool.purpose.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === '全部' || tool.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

const openTool = (tool: any) => {
  if (tool.id === 1) {
    router.push('/tools/test-case-generator')
    return
  }
  if (tool.id === 2) {
    router.push('/tools/bug-report-generator')
    return
  }
  if (tool.id === 5) {
    router.push('/tools/project-packager')
    return
  }
  if (tool.status === '已完成') {
    router.push('/tools/test-case-generator')
  }
}
</script>

<style scoped lang="scss">
.tools-container {
  max-width: 1200px;
  margin: 0 auto;
}

.tools-header {
  margin-bottom: 40px;
  .header-info {
    margin-bottom: 24px;
    h1 { font-size: 2.5rem; margin: 0 0 12px; }
    .description { color: var(--text-muted); font-size: 1.1rem; }
  }
  
  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    
    .search-input { width: 320px; }
  }
}

.category-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  
  .tab-item {
    padding: 6px 16px;
    font-size: 0.9rem;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
    
    &:hover { color: var(--text-color); }
    &.active {
      background: var(--primary-color);
      color: white;
    }
  }
}

.tools-grid {
  display: flex;
  flex-wrap: wrap;
  
  .tool-col {
    display: flex;
    margin-bottom: 24px;
  }
}

.tool-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 24px; // 显式声明以确保局部样式覆盖或生效
  
  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    
    .tool-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      
      &.testing { background: rgba(88, 166, 255, 0.1); color: #58a6ff; }
      &.career { background: rgba(255, 123, 114, 0.1); color: #ff7b72; }
      &.dev { background: rgba(126, 231, 135, 0.1); color: #7ee787; }
      &.study { background: rgba(210, 153, 255, 0.1); color: #d299ff; }
    }

    .header-right-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;

      .featured-badge {
        font-family: monospace;
        font-size: 0.65rem;
        font-weight: bold;
        color: var(--primary-color);
        background: rgba(88, 166, 255, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid rgba(88, 166, 255, 0.2);
      }
    }
    
    .tool-status {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      &.done { background: rgba(35, 134, 54, 0.1); color: #3fb950; }
      &.working { background: rgba(187, 128, 9, 0.1); color: #d29922; }
      &.plan { background: rgba(139, 148, 158, 0.1); color: #8b949e; }
    }
  }

  &.featured-tool {
    border-color: rgba(88, 166, 255, 0.4);
    background: linear-gradient(135deg, rgba(88, 166, 255, 0.05) 0%, var(--card-bg) 100%);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    
    &::after {
      content: '';
      position: absolute;
      top: -10px; right: -10px;
      width: 40px; height: 40px;
      background: radial-gradient(circle, rgba(88, 166, 255, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }
  }
  
  .tool-name {
    margin: 0 0 16px;
    font-size: 1.2rem;
    color: var(--text-color);
  }
  
  .tool-body {
    flex: 1;
    margin-bottom: 24px;
    .info-row {
      margin-bottom: 8px;
      font-size: 0.9rem;
      line-height: 1.5;
      .label { color: var(--text-muted); margin-right: 8px; }
      .value { color: var(--text-color); }
    }
  }
  
  .tool-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border-color);
    padding-top: 16px;
  }
}
</style>
