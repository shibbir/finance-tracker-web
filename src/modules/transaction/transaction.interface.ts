export default interface ITransaction {
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
