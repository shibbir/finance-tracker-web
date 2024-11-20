<script setup lang="ts">
import { ref, watch } from 'vue';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';

import format_currency from '@/core/currency_formatter';
import TransactionsDatatable from '@/components/TransactionsDatatable.vue';

const props = defineProps(['ledgerId', 'year']);
const categorical_monthly_expenses = ref([]);

watch(
    () => props.year,
    () => {
        fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/categorical-monthly-expenses?year=${props.year}`)
            .then((response) => response.json())
            .then((data) => {
                categorical_monthly_expenses.value = data;
            });
    },
    { immediate: true }
);

const handleSubmit = function (category_id: string, month: number) {
    visible.value = true;

    filter.value = {
        category_id,
        start_date: new Date(props.year, month, 1).toISOString(),
        end_date: new Date(props.year, month, new Date(props.year, month + 1, 0).getDate()).toISOString()
    };
};

const visible = ref(false);
const filter = ref({});
</script>

<template>
    <p class="text-xl">Categorical Monthly Expenses</p>
    <DataTable :value="categorical_monthly_expenses">
        <Column field="category_name" header="Category"></Column>
        <Column field="january" header="January">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 0)">{{ format_currency(slotProps.data.january) }}</a>
            </template>
        </Column>
        <Column field="february" header="February">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 1)">{{ format_currency(slotProps.data.february) }}</a>
            </template>
        </Column>
        <Column field="march" header="March">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 2)">{{ format_currency(slotProps.data.march) }}</a>
            </template>
        </Column>
        <Column field="april" header="April">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 3)">{{ format_currency(slotProps.data.april) }}</a>
            </template>
        </Column>
        <Column field="may" header="May">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 4)">{{ format_currency(slotProps.data.may) }}</a>
            </template>
        </Column>
        <Column field="june" header="June">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 5)">{{ format_currency(slotProps.data.june) }}</a>
            </template>
        </Column>
        <Column field="july" header="July">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 6)">{{ format_currency(slotProps.data.july) }}</a>
            </template>
        </Column>
        <Column field="august" header="August">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 7)">{{ format_currency(slotProps.data.august) }}</a>
            </template>
        </Column>
        <Column field="september" header="September">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 8)">{{ format_currency(slotProps.data.september) }}</a>
            </template>
        </Column>
        <Column field="october" header="October">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 9)">{{ format_currency(slotProps.data.october) }}</a>
            </template>
        </Column>
        <Column field="november" header="November">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 10)">{{ format_currency(slotProps.data.november) }}</a>
            </template>
        </Column>
        <Column field="december" header="December">
            <template #body="slotProps">
                <a href="javascript:void(0)" @click="handleSubmit(slotProps.data.category_id, 11)">{{ format_currency(slotProps.data.december) }}</a>
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="visible" modal>
        <Suspense>
            <TransactionsDatatable :ledger-id="props.ledgerId" :filter="filter" :fields="['date', 'account', 'category', 'merchant', 'amount']" />
        </Suspense>
    </Dialog>
</template>
