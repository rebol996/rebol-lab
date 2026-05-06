import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/home/HomeView.vue')
        },
        {
          path: 'tools',
          name: 'tools',
          component: () => import('../views/tools/ToolsView.vue')
        },
        {
          path: 'tools/test-case-generator',
          name: 'test-case-generator',
          component: () => import('../views/tools/TestCaseGenerator.vue')
        },
        {
          path: 'tools/bug-report-generator',
          name: 'bug-report-generator',
          component: () => import('../views/tools/BugReportGenerator.vue')
        },
        {
          path: 'tools/project-packager',
          name: 'project-packager',
          component: () => import('../views/tools/ProjectPackager.vue')
        },
        {
          path: 'tools/model-price-radar',
          name: 'model-price-radar',
          component: () => import('../views/tools/ModelPriceRadar.vue')
        },
        {
          path: 'tools/resume-project-generator',
          name: 'resume-project-generator',
          component: () => import('../views/tools/ResumeProjectGenerator.vue')
        },
        {
          path: 'tools/interview-question-generator',
          name: 'interview-question-generator',
          component: () => import('../views/tools/InterviewQuestionGenerator.vue')
        },
        {
          path: 'tools/readme-generator',
          name: 'readme-generator',
          component: () => import('../views/tools/ReadmeGenerator.vue')
        },
        {
          path: 'tools/git-commit-generator',
          name: 'git-commit-generator',
          component: () => import('../views/tools/GitCommitGenerator.vue')
        },
        {
          path: 'tools/problem-notebook',
          name: 'problem-notebook',
          component: () => import('../views/tools/ProblemNotebook.vue')
        },
        {
          path: 'projects',
          name: 'projects',
          component: () => import('../views/projects/ProjectsView.vue')
        },
        {
          path: 'projects/rebol-lab',
          name: 'rebol-lab-detail',
          component: () => import('../views/projects/ProjectDetailView.vue')
        },
        {
          path: 'roadmap',
          name: 'roadmap',
          component: () => import('../views/roadmap/RoadmapView.vue')
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/about/AboutView.vue')
        }
      ]
    }
  ]
})

export default router
