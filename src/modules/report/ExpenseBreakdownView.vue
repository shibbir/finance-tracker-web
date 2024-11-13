<script setup lang="ts">
import { useRoute } from 'vue-router';
import SideMenu from '@/components/SideMenu.vue';
import ExpenseBreakdown from '@/modules/report/ExpenseBreakdown.vue';

const route = useRoute();
</script>

<template>
    <div class="grid grid-cols-12">
        <div class="col-span-2">
            <Suspense>
                <SideMenu />
                <template #fallback> Loading... </template>
            </Suspense>
        </div>
        <div class="col-span-10">
            <ExpenseBreakdown :ledger-id="route.params.id" />
        </div>
    </div>
</template>
