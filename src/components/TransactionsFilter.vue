<script setup lang="ts">
import { ref, watch, defineExpose, computed, onBeforeUnmount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useLedgerStore from '@/stores/ledger.store';

const ledgerStore = useLedgerStore();
const route = useRoute();
const router = useRouter();

const showModal = ref(false);

const selectedAccount = ref('');
const selectedMerchant = ref('');
const selectedCategory = ref('');
const selectedCategoryGroup = ref('');
const startDate = ref('');
const endDate = ref('');
const selectedType = ref('');

const accounts = computed(() => ledgerStore.ledger?.accounts || []);
const merchants = computed(() => ledgerStore.ledger?.merchants || []);
const categories = computed(() => ledgerStore.ledger?.categories || []);
const category_groups = computed(() => ledgerStore.ledger?.category_groups || []);

function loadFiltersFromQuery() {
    selectedAccount.value = (route.query.account_id as string) || '';
    selectedMerchant.value = (route.query.merchant_id as string) || '';
    selectedCategory.value = (route.query.category_id as string) || '';
    selectedCategoryGroup.value = (route.query.category_group_id as string) || '';
    startDate.value = (route.query.start_date as string) || '';
    endDate.value = (route.query.end_date as string) || '';
    selectedType.value = (route.query.type as string) || '';
}

const filter = computed(() => {
    const f: Record<string, string> = {};
    if (selectedAccount.value) f.account_id = selectedAccount.value;
    if (selectedMerchant.value) f.merchant_id = selectedMerchant.value;
    if (selectedCategory.value) f.category_id = selectedCategory.value;
    if (selectedCategoryGroup.value) f.category_group_id = selectedCategoryGroup.value;
    if (startDate.value) f.start_date = startDate.value;
    if (endDate.value) f.end_date = endDate.value;
    if (selectedType.value) f.type = selectedType.value;
    return f;
});

const emit = defineEmits<{
    (e: 'update:filter', value: Record<string, string>): void;
}>();

function executeFilter() {
    const f = filter.value;

    router.replace({
        query: {
            ...route.query,
            ...f
        }
    });

    emit('update:filter', f);
    close();
}

function open() {
    loadFiltersFromQuery();
    showModal.value = true;
}

function close() {
    showModal.value = false;
}

defineExpose({ open, close });

watch(showModal, (val) => {
    if (val) {
        document.body.classList.add('modal-open');
    } else {
        document.body.classList.remove('modal-open');
    }
});

onBeforeUnmount(() => {
    document.body.classList.remove('modal-open');
});

onMounted(() => {
    loadFiltersFromQuery();
    emit('update:filter', filter.value);
});
</script>

<template>
    <div v-if="showModal" class="modal" @click.self="close" role="dialog" aria-labelledby="filter-dialog-title">
        <div class="modal-content">
            <form @submit.prevent class="form-grid">
                <div>
                    <label for="account">Account</label>
                    <select id="account" v-model="selectedAccount">
                        <option value="">All</option>
                        <option v-for="acc in accounts" :key="acc._id" :value="acc._id">
                            {{ acc.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label for="merchant">Merchant</label>
                    <select id="merchant" v-model="selectedMerchant">
                        <option value="">All</option>
                        <option v-for="merch in merchants" :key="merch._id" :value="merch._id">
                            {{ merch.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label for="category-group">Category Group</label>
                    <select id="category-group" v-model="selectedCategoryGroup">
                        <option value="">All</option>
                        <option v-for="cat in category_groups" :key="cat._id" :value="cat._id">
                            {{ cat.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label for="category">Child Category</label>
                    <select id="category" v-model="selectedCategory">
                        <option value="">All</option>
                        <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                            {{ cat.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label for="start-date">Start Date</label>
                    <input type="date" id="start-date" v-model="startDate" />
                </div>

                <div>
                    <label for="end-date">End Date</label>
                    <input type="date" id="end-date" v-model="endDate" />
                </div>

                <div>
                    <label for="category">Type</label>
                    <select id="category" v-model="selectedType">
                        <option value="">All</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                </div>
            </form>

            <footer style="margin-top: 1.5rem; text-align: right">
                <button class="primary-button" @click="executeFilter" type="button">Execute Filter</button>
                <button class="close-btn-text" @click="close" type="button" style="margin-left: 0.5rem">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.modal-content {
    padding: 1rem;
}

label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--color-text);
}

select,
input[type='date'] {
    width: 100%;
    box-sizing: border-box;
}

.form-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
}

.close-btn-text {
    background-color: transparent;
    color: var(--color-muted);
    border: 1px solid var(--color-border);
    font-weight: 500;
}

.close-btn-text:hover {
    color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
}

@media (max-width: 500px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
