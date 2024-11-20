<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import FileUpload from 'primevue/fileupload';
import SideMenu from '@/components/SideMenu.vue';
import TransactionForm from '@/components/TransactionForm.vue';
import TransactionsDatatable from '@/components/TransactionsDatatable.vue';

const route = useRoute();
const visible = ref(false);
</script>

<template>
    <div class="grid grid-cols-12">
        <div class="col-span-2">
            <Suspense>
                <SideMenu />
                <template #fallback> Loading... </template>
            </Suspense>
        </div>
        <div class="col-span-10">
            <Card>
                <template #title>Transactions</template>
                <template #content>
                    <Toolbar class="mb-6">
                        <template #start>
                            <Button label="New" icon="pi pi-plus" class="mr-2" @click="visible = true" />
                            <Button label="Delete" icon="pi pi-trash" severity="danger" outlined />
                        </template>

                        <template #end>
                            <FileUpload
                                mode="basic"
                                accept="image/*"
                                :maxFileSize="1000000"
                                label="Import"
                                customUpload
                                chooseLabel="Import"
                                class="mr-2"
                                auto
                                :chooseButtonProps="{ severity: 'secondary' }"
                            />
                            <Button label="Export" icon="pi pi-upload" severity="secondary" />
                        </template>
                    </Toolbar>

                    <Suspense>
                        <TransactionsDatatable :ledger-id="route.params.id" :fields="['memo']" :paginator="true" />
                        <template #fallback> Loading... </template>
                    </Suspense>
                </template>
            </Card>
            <Dialog v-model:visible="visible" modal header="Add transaction" :style="{ width: '30rem' }">
                <TransactionForm :ledger-id="route.params.id" />
            </Dialog>
        </div>
    </div>
</template>
