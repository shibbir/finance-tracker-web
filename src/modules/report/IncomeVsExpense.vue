<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue';

import VerticalBarChart from '@/components/VerticalBarChart.vue';

const props = defineProps(['ledgerId', 'year']);
const incomes = ref(Array(12).fill(0));
const expenses = ref(Array(12).fill(0));

watch(
    () => props.year,
    () => {
        axios
            .get(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/transactions?start_date=${props.year}-01-01&end_date=${props.year}-12-31`)
            .then((response) => {
                incomes.value = Array(12).fill(0);
                expenses.value = Array(12).fill(0);

                for (const transaction of response.data) {
                    const month = new Date(transaction.date).getMonth();

                    incomes.value[month] += transaction.amount > 0 ? transaction.amount : 0;
                    expenses.value[month] += transaction.amount < 0 ? Math.abs(transaction.amount) : 0;
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
