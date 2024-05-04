import { getCurrentUser } from 'vuefire';
import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import LedgerView from '@/views/LedgerView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Dashboard,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/ledgers/:id',
            component: LedgerView,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach(async (to) => {
    if (to.meta.requiresAuth) {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return {
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            };
        }
    }
});

export default router;
