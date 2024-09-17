import currency from 'currency.js';

export default (value: number, symbol: string, group_separator: string, decimal_separator: string) =>
    currency(value, {
        symbol: symbol,
        separator: group_separator,
        decimal: decimal_separator,
        precision: 2
    });
