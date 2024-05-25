<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from 'primevue/card';
import Column from 'primevue/column';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import { useTransactionStore } from '@/store';

const transactions = ref([]);
const route = useRoute();
const store = useTransactionStore();

watch(() => route.query.account_id, fetchData, { immediate: true });

async function fetchData() {
    await store.getTransactions(route.params.id, route.query);
    transactions.value = store.transactions;
}
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
                        <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                    </div>
                </template>
                <Column field="date" header="Date"></Column>
                <Column field="account.name" header="Account"></Column>
                <Column field="payee.name" header="Payee"></Column>
                <Column field="category.name" header="Category"></Column>
                <Column field="memo" header="Memo"></Column>
                <Column field="credit" header="Credit"></Column>
                <Column field="debit" header="debit"></Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
            </DataTable>
        </template>
    </Card>
</template>
