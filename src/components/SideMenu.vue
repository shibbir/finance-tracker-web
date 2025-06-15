<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import useLedgerStore from '@/modules/ledger/ledger.store';
import format_currency from '@/core/currency_formatter';

const router = useRouter();
const route = useRoute();

const store = useLedgerStore();
await store.getLedger(route.params.id);
const ledger = store.ledger;

function navigateTo(path: string) {
    router.push(path);
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}
</script>

<template>
    <nav class="menu">
        <div class="menu-header">
            <span class="logo">Finance Tracker</span>
            <i class="pi pi-moon theme-toggle" @click="toggleDarkMode"></i>
        </div>

        <ul class="menu-section">
            <li class="section-title">Accounts</li>
            <li v-for="account in ledger?.accounts" :key="account._id">
                <a @click="navigateTo(`/ledgers/${route.params.id}?account_id=${account._id}`)">
                    {{ account.name }} ({{ format_currency(account.balance) }})
                </a>
            </li>
        </ul>

        <ul class="menu-section">
            <li class="section-title">Reports</li>
            <li>
                <a @click="navigateTo(`/ledgers/${route.params.id}/report/income-vs-expense`)">Income vs Expense</a>
            </li>
            <li>
                <a @click="navigateTo(`/ledgers/${route.params.id}/report/expense-brekdown`)">Expense Breakdown</a>
            </li>
        </ul>

        <ul class="menu-section">
            <li class="section-title">Profile</li>
            <li>
                <a @click="navigateTo('/profile')">My Profile</a>
            </li>
            <li>
                <a @click="navigateTo('/login')">Logout</a>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
.menu {
    width: 250px;
    background: #f9f9f9;
    border-right: 1px solid #ddd;
    padding: 16px;
    font-family: Arial, sans-serif;
}

.menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.logo {
    font-size: 1.4rem;
    font-weight: bold;
}

.theme-toggle {
    cursor: pointer;
}

.menu-section {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
}

.section-title {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #555;
}

.menu-section li a {
    display: block;
    padding: 6px 0;
    color: #333;
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;
}

.menu-section li a:hover {
    color: #007bff;
}
</style>
