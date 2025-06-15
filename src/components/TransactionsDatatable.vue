<script setup lang="ts">
import { watch } from 'vue';

import format_date from '@/core/date_formatter';
import format_currency from '@/core/currency_formatter';
import useTransactionStore from '@/modules/transaction/transaction.store';

const transactionStore = useTransactionStore();

const props = defineProps({
    filter: Object,
    fields: Object,
    ledgerId: { type: String, required: true }
});

watch(
    () => [props.filter],
    async ([filter]) => {
        await transactionStore.getTransactions(props.ledgerId, filter);
    },
    { deep: true, immediate: true }
);
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
            <tr v-for="(tx, index) in transactionStore.transactions" :key="index">
                <td>{{ format_date(tx.date) }}</td>
                <td>{{ tx.account.name }}</td>
                <td>{{ tx.merchant.name }}</td>
                <td>{{ tx.category.name }}</td>
                <td class="memo-cell" v-if="props.fields?.includes('memo')">{{ tx.memo }}</td>
                <td>{{ format_currency(tx.amount) }}</td>
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
</style>
