<script lang="ts">
import { GoogleAuthProvider } from 'firebase/auth';
export const googleAuthProvider = new GoogleAuthProvider();
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { useFirebaseAuth } from 'vuefire';
import { signInWithPopup } from 'firebase/auth';

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
    <div v-if="error" severity="error">{{ error }}</div>
    <button @click="signinPopup()">SignIn with Google</button>
</template>
