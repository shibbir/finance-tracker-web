<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useLedgerStore from '@/modules/ledger/ledger.store';
import CategoricalMonthlyExpenses from '@/modules/report/CategoricalMonthlyExpenses.vue';

const route = useRoute();
const store = useLedgerStore();

onMounted(async () => {
    await store.getLedger(route.params.id);
});

const years = [2025, 2024, 2023, 2022];
const selectedYear = ref(new Date().getFullYear());
</script>

<template>
    <div class="container">
        <select v-model="selectedYear">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <CategoricalMonthlyExpenses :ledger-id="route.params.id" :year="selectedYear" />
    </div>
</template>
