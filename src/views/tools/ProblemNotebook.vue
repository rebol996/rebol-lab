<template>
  <div class="notebook-container">
    <div class="notebook-header">
      <el-button link class="back-btn" @click="$router.push('/tools')">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回工具集</span>
      </el-button>
      <div class="header-divider"></div>
      <div>
        <h1 class="gradient-text">问题记录本</h1>
        <p class="description">记录开发与测试过程中遇到的坑及解决方案</p>
      </div>
    </div>

    <div class="notebook-actions">
      <el-input
        v-model="searchQuery"
        placeholder="搜索问题..."
        class="search-input"
        :prefix-icon="Search"
        clearable
      />
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon> 记录问题
      </el-button>
      <el-button @click="exportJSON">导出 JSON</el-button>
    </div>

    <div v-if="records.length === 0" class="empty-state tech-card">
      <el-icon :size="48"><Notebook /></el-icon>
      <p>暂无记录</p>
      <el-button type="primary" @click="showAddDialog = true">添加第一条记录</el-button>
    </div>

    <div v-else class="records-list">
      <div v-for="record in filteredRecords" :key="record.id" class="record-card tech-card">
        <div class="record-header">
          <h3 class="record-title">{{ record.title }}</h3>
          <div class="record-meta">
            <el-tag size="small">{{ record.tags.join(', ') }}</el-tag>
            <span class="record-date">{{ record.date }}</span>
          </div>
        </div>
        <div class="record-problem">
          <strong>问题：</strong>{{ record.problem }}
        </div>
        <div class="record-solution">
          <strong>解决方案：</strong>{{ record.solution }}
        </div>
        <div class="record-actions">
          <el-button size="small" link @click="copyRecord(record)">复制</el-button>
          <el-button size="small" link type="danger" @click="deleteRecord(record.id)">删除</el-button>
        </div>
      </div>
    </div>

    <el-dialog v-model="showAddDialog" title="记录问题" width="500px">
      <div class="dialog-form">
        <div class="form-group">
          <label class="form-label">问题标题</label>
          <el-input v-model="newRecord.title" placeholder="简洁描述问题" />
        </div>
        <div class="form-group">
          <label class="form-label">问题描述</label>
          <el-input v-model="newRecord.problem" type="textarea" :rows="3" placeholder="详细描述问题现象" />
        </div>
        <div class="form-group">
          <label class="form-label">解决方案</label>
          <el-input v-model="newRecord.solution" type="textarea" :rows="3" placeholder="如何解决" />
        </div>
        <div class="form-group">
          <label class="form-label">标签（用逗号分隔）</label>
          <el-input v-model="newRecord.tags" placeholder="例如：Vue, Bug, 性能" />
        </div>
      </div>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addRecord" :disabled="!newRecord.title">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Search, Plus, Notebook } from '@element-plus/icons-vue'

interface ProblemRecord {
  id: string
  title: string
  problem: string
  solution: string
  tags: string[]
  date: string
}

const STORAGE_KEY = 'rebol-lab-problem-records'

const searchQuery = ref('')
const showAddDialog = ref(false)

const newRecord = reactive({
  title: '',
  problem: '',
  solution: '',
  tags: ''
})

const records = ref<ProblemRecord[]>([])

function loadRecords() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      records.value = JSON.parse(stored)
    }
  } catch {
    records.value = []
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
}

function addRecord() {
  if (!newRecord.title) return

  const record: ProblemRecord = {
    id: Date.now().toString(),
    title: newRecord.title,
    problem: newRecord.problem,
    solution: newRecord.solution,
    tags: newRecord.tags.split(/[,，]/).filter(t => t.trim()),
    date: new Date().toLocaleDateString('zh-CN')
  }

  records.value.unshift(record)
  saveRecords()

  newRecord.title = ''
  newRecord.problem = ''
  newRecord.solution = ''
  newRecord.tags = ''
  showAddDialog.value = false

  ElMessage.success('已保存')
}

function deleteRecord(id: string) {
  records.value = records.value.filter(r => r.id !== id)
  saveRecords()
  ElMessage.success('已删除')
}

function copyRecord(record: ProblemRecord) {
  const text = `【问题】${record.title}\n【现象】${record.problem}\n【解决】${record.solution}`
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(records.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `problem-records-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value
  const q = searchQuery.value.toLowerCase()
  return records.value.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.problem.toLowerCase().includes(q) ||
    r.solution.toLowerCase().includes(q) ||
    r.tags.some(t => t.toLowerCase().includes(q))
  )
})

onMounted(loadRecords)
</script>

<style scoped lang="scss">
.notebook-container {
  max-width: 900px;
  margin: 0 auto;
}

.notebook-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

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

.notebook-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  .search-input { width: 300px; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  color: var(--text-muted);

  p { margin: 16px 0; }
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.record-card {
  padding: 20px;

  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;

    .record-title { margin: 0; font-size: 1.1rem; }
    .record-meta {
      display: flex;
      align-items: center;
      gap: 12px;

      .record-date { font-size: 0.8rem; color: var(--text-muted); }
    }
  }

  .record-problem, .record-solution {
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 8px;

    strong { color: var(--text-color); }
  }

  .record-problem { color: var(--text-muted); }
  .record-solution { color: var(--accent-color); }

  .record-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border-color);
  }
}

.dialog-form {
  .form-group {
    margin-bottom: 16px;

    .form-label {
      display: block;
      margin-bottom: 6px;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
  }
}
</style>