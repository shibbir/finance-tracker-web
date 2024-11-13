<script setup lang="ts">
import { ref, watch } from 'vue';

import VerticalBarChart from '@/components/VerticalBarChart.vue';

const props = defineProps(['ledgerId', 'year']);
const income_vs_expense: Record<any, any> = ref({});
const incomes = ref([]);
const expenses = ref([]);

watch(
    () => props.year,
    () => {
        fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/expenses?year=${props.year}`)
            .then((response) => response.json())
            .then((data) => {
                income_vs_expense.value = data.income_vs_expense;

                incomes.value = [];
                expenses.value = [];

                income_vs_expense.value[props.year].sort((a, b) => a.month - b.month);
                for (let i = 0; i < 12; i++) {
                    incomes.value.push(income_vs_expense.value[props.year][i] ? income_vs_expense.value[props.year][i].income : 0);
                    expenses.value.push(income_vs_expense.value[props.year][i] ? income_vs_expense.value[props.year][i].expense : 0);
                }
            });
    },
    { immediate: true }
);
</script>

<template>
    <p class="text-xl">Income vs Expense</p>
    <VerticalBarChart
        v-if="incomes.length || expenses.length"
        :data="{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Income',
                    data: incomes
                },
                {
                    label: 'Expense',
                    data: expenses
                }
            ]
        }"
    />
</template>
