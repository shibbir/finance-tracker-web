<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import DatePicker from 'primevue/datepicker';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, date as yupdate } from 'yup';

import Panel from 'primevue/panel';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import MultiSelect from 'primevue/multiselect';
import InputGroupAddon from 'primevue/inputgroupaddon';

import VerticalBarChart from '@/components/VerticalBarChart.vue';
import DoughnutChart from '@/components/DoughnutChart.vue';

import format_currency from '@/core/currency_formatter';
import { useTransactionStore, useLedgerStore } from '@/store';
import MeterGroup from 'primevue/metergroup';

const props = defineProps(['ledgerId']);
const accounts: Record<any, any> = ref([]);
const recipients: Record<any, any> = ref([]);
const categories: Record<any, any> = ref([]);
const expenses: Record<any, any> = ref([]);

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/accounts`)
    .then((response) => response.json())
    .then((data) => (accounts.value = data.accounts));

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/recipients`)
    .then((response) => response.json())
    .then((data) => (recipients.value = data.recipients));

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/categories`)
    .then((response) => response.json())
    .then((data) => (categories.value = data.categories));

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/expenses`)
    .then((response) => response.json())
    .then((data) => {
        expenses.value = data.map((x: any) => ({
            label: `${x.category_name}`,
            value: Math.abs(x.amount),
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
        }));
    });

let transaction_form_visibility = ref(false);
const ledger_store = useLedgerStore();
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

const { meta, handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(
        object({
            start_date: yupdate().required(),
            end_date: yupdate().required(),
            account_id: string().required(),
            recipient_id: string(),
            category_id: string().required()
        })
    ),
    initialValues: {
        start_date: undefined,
        end_date: undefined,
        account_id: undefined,
        recipient_id: undefined,
        category_id: undefined
    }
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
    await fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/transactions`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
            'content-type': 'application/json; charset=UTF-8'
        }
    });

    // resetForm();
});

const [start_date] = defineField('start_date');
const [end_date] = defineField('end_date');
const [account_id] = defineField('account_id');
const [recipient_id] = defineField('recipient_id');
const [category_id] = defineField('category_id');
</script>

<template>
    <Panel header="Expense Breakdown">
        <form @submit="onSubmit">
            <div class="card flex flex-col md:flex-row gap-2">
                <InputGroup>
                    <InputGroupAddon> Start Date </InputGroupAddon>
                    <DatePicker v-model="start_date" />
                </InputGroup>

                <InputGroup>
                    <InputGroupAddon> End Date </InputGroupAddon>
                    <DatePicker v-model="end_date" />
                </InputGroup>

                <InputGroup>
                    <InputGroupAddon>Accounts</InputGroupAddon>
                    <MultiSelect v-model="account_id" :options="accounts" optionLabel="name" optionValue="_id" filter :maxSelectedLabels="2" />
                </InputGroup>

                <InputGroup>
                    <InputGroupAddon>Categories</InputGroupAddon>
                    <MultiSelect v-model="category_id" :options="categories" optionLabel="name" optionValue="_id" filter :maxSelectedLabels="2" />
                </InputGroup>

                <InputGroup>
                    <InputGroupAddon>Recipients</InputGroupAddon>
                    <MultiSelect v-model="recipient_id" :options="recipients" optionLabel="name" optionValue="_id" filter :maxSelectedLabels="2" />
                </InputGroup>
            </div>
            <div class="flex gap-2">
                <Button type="submit" label="Save" :disabled="!meta.valid"></Button>
            </div>
        </form>
    </Panel>

    <Panel header="Expenses by Category">
        <MeterGroup :value="expenses" :max="10000" />
    </Panel>

    <Panel header="Income vs Expense">
        <VerticalBarChart
            :data="{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Income',
                        data: [30, 40, 50, 100, 30, 40, 800, 100, 30, 40, 300, 75]
                    },
                    {
                        label: 'Expense',
                        data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86]
                    }
                ]
            }"
        />
    </Panel>

    <Panel header="Monthly Expenses">
        <DoughnutChart
            :data="{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        data: [30, 40, 50, 100, 30, 40, 200, 100, 30, 40, 300, 75]
                    }
                ]
            }"
        />
    </Panel>
</template>
