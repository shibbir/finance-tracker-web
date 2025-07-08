import axios from 'axios';
import { defineStore } from 'pinia';

interface ITransaction {
    _id?: string;
    date: Date;
    type: string;
    amount: number;
    memo?: string;
    ledger_id: string;
    account_id: string;
    category_id: string;
    merchant_id: string;
}

const BASE_URL = import.meta.env.VITE_SERVICE_BASE_URL;

export default defineStore('TransactionStore', {
    state: () => ({ transactions: [] as ITransaction[] }),

    actions: {
        async getTransactions(ledger_id: string, query?: any) {
            let url = `${BASE_URL}/ledgers/${ledger_id}/transactions`;
            if (query && Object.keys(query).length) {
                const params = new URLSearchParams(query).toString();
                url += `?${params}`;
            }
            const response = await axios.get<ITransaction[]>(url);
            this.transactions = response.data;
        },

        async postTransaction(data: ITransaction) {
            const url = `${BASE_URL}/ledgers/${data.ledger_id}/transactions`;
            const response = await axios.post<ITransaction>(url, data);
            this.transactions.push(response.data);
        }
    }
});
