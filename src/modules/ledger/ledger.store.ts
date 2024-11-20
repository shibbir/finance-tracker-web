import axios from 'axios';
import { defineStore } from 'pinia';

export default defineStore('LedgerStore', {
    state: () => ({ ledgers: [], ledger: null, account_id: null, accounts: [] }),
    actions: {
        async getLedgers() {
            this.ledgers = (await axios.get(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers`)).data;
        },
        async getLedger(ledger_id: any) {
            this.ledger = (await axios.get(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${ledger_id}`)).data;
        },
        async getAccounts(ledger_id: any) {
            this.accounts = (await axios.get(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${ledger_id}/accounts`)).data;
        }
    }
});
