<script setup lang="ts">
import { useCurrentUser } from 'vuefire';
import Ledgers from '../components/Ledgers.vue';

const user = useCurrentUser();
</script>

<template>
    <p v-if="user">Hello {{ user.providerData.displayName }}</p>
    <Ledgers />
</template>
