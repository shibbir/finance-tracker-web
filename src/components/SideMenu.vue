<script setup lang="ts">
import { ref } from 'vue';
import Menu from 'primevue/menu';
import { signOut } from 'firebase/auth';
import { useRoute, useRouter } from 'vue-router';
import { useFirebaseAuth, useCurrentUser } from 'vuefire';

import useLedgerStore from '@/modules/ledger/ledger.store';
import format_currency from '@/core/currency_formatter';

const router = useRouter();
const user = useCurrentUser();
const auth = useFirebaseAuth()!;

const route = useRoute();
const store = useLedgerStore();
await store.getLedger(route.params.id);
const ledger = store.ledger;

const items = ref([
    {
        separator: true
    },
    {
        label: 'Accounts',
        items: ledger?.accounts.map((account: { name: any; balance: number; _id: any }) => ({
            label: `${account.name} (${format_currency(account.balance)})`,
            route: `/ledgers/${route.params.id}?account_id=${account._id}`
        }))
    },
    {
        label: 'Reports',
        items: [
            {
                label: 'Income vs Expense',
                route: `/ledgers/${route.params.id}/report/income-vs-expense`
            },
            {
                label: 'Expense Brekdown',
                route: `/ledgers/${route.params.id}/report/expense-brekdown`
            }
        ]
    },
    {
        label: 'Profile',
        items: [
            {
                label: user.value?.displayName,
                route: '/profile'
            },
            {
                label: 'Logout',
                command: () => {
                    signOut(auth);
                    router.push('/login');
                }
            }
        ]
    }
]);

function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}
</script>

<template>
    <Menu :model="items" class="w-full">
        <template #start>
            <span class="inline-flex align-items-center gap-1 px-2 py-2">
                <span class="font-medium text-xl font-semibold">Finance Tracker</span>
                <i class="pi pi-moon" style="color: green" @click="toggleDarkMode()"></i>
            </span>
        </template>
        <template #submenulabel="{ item }">
            <span class="text-primary font-bold">{{ item.label }}</span>
        </template>
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </router-link>
            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span class="ml-2">{{ item.label }}</span>
            </a>
        </template>
    </Menu>
</template>
