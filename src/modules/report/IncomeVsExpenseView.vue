<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Select from 'primevue/select';
import SideMenu from '@/components/SideMenu.vue';
import IncomeVsExpense from '@/modules/report/IncomeVsExpense.vue';
import CategoricalMonthlyExpenses from '@/modules/report/CategoricalMonthlyExpenses.vue';

const route = useRoute();
const year = ref(new Date().getFullYear());
</script>

<template>
    <div class="grid grid-cols-12 gap-3">
        <div class="col-span-2">
            <Suspense>
                <SideMenu />
                <template #fallback> Loading... </template>
            </Suspense>
        </div>
        <div class="col-span-10">
            <Select v-model="year" :options="[2021, 2022, 2023, 2024]" />

            <IncomeVsExpense :ledger-id="route.params.id" :year="year" />

            <br />

            <CategoricalMonthlyExpenses :ledger-id="route.params.id" :year="year" />
        </div>
    </div>
</template>
