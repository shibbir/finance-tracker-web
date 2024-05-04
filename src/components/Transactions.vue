<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

const props = defineProps(['ledgerId']);

const transactions = ref(null);

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/transactions`)
    .then((response) => response.json())
    .then((data) => (transactions.value = data));
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
                <Column field="date" header="Date"></Column>
                <Column field="account.name" header="Account"></Column>
                <Column field="payee.name" header="Payee"></Column>
                <Column field="category.name" header="Category"></Column>
                <Column field="memo" header="Memo"></Column>
                <Column field="amount" header="Amount"></Column>
                <Column
                    :rowEditor="true"
                    style="width: 10%; min-width: 8rem"
                    bodyStyle="text-align:center"
                ></Column>
            </DataTable>
        </template>
    </Card>
</template>
