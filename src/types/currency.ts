interface Currency {
    code: string;
    name: string;
    sellingRate: number;
    buyingTTRate: number;
    buyingDDRate: number;
}

interface CurrencyData {
    date: string;
    base: string;
    currencies: Currency[];
}

interface ProcessedCurrency {
    code: string;
    name: string;
    rate: number;
}

interface ProcessedCurrencyData {
    date: string;
    base: string;
    currencies: ProcessedCurrency[];
}
