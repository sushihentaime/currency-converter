import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as cheerio from "cheerio";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
    const url = "https://www.hkab.org.hk/en/rates/exchange-rates";
    const data: CurrencyData = {
        date: "",
        base: "HKD",
        currencies: [],
    };

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch data from the provided URL");
        }

        const html = await response.text();

        const $ = cheerio.load(html);

        data.date = $("div.section_container_in.shorter").find("strong").text().trim();

        const firstContainer = $("div.section_container_in.for_rates")
            .find("div.general_table_container")
            .first();

        firstContainer.find("div.general_table_row.exchange_rate").each((i, element) => {
            const code = $(element)
                .find(".mobile_change_layout_table_cell.exchange_rate_1 > div:nth-of-type(2)")
                .text()
                .trim();

            const name = $(element)
                .find(".mobile_change_layout_table_cell > div:nth-of-type(2)")
                .eq(1)
                .text()
                .trim();

            const sellingRate = $(element)
                .find(".exchange_rate_2.mobile_change_layout_table_cell > div:nth-of-type(2)")
                .first()
                .text()
                .trim();

            const buyingTTRate = $(element)
                .find(".exchange_rate_2.mobile_change_layout_table_cell > div:nth-of-type(2)")
                .eq(1)
                .text()
                .trim();

            const buyingDDRate = $(element)
                .find(".exchange_rate_3.mobile_change_layout_table_cell > div:nth-of-type(2)")
                .text()
                .trim();

            const rate = parseFloat(((parseFloat(sellingRate) + (parseFloat(buyingTTRate) + parseFloat(buyingDDRate)) / 2) / 2).toFixed(4));

            const currency: Currency = {
                code,
                name,
                rate,
            };

            data.currencies.push(currency);
        });

        //add HKD
        data.currencies.push({
            code: "HKD",
            name: "Hong Kong Dollar",
            rate: 1,
        });

        return NextResponse.json({ data });

    } catch (error) {
        console.error("Unexpected error occurred:", error);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}
