import { getCurrentUser } from 'vuefire';
import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import LedgerView from '@/views/LedgerView.vue';
import IncomeVsExpenseView from '@/modules/report/IncomeVsExpenseView.vue';
import ExpenseBreakdownView from '@/modules/report/ExpenseBreakdownView.vue';

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
        },
        {
            path: '/ledgers/:id/report/income-vs-expense',
            component: IncomeVsExpenseView,
            meta: { requiresAuth: true }
        },
        {
            path: '/ledgers/:id/report/expense-brekdown',
            component: ExpenseBreakdownView,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach(async (to) => {
    const currentUser = await getCurrentUser();

    if (to.meta.requiresAuth && !currentUser) {
        return {
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        };
    }

    if (!to.meta.requiresAuth && currentUser) {
        router.push('/');
    }
});

export default router;
