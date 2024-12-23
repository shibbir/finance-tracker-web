import axios from 'axios';
import { defineStore } from 'pinia';
import type ITransaction from './transaction.interface';

export default defineStore('TransactionStore', {
    state: () => ({ transactions: [] as ITransaction[] }),
    actions: {
        async getTransactions(ledger_id: any, query?: any) {
            let url = `${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${ledger_id}/transactions`;
            if (query && Object.keys(query).length) {
                url += `?`;
                for (const key in query) {
                    url += `${key}=${query[key]}&`;
                }
            }
            this.transactions = (await axios.get(url)).data;
        },
        async postTransaction(data: ITransaction) {
            const api = `${import.meta.env.VITE_SERVICE_BASE_URL}/ledgers/${data.ledger_id}/transactions`;
            const response = (await axios.post(api, data)).data;
            this.transactions.push(response);
        }
    }
});
