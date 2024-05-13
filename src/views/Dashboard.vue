<script setup lang="ts">
import Button from 'primevue/button';
import { signOut } from 'firebase/auth';
import { useFirebaseAuth, useCurrentUser } from 'vuefire';
import Ledgers from '../components/Ledgers.vue';

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
</script>

<template>
    <p v-if="user">Hello {{ user.displayName }}</p>
    <Button label="Sign Out" v-if="user" @click="signOut(auth)" />
    <Ledgers />
</template>
