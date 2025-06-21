<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import format_currency from '@/core/currency_formatter';
import useLedgerStore from '@/modules/ledger/ledger.store';
import TransactionsDatatable from '@/components/TransactionsDatatable.vue';

const route = useRoute();
const store = useLedgerStore();

onMounted(async () => {
    await store.getLedger(route.params.id);
});

const years = [2025, 2024, 2023, 2022];
const selectedYear = ref(new Date().getFullYear());

const categorical_monthly_expenses = ref([]);

interface Filter {
    category_id: string;
    start_date: string;
    end_date: string;
}

watch(
    selectedYear,
    () => {
        fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${route.params.id}/categorical-monthly-expenses?year=${selectedYear.value}`)
            .then((response) => response.json())
            .then((data) => {
                categorical_monthly_expenses.value = data;
            });
    },
    { immediate: true }
);

const showTransactionsForSelectedCategory = function (category_id: string, month: number) {
    visible.value = true;

    filter.value = {
        category_id,
        start_date: startOfMonth(new Date(selectedYear.value, month)).toISOString(),
        end_date: endOfMonth(new Date(selectedYear.value, month)).toISOString()
    };
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const visible = ref(false);
const filter = ref<Filter>({
    category_id: '',
    start_date: '',
    end_date: ''
});

const incomeRows = computed(() => {
    return categorical_monthly_expenses.value.filter((row) => {
        const total = months.reduce((acc, month) => acc + (row[month.toLowerCase()] || 0), 0);
        return total > 0;
    });
});

const expenseRows = computed(() => {
    return categorical_monthly_expenses.value.filter((row) => {
        const total = months.reduce((acc, month) => acc + (row[month.toLowerCase()] || 0), 0);
        return total <= 0;
    });
});

const netIncome = computed(() => {
    const netRow: Record<string, number> = {};

    for (const month of months) {
        netRow[month.toLowerCase()] = categorical_monthly_expenses.value.reduce((sum, row) => {
            return sum + (row[month.toLowerCase()] || 0);
        }, 0);
    }

    return netRow;
});
</script>

<template>
    <div class="container">
        <select v-model="selectedYear">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>

        <div class="table-wrapper">
            <h3>Income vs Expense Report for Year {{ selectedYear }}</h3>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th class="right" v-for="(month, index) in months" :key="index">{{ month }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="13" style="border-top: 2px solid #ccc">Income</td>
                    </tr>
                    <tr v-for="(row, idx) in incomeRows" :key="idx">
                        <td class="left">{{ row.category_name }}</td>
                        <td class="right" v-for="(month, index) in months" :key="index">
                            <a href="#" @click.prevent="showTransactionsForSelectedCategory(row.category_id, index)">
                                {{ format_currency(row[month.toLowerCase()]) }}
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="13" style="border-top: 2px solid #ccc">Expense</td>
                    </tr>
                    <tr v-for="(row, idx) in expenseRows" :key="idx">
                        <td class="left">{{ row.category_name }}</td>
                        <td class="right" v-for="(month, index) in months" :key="index">
                            <a href="#" @click.prevent="showTransactionsForSelectedCategory(row.category_id, index)">
                                {{ format_currency(row[month.toLowerCase()]) }}
                            </a>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>Net Income</td>
                        <td v-for="(month, index) in months" :key="'net-' + index">
                            {{ format_currency(netIncome[month.toLowerCase()]) }}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div class="modal" v-if="visible">
                <div class="modal-content">
                    <span class="close-btn" @click="visible = false">&times;</span>
                    <h3 v-if="filter.start_date && filter.end_date">
                        Expenses from {{ format(new Date(filter.start_date), 'dd.MM.yyyy') }} - {{ format(new Date(filter.end_date), 'dd.MM.yyyy') }}
                    </h3>
                    <Suspense>
                        <TransactionsDatatable :ledger-id="route.params.id" :filter="filter" :fields="['date', 'account', 'category', 'merchant', 'amount']" />
                    </Suspense>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.income-row {
    font-weight: bold;
    border-top: 2px solid #ccc;
}

tfoot td {
    font-weight: bold;
    border-top: 2px solid #ccc;
}

tfoot tr {
    text-align: right;
}

tfoot td:first-child {
    text-align: left;
}
</style>
