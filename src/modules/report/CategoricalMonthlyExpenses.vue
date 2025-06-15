<script setup lang="ts">
import { ref, watch } from 'vue';
import { format, startOfMonth, endOfMonth } from 'date-fns';

import format_currency from '@/core/currency_formatter';
import TransactionsDatatable from '@/components/TransactionsDatatable.vue';

const props = defineProps(['ledgerId', 'year']);
const categorical_monthly_expenses = ref([]);

interface Filter {
    category_id: string;
    start_date: string;
    end_date: string;
}

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

const showExpensesForSelectedCategory = function (category_id: string, month: number) {
    visible.value = true;

    filter.value = {
        category_id,
        start_date: startOfMonth(new Date(props.year, month)).toISOString(),
        end_date: endOfMonth(new Date(props.year, month)).toISOString()
    };
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const visible = ref(false);
const filter = ref<Filter>({
    category_id: '',
    start_date: '',
    end_date: ''
});
</script>

<template>
    <div class="table-wrapper">
        <h2>Categorical Monthly Expenses</h2>

        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th v-for="(month, index) in months" :key="index">{{ month }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, idx) in categorical_monthly_expenses" :key="idx">
                    <td>{{ row.category_name }}</td>
                    <td v-for="(month, index) in months" :key="index">
                        <a href="#" @click.prevent="showExpensesForSelectedCategory(row.category_id, index)">
                            {{ format_currency(row[month.toLowerCase()]) }}
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="modal" v-if="visible">
            <div class="modal-content">
                <span class="close-btn" @click="visible = false">&times;</span>
                <h3 v-if="filter.start_date && filter.end_date">
                    Expenses from {{ format(new Date(filter.start_date), 'dd.MM.yyyy') }} - {{ format(new Date(filter.end_date), 'dd.MM.yyyy') }}
                </h3>
                <Suspense>
                    <TransactionsDatatable :ledger-id="props.ledgerId" :filter="filter" :fields="['date', 'account', 'category', 'merchant', 'amount']" />
                </Suspense>
            </div>
        </div>
    </div>
</template>

<style scoped>
h3 {
    margin-left: 10px;
}
</style>
