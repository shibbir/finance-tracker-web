<script setup lang="ts">
import { ref } from 'vue';
import Select from 'primevue/select';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import InputNumber from 'primevue/inputnumber';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, number, date as yupdate } from 'yup';

const props = defineProps(['ledgerId']);
const visible = defineModel();
const accounts: Record<any, any> = ref([]);
const recipients: Record<any, any> = ref([]);
const categories: Record<any, any> = ref([]);

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/accounts`)
    .then((response) => response.json())
    .then((data) => (accounts.value = data.accounts));

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/recipients`)
    .then((response) => response.json())
    .then((data) => (recipients.value = data.recipients));

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${props.ledgerId}/categories`)
    .then((response) => response.json())
    .then((data) => (categories.value = data.categories));

const { meta, handleSubmit, defineField } = useForm({
    validationSchema: toTypedSchema(
        object({
            date: yupdate().required(),
            account_id: string().required(),
            recipient_id: string(),
            category_id: string().required(),
            amount: number(),
            memo: string()
        })
    ),
    initialValues: {
        date: new Date(),
        account_id: undefined,
        recipient_id: undefined,
        category_id: undefined,
        amount: 0,
        memo: ''
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
    // visible.value = false;
});

const [date] = defineField('date');
const [account_id] = defineField('account_id');
const [recipient_id] = defineField('recipient_id');
const [category_id] = defineField('category_id');
const [amount] = defineField('amount');
const [memo] = defineField('memo');
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Add transaction" :style="{ width: '30rem' }">
        <form @submit="onSubmit">
            <div class="flex items-center gap-4 mb-4">
                <label for="account" class="font-semibold w-24">Account</label>
                <Select
                    v-model="account_id"
                    :options="accounts"
                    optionLabel="name"
                    optionValue="_id"
                    placeholder="Select account"
                    class="flex-auto"
                />
            </div>

            <div class="flex items-center gap-4 mb-4">
                <label for="date" class="font-semibold w-24">Date</label>
                <DatePicker v-model="date" class="flex-auto" />
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
                <label for="recipient" class="font-semibold w-24">Recipient</label>
                <Select
                    v-model="recipient_id"
                    :options="recipients"
                    optionLabel="name"
                    optionValue="_id"
                    placeholder="Select recipient"
                    class="flex-auto"
                />
            </div>

            <div class="flex items-center gap-4 mb-4">
                <label for="amount" class="font-semibold w-24">Amount</label>
                <InputNumber v-model="amount" :minFractionDigits="2" :maxFractionDigits="5" class="flex-auto" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="memo" class="font-semibold w-24">Memo</label>
                <InputText type="text" v-model="memo" class="flex-auto" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="submit" label="Save" :disabled="!meta.valid"></Button>
            </div>
        </form>
    </Dialog>
</template>
