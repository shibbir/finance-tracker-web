import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useFirebaseAuth } from 'vuefire';
import { useRouter, useRoute } from 'vue-router';
import { signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, type User } from 'firebase/auth';

export default defineStore('AuthStore', () => {
    const auth = useFirebaseAuth();
    const route = useRoute();
    const router = useRouter();
    const user = ref<User | null>(null);

    const provider = new GoogleAuthProvider();

    async function loginWithGoogle() {
        if (!auth) return;
        await signInWithPopup(auth, provider);
    }

    async function logout() {
        if (!auth) return;
        await signOut(auth);

        router.push({
            path: '/login',
            query: { redirect: route.fullPath }
        });
    }

    if (auth) {
        onAuthStateChanged(auth, (firebaseUser) => {
            user.value = firebaseUser;
        });
    }

    return {
        user,
        loginWithGoogle,
        logout
    };
});
