<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import useLedgerStore from '@/modules/ledger/ledger.store';

const router = useRouter();

const { ledgers } = storeToRefs(useLedgerStore());

onMounted(async () => {
    const store = useLedgerStore();
    await store.getLedgers();
});
</script>

<template>
    <div v-if="ledgers" v-for="ledger in ledgers">
        <p>{{ ledger.name }}</p>
        <button @click="router.push(`/ledgers/${ledger._id}`)">Explore</button>
    </div>
</template>
