<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue';
import Transactions from '@/components/Transactions.vue';
</script>

<template>
    <div class="grid">
        <div class="col-2">
            <Suspense>
                <SideMenu />
                <template #fallback> Loading... </template>
            </Suspense>
        </div>
        <div class="col-10">
            <Transactions />
        </div>
    </div>
</template>
