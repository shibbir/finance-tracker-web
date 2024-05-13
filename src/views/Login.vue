<script lang="ts">
import { GoogleAuthProvider } from 'firebase/auth';
export const googleAuthProvider = new GoogleAuthProvider();
</script>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useFirebaseAuth, useCurrentUser } from 'vuefire';
import { signInWithPopup } from 'firebase/auth';

const user = useCurrentUser();
const auth = useFirebaseAuth()!;

const error = ref(null);
function signinPopup() {
    error.value = null;
    signInWithPopup(auth, googleAuthProvider).catch((reason) => {
        console.error('Failed sign', reason);
        error.value = reason;
    });
}
</script>

<template>
    <p v-if="user">Hello {{ user.displayName }}</p>
    <Message v-if="error" severity="error">{{ error }}</Message>
    <Button label="SignIn with Google" @click="signinPopup()" />
</template>
