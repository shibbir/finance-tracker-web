<script setup lang="ts">
import { ref } from 'vue';
import Select from 'primevue/select';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, number, date as yupdate } from 'yup';

import useTransactionStore from '@/modules/transaction/transaction.store';
import type ITransaction from '@/modules/transaction/transaction.interface';

const props = defineProps({
    ledgerId: {
        type: String,
        required: true
    }
});

const accounts = ref([]);
const merchants = ref([]);
const categories = ref([]);

const transactionStore = useTransactionStore();

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/accounts`)
    .then((response) => response.json())
    .then((data) => (accounts.value = data.accounts));

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/merchants`)
    .then((response) => response.json())
    .then((data) => (merchants.value = data.merchants));

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/categories`)
    .then((response) => response.json())
    .then((data) => (categories.value = data.categories));

const { meta, handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(
        object({
            date: yupdate().required(),
            ledger_id: string().required(),
            account_id: string().required(),
            merchant_id: string(),
            category_id: string().required(),
            type: string().required(),
            amount: number(),
            memo: string()
        })
    ),
    initialValues: {
        date: new Date(),
        ledger_id: props.ledgerId,
        account_id: undefined,
        merchant_id: undefined,
        category_id: undefined,
        type: undefined,
        amount: 0,
        memo: ''
    }
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
    transactionStore.postTransaction(values as ITransaction);

    resetForm();
});

const [date] = defineField('date');
const [account_id] = defineField('account_id');
const [merchant_id] = defineField('merchant_id');
const [category_id] = defineField('category_id');
const [amount] = defineField('amount');
const [type] = defineField('type');
const [memo] = defineField('memo');
</script>

<template>
    <form @submit="onSubmit">
        <div class="flex items-center gap-4 mb-4">
            <label for="date" class="font-semibold w-24">Date</label>
            <DatePicker v-model="date" class="flex-auto" />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="account" class="font-semibold w-24">Account</label>
            <Select v-model="account_id" :options="accounts" optionLabel="name" optionValue="_id" placeholder="Select account" class="flex-auto" />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="category" class="font-semibold w-24">Category</label>
            <Select
                v-model="category_id"
                :options="categories"
                optionLabel="name"
                optionValue="_id"
                placeholder="Select category"
                class="flex-auto"
            />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="merchant" class="font-semibold w-24">Merchant</label>
            <Select v-model="merchant_id" :options="merchants" optionLabel="name" optionValue="_id" placeholder="Select merchant" class="flex-auto" />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="amount" class="font-semibold w-24">Amount</label>
            <InputNumber v-model="amount" :minFractionDigits="2" :maxFractionDigits="5" class="flex-auto" />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="type" class="font-semibold w-24">Type</label>
            <Select
                v-model="type"
                :options="[
                    { label: 'Debit', value: 'debit' },
                    { label: 'Credit', value: 'credit' }
                ]"
                optionLabel="label"
                optionValue="value"
                placeholder="Transaction Type"
                class="flex-auto"
            />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="memo" class="font-semibold w-24">Memo</label>
            <InputText type="text" v-model="memo" class="flex-auto" />
        </div>

        <div class="flex justify-end gap-2">
            <Button type="submit" label="Save Changes" :disabled="!meta.valid"></Button>
        </div>
    </form>
</template>
