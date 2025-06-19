<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useLedgerStore from '@/modules/ledger/ledger.store';
import useTransactionStore from '@/modules/transaction/transaction.store';
import TransactionsDatatable from '@/components/TransactionsDatatable.vue';

const router = useRouter();
const route = useRoute();

const store = useLedgerStore();
const transactionStore = useTransactionStore();

const accounts = computed(() => store.ledger?.accounts || []);
const merchants = computed(() => store.ledger?.merchants || []);
const categories = computed(() => store.ledger?.categories || []);

const selectedAccount = ref('');
const selectedMerchant = ref('');
const selectedCategory = ref('');
const startDate = ref('');
const endDate = ref('');

const filter = computed(() => {
    const f: Record<string, any> = {};

    if (selectedAccount.value) f.account_id = selectedAccount.value;
    if (selectedMerchant.value) f.merchant_id = selectedMerchant.value;
    if (selectedCategory.value) f.category_id = selectedCategory.value;
    if (startDate.value) f.start_date = startDate.value;
    if (endDate.value) f.end_date = endDate.value;

    return f;
});

watch(
    [selectedAccount, selectedMerchant, selectedCategory, startDate, endDate],
    () => {
        const query: Record<string, any> = {};

        if (selectedAccount.value) query.account_id = selectedAccount.value;
        if (selectedMerchant.value) query.merchant_id = selectedMerchant.value;
        if (selectedCategory.value) query.category_id = selectedCategory.value;
        if (startDate.value) query.start_date = startDate.value;
        if (endDate.value) query.end_date = endDate.value;

        router.replace({ query });
    },
    { immediate: true }
);

const filtersReady = ref(false);

if (route.query.account_id) selectedAccount.value = String(route.query.account_id);
if (route.query.merchant_id) selectedMerchant.value = String(route.query.merchant_id);
if (route.query.category_id) selectedCategory.value = String(route.query.category_id);
if (route.query.start_date) startDate.value = String(route.query.start_date);
if (route.query.end_date) endDate.value = String(route.query.end_date);

onMounted(async () => {
    await store.getLedger(route.params.id);
    filtersReady.value = true;
});
</script>

<template>
    <div class="container">
        <div class="grid-layout">
            <form class="filter-form" @submit.prevent>
                <h3 style="margin: 0 0 0.5rem 0;">Filter Transactions</h3>

                <div class="form-group">
                    <label for="account">Account</label>
                    <select id="account" v-model="selectedAccount">
                        <option value="">All</option>
                        <option v-for="acc in accounts" :key="acc._id" :value="acc._id">{{ acc.name }}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="merchant">Merchant</label>
                    <select id="merchant" v-model="selectedMerchant">
                        <option value="">All</option>
                        <option v-for="merch in merchants" :key="merch._id" :value="merch._id">{{ merch.name }}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" v-model="selectedCategory">
                        <option value="">All</option>
                        <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="start">Start Date</label>
                    <input type="date" v-model="startDate" />
                </div>

                <div class="form-group">
                    <label for="end">End Date</label>
                    <input type="date" v-model="endDate" />
                </div>

                Total Transactions: {{ transactionStore.transactions.length }}
            </form>

            <div v-if="filtersReady" class="table-wrapper">
                <TransactionsDatatable :ledger-id="route.params.id" :fields="['memo']" :filter="filter" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.filter-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--color-border);
    background-color: var(--color-surface);
    height: 100%;
    box-sizing: border-box;
}

.form-group {
    width: 100%;
}

.table-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface);
}
</style>
