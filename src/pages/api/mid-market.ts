import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
    const data: ProcessedCurrencyData = {
        date: "",
        base: "HKD",
        currencies: [],
    };

    try {
        const response = await fetch(`${req.nextUrl.origin}/api/rates`);
        if (!response.ok) {
            throw new Error("Failed to fetch data from the provided URL");
        }

        const result: CurrencyData = (await response.json()).data;
        data.date = result.date;
        data.base = result.base;

        const rate = (sellingRate: number, buyingTTRate: number, buyingDDRate: number): number => {
            const parsedRate = (sellingRate + (buyingDDRate + buyingTTRate) /2) / 2;
            return parseFloat(parsedRate.toFixed(4));
        }

        result.currencies.forEach((currency) => {
            data.currencies.push({
                code: currency.code,
                name: currency.name,
                rate: rate(currency.sellingRate, currency.buyingTTRate, currency.buyingDDRate),
            });
        });

        return NextResponse.json({ data });

    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch currency data. Please try again." }, { status: 500 });
    }
}
