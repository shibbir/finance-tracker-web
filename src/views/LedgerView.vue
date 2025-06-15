<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useLedgerStore from '@/modules/ledger/ledger.store';
import TransactionsDatatable from '@/components/TransactionsDatatable.vue';

const router = useRouter();
const route = useRoute();

const store = useLedgerStore();

onMounted(async () => {
    await store.getLedger(route.params.id);
});

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

onMounted(async () => {
    if (route.query.account_id) selectedAccount.value = String(route.query.account_id);
    if (route.query.merchant_id) selectedMerchant.value = String(route.query.merchant_id);
    if (route.query.category_id) selectedCategory.value = String(route.query.category_id);
    if (route.query.start_date) startDate.value = String(route.query.start_date);
    if (route.query.end_date) endDate.value = String(route.query.end_date);

    await nextTick();
    filtersReady.value = true;
});
</script>

<template>
    <div class="container">
        <form class="filter-form" @submit.prevent>
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
                <input type="date" id="start" v-model="startDate" />
            </div>

            <div class="form-group">
                <label for="end">End Date</label>
                <input type="date" id="end" v-model="endDate" />
            </div>
        </form>

        <div v-if="filtersReady" class="table-wrapper">
            <TransactionsDatatable :ledger-id="route.params.id" :fields="['memo']" :filter="filter" />
        </div>
    </div>
</template>

<style scoped>
.filter-form {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-bottom: 20px;
}

.form-group {
    flex: 1;
    min-width: 150px;
}

select,
input[type='date'] {
    padding: 0.5rem;
    font-size: 1rem;
    width: 100%;
}
</style>
