import { getCurrentUser } from 'vuefire';
import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import LedgerLayout from '@/components/LedgerLayout.vue';

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
            component: LedgerLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    redirect: (to) => `/ledgers/${to.params.id}/transactions`
                },
                {
                    path: 'transactions',
                    name: 'LedgerTransactions',
                    component: () => import('@/views/TransactionsView.vue')
                },
                {
                    path: 'monthly-report',
                    name: 'MonthlyReport',
                    component: () => import('@/views/IncomeVsExpenseView.vue')
                }
            ]
        }
    ]
});

router.beforeEach(async (to) => {
    const currentUser = await getCurrentUser();

    if (to.meta.requiresAuth && !currentUser) {
        return {
            path: '/login',
            query: { redirect: to.fullPath }
        };
    }

    if (to.path === '/login' && currentUser) {
        return to.query.redirect?.toString() || '/';
    }

    return true;
});

export default router;
