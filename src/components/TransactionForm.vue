<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

const props = defineProps(['ledgerId']);
const visible = defineModel();
const accounts: Record<any, any> = ref([]);
const payees: Record<any, any> = ref([]);
const categories: Record<any, any> = ref([]);

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/accounts`)
    .then((response) => response.json())
    .then((data) => (accounts.value = data.accounts));

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/payees`)
    .then((response) => response.json())
    .then((data) => (payees.value = data.payees));

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/categories`)
    .then((response) => response.json())
    .then((data) => (categories.value = data.categories));

const { errors, handleSubmit, defineField } = useForm({
    validationSchema: yup.object({
        date: yup.date().required(),
        account_id: yup.string().required(),
        payee_id: yup.string(),
        category_id: yup.string().required(),
        credit: yup.number(),
        debit: yup.number(),
        memo: yup.string()
    }),
    initialValues: {
        date: new Date(),
        account_id: '',
        payee_id: '',
        category_id: '',
        credit: 0,
        debit: 0,
        memo: ''
    }
});

const onSubmit = handleSubmit((values, { resetForm }) => {
    console.log(values);
    resetForm();
    visible.value = false;
});

const [date, dateAttrs] = defineField('date');
const [account_id, accountAttrs] = defineField('account_id');
const [payee_id, payeeAttrs] = defineField('payee_id');
const [category_id, categoryAttrs] = defineField('category_id');
const [credit, creditAttrs] = defineField('credit');
const [debit, debitAttrs] = defineField('debit');
const [memo, memotAttrs] = defineField('memo');
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Add transaction" :style="{ width: '30rem' }">
        <form @submit="onSubmit">
            <div class="flex items-center gap-4 mb-4">
                <label for="date" class="font-semibold w-24">Date</label>
                <DatePicker v-model="date" v-bind="dateAttrs" class="flex-auto" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="account" class="font-semibold w-24">Account</label>
                <Select
                    v-model="account_id"
                    v-bind="accountAttrs"
                    :options="accounts"
                    optionLabel="name"
                    optionValue="_id"
                    placeholder="Select account"
                    class="flex-auto"
                    aria-describedby="username-help"
                />
                <small id="username-help">This field is required.</small>
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="payee" class="font-semibold w-24">Payee</label>
                <Select v-model="payee_id" v-bind="payeeAttrs" :options="payees" optionLabel="name" optionValue="_id" placeholder="Select payee" class="flex-auto" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="category" class="font-semibold w-24">Category</label>
                <Select v-model="category_id" v-bind="categoryAttrs" :options="categories" optionLabel="name" optionValue="_id" placeholder="Select category" class="flex-auto" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="credit" class="font-semibold w-24">Credit</label>
                <InputNumber v-model="credit" v-bind="creditAttrs" :minFractionDigits="2" :maxFractionDigits="5" class="flex-auto" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="debit" class="font-semibold w-24">Debit</label>
                <InputNumber v-model="debit" v-bind="debitAttrs" :minFractionDigits="2" :maxFractionDigits="5" class="flex-auto" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="memo" class="font-semibold w-24">Memo</label>
                <InputText type="text" v-model="memo" v-bind="memotAttrs" class="flex-auto" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="submit" label="Save"></Button>
            </div>
        </form>
    </Dialog>
</template>
