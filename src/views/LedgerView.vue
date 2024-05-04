<script setup lang="ts">
import Transactions from '../components/Transactions.vue';
</script>

<template>
    <Transactions :ledger-id="$route.params.id" />
</template>
