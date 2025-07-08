import axios from 'axios';
import { defineStore } from 'pinia';

const BASE_URL = import.meta.env.VITE_SERVICE_BASE_URL;

export default defineStore('LedgerStore', {
    state: () => ({ ledgers: [], ledger: null }),

    actions: {
        async getLedgers() {
            const response = await axios.get(`${BASE_URL}/ledgers/`);
            this.ledgers = response.data;
        },

        async getLedger(ledger_id: string) {
            const response = await axios.get(`${BASE_URL}/ledgers/${ledger_id}`);
            this.ledger = response.data;
        }
    }
});
