<template>
    <div class="container">
        <div class="grid-layout">
            <aside class="side-panel">
                <section class="nav-section">
                    <h3>{{ ledgerStore.ledger?.name }}</h3>
                    <nav>
                        <ul>
                            <li>
                                <router-link :to="`/`"> Ledgers </router-link>
                            </li>
                            <li>
                                <router-link :to="`/ledgers/${ledgerId}/transactions`"> Transactions </router-link>
                            </li>
                            <li>
                                <router-link :to="`/ledgers/${ledgerId}/reports`"> Reports </router-link>
                            </li>
                        </ul>
                    </nav>
                </section>

                <section class="balance-section" v-if="ledgerStore.ledger?.accounts?.length">
                    <h4>Accounts</h4>
                    <ul>
                        <li v-for="(account, index) in ledgerStore.ledger.accounts" :key="index">
                            <span>{{ account.name }}</span>
                            <span class="right">{{ format_currency(account.balance) }}</span>
                        </li>
                    </ul>
                    <div class="total">
                        <strong>Total Value</strong>
                        <span class="right">{{ format_currency(totalBalance) }}</span>
                    </div>
                </section>

                <section class="user-control-section">
                    <div>
                        Logged in as: <strong>{{ user?.displayName }}</strong>
                    </div>
                    <button @click="logout" class="logout-button">Logout</button>
                </section>
            </aside>

            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { watch, onMounted, computed } from 'vue';
import format_currency from '@/core/currency_formatter';
import useAuthStore from '@/stores/auth.store';
import useLedgerStore from '@/stores/ledger.store';

const route = useRoute();
const authStore = useAuthStore();
const ledgerStore = useLedgerStore();

const ledgerId = computed(() => route.params.id);

onMounted(async () => {
    await ledgerStore.getLedger(ledgerId.value);
});

watch(ledgerId, async (newId) => {
    await ledgerStore.getLedger(newId);
});

const totalBalance = computed(() => {
    return ledgerStore.ledger?.accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
});

const user = computed(() => authStore.user);

async function logout() {
    await authStore.logout();
}
</script>

<style scoped>
.grid-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 1rem;
    align-items: start;
}

.side-panel {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    background-color: var(--color-surface);
    box-sizing: border-box;
    gap: 1rem;
}

.nav-section h3 {
    margin-bottom: 1rem;
}

.nav-section nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-section nav a {
    display: block;
    color: var(--color-text);
    text-decoration: underline;
}

.nav-section nav a.router-link-active {
    color: var(--color-primary);
    font-weight: 600;
}

.balance-section {
    font-size: 0.95rem;
    border-top: 1px solid var(--color-border);
    padding-top: 1rem;
}

.balance-section h4 {
    margin-bottom: 1rem;
}

.balance-section ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
}

.balance-section li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.balance-section .total {
    border-top: 1px solid var(--color-border);
    padding-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    font-weight: 600;
}

.user-control-section {
    border-top: 1px solid var(--color-border);
    padding-top: 1rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 50px;
}

.logout-button {
    align-self: flex-start;
    padding: 0.4rem 0.8rem;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
}

.logout-button:hover {
    background-color: var(--color-primary-dark);
}

@media (max-width: 768px) {
    .grid-layout {
        grid-template-columns: 1fr;
    }

    .side-panel {
        height: auto;
    }
}
</style>
