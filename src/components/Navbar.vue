<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import Menu from 'primevue/menu';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { useFirebaseAuth, useCurrentUser } from 'vuefire';

const router = useRouter();
const user = useCurrentUser();
const auth = useFirebaseAuth()!;

const ledgers: any = await axios.get(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers`);

const items = ref([
    {
        separator: true
    },
    {
        label: 'Ledgers',
        items: ledgers.data.map((ledger) => ({
            label: ledger.name,
            route: `/ledgers/${ledger._id}`
        }))
    },
    {
        label: 'Profile',
        items: [
            {
                label: 'Logout',
                command: () => {
                    signOut(auth);
                    router.push('/login');
                }
            }
        ]
    }
]);
</script>

<template>
    <Menu :model="items" class="w-full md:w-15rem">
        <template #start>
            <span class="inline-flex align-items-center gap-1 px-2 py-2">
                <span class="font-medium text-xl font-semibold">Finance Tracker</span>
            </span>
        </template>
        <template #submenuheader="{ item }">
            <span class="text-primary font-bold">{{ item.label }}</span>
        </template>
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </router-link>
            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span class="ml-2">{{ item.label }}</span>
            </a>
        </template>
    </Menu>
</template>
