<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Card from 'primevue/card';
import Column from 'primevue/column';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import format_currency from '@/core/currency_formatter';
import { useTransactionStore, useLedgerStore } from '@/store';
import TransactionForm from '@/components/TransactionForm.vue';

const route = useRoute();
const transactions = ref([]);
const ledger_store = useLedgerStore();
const transaction_store = useTransactionStore();

let transaction_form_visibility = ref(false);

watch(() => route.query.account_id, fetchData, { immediate: true });

async function fetchData() {
    await transaction_store.getTransactions(route.params.id, route.query);
    transactions.value = transaction_store.transactions;
}

const formatCurrency = (value: number) => {
    if (ledger_store.ledger) {
        return format_currency(
            value,
            ledger_store.ledger.currency_format.currency_symbol,
            ledger_store.ledger.currency_format.group_separator,
            ledger_store.ledger.currency_format.decimal_separator
        );
    }
};
</script>

<template>
    <Card>
        <template #title>Transactions</template>
        <template #content>
            <DataTable
                :value="transactions"
                tableStyle="min-width: 50rem"
                editMode="row"
                size="small"
                paginator
                :rows="20"
                :rowsPerPageOptions="[20, 30, 40, 50]"
            >
                <template #header>
                    <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Add" @click="transaction_form_visibility = true" />
                    </div>
                </template>
                <Column field="date" header="Date"></Column>
                <Column field="account.name" header="Account"></Column>
                <Column field="payee.name" header="Payee"></Column>
                <Column field="category.name" header="Category"></Column>
                <Column field="memo" header="Memo"></Column>
                <Column field="credit" header="Credit">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.credit) }}
                    </template>
                </Column>
                <Column field="debit" header="Debit">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.debit) }}
                    </template>
                </Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
            </DataTable>
        </template>
    </Card>

    <TransactionForm v-model="transaction_form_visibility" :ledger-id="route.params.id" />
</template>
