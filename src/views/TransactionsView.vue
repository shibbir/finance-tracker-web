<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TransactionsFilter from '@/components/TransactionsFilter.vue';
import TransactionsDatatable from '@/components/TransactionsDatatable.vue';

const route = useRoute();
const router = useRouter();

const ledgerId = computed(() => {
    const id = route.params.id;
    return typeof id === 'string' ? id : undefined;
});

const filter = ref<Record<string, string>>(Object.fromEntries(Object.entries(route.query).filter(([_, v]) => typeof v === 'string')) as Record<string, string>);

const filterRef = ref<InstanceType<typeof TransactionsFilter> | null>(null);

watch(
    filter,
    (newFilter) => {
        const cleanFilter = Object.fromEntries(Object.entries(newFilter).filter(([_, v]) => v && v !== ''));
        router.replace({ query: cleanFilter });
    },
    { deep: true }
);

function onResetFilters() {
    filter.value = {};
    router.replace({ query: {} });
    filterRef.value?.close();
}

function onFilterChange(newFilter: Record<string, string>) {
    filter.value = newFilter;
}

function openFilterModal() {
    filterRef.value?.open();
}

function addTransaction() {
    alert('Add Transaction clicked');
}

function exportTransactions() {
    alert('Export clicked');
}
</script>

<template>
    <div class="transactions-view">
        <div class="toolbar">
            <button class="primary-button" @click="addTransaction">Add</button>
            <button class="primary-button" @click="openFilterModal">Filter</button>
            <button class="primary-button" @click="exportTransactions">Export</button>
        </div>

        <TransactionsFilter
            ref="filterRef"
            :initialFilter="filter"
            :showResetButton="Object.keys(filter).length > 0"
            @update:filter="onFilterChange"
            @reset="onResetFilters"
        />

        <TransactionsDatatable v-if="ledgerId" :key="ledgerId" :ledger-id="ledgerId" :fields="['memo']" :filter="filter" />
    </div>
</template>

<style scoped>
.transactions-view {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.toolbar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    justify-content: flex-end;
}

@media (max-width: 768px) {
    .toolbar {
        flex-direction: column;
        justify-content: flex-start;
    }
}
</style>
