import axios from 'axios';
import { defineStore } from 'pinia';

export const useLedgerStore = defineStore('Ledger Store', {
    state: () => ({ ledgers: [], ledger: null, account_id: null }),
    actions: {
        async getLedgers() {
            this.ledgers = (await axios.get(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers`)).data;
        },
        async getLedger(ledger_id: any) {
            this.ledger = (await axios.get(`${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${ledger_id}`)).data;
        }
    }
});

export const useTransactionStore = defineStore('Transaction Store', {
    state: () => ({ transactions: [] }),
    actions: {
        async getTransactions(ledger_id: any, query?: any) {
            let url = `${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${ledger_id}/transactions`;
            if (Object.keys(query).length) {
                url += `?`;
                for (const key in query) {
                    url += `${key}=${query[key]}&`;
                }
            }
            this.transactions = (await axios.get(url)).data;
        }
    }
});
