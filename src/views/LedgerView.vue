<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import Transactions from '../components/Transactions.vue';
</script>

<template>
    <div class="grid">
        <div class="col-3">
            <Suspense>
                <Navbar />
                <template #fallback> Loading... </template>
            </Suspense>
        </div>
        <div class="col-9">
            <Transactions :ledger-id="$route.params.id" />
        </div>
    </div>
</template>
