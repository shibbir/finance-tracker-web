<script setup lang="ts">
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

import format_currency from '@/core/currency_formatter';
import useTransactionStore from '@/modules/transaction/transaction.store';

const transactionStore = useTransactionStore();

const props = defineProps({
    filter: Object,
    fields: Object,
    paginator: Boolean,
    ledgerId: {
        type: String,
        required: true
    }
});

await transactionStore.getTransactions(props.ledgerId, props.filter);
</script>

<template>
    <DataTable :value="transactionStore.transactions" :paginator="props.paginator" :rows="20" :rowsPerPageOptions="[10, 20, 30, 40, 50]">
        <Column field="date" header="Date"></Column>
        <Column field="account.name" header="Account"></Column>
        <Column field="merchant.name" header="Merchant"></Column>
        <Column field="category.name" header="Category"></Column>
        <Column field="memo" header="Memo" v-if="props.fields?.includes('memo')"></Column>
        <Column field="amount" header="Amount">
            <template #body="slotProps">
                {{ format_currency(slotProps.data.amount) }}
            </template>
        </Column>
    </DataTable>
</template>
