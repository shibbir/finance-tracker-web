<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFirebaseAuth } from 'vuefire';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = useFirebaseAuth()!;
const router = useRouter();
const route = useRoute();

const error = ref<unknown>(null);

const provider = new GoogleAuthProvider();

async function signinPopup() {
    error.value = null;
    try {
        await signInWithPopup(auth, provider);

        const redirectPath = route.query.redirect?.toString() || '/';
        router.push(redirectPath);
    } catch (reason) {
        console.error('Failed sign-in', reason);
        error.value = reason;
    }
}
</script>

<template>
    <div v-if="error" severity="error">{{ error }}</div>
    <button @click="signinPopup()">SignIn with Google</button>
</template>
