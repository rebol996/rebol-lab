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
          path: 'projects',
          name: 'projects',
          component: () => import('../views/projects/ProjectsView.vue')
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
