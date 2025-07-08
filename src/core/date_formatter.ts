import { format } from 'date-fns';
import useLedgerStore from '@/stores/ledger.store';

export default (date: Date | string): string => {
    const ledgerStore = useLedgerStore();

    const formatString = ledgerStore?.ledger?.date_format || 'dd.MM.yyyy';
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
        return 'Invalid date';
    }

    return format(parsedDate, formatString);
};
