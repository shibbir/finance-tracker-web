<script setup lang="ts">
import { watch } from 'vue';
import { format } from 'date-fns';
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

watch(
    () => props.filter,
    async () => {
        await transactionStore.getTransactions(props.ledgerId, props.filter);
    }
);

await transactionStore.getTransactions(props.ledgerId, props.filter);
</script>

<template>
    <DataTable size="small" :value="transactionStore.transactions" :paginator="props.paginator" :rows="20" :rowsPerPageOptions="[20, 40, 60, 80, 100]">
        <Column field="date" header="Date">
            <template #body="slotProps">
                {{ format(new Date(slotProps.data.date), 'dd/MM/yyyy') }}
            </template>
        </Column>
        <Column field="account.name" header="Account"></Column>
        <Column field="merchant.name" header="Merchant"></Column>
        <Column field="category.name" header="Category"></Column>
        <Column field="memo" header="Memo" v-if="props.fields?.includes('memo')" style="max-width: 450px" class="truncate"></Column>
        <Column field="amount" header="Amount">
            <template #body="slotProps">
                {{ format_currency(slotProps.data.amount) }}
            </template>
        </Column>
    </DataTable>
</template>
