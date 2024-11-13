<script setup lang="ts">
import { ref, watch } from 'vue';

import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

const props = defineProps(['ledgerId', 'year']);
const categorical_monthly_expenses = ref([]);

watch(
    () => props.year,
    () => {
        fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/categorical-monthly-expenses?year=${props.year}`)
            .then((response) => response.json())
            .then((data) => {
                categorical_monthly_expenses.value = data;
            });
    },
    { immediate: true }
);
</script>

<template>
    <p class="text-xl">Categorical Monthly Expenses</p>
    <DataTable :value="categorical_monthly_expenses" size="small" showGridlines>
        <Column field="category_name" header="Category"></Column>
        <Column field="january" header="January"></Column>
        <Column field="february" header="February"></Column>
        <Column field="march" header="March"></Column>
        <Column field="april" header="April"></Column>
        <Column field="may" header="May"></Column>
        <Column field="june" header="June"></Column>
        <Column field="july" header="July"></Column>
        <Column field="august" header="August"></Column>
        <Column field="september" header="September"></Column>
        <Column field="october" header="October"></Column>
        <Column field="november" header="November"></Column>
        <Column field="december" header="December"></Column>
    </DataTable>
</template>
