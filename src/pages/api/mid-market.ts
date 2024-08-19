import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  try {
    const data: MidMarketData = {
      date: "",
      base: "",
      rates: {},
    };

    const response = await fetch(`${req.nextUrl.origin}/api/rates`);
    if (!response.ok) {
      throw new Error("Failed to fetch data from the provided URL");
    }

    const result: ProcessedData = (await response.json()).data;

    const rate = (sellingRate: number, buyingTTRate: number, buyingDDRate: number): number => {
      return (sellingRate + (buyingDDRate + buyingTTRate) /2) / 2;
    }

    data.date = result.date;
    data.base = result.base;

    data.rates = Object.fromEntries(Object.entries(result.rates).map(([currencyCode, currencyRate]) => {
      return [currencyCode, rate(currencyRate.selling, currencyRate.buyingTT, currencyRate.buyingDD)];
    }));

    return NextResponse.json({ data });

  } catch(error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch currency data. Please try again." }, { status: 500 });
  }
}
