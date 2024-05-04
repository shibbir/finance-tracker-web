<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Message from 'primevue/message';
import { useFirebaseAuth } from 'vuefire';
import { getRedirectResult, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

const auth = useFirebaseAuth()!;
const provider = new GoogleAuthProvider();

const error = ref(null);
function signinRedirect() {
    signInWithRedirect(auth, provider).catch((reason) => {
        console.error('Failed signinRedirect', reason);
        error.value = reason;
    });
}

onMounted(() => {
    getRedirectResult(auth).catch((reason) => {
        console.error('Failed redirect result', reason);
        error.value = reason;
    });
});
</script>

<template>
    <Message v-if="error" severity="error">{{ error }}</Message>
    <button @click="signinRedirect()">SignIn with Google</button>
</template>
