<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';

const ledgers = ref(null);

fetch(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers`)
    .then((response) => response.json())
    .then((data) => (ledgers.value = data));
</script>

<template>
    <Card>
        <template #title>Ledgers</template>
        <template #content>
            <router-link
                v-for="ledger in ledgers"
                :key="ledger._id"
                :to="`/ledgers/${ledger._id}`"
                rel="noopener"
            >
                <Button :label="ledger.name" severity="secondary" text raised />
            </router-link>
        </template>
    </Card>
</template>
