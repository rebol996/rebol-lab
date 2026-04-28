<template>
  <el-container class="layout-container">
    <!-- Console Sidebar -->
    <el-aside width="260px" class="aside">
      <div class="aside-header">
        <div class="logo-box">
          <div class="logo-scanner"></div>
          <el-icon :size="24" class="logo-icon"><Monitor /></el-icon>
        </div>
        <div class="logo-text">
          <span class="main">REBOL</span>
          <span class="sub">LABORATORY v1.2</span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <el-icon><HomeFilled /></el-icon>
          <span class="label">控制台首页 / HOME</span>
        </router-link>
        
        <router-link to="/tools" class="nav-item" :class="{ active: $route.path.startsWith('/tools') }">
          <el-icon><Tools /></el-icon>
          <span class="label">实验工具集 / TOOLS</span>
        </router-link>
        
        <router-link to="/projects" class="nav-item" :class="{ active: $route.path === '/projects' }">
          <el-icon><FolderOpened /></el-icon>
          <span class="label">作品展示厅 / PROJECTS</span>
        </router-link>
        
        <router-link to="/roadmap" class="nav-item" :class="{ active: $route.path === '/roadmap' }">
          <el-icon><Guide /></el-icon>
          <span class="label">技能成长图 / ROADMAP</span>
        </router-link>
        
        <router-link to="/about" class="nav-item" :class="{ active: $route.path === '/about' }">
          <el-icon><User /></el-icon>
          <span class="label">关于实验室 / ABOUT</span>
        </router-link>
      </nav>

      <div class="aside-footer">
        <div class="status-panel">
          <div class="status-header">
            <span class="title">LAB STATUS</span>
            <span class="version">v1.2 beta</span>
          </div>
          <div class="status-body">
            <div class="status-item">
              <span class="label">主线任务:</span>
              <span class="txt">个人工具集开发</span>
            </div>
            <div class="status-item">
              <span class="label">学习方向:</span>
              <span class="txt">Vue / 测试 / AI</span>
            </div>
            <div class="status-item mt-8">
              <span class="dot active"></span>
              <span class="txt">CORE ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </el-aside>
    
    <el-container class="content-wrapper">
      <!-- Top Monitor Bar -->
      <el-header class="header">
        <div class="header-left">
          <div class="breadcrumb">
            <span class="root">LAB</span>
            <span class="sep">/</span>
            <span class="current">{{ currentPageTitle }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="terminal-info">
            <span class="status-indicator"></span>
            <span class="env">PROD_ENV</span>
          </div>
          <div class="header-actions">
            <el-button link class="action-btn"><el-icon><Search /></el-icon></el-button>
            <el-button link class="action-btn"><el-icon><Bell /></el-icon></el-button>
            <div class="user-profile">
              <el-avatar :size="28" src="https://github.com/rebol.png" />
              <span class="username">REBOL</span>
            </div>
          </div>
        </div>
      </el-header>
      
      <!-- Main Display Main -->
      <el-main class="main">
        <div class="main-content-inner">
          <router-view v-slot="{ Component, route }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Monitor, HomeFilled, Tools, FolderOpened, Guide, User, 
  Search, Bell 
} from '@element-plus/icons-vue'

const route = useRoute()

const currentPageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'DASHBOARD',
    '/tools': 'TOOLS_LAB',
    '/tools/test-case-generator': 'TEST_CASE_GENERATOR',
    '/tools/bug-report-generator': 'BUG_REPORT_GENERATOR',
    '/projects': 'PORTFOLIO',
    '/roadmap': 'GROWTH_MAP',
    '/about': 'MANIFESTO'
  }
  return titles[route.path] || 'LAB_VIEW'
})
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}

// Sidebar Style
.aside {
  background-color: #0d1117;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.aside-header {
  padding: 30px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  
  .logo-box {
    position: relative;
    width: 40px;
    height: 40px;
    background: rgba(88, 166, 255, 0.1);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .logo-scanner {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 2px;
      background: var(--primary-color);
      box-shadow: 0 0 8px var(--primary-color);
      animation: scan 3s infinite linear;
    }
    
    .logo-icon { color: var(--primary-color); }
  }
  
  .logo-text {
    display: flex;
    flex-direction: column;
    .main { font-weight: 800; font-size: 1.2rem; letter-spacing: 2px; line-height: 1; }
    .sub { font-size: 0.6rem; color: var(--text-muted); margin-top: 4px; font-family: monospace; }
  }
}

.nav-menu {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.85rem;
    transition: all 0.2s;
    font-family: monospace;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-color);
    }

    &.active {
      background: rgba(88, 166, 255, 0.1);
      color: var(--primary-color);
      font-weight: 600;
    }

    .el-icon { font-size: 1.1rem; }
  }
}

.aside-footer {
  padding: 24px;
  border-top: 1px solid var(--border-color);
}

.status-panel {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;

  .status-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.65rem;
    font-weight: bold;
    color: var(--text-muted);
    margin-bottom: 10px;
    .version { color: var(--accent-color); }
  }

  .status-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.65rem;
      color: var(--text-muted);
      margin-bottom: 2px;
      
      .label { opacity: 0.6; white-space: nowrap; }
      .txt { color: var(--text-color); }
      &.mt-8 { margin-top: 8px; }
      
      .dot {
        width: 4px; height: 4px; border-radius: 50%;
        &.active { background: var(--accent-color); box-shadow: 0 0 4px var(--accent-color); }
      }
    }
  }
}

// Header Style
.header {
  height: 60px !important;
  background-color: rgba(13, 17, 23, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.breadcrumb {
  font-family: monospace;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  .root { color: var(--primary-color); font-weight: bold; }
  .sep { color: var(--text-muted); }
  .current { color: var(--text-color); }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 32px;

  .terminal-info {
    font-family: monospace;
    font-size: 0.7rem;
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.02);
    padding: 2px 12px;
    border-radius: 20px;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0.5;
    transition: opacity 0.3s;
    
    &:hover { opacity: 1; }

    .status-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-color);
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .action-btn {
      font-size: 1.2rem;
      color: var(--text-muted);
      &:hover { color: var(--primary-color); }
    }
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 12px;
    border-left: 1px solid var(--border-color);
    .username { font-size: 0.8rem; font-weight: 600; font-family: monospace; }
  }
}

// Main Content
.main {
  padding: 0;
  overflow-x: hidden;
  background-image: 
    linear-gradient(rgba(88, 166, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(88, 166, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

.main-content-inner {
  padding: 40px;
  min-height: 100%;
}

@keyframes scan {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}

@keyframes mini-pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
