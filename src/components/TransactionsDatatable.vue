<script setup lang="ts">
import { watch } from 'vue';

import format_date from '@/core/date_formatter';
import format_currency from '@/core/currency_formatter';
import useTransactionStore from '@/stores/transaction.store';

const transactionStore = useTransactionStore();

const props = defineProps<{
    filter: Record<string, any>;
    fields: string[];
    ledgerId: string;
}>();

watch(
    () => props.filter,
    async (filter) => {
        await transactionStore.getTransactions(props.ledgerId, filter);
    },
    { deep: true, immediate: true }
);

function amountClass(amount: number) {
    return amount > 0 ? 'amount-positive' : amount < 0 ? 'amount-negative' : '';
}
</script>

<template>
    <table v-if="transactionStore.transactions.length">
        <thead>
            <tr>
                <th>Date</th>
                <th>Account</th>
                <th>Merchant</th>
                <th>Category</th>
                <th v-if="props.fields?.includes('memo')">Memo</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="tx in transactionStore.transactions" :key="tx._id">
                <td>{{ format_date(tx.date) }}</td>
                <td>{{ tx.account.name }}</td>
                <td>{{ tx.merchant.name }}</td>
                <td>{{ tx.category.name }}</td>
                <td class="memo-cell" v-if="props.fields?.includes('memo')" :title="tx.memo">{{ tx.memo }}</td>
                <td :class="amountClass(tx.amount)">{{ format_currency(tx.amount) }}</td>
            </tr>
        </tbody>
    </table>

    <div v-if="!transactionStore.transactions.length">No transactions found!</div>
</template>

<style scoped>
.memo-cell {
    max-width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

th,
td {
    text-align: left;
}

th:last-child,
td:last-child {
    text-align: right;
}

.amount-positive {
    color: green;
    font-weight: 500;
}

.amount-negative {
    color: crimson;
    font-weight: 500;
}
</style>
