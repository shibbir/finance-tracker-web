<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useCurrentUser } from 'vuefire';
import { useRouter, useRoute, RouterView } from 'vue-router';

import { useLedgerStore } from '@/store';

const user = useCurrentUser();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
    const store = useLedgerStore();
    await store.getLedgers();
});

watch(user, async (currentUser, previousUser) => {
    if (!currentUser && previousUser && route.meta.requiresAuth) {
        return router.push({ name: 'login' });
    }

    if (currentUser && typeof route.query.redirect === 'string') {
        return router.push(route.query.redirect);
    }
});
</script>

<template>
    <RouterView />
</template>
