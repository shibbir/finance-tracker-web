<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import format_currency from '@/core/currency_formatter';
import useLedgerStore from '@/stores/ledger.store';
import TransactionsDatatable from '@/components/TransactionsDatatable.vue';

const route = useRoute();
const ledgerStore = useLedgerStore();

onMounted(async () => {
    await ledgerStore.getLedger(route.params.id);
});

const years = [2025, 2024, 2023, 2022];
const selectedYear = ref(new Date().getFullYear());
const selectedAccount = ref('');
const accounts = computed(() => ledgerStore.ledger?.accounts || []);

const monthly_report = ref([]);

interface Filter {
    category_id: string;
    start_date: string;
    end_date: string;
    account_id?: string;
}

watch(
    [selectedYear, selectedAccount],
    () => {
        let url = `${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${route.params.id}/monthly-report?year=${selectedYear.value}`;

        if (selectedAccount.value) {
            url += `&account_id=${selectedAccount.value}`;
        }

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                monthly_report.value = data;
            });
    },
    { immediate: true }
);

const showTransactionsForSelectedCategory = function (category_id: string, month: number) {
    visible.value = true;

    filter.value = {
        category_id,
        start_date: startOfMonth(new Date(selectedYear.value, month)).toISOString(),
        end_date: endOfMonth(new Date(selectedYear.value, month)).toISOString(),
        ...(selectedAccount.value ? { account_id: selectedAccount.value } : {})
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
    return monthly_report.value.filter((row) => {
        const total = months.reduce((acc, month) => acc + (row[month.toLowerCase()] || 0), 0);
        return total > 0;
    });
});

const expenseRows = computed(() => {
    return monthly_report.value.filter((row) => {
        const total = months.reduce((acc, month) => acc + (row[month.toLowerCase()] || 0), 0);
        return total <= 0;
    });
});

const inflow = computed(() => {
    const inflowRow: Record<string, number> = {};
    for (const month of months) {
        inflowRow[month.toLowerCase()] = monthly_report.value.reduce((sum, row) => {
            const val = row[month.toLowerCase()] || 0;
            return sum + (val > 0 ? val : 0);
        }, 0);
    }
    return inflowRow;
});

const outflow = computed(() => {
    const outflowRow: Record<string, number> = {};
    for (const month of months) {
        outflowRow[month.toLowerCase()] = monthly_report.value.reduce((sum, row) => {
            const val = row[month.toLowerCase()] || 0;
            return sum + (val < 0 ? val : 0);
        }, 0);
    }
    return outflowRow;
});

const netFlow = computed(() => {
    const netRow: Record<string, number> = {};

    for (const month of months) {
        netRow[month.toLowerCase()] = monthly_report.value.reduce((sum, row) => {
            return sum + (row[month.toLowerCase()] || 0);
        }, 0);
    }

    return netRow;
});
</script>

<template>
    <div class="table-wrapper">
        <h3 style="border-bottom: none">
            Monthly Income vs Expense Report for
            <select v-model="selectedYear">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>

            <select v-model="selectedAccount">
                <option value="">All</option>
                <option v-for="account in accounts" :key="account._id" :value="account._id">{{ account.name }}</option>
            </select>
        </h3>
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
                    <td>Inflow</td>
                    <td v-for="(month, index) in months" :key="'inflow-' + index">
                        {{ format_currency(inflow[month.toLowerCase()]) }}
                    </td>
                </tr>
                <tr>
                    <td>Outflow</td>
                    <td v-for="(month, index) in months" :key="'outflow-' + index">
                        {{ format_currency(outflow[month.toLowerCase()]) }}
                    </td>
                </tr>
                <tr>
                    <td>Net Flow</td>
                    <td
                        v-for="(month, index) in months"
                        :key="'net-' + index"
                        :class="{ 'amount-positive': netFlow[month.toLowerCase()] > 0, 'amount-negative': netFlow[month.toLowerCase()] < 0 }"
                    >
                        {{ format_currency(netFlow[month.toLowerCase()]) }}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

    <div class="modal" v-if="visible">
        <div class="modal-content">
            <span class="close-btn" @click="visible = false">&times;</span>
            <h3 v-if="filter.start_date && filter.end_date">
                Transactions from {{ format(new Date(filter.start_date), 'dd.MM.yyyy') }} - {{ format(new Date(filter.end_date), 'dd.MM.yyyy') }}
            </h3>
            <Suspense>
                <TransactionsDatatable :ledger-id="route.params.id" :filter="filter" :fields="['date', 'account', 'category', 'merchant', 'amount']" />
            </Suspense>
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
}

tfoot td:first-child {
    text-align: left;
}

tfoot tr {
    text-align: right;
}

tfoot tr:first-child, tfoot tr:last-child {
    border-top: 2px solid #ccc;
}
</style>
