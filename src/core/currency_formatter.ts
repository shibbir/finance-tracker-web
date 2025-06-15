import currency from 'currency.js';
import useLedgerStore from '@/modules/ledger/ledger.store';

export default (value: number) => {
    const ledgerStore = useLedgerStore();

    return currency(value, {
        symbol: ledgerStore?.ledger?.currency_format?.currency_symbol,
        separator: ledgerStore?.ledger?.currency_format?.group_separator || ',',
        decimal: ledgerStore?.ledger?.currency_format?.decimal_separator || '.',
        precision: 2
    }).format();
};
