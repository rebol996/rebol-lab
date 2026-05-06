<template>
  <div class="radar-container">
    <!-- 顶部说明区 -->
    <div class="radar-header">
      <div class="header-left">
        <el-button link class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回工具集</span>
        </el-button>
        <div class="header-divider"></div>
        <div>
          <h1 class="gradient-text">AI 模型价格雷达</h1>
          <p class="description">对比模型价格、套餐额度与调用成本，帮助选择合适模型</p>
        </div>
      </div>
      <div class="header-meta">
        <span class="meta-item">数据更新：{{ lastUpdateTime }}</span>
        <span class="meta-item">模型数量：{{ allModels.length }}</span>
      </div>
    </div>

    <!-- 数据可靠性提示 -->
    <div class="reliability-notice tech-card">
      <div class="notice-icon">
        <el-icon><Warning /></el-icon>
      </div>
      <div class="notice-content">
        <h3>数据可靠性说明</h3>
        <p>本工具用于辅助模型选型和成本估算。模型价格、套餐额度、免费额度和上下文长度变化较快，<strong>所有数据均需以厂商官方价格页、控制台账单和最新公告为准</strong>。本页面会标记数据的新鲜度和核验状态，避免把旧数据误当成实时价格。</p>
      </div>
    </div>

    <!-- 可靠性统计 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ reliabilityStats.total }}</span>
        <span class="stat-label">总模型数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value success">{{ reliabilityStats.successCount }}</span>
        <span class="stat-label">解析成功</span>
      </div>
      <div class="stat-item">
        <span class="stat-value warning">{{ reliabilityStats.partialCount }}</span>
        <span class="stat-label">部分解析</span>
      </div>
      <div class="stat-item">
        <span class="stat-value danger">{{ reliabilityStats.failedCount }}</span>
        <span class="stat-label">解析失败</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ reliabilityStats.canCalculate }}</span>
        <span class="stat-label">可参与计算</span>
      </div>
      <div class="stat-item">
        <span class="stat-value muted">{{ reliabilityStats.legacyFallback }}</span>
        <span class="stat-label">Fallback</span>
      </div>
    </div>

    <!-- 数据来源状态 -->
    <div v-if="hasGeneratedData" class="source-status-card tech-card">
      <div class="source-status-header">
        <span class="source-status-title">自动数据抓取状态</span>
        <el-tag v-if="fetchSummary" size="small" type="success">
          {{ fetchSummary.successSources }} 成功
        </el-tag>
        <el-tag v-if="fetchSummary && fetchSummary.failedSources > 0" size="small" type="danger">
          {{ fetchSummary.failedSources }} 失败
        </el-tag>
        <el-tag v-if="fetchSummary && fetchSummary.manualRequiredSources > 0" size="small" type="warning">
          {{ fetchSummary.manualRequiredSources }} 需人工核验
        </el-tag>
      </div>
      <div class="source-status-meta">
        <span>数据生成时间：{{ lastUpdateTime }}</span>
        <span v-if="!hasGeneratedData" class="source-mode-tag">手动维护数据</span>
        <span v-else class="source-mode-tag auto">自动抓取数据</span>
      </div>
    </div>

    <!-- 筛选区 -->
    <div class="filter-section tech-card">
      <div class="filter-row">
        <el-select v-model="filters.vendor" placeholder="全部厂商" clearable class="filter-item">
          <el-option v-for="v in vendorOptions" :key="v" :label="v" :value="v" />
        </el-select>
        <el-select v-model="filters.modelType" placeholder="模型类型" clearable class="filter-item">
          <el-option v-for="(label, key) in modelTypeLabels" :key="key" :label="label" :value="key" />
        </el-select>
        <el-select v-model="filters.billingMode" placeholder="计费方式" clearable class="filter-item">
          <el-option v-for="(label, key) in billingModeLabels" :key="key" :label="label" :value="key" />
        </el-select>
        <el-input
          v-model="filters.keyword"
          placeholder="搜索厂商、模型、场景、标签..."
          clearable
          class="filter-search"
          :prefix-icon="Search"
        />
      </div>
      <div class="filter-row">
        <el-select v-model="filters.verificationStatus" placeholder="核验状态" clearable class="filter-item">
          <el-option v-for="(label, key) in verificationStatusLabels" :key="key" :label="label" :value="key" />
        </el-select>
        <el-select v-model="filters.freshnessFilter" placeholder="数据新鲜度" clearable class="filter-item">
          <el-option label="只看近期核验" value="fresh" />
          <el-option label="只看可能过期" value="stale" />
          <el-option label="只看严重过期" value="critical" />
          <el-option label="只看未核验" value="unchecked" />
        </el-select>
        <div class="filter-checkboxes">
          <el-checkbox v-model="filters.priceCompleteOnly" label="只看价格完整" />
          <el-checkbox v-model="filters.sourceMissingOnly" label="只看来源缺失" />
        </div>
      </div>
      <div class="filter-actions">
        <el-button size="small" @click="resetFilters">重置筛选</el-button>
        <el-button size="small" @click="exportJSON">导出 JSON</el-button>
        <el-upload
          :show-file-list="false"
          :before-upload="handleImport"
          accept=".json"
          class="inline-upload"
        >
          <el-button size="small">导入 JSON</el-button>
        </el-upload>
        <el-button size="small" @click="sortMode = sortMode === 'input-asc' ? 'input-desc' : 'input-asc'">
          按输入价格排序 <el-icon class="el-icon--right"><Sort /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 模型价格表 -->
    <div class="price-section">
      <div class="section-header">
        <h2>模型价格表</h2>
        <div class="tab-switch">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'valid' }"
            @click="activeTab = 'valid'"
          >
            有效数据 ({{ filteredValidModels.length }})
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'failed' }"
            @click="activeTab = 'failed'"
          >
            采集状态 ({{ failedModels.length }})
          </button>
        </div>
      </div>

      <!-- 有效数据表格 -->
      <div v-show="activeTab === 'valid'" class="price-table-wrapper desktop-only">
        <div v-if="filteredValidModels.length === 0" class="empty-state">
          <el-icon :size="48"><Search /></el-icon>
          <p>没有找到匹配的模型</p>
          <el-button @click="resetFilters">重置筛选</el-button>
        </div>
        <div v-else class="price-table">
          <div class="table-header">
            <div class="col-vendor">厂商</div>
            <div class="col-name">模型名称</div>
            <div class="col-type">类型</div>
            <div class="col-context">上下文</div>
            <div class="col-input">输入价格</div>
            <div class="col-output">输出价格</div>
            <div class="col-parse">解析状态</div>
            <div class="col-price">价格状态</div>
            <div class="col-fresh">新鲜度</div>
            <div class="col-source">来源</div>
            <div class="col-action">操作</div>
          </div>
          <div
            v-for="model in filteredValidModels"
            :key="model.id"
            class="table-row"
            :class="getRowClass(model)"
          >
            <div class="col-vendor">
              <span class="vendor-badge">{{ model.vendor }}</span>
            </div>
            <div class="col-name">
              <div class="model-name">{{ model.modelName }}</div>
              <div v-if="model.note" class="model-note">{{ model.note }}</div>
            </div>
            <div class="col-type">
              <el-tag size="small" :type="getModelTypeTagType(model.modelType)">
                {{ modelTypeLabels[model.modelType] }}
              </el-tag>
            </div>
            <div class="col-context">{{ model.contextLength || '-' }}</div>
            <div class="col-input">
              <span v-if="model.inputPricePerMillion !== undefined && model.currency && model.priceUnit" class="price-value">
                {{ formatPriceWithCurrency(model.inputPricePerMillion, model.currency) }}
              </span>
              <span v-else-if="model.inputPricePerMillion !== undefined" class="price-value price-uncertain">
                {{ formatPriceWithCurrency(model.inputPricePerMillion, model.currency) || '单位待确认' }}
              </span>
              <span v-else class="price-pending">未获取到</span>
            </div>
            <div class="col-output">
              <span v-if="model.outputPricePerMillion !== undefined && model.currency && model.priceUnit" class="price-value">
                {{ formatPriceWithCurrency(model.outputPricePerMillion, model.currency) }}
              </span>
              <span v-else-if="model.outputPricePerMillion !== undefined" class="price-value price-uncertain">
                {{ formatPriceWithCurrency(model.outputPricePerMillion, model.currency) || '单位待确认' }}
              </span>
              <span v-else class="price-pending">未获取到</span>
            </div>
            <div class="col-parse">
              <el-tag size="small" :type="getParseStatusTagType(getParseStatus(model as Record<string, any>).type)">
                {{ getParseStatus(model as Record<string, any>).label }}
              </el-tag>
            </div>
            <div class="col-price">
              <el-tag size="small" :type="getPriceStatusTagType(getPriceStatus(model as Record<string, any>).type)">
                {{ getPriceStatus(model as Record<string, any>).label }}
              </el-tag>
            </div>
            <div class="col-fresh">
              <span :class="getFreshnessTagClass(getDataFreshness(model as Record<string, any>).type)">
                {{ getDataFreshness(model as Record<string, any>).label }}
              </span>
            </div>
            <div class="col-source">
              <a v-if="getSourceDisplay(model as Record<string, any>).url" :href="getSourceDisplay(model as Record<string, any>).url" target="_blank" rel="noopener" class="source-link">
                {{ getSourceDisplay(model as Record<string, any>).label }}
              </a>
              <span v-else :class="getSourceTagClass(getSourceDisplay(model as Record<string, any>).type)">
                {{ getSourceDisplay(model as Record<string, any>).label }}
              </span>
            </div>
            <div class="col-action">
              <el-button size="small" link @click="openApiAccessPanel(model)">API接入</el-button>
              <el-button size="small" link @click="openDetailPanel(model)">详情</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 采集状态 -->
      <div v-show="activeTab === 'failed'" class="failed-section">
        <div v-if="failedModels.length === 0 && (!generatedFailedSources || generatedFailedSources.length === 0)" class="empty-state">
          <el-icon :size="48"><DataAnalysis /></el-icon>
          <p>暂无采集失败记录</p>
        </div>
        <div v-else class="failed-list">
          <div v-if="generatedFailedSources && generatedFailedSources.length > 0" class="failed-sources">
            <h3>失败来源 ({{ generatedFailedSources.length }})</h3>
            <div v-for="src in generatedFailedSources" :key="src.vendorSlug" class="failed-source-card tech-card">
              <div class="failed-source-header">
                <span class="vendor-badge">{{ src.vendor }}</span>
                <el-tag size="small" type="danger">{{ src.fetchStatus === 'parse_failed' ? '解析失败' : '抓取失败' }}</el-tag>
              </div>
              <div class="failed-source-url">
                <a :href="src.sourceUrl" target="_blank" rel="noopener">{{ src.sourceUrl }}</a>
              </div>
              <div class="failed-source-error">
                {{ src.parserError || src.errorMessage || '未知错误' }}
              </div>
              <div class="failed-source-meta">
                <span>最后尝试：{{ new Date(src.attemptedAt).toLocaleString('zh-CN') }}</span>
              </div>
            </div>
          </div>
          <div v-if="failedModels.length > 0" class="failed-models">
            <h3>解析失败模型 ({{ failedModels.length }})</h3>
            <div class="price-table">
              <div class="table-header">
                <div class="col-vendor">厂商</div>
                <div class="col-name">模型名称</div>
                <div class="col-parse">解析状态</div>
                <div class="col-source">来源</div>
                <div class="col-action">操作</div>
              </div>
              <div v-for="model in failedModels" :key="model.id" class="table-row row-danger">
                <div class="col-vendor">
                  <span class="vendor-badge">{{ model.vendor }}</span>
                </div>
                <div class="col-name">
                  <div class="model-name">{{ model.modelName }}</div>
                  <div class="model-note text-danger">{{ (model as Record<string, any>).parserError || '解析失败' }}</div>
                </div>
                <div class="col-parse">
                  <el-tag size="small" type="danger">解析失败</el-tag>
                </div>
                <div class="col-source">
                  <a v-if="model.officialSourceUrl" :href="model.officialSourceUrl" target="_blank" rel="noopener" class="source-link">
                    官方来源
                  </a>
                  <span v-else class="source-missing">来源缺失</span>
                </div>
                <div class="col-action">
                  <el-button size="small" link @click="openDetailPanel(model)">详情</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 移动端卡片 -->
      <div class="mobile-cards mobile-only">
        <div v-if="activeTab === 'valid'">
          <div v-if="filteredValidModels.length === 0" class="empty-state">
            <el-icon :size="48"><Search /></el-icon>
            <p>没有找到匹配的模型</p>
            <el-button @click="resetFilters">重置筛选</el-button>
          </div>
          <div v-for="model in filteredValidModels" :key="model.id" class="model-card tech-card" :class="getRowClass(model)">
          <div class="card-header">
            <span class="vendor-badge">{{ model.vendor }}</span>
            <el-tag size="small" :type="getModelTypeTagType(model.modelType)">
              {{ modelTypeLabels[model.modelType] }}
            </el-tag>
            <el-tag size="small" :type="getVerificationTagType(model.verificationStatus)">
              {{ verificationStatusLabels[model.verificationStatus] }}
            </el-tag>
            <el-tag size="small" effect="plain" class="billing-tag">
              {{ billingModeLabels[model.billingMode] }}
            </el-tag>
          </div>
          <h3 class="card-model-name">{{ model.modelName }}</h3>
          <div class="card-prices">
            <div class="price-item">
              <span class="price-label">输入价格</span>
              <span v-if="model.inputPricePerMillion !== undefined && model.currency && model.priceUnit" class="price-value">
                {{ formatPriceWithCurrency(model.inputPricePerMillion, model.currency) }}/M
              </span>
              <span v-else-if="model.inputPricePerMillion !== undefined" class="price-value price-uncertain">
                {{ formatPriceWithCurrency(model.inputPricePerMillion, model.currency) || '单位待确认' }}
              </span>
              <span v-else class="price-pending">未获取到</span>
            </div>
            <div class="price-item">
              <span class="price-label">输出价格</span>
              <span v-if="model.outputPricePerMillion !== undefined && model.currency && model.priceUnit" class="price-value">
                {{ formatPriceWithCurrency(model.outputPricePerMillion, model.currency) }}/M
              </span>
              <span v-else-if="model.outputPricePerMillion !== undefined" class="price-value price-uncertain">
                {{ formatPriceWithCurrency(model.outputPricePerMillion, model.currency) || '单位待确认' }}
              </span>
              <span v-else class="price-pending">未获取到</span>
            </div>
          </div>
          <div class="card-meta">
            <el-tag size="small" :type="getModelStatus(model).statusType">
              {{ getModelStatus(model).statusText }}
            </el-tag>
            <span v-if="model.note" class="card-note">{{ model.note }}</span>
          </div>
          <div class="card-info">
            <div v-if="model.contextLength" class="info-item">
              <span class="info-label">上下文：</span>
              <span>{{ model.contextLength }}</span>
            </div>
            <div v-if="model.freeQuota" class="info-item">
              <span class="info-label">免费额度：</span>
              <span>{{ model.freeQuota }}</span>
            </div>
            <div v-if="model.scenario" class="info-item">
              <span class="info-label">适用场景：</span>
              <span>{{ model.scenario }}</span>
            </div>
            <div v-if="model.recommendTags && model.recommendTags.length > 0" class="info-item">
              <span class="info-label">推荐：</span>
              <span class="card-tags">
                <el-tag v-for="tag in model.recommendTags" :key="tag" size="small" type="info">
                  {{ recommendTagLabels[tag] }}
                </el-tag>
              </span>
            </div>
          </div>
          <div class="card-actions">
            <el-button size="small" @click="openApiAccessPanel(model)">API接入</el-button>
            <el-button size="small" @click="openDetailPanel(model)">详情</el-button>
            <a v-if="model.officialSourceUrl" :href="model.officialSourceUrl" target="_blank" rel="noopener" class="source-link">
              官方来源
            </a>
            <span v-else class="source-missing">来源待补充</span>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- 成本计算器 -->
    <div class="calculator-section tech-card">
      <div class="section-header">
        <h2><el-icon><DataAnalysis /></el-icon> 成本计算器</h2>
      </div>
      <div class="calc-layout">
        <div class="calc-form">
          <div class="form-group">
            <label class="form-label">选择模型（可多选对比）</label>
            <el-select v-model="calc.modelIds" multiple placeholder="选择模型进行对比" class="calc-select">
              <el-option
                v-for="m in modelsWithPrice"
                :key="m.id"
                :label="`${m.vendor} - ${m.modelName}`"
                :value="m.id"
              />
            </el-select>
          </div>
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">预计输入 tokens</label>
              <el-input-number v-model="calc.inputTokens" :min="0" :step="1000" class="calc-input" />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">预计输出 tokens</label>
              <el-input-number v-model="calc.outputTokens" :min="0" :step="1000" class="calc-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">每天调用次数</label>
              <el-input-number v-model="calc.dailyCalls" :min="1" :step="10" class="calc-input" />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">使用天数</label>
              <el-input-number v-model="calc.days" :min="1" :step="1" class="calc-input" />
            </div>
          </div>
        </div>
        <div class="calc-result">
          <div v-if="calc.modelIds.length === 0" class="calc-placeholder">
            <el-icon :size="32"><DataAnalysis /></el-icon>
            <p>请先选择一个或多个模型</p>
          </div>
          <div v-else class="calc-compare-list">
            <div v-for="r in calcResults" :key="r.model.id" class="compare-item">
              <div class="compare-header">
                <span class="vendor-badge">{{ r.model.vendor }}</span>
                <span class="compare-name">{{ r.model.modelName }}</span>
              </div>
              <div v-if="!r.canCalculate" class="compare-error">
                <el-icon><Warning /></el-icon>
                <span>{{ r.errorMessage }}</span>
              </div>
              <div v-else class="compare-body">
                <div v-if="r.hasRisk" class="calc-risk">
                  <el-icon><Warning /></el-icon>
                  <span>{{ r.riskMessage }}</span>
                </div>
                <div class="compare-row">
                  <span class="compare-label">单次调用</span>
                  <span class="compare-value">¥{{ r.singleCall }}</span>
                </div>
                <div class="compare-row">
                  <span class="compare-label">每日成本</span>
                  <span class="compare-value">¥{{ r.daily }}</span>
                </div>
                <div class="compare-row highlight">
                  <span class="compare-label">{{ calc.days }}天总成本</span>
                  <span class="compare-value total">¥{{ r.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 套餐 Plan 区 -->
    <div class="plan-section">
      <div class="section-header">
        <h2>套餐 / Plan 信息</h2>
      </div>
      <div class="plan-grid">
        <div v-for="plan in allPlans" :key="plan.id" class="plan-card tech-card">
          <div class="plan-header">
            <span class="vendor-badge">{{ plan.vendor }}</span>
            <span class="plan-name">{{ plan.planName }}</span>
          </div>
          <div class="plan-price">{{ plan.price }}</div>
          <div class="plan-quota">{{ plan.quota }}</div>
          <div v-if="plan.period" class="plan-period">有效期：{{ plan.period }}</div>
          <div v-if="plan.suitableFor" class="plan-suitable">适合：{{ plan.suitableFor }}</div>
          <div v-if="plan.note" class="plan-note">{{ plan.note }}</div>
          <a :href="plan.officialSourceUrl" target="_blank" rel="noopener" class="source-link">
            查看官方详情
          </a>
        </div>
      </div>
    </div>

    <!-- 数据来源管理区 -->
    <div class="source-section">
      <div class="section-header">
        <h2>数据来源管理</h2>
      </div>
      <div class="source-grid">
        <div v-for="src in vendorSources" :key="src.vendor" class="source-card tech-card">
          <div class="source-header">
            <span class="vendor-badge">{{ src.vendor }}</span>
            <el-tag size="small" :type="getVerificationTagType(src.verificationStatus)">
              {{ verificationStatusLabels[src.verificationStatus] }}
            </el-tag>
          </div>
          <div v-if="src.note" class="source-note">{{ src.note }}</div>
          <div class="source-meta">
            <span v-if="src.lastVerifiedAt" class="source-time">最后核验：{{ src.lastVerifiedAt }}</span>
          </div>
          <div class="source-links">
            <a :href="src.priceUrl" target="_blank" rel="noopener" class="source-link">价格页</a>
            <a v-if="src.consoleUrl" :href="src.consoleUrl" target="_blank" rel="noopener" class="source-link">控制台</a>
            <a v-if="src.docsUrl" :href="src.docsUrl" target="_blank" rel="noopener" class="source-link">文档</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 价格快照 / 更新记录 -->
    <div class="snapshot-section tech-card">
      <div class="section-header">
        <h2>更新记录</h2>
        <div class="snapshot-actions">
          <el-button size="small" type="primary" @click="showAddSnapshot = true">添加记录</el-button>
          <el-popconfirm
            title="确定清空所有更新记录吗？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="clearSnapshots"
          >
            <template #reference>
              <el-button size="small" type="danger">清空记录</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
      <div v-if="snapshots.length === 0" class="empty-snapshots">
        <p>暂无更新记录</p>
      </div>
      <div v-else class="snapshot-list">
        <div v-for="snap in snapshots" :key="snap.id" class="snapshot-item">
          <div class="snap-time">{{ snap.time }}</div>
          <div class="snap-content">{{ snap.content }}</div>
        </div>
      </div>
    </div>

    <!-- 添加记录弹窗 -->
    <el-dialog v-model="showAddSnapshot" title="添加更新记录" width="400px">
      <el-input
        v-model="newSnapshotContent"
        type="textarea"
        :rows="3"
        placeholder="请输入更新内容"
      />
      <template #footer>
        <el-button @click="showAddSnapshot = false">取消</el-button>
        <el-button type="primary" @click="addSnapshot" :disabled="!newSnapshotContent.trim()">
          添加
        </el-button>
      </template>
    </el-dialog>

    <!-- API 接入示例面板 -->
    <el-drawer v-model="showApiAccessPanel" :title="selectedModelForApi?.modelName + ' API 接入'" size="500px">
      <div v-if="selectedModelForApi" class="api-panel">
        <div class="api-model-info">
          <span class="vendor-badge">{{ selectedModelForApi.vendor }}</span>
          <span class="model-name">{{ selectedModelForApi.modelName }}</span>
        </div>
        <div class="api-endpoint">
          <div class="api-endpoint-url">
            <span class="endpoint-label">Endpoint</span>
            <code>{{ (selectedModelForApi as any).apiAccess?.baseUrl }}{{ (selectedModelForApi as any).apiAccess?.endpoint }}</code>
          </div>
          <div class="api-model-id">
            <span class="endpoint-label">模型 ID</span>
            <code>{{ (selectedModelForApi as any).apiAccess?.apiModelId || selectedModelForApi.modelName }}</code>
          </div>
        </div>
        <div class="api-examples">
          <div class="example-tabs">
            <el-button size="small" :type="activeExampleTab === 'curl' ? 'primary' : ''" @click="activeExampleTab = 'curl'">cURL</el-button>
            <el-button size="small" :type="activeExampleTab === 'javascript' ? 'primary' : ''" @click="activeExampleTab = 'javascript'">JavaScript</el-button>
            <el-button size="small" :type="activeExampleTab === 'python' ? 'primary' : ''" @click="activeExampleTab = 'python'">Python</el-button>
            <el-button size="small" :type="activeExampleTab === 'opencode' ? 'primary' : ''" @click="activeExampleTab = 'opencode'">OpenCode</el-button>
          </div>
          <div class="example-code">
            <pre v-if="activeExampleTab === 'curl'">{{ generateExample('curl') }}</pre>
            <pre v-if="activeExampleTab === 'javascript'">{{ generateExample('javascript') }}</pre>
            <pre v-if="activeExampleTab === 'python'">{{ generateExample('python') }}</pre>
            <pre v-if="activeExampleTab === 'opencode'">{{ generateExample('opencode') }}</pre>
          </div>
          <el-button type="primary" size="small" class="copy-example-btn" @click="copyApiExample(activeExampleTab as 'curl' | 'javascript' | 'python' | 'opencode')">
            复制示例代码
          </el-button>
        </div>
        <div v-if="(selectedModelForApi as any).apiAccess?.docsUrl" class="api-links">
          <a :href="(selectedModelForApi as any).apiAccess.docsUrl" target="_blank" rel="noopener" class="api-doc-link">官方文档</a>
          <a v-if="(selectedModelForApi as any).apiAccess?.consoleUrl" :href="(selectedModelForApi as any).apiAccess.consoleUrl" target="_blank" rel="noopener" class="api-doc-link">控制台</a>
        </div>
        <div class="api-note">
          <p>请将 <code>&lt;YOUR_API_KEY&gt;</code> 替换为您的真实 API Key</p>
        </div>
      </div>
    </el-drawer>

    <!-- 解析详情弹窗 -->
    <el-dialog v-model="showDetailPanel" :title="selectedModelForDetail?.modelName + ' 解析详情'" width="700px">
      <div v-if="selectedModelForDetail" class="detail-panel">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">厂商</span>
              <span class="detail-value">{{ selectedModelForDetail.vendor }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">模型名</span>
              <span class="detail-value">{{ selectedModelForDetail.modelName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">API Model ID</span>
              <span class="detail-value">{{ (selectedModelForDetail as Record<string, any>).apiModelId || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>解析状态</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">sourceType</span>
              <span class="detail-value">{{ (selectedModelForDetail as Record<string, any>).sourceType || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">parserStatus</span>
              <span class="detail-value">{{ (selectedModelForDetail as Record<string, any>).parserStatus || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">fetchStatus</span>
              <span class="detail-value">{{ (selectedModelForDetail as Record<string, any>).fetchStatus || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">verifyStatus</span>
              <span class="detail-value">{{ (selectedModelForDetail as Record<string, any>).verifyStatus || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>价格信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">输入价格</span>
              <span class="detail-value">
                {{ selectedModelForDetail.inputPricePerMillion !== undefined ? selectedModelForDetail.inputPricePerMillion : '-' }}
                {{ selectedModelForDetail.inputPricePerMillion !== undefined ? `/ ${selectedModelForDetail.currency || '-'}` : '' }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">输出价格</span>
              <span class="detail-value">
                {{ selectedModelForDetail.outputPricePerMillion !== undefined ? selectedModelForDetail.outputPricePerMillion : '-' }}
                {{ selectedModelForDetail.outputPricePerMillion !== undefined ? `/ ${selectedModelForDetail.currency || '-'}` : '' }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">价格单位</span>
              <span class="detail-value">{{ (selectedModelForDetail as Record<string, any>).priceUnit || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">货币</span>
              <span class="detail-value">{{ selectedModelForDetail.currency || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>成本计算</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">可参与计算</span>
              <span class="detail-value" :class="getModelStatus(selectedModelForDetail as Record<string, any>).canCalculateCost ? 'text-success' : 'text-danger'">
                {{ getModelStatus(selectedModelForDetail as Record<string, any>).canCalculateCost ? '是' : '否' }}
              </span>
            </div>
            <div class="detail-item full-width">
              <span class="detail-label">不参与原因</span>
              <span class="detail-value text-muted">
                {{ getModelStatus(selectedModelForDetail as Record<string, any>).cannotCalculateReason || '无' }}
              </span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>错误信息</h4>
          <div class="detail-error">
            {{ (selectedModelForDetail as Record<string, any>).parserError || '无' }}
          </div>
        </div>
        <div class="detail-section">
          <h4>数据来源</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">官方来源</span>
              <span class="detail-value">
                <a v-if="selectedModelForDetail.officialSourceUrl" :href="selectedModelForDetail.officialSourceUrl" target="_blank" rel="noopener">
                  {{ selectedModelForDetail.officialSourceUrl }}
                </a>
                <span v-else>-</span>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">抓取时间</span>
              <span class="detail-value">
                {{ (selectedModelForDetail as Record<string, any>).fetchedAt ? new Date((selectedModelForDetail as Record<string, any>).fetchedAt).toLocaleString('zh-CN') : '-' }}
              </span>
            </div>
          </div>
        </div>
        <div class="detail-section">
          <h4>解析详情</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">parserVersion</span>
              <span class="detail-value">{{ (selectedModelForDetail as Record<string, any>).parserVersion || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">rawTextHash</span>
              <span class="detail-value">{{ (selectedModelForDetail as Record<string, any>).rawTextHash || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Search, Warning, DataAnalysis, Sort
} from '@element-plus/icons-vue'
import {
  modelPrices as manualModelPrices,
  modelPlans as manualModelPlans,
  modelTypeLabels,
  billingModeLabels,
  recommendTagLabels,
  vendorSources,
  verificationStatusLabels,
  getFreshnessLabel,
  getModelStatus,
  getParseStatus,
  getPriceStatus,
  getDataFreshness,
  getSourceDisplay,
  type ModelPriceItem,
  type ModelType,
  type BillingMode,
  type VerificationStatus
} from '@/data/modelPrices'

import generatedData from '@/data/generated/model-prices.latest.json' with { type: 'json' }

const generatedModelPrices = (generatedData as any)?.models as ModelPriceItem[] | undefined
const generatedSources = (generatedData as any)?.sources as any[] | undefined
const generatedFailedSources = (generatedData as any)?.failedSources as any[] | undefined
const generatedAt = (generatedData as any)?.generatedAt as string | undefined
const fetchSummary = (generatedData as any)?.fetchSummary as { successSources: number; failedSources: number; manualRequiredSources: number } | undefined

const allModels = ref<ModelPriceItem[]>(
  generatedModelPrices && generatedModelPrices.length > 0
    ? generatedModelPrices
    : [...manualModelPrices]
)
const allPlans = ref([...manualModelPlans])
const lastUpdateTime = ref(
  generatedAt
    ? new Date(generatedAt).toLocaleDateString('zh-CN')
    : '2025-05-04'
)

interface Snapshot {
  id: number
  time: string
  content: string
}

const snapshots = ref<Snapshot[]>([])
const showAddSnapshot = ref(false)
const newSnapshotContent = ref('')
const sortMode = ref<'input-asc' | 'input-desc'>('input-asc')

const selectedModelForApi = ref<ModelPriceItem | null>(null)
const showApiAccessPanel = ref(false)
const activeExampleTab = ref<'curl' | 'javascript' | 'python' | 'opencode'>('curl')

const selectedModelForDetail = ref<ModelPriceItem | null>(null)
const showDetailPanel = ref(false)

const filters = reactive({
  vendor: '',
  modelType: '' as ModelType | '',
  billingMode: '' as BillingMode | '',
  keyword: '',
  verificationStatus: '' as VerificationStatus | '',
  freshnessFilter: '' as '' | 'fresh' | 'stale' | 'critical' | 'unchecked',
  priceCompleteOnly: false,
  sourceMissingOnly: false
})

const calc = reactive({
  modelIds: [] as string[],
  inputTokens: 1000,
  outputTokens: 500,
  dailyCalls: 100,
  days: 30
})

const STORAGE_KEY = 'rebol_model_price_snapshots'
const router = useRouter()

const hasGeneratedData = computed(() =>
  generatedModelPrices !== undefined && generatedModelPrices.length > 0
)

onMounted(() => {
  loadSnapshots()
})

function loadSnapshots() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      snapshots.value = JSON.parse(stored)
    }
  } catch {
    // ignore
  }
}

function saveSnapshots() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots.value))
  } catch {
    // ignore
  }
}

function addSnapshot() {
  if (!newSnapshotContent.value.trim()) return
  const now = new Date()
  snapshots.value.unshift({
    id: Date.now(),
    time: now.toLocaleString('zh-CN'),
    content: newSnapshotContent.value.trim()
  })
  saveSnapshots()
  newSnapshotContent.value = ''
  showAddSnapshot.value = false
  ElMessage.success('记录已添加')
}

function clearSnapshots() {
  snapshots.value = []
  saveSnapshots()
  ElMessage.success('记录已清空')
}

const vendorOptions = computed(() => {
  const vendors = new Set(allModels.value.map(m => m.vendor))
  return Array.from(vendors).sort()
})

const filteredModels = computed(() => {
  return filteredValidModels.value
})

const reliabilityStats = computed(() => {
  const total = allModels.value.length
  const statsList = allModels.value.map(m => getModelStatus(m as Record<string, any>))
  const successCount = statsList.filter(s => s.statusType === 'success').length
  const partialCount = statsList.filter(s => s.statusType === 'warning').length
  const failedCount = statsList.filter(s => s.statusType === 'danger').length
  const canCalculate = statsList.filter(s => s.canCalculateCost).length
  const cannotCalculate = statsList.filter(s => !s.canCalculateCost).length
  const legacyFallback = allModels.value.filter(m => (m as Record<string, any>).sourceType === 'legacy_fallback').length
  return {
    total,
    successCount,
    partialCount,
    failedCount,
    canCalculate,
    cannotCalculate,
    legacyFallback,
    missingSource: allModels.value.filter(m => !m.officialSourceUrl).length
  }
})

const modelsWithPrice = computed(() => {
  return allModels.value.filter(m => {
    const status = getModelStatus(m as Record<string, any>)
    return status.canCalculateCost
  })
})

const activeTab = ref<'valid' | 'failed'>('valid')

const validModels = computed(() => {
  return allModels.value.filter(m => {
    const model = m as Record<string, any>
    const parseStatus = getParseStatus(model)
    const sourceDisplay = getSourceDisplay(model)
    if (parseStatus.type === 'failed') return false
    if (sourceDisplay.type === 'fallback') return false
    if (sourceDisplay.type === 'missing') return false
    return true
  })
})

const filteredValidModels = computed(() => {
  let result = validModels.value.filter(m => {
    if (filters.vendor && m.vendor !== filters.vendor) return false
    if (filters.modelType && m.modelType !== filters.modelType) return false
    if (filters.billingMode && m.billingMode !== filters.billingMode) return false
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const tags = (m.recommendTags || []).map((t) => recommendTagLabels[t as keyof typeof recommendTagLabels]).join(' ')
      const searchable = [m.vendor, m.modelName, m.scenario, m.note, m.sourceNote, tags].filter(Boolean).join(' ').toLowerCase()
      if (!searchable.includes(kw)) return false
    }
    return true
  })
  result.sort((a, b) => {
    const priceA = a.inputPricePerMillion ?? 999999
    const priceB = b.inputPricePerMillion ?? 999999
    return sortMode.value === 'input-asc' ? priceA - priceB : priceB - priceA
  })
  return result
})

const failedModels = computed(() => {
  return allModels.value.filter(m => {
    const model = m as Record<string, any>
    const parseStatus = getParseStatus(model)
    return parseStatus.type === 'failed'
  })
})

interface CalcResult {
  model: ModelPriceItem
  canCalculate: boolean
  errorMessage?: string
  hasRisk?: boolean
  riskMessage?: string
  singleCall?: string
  daily?: string
  total?: string
  inputCost?: string
  outputCost?: string
}

const calcResults = computed((): CalcResult[] => {
  if (calc.modelIds.length === 0) return []

  return calc.modelIds.map(id => {
    const model = allModels.value.find(m => m.id === id)!

    const hasPrice = model.inputPricePerMillion !== undefined && model.outputPricePerMillion !== undefined

    if (!hasPrice) {
      return {
        model,
        canCalculate: false,
        errorMessage: '输入/输出价格缺失，无法估算'
      }
    }

    if (model.priceUnit !== 'per_1m_tokens') {
      return {
        model,
        canCalculate: false,
        errorMessage: `当前计费单位（${model.priceUnit}）暂不支持自动估算`
      }
    }

    if (model.currency !== 'CNY' && model.currency !== 'USD') {
      return {
        model,
        canCalculate: false,
        errorMessage: `币种（${model.currency}）未知，无法准确估算`
      }
    }

    const isRisky = ['stale', 'needs_review', 'deprecated', 'unknown'].includes(model.verificationStatus)
    let riskMessage = ''
    if (model.verificationStatus === 'stale' || model.verificationStatus === 'deprecated') {
      riskMessage = '数据可能过期，结果仅供参考'
    } else if (model.verificationStatus === 'needs_review' || model.verificationStatus === 'unknown') {
      riskMessage = '数据未核验，结果仅供参考'
    }

    const inputCost = (calc.inputTokens / 1_000_000) * (model.inputPricePerMillion || 0)
    const outputCost = (calc.outputTokens / 1_000_000) * (model.outputPricePerMillion || 0)
    const singleCall = inputCost + outputCost
    const daily = singleCall * calc.dailyCalls
    const total = daily * calc.days

    return {
      model,
      canCalculate: true,
      hasRisk: isRisky,
      riskMessage,
      singleCall: singleCall.toFixed(4),
      daily: daily.toFixed(2),
      total: total.toFixed(2),
      inputCost: inputCost.toFixed(4),
      outputCost: outputCost.toFixed(4)
    }
  })
})

function getRowClass(model: ModelPriceItem): string {
  const label = getFreshnessLabel(model.lastCheckedAt, model.verificationStatus)
  if (['严重过期', '已废弃'].includes(label)) return 'row-danger'
  if (label === '可能过期') return 'row-warning'
  return ''
}

function getVerificationTagType(status: VerificationStatus): '' | 'success' | 'warning' | 'danger' | 'info' | 'default' {
  const map: Record<VerificationStatus, '' | 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    verified: 'success',
    needs_review: 'warning',
    stale: 'warning',
    deprecated: 'danger',
    unknown: 'info',
    auto_fetched: 'success'
  }
  return map[status] || 'info'
}

type ParseStatusType = 'success' | 'partial' | 'failed' | 'not_adapted' | 'fallback' | 'unknown'
type PriceStatusType = 'complete' | 'partial' | 'not_fetched' | 'unit_unconfirmed' | 'unknown'
type FreshnessType = 'recent' | 'suggest_review' | 'possibly_stale' | 'deprecated' | 'not_applicable'
type SourceDisplayType = 'official' | 'snapshot' | 'fallback' | 'missing'

function getParseStatusTagType(type: ParseStatusType): '' | 'success' | 'warning' | 'danger' | 'info' | 'default' {
  const map: Record<ParseStatusType, '' | 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    success: 'success',
    partial: 'warning',
    failed: 'danger',
    not_adapted: 'info',
    fallback: 'info',
    unknown: 'default'
  }
  return map[type] || 'default'
}

function getPriceStatusTagType(type: PriceStatusType): '' | 'success' | 'warning' | 'danger' | 'info' | 'default' {
  const map: Record<PriceStatusType, '' | 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    complete: 'success',
    partial: 'warning',
    not_fetched: 'danger',
    unit_unconfirmed: 'warning',
    unknown: 'default'
  }
  return map[type] || 'default'
}

function getFreshnessTagClass(type: FreshnessType): string {
  const map: Record<FreshnessType, string> = {
    recent: 'freshness-recent',
    suggest_review: 'freshness-review',
    possibly_stale: 'freshness-stale',
    deprecated: 'freshness-deprecated',
    not_applicable: 'freshness-na'
  }
  return map[type] || ''
}

function getSourceTagClass(type: SourceDisplayType): string {
  const map: Record<SourceDisplayType, string> = {
    official: '',
    snapshot: 'source-snapshot',
    fallback: 'source-fallback',
    missing: 'source-missing'
  }
  return map[type] || ''
}

function getCurrencySymbol(currency: string | undefined): string {
  if (currency === 'USD') return '$'
  if (currency === 'CNY') return '¥'
  return ''
}

function formatPriceWithCurrency(price: number | undefined, currency: string | undefined): string {
  if (price === undefined || price === null || isNaN(price)) return '未获取到'
  const symbol = getCurrencySymbol(currency)
  if (price === 0) return symbol + '免费'
  if (price < 0.01) return symbol + price.toFixed(3)
  if (price < 1) return symbol + price.toFixed(2)
  return symbol + price.toFixed(1)
}

function getModelTypeTagType(type: ModelType): '' | 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<ModelType, '' | 'success' | 'warning' | 'danger' | 'info'> = {
    text: '',
    code: 'success',
    vision: 'warning',
    audio: 'danger',
    video: 'info',
    embedding: 'info',
    reasoning: 'warning',
    other: 'info'
  }
  return map[type] || 'info'
}

function resetFilters() {
  filters.vendor = ''
  filters.modelType = ''
  filters.billingMode = ''
  filters.keyword = ''
  filters.verificationStatus = ''
  filters.freshnessFilter = ''
  filters.priceCompleteOnly = false
  filters.sourceMissingOnly = false
}

function openApiAccessPanel(model: ModelPriceItem) {
  selectedModelForApi.value = model
  showApiAccessPanel.value = true
}

function openDetailPanel(model: ModelPriceItem) {
  selectedModelForDetail.value = model
  showDetailPanel.value = true
}

function copyApiExample(format: 'curl' | 'javascript' | 'python' | 'opencode') {
  if (!selectedModelForApi.value) return
  const model = selectedModelForApi.value
  const apiAccess = (model as any).apiAccess
  if (!apiAccess) return

  let example = ''
  switch (format) {
    case 'curl':
      example = `curl ${apiAccess.baseUrl}${apiAccess.endpoint} \\
  -H "Content-Type: application/json" \\
  -H "${apiAccess.authHeader.replace('<API_KEY>', '<YOUR_API_KEY>')}" \\
  -d '{"model": "${model.apiModelId || model.modelName}", "messages": [{"role": "user", "content": "Hello"}]}'
`
      break
    case 'javascript':
      example = `// ${model.vendor} API 调用示例
const response = await fetch('${apiAccess.baseUrl}${apiAccess.endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    '${apiAccess.authHeader.split(':')[0]}': '<YOUR_API_KEY>'
  },
  body: JSON.stringify({
    model: '${model.apiModelId || model.modelName}',
    messages: [{ role: 'user', content: 'Hello' }]
  })
})
const data = await response.json()
console.log(data)
`
      break
    case 'python':
      example = `# ${model.vendor} API 调用示例
import requests

response = requests.post(
    '${apiAccess.baseUrl}${apiAccess.endpoint}',
    headers={
        'Content-Type': 'application/json',
        '${apiAccess.authHeader.split(':')[0]}': '<YOUR_API_KEY>'
    },
    json={
        'model': '${model.apiModelId || model.modelName}',
        'messages': [{'role': 'user', 'content': 'Hello'}]
    }
)
print(response.json())
`
      break
    case 'opencode':
      example = `# OpenCode 配置示例
# 在 OpenCode 的模型配置中使用以下信息
厂商: ${model.vendor}
模型: ${model.apiModelId || model.modelName}
Base URL: ${apiAccess.baseUrl}
Endpoint: ${apiAccess.endpoint}
认证方式: ${apiAccess.authHeader.split(':')[0]}
兼容 OpenAI: ${apiAccess.compatibleWithOpenAI ? '是' : '否'}
文档: ${apiAccess.docsUrl || '无'}
`
      break
  }

  navigator.clipboard.writeText(example).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function generateExample(format: 'curl' | 'javascript' | 'python' | 'opencode'): string {
  if (!selectedModelForApi.value) return ''
  const model = selectedModelForApi.value as any
  const apiAccess = model.apiAccess
  if (!apiAccess) return ''

  const modelId = model.apiModelId || model.modelName

  switch (format) {
    case 'curl':
      return `curl ${apiAccess.baseUrl}${apiAccess.endpoint} \\
  -H "Content-Type: application/json" \\
  -H "${apiAccess.authHeader.replace('<API_KEY>', '<YOUR_API_KEY>')}" \\
  -d '{"model": "${modelId}", "messages": [{"role": "user", "content": "Hello"}]}'`
    case 'javascript':
      return `// ${model.vendor} API 调用示例
const response = await fetch('${apiAccess.baseUrl}${apiAccess.endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    '${apiAccess.authHeader.split(':')[0]}': '<YOUR_API_KEY>'
  },
  body: JSON.stringify({
    model: '${modelId}',
    messages: [{ role: 'user', content: 'Hello' }]
  })
})
const data = await response.json()
console.log(data)`
    case 'python':
      return `# ${model.vendor} API 调用示例
import requests

response = requests.post(
    '${apiAccess.baseUrl}${apiAccess.endpoint}',
    headers={
        'Content-Type': 'application/json',
        '${apiAccess.authHeader.split(':')[0]}': '<YOUR_API_KEY>'
    },
    json={
        'model': '${modelId}',
        'messages': [{'role': 'user', 'content': 'Hello'}]
    }
)
print(response.json())`
    case 'opencode':
      return `# OpenCode 配置示例
# 在 OpenCode 的模型配置中使用以下信息
厂商: ${model.vendor}
模型: ${modelId}
Base URL: ${apiAccess.baseUrl}
Endpoint: ${apiAccess.endpoint}
认证方式: ${apiAccess.authHeader.split(':')[0]}
兼容 OpenAI: ${apiAccess.compatibleWithOpenAI ? '是' : '否'}
文档: ${apiAccess.docsUrl || '无'}`
    default:
      return ''
  }
}

function exportJSON() {
  const data = {
    exportedAt: new Date().toISOString(),
    toolVersion: 'v3-auto-source-check',
    disclaimer: '本工具中的模型价格、套餐和额度信息仅用于学习与选型参考，实际费用以厂商官方页面和控制台账单为准。',
    generatedAt: generatedAt || null,
    fetchSummary: fetchSummary || null,
    models: filteredModels.value,
    plans: allPlans.value,
    vendorSources: generatedSources || vendorSources
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `model-prices-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

function handleImport(file: File): boolean {
  ElMessageBox.confirm('导入将覆盖当前数据，是否继续？', '确认导入', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.models && Array.isArray(data.models)) {
          allModels.value = data.models
          if (data.plans && Array.isArray(data.plans)) {
            allPlans.value = data.plans
          }
          lastUpdateTime.value = new Date().toLocaleDateString('zh-CN')
          ElMessage.success('导入成功')
        } else {
          ElMessage.error('JSON 格式不正确')
        }
      } catch {
        ElMessage.error('JSON 解析失败')
      }
    }
    reader.readAsText(file)
  }).catch(() => {})
  return false
}

function goBack() {
  router.push('/tools')
}
</script>

<style scoped lang="scss">
.radar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.radar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .back-btn {
    color: var(--text-muted);
    font-size: 0.9rem;
    &:hover { color: var(--primary-color); }
  }

  .header-divider {
    width: 1px;
    height: 32px;
    background: var(--border-color);
  }

  h1 {
    font-size: 1.8rem;
    margin: 0 0 4px;
  }

  .description {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0;
  }

  .header-meta {
    display: flex;
    gap: 16px;
    font-size: 0.8rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
}

// 数据可靠性提示
.reliability-notice {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(210, 153, 34, 0.05);
  border-color: rgba(210, 153, 34, 0.3);

  .notice-icon {
    flex-shrink: 0;
    .el-icon {
      font-size: 24px;
      color: #d29922;
    }
  }

  .notice-content {
    h3 {
      margin: 0 0 8px;
      font-size: 1rem;
      color: var(--text-color);
    }

    p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.6;

      strong {
        color: #d29922;
      }
    }
  }
}

.filter-section {
  .filter-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;

    .filter-item { width: 180px; }
    .filter-search { flex: 1; min-width: 200px; }
    .filter-checkboxes { display: flex; gap: 16px; align-items: center; }
  }

  .filter-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;

    .inline-upload { display: inline-block; }
  }
}

.stats-bar {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 20px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    min-width: 100px;

    .stat-value {
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 1.3rem;
      color: var(--text-color);

      &.success { color: var(--accent-color); }
      &.warning { color: #d29922; }
      &.danger { color: #c4564a; }
      &.muted { color: var(--text-muted); }
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    font-size: 1.3rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .result-count {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
}

.price-section {
  .price-table-wrapper { overflow-x: auto; }
}

.price-table {
  min-width: 1200px;

  .table-header {
    display: grid;
    grid-template-columns: 90px 180px 60px 75px 90px 90px 80px 90px 100px 60px;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px 8px 0 0;
    border: 1px solid var(--border-color);
    border-bottom: none;
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .table-row {
    display: grid;
    grid-template-columns: 90px 180px 60px 75px 90px 90px 80px 90px 100px 60px;
    gap: 8px;
    padding: 12px 16px;
    border: 1px solid var(--border-color);
    border-top: none;
    font-size: 0.85rem;
    align-items: center;
    transition: background 0.2s;

    &:hover { background: rgba(88, 166, 255, 0.03); }
    &:last-child { border-radius: 0 0 8px 8px; }
    &.row-warning { background: rgba(210, 153, 34, 0.05); }
    &.row-danger { background: rgba(196, 86, 74, 0.05); }
  }
}

.vendor-badge {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(88, 166, 255, 0.1);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-color);
  white-space: nowrap;
}

.model-name { font-weight: 500; color: var(--text-color); }
.model-note { font-size: 0.7rem; color: var(--text-muted); margin-top: 2px; }

.price-value {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--accent-color);
}

.price-pending {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.8rem;
}

.price-uncertain {
  color: var(--warning-color, #e6a23c);
  font-style: italic;
}

.source-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.8rem;
  &:hover { text-decoration: underline; }
}

.source-missing {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-style: italic;
}

// 新鲜度标签
.freshness-fresh { color: var(--accent-color); font-size: 0.8rem; font-weight: 600; }
.freshness-ok { color: var(--text-muted); font-size: 0.8rem; }
.freshness-stale { color: #d29922; font-size: 0.8rem; font-weight: 600; }
.freshness-critical { color: #c4564a; font-size: 0.8rem; font-weight: 700; }
.freshness-review { color: #d29922; font-size: 0.8rem; }
.freshness-deprecated { color: #c4564a; font-size: 0.8rem; text-decoration: line-through; }
.freshness-unchecked { color: var(--text-muted); font-size: 0.8rem; font-style: italic; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-muted);

  p { margin: 16px 0; font-size: 1rem; }
}

// 移动端卡片
.mobile-only { display: none; }

.model-card {
  margin-bottom: 16px;

  &.row-warning { border-color: rgba(210, 153, 34, 0.3); }
  &.row-danger { border-color: rgba(196, 86, 74, 0.3); }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .card-model-name { margin: 0 0 12px; font-size: 1.1rem; }

  .card-prices {
    display: flex;
    gap: 24px;
    margin-bottom: 12px;

    .price-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .price-label { font-size: 0.75rem; color: var(--text-muted); }
      .price-value { font-size: 1.1rem; }
    }
  }

  .card-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 12px;

    .freshness-badge { font-size: 0.75rem; }
    .card-note { font-size: 0.75rem; color: var(--text-muted); }
  }

  .card-info {
    margin-bottom: 12px;

    .info-item {
      font-size: 0.85rem;
      margin-bottom: 4px;

      .info-label { color: var(--text-muted); }
    }
  }

  .card-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid var(--border-color);
  }
}

// 成本计算器
.calculator-section {
  .calc-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .calc-form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .form-row {
      display: flex;
      gap: 16px;
      .flex-1 { flex: 1; }
    }

    .calc-select, .calc-input { width: 100%; }
  }

  .calc-result {
    display: flex;
    align-items: center;
    justify-content: center;

    .calc-placeholder, .calc-warning {
      text-align: center;
      color: var(--text-muted);
      p { margin: 12px 0 0; }
    }
  }
}

.compare-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 12px;

  &:last-child { margin-bottom: 0; }

  .compare-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .compare-name { font-weight: 600; font-size: 0.95rem; }
  }

  .compare-error {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #c4564a;
    font-size: 0.85rem;
  }

  .calc-risk {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #d29922;
    font-size: 0.8rem;
    padding: 6px 10px;
    background: rgba(210, 153, 34, 0.1);
    border-radius: 4px;
    margin-bottom: 12px;
  }

  .compare-body { display: flex; gap: 16px; flex-wrap: wrap; }

  .compare-row {
    display: flex;
    flex-direction: column;
    gap: 2px;

    &.highlight .compare-value.total { color: var(--primary-color); font-size: 1.1rem; }

    .compare-label { font-size: 0.75rem; color: var(--text-muted); }
    .compare-value { font-family: var(--font-mono); font-weight: 600; font-size: 0.95rem; color: var(--accent-color); }
  }
}

// Plan 区
.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.plan-card {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .plan-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;

    .plan-name { font-weight: 600; font-size: 1rem; }
  }

  .plan-price { font-family: var(--font-mono); font-weight: 700; font-size: 1.1rem; color: var(--accent-color); }
  .plan-quota, .plan-period, .plan-suitable, .plan-note { font-size: 0.85rem; color: var(--text-muted); }
  .source-link { margin-top: auto; padding-top: 8px; }
}

// 数据来源管理
.source-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.source-card {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .source-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .source-note { font-size: 0.8rem; color: var(--text-muted); }
  .source-meta { font-size: 0.75rem; }
  .source-time { color: var(--text-muted); font-family: var(--font-mono); }
  .source-links { display: flex; gap: 12px; margin-top: auto; padding-top: 8px; }
}

.card-tags { display: flex; gap: 4px; flex-wrap: wrap; }

// 数据来源状态卡片
.source-status-card {
  padding: 16px 20px;

  .source-status-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;

    .source-status-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-color);
    }
  }

  .source-status-meta {
    display: flex;
    gap: 16px;
    font-size: 0.8rem;
    color: var(--text-muted);
    font-family: var(--font-mono);

    .source-mode-tag {
      padding: 2px 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      font-size: 0.7rem;

      &.auto {
        background: rgba(88, 166, 255, 0.1);
        color: var(--primary-color);
      }
    }
  }
}

// 快照区
.snapshot-section {
  .snapshot-actions { display: flex; gap: 8px; }
  .empty-snapshots { text-align: center; padding: 24px; color: var(--text-muted); }
  .snapshot-list {
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .snapshot-item {
    display: flex;
    gap: 16px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    border: 1px solid var(--border-color);

    .snap-time {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-muted);
      white-space: nowrap;
      min-width: 140px;
    }

    .snap-content { font-size: 0.9rem; color: var(--text-color); line-height: 1.5; }
  }
}

.rec-tag { margin-right: 4px; margin-bottom: 2px; }
.no-tags { color: var(--text-muted); font-size: 0.8rem; }

// API 接入面板
.api-panel {
  padding: 0 8px;

  .api-model-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);

    .model-name {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }

  .api-endpoint {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .api-endpoint-url, .api-model-id {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .endpoint-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
      }

      code {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: var(--primary-color);
        word-break: break-all;
      }
    }
  }

  .api-examples {
    margin-bottom: 20px;

    .example-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .example-code {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      max-height: 320px;
      overflow-y: auto;

      pre {
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--text-color);
        white-space: pre-wrap;
        word-break: break-all;
      }
    }

    .copy-example-btn {
      width: 100%;
    }
  }

  .api-links {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    .api-doc-link {
      padding: 6px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-color);
      text-decoration: none;
      font-size: 0.85rem;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--primary-color);
      }
    }
  }

  .api-note {
    padding: 12px 16px;
    background: rgba(255, 200, 0, 0.08);
    border: 1px solid rgba(255, 200, 0, 0.2);
    border-radius: 8px;
    font-size: 0.85rem;
    color: var(--text-muted);

    code {
      background: rgba(255, 200, 0, 0.15);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: var(--font-mono);
      color: #ffc800;
    }
  }
}

@media (max-width: 768px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block !important; }

  .radar-header {
    flex-direction: column;
    .header-left { flex-direction: column; align-items: flex-start; gap: 8px; .header-divider { display: none; } }
    h1 { font-size: 1.4rem; }
  }

  .filter-section {
    .filter-row { flex-direction: column; .filter-item { width: 100%; } }
    .filter-checkboxes { flex-direction: column; align-items: flex-start; }
  }

  .calculator-section { .calc-layout { grid-template-columns: 1fr; } }
  .plan-grid { grid-template-columns: 1fr; }
  .source-grid { grid-template-columns: 1fr; }

  .stats-bar {
    flex-direction: column;
    gap: 8px;

    .stat-item { flex-direction: row; justify-content: space-between; padding: 8px 16px; }
  }
}
</style>