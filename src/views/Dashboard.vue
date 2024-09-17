<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

import { useLedgerStore } from '@/store';

const router = useRouter();
const store = useLedgerStore();
const ledgers: any = store.ledgers;
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-6 lg:col-3" v-for="ledger in ledgers">
            <Card style="width: 25rem; overflow: hidden">
                <template #title>{{ ledger.name }}</template>
                <template #content>
                    <p class="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                        quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                    </p>
                </template>
                <template #footer>
                    <div class="flex gap-3 mt-1">
                        <Button label="Explore" severity="secondary" outlined class="w-full" @click="router.push(`/ledgers/${ledger._id}`)" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
