import {NextRequest, NextResponse} from "next/server";

export const runtime = "edge";

function processedData(input: any): ProcessedData {
  const data: ProcessedData = {
    date: "",
    base: "HKD",
    rates: {},
  };

  data.date = input.RateDate;

  for (const key in input) {
    if (key.endsWith("Selling")) {
      const currencyCode = key.slice(0, 3);
      data.rates[currencyCode] = {
        selling: parseFloat(input[`${currencyCode}Selling`]) || NaN,
        buyingTT: parseFloat(input[`${currencyCode}BuyingTT`]) || NaN,
        buyingDD: parseFloat(input[`${currencyCode}BuyingOD`]) || NaN,
      };
    }
  }

  return addHKD(adjustRates(filterNullRates(data)));
}

function filterNullRates(data: ProcessedData): ProcessedData {
  const filteredRates: Record<CurrencyCode, CurrencyRate> = {}

  for (const [currencyCode, currencyRate] of Object.entries(data.rates)) {
    if (!isNaN(currencyRate.selling) && !isNaN(currencyRate.buyingTT) && !isNaN(currencyRate.buyingDD)) {
      filteredRates[currencyCode] = currencyRate;
    }
  }

  return {
    date: data.date,
    base: data.base,
    rates: filteredRates,
  };
}

async function fetchDataForDate(date: string): Promise<ExchangeRateData> {
  const url = `https://www.hkab.org.hk/api/member/public/getExrate/${date}`
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data from the provided URL");
  }

  return await response.json();
}

async function fetchValidData(date: string): Promise<ExchangeRateData> {
  let data = await fetchDataForDate(date);

  while(data.holiday === 1) {
    const previousWorkingDay = new Date(date);
    previousWorkingDay.setDate(previousWorkingDay.getDate() - 1);

    date = previousWorkingDay.toISOString().split("T")[0];
    data = await fetchDataForDate(date);
  }

  return data;
}

function adjustRates(data: ProcessedData): ProcessedData {
  const adjustedRates: Record<CurrencyCode, CurrencyRate> = {};

  for(const [currencyCode, rate] of Object.entries(data.rates)) {
    if (currencyCode === 'GBP') {
      adjustedRates[currencyCode] = {
        selling: parseFloat(rate.selling.toFixed(4)),
        buyingTT: parseFloat(rate.buyingTT.toFixed(4)),
        buyingDD: parseFloat(rate.buyingDD.toFixed(4)),
      };
    } else {
      adjustedRates[currencyCode] = {
        selling: parseFloat((rate.selling / 100).toFixed(4)),
        buyingTT: parseFloat((rate.buyingTT / 100).toFixed(4)),
        buyingDD: parseFloat((rate.buyingDD / 100).toFixed(4)),
      }
    }
  }

  return {
    date: data.date,
    base: data.base,
    rates: adjustedRates,
  };
}

function addHKD(data: ProcessedData): ProcessedData {
  const adjustedRates: Record<CurrencyCode, CurrencyRate> = {
    ...data.rates,
    HKD: {
      selling: 1,
      buyingTT: 1,
      buyingDD: 1,
    },
  };

  return {
    date: data.date,
    base: data.base,
    rates: adjustedRates,
  };
}


export default async function handler(req: NextRequest) {
  try {
    const currentDate = new Date().toISOString().split("T")[0];

    const apiData = await fetchValidData(currentDate);
    const data = processedData(apiData);

    return NextResponse.json({ data });

  } catch (error) {
    console.error("Unexpected error occurred:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

