<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Card from 'primevue/card';
import Column from 'primevue/column';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Toolbar from 'primevue/toolbar';
import FileUpload from 'primevue/fileupload';
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
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="mr-2" @click="transaction_form_visibility = true" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" outlined />
                </template>

                <template #end>
                    <FileUpload
                        mode="basic"
                        accept="image/*"
                        :maxFileSize="1000000"
                        label="Import"
                        customUpload
                        chooseLabel="Import"
                        class="mr-2"
                        auto
                        :chooseButtonProps="{ severity: 'secondary' }"
                    />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" />
                </template>
            </Toolbar>

            <DataTable
                :value="transactions"
                tableStyle="min-width: 50rem"
                editMode="row"
                size="small"
                paginator
                :rows="20"
                :rowsPerPageOptions="[10, 20, 30, 40, 50, 100]"
            >
                <Column field="date" header="Date"></Column>
                <Column field="account.name" header="Account"></Column>
                <Column field="recipient.name" header="Recipient"></Column>
                <Column field="category.name" header="Category"></Column>
                <Column field="memo" header="Memo"></Column>
                <Column field="amount" header="Amount">
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.amount) }}
                    </template>
                </Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
            </DataTable>
        </template>
    </Card>

    <TransactionForm v-model="transaction_form_visibility" :ledger-id="route.params.id" />
</template>
