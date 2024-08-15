interface Currency {
    code: string;
    name: string;
    rate: number;
}

interface CurrencyData {
    date: string;
    base: string;
    currencies: Currency[];
}
