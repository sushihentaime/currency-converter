import * as cheerio from "cheerio";
import {NextRequest, NextResponse} from "next/server";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
    const url = "https://www.hkab.org.hk/en/rates/exchange-rates";
    const data: CurrencyData = {
        date: "",
        base: "HKD",
        currencies: [],
    };

    const parseRate = (rateString: string, divideBy100: boolean = true): number => {
        const rate = parseFloat(rateString.trim());
        return divideBy100 ? parseFloat((rate / 100).toFixed(4)) : parseFloat(rate.toFixed(4));
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

            const sellingRate = parseRate($(element)
                .find(".exchange_rate_2.mobile_change_layout_table_cell > div:nth-of-type(2)")
                .first()
                .text(), true);

            const buyingTTRate = parseRate($(element)
                .find(".exchange_rate_2.mobile_change_layout_table_cell > div:nth-of-type(2)")
                .eq(1)
                .text(), true);

            const buyingDDRate = parseRate($(element)
                .find(".exchange_rate_3.mobile_change_layout_table_cell > div:nth-of-type(2)")
                .text(), true);

            const currency: Currency = {
                code,
                name,
                sellingRate,
                buyingTTRate,
                buyingDDRate,
            };

            data.currencies.push(currency);
        });

        const secondContainer = $("div.section_container_in.for_rates").find("div.general_table_container").eq(1);

        secondContainer.find("div.general_table_row.exchange_rate").each((i, element) => {
            const code = $(element)
                .find(".mobile_change_layout_table_cell.exchange_rate_1 > div:nth-of-type(2)")
                .text()
                .trim();

            const name = $(element)
                .find(".mobile_change_layout_table_cell > div:nth-of-type(2)")
                .eq(1)
                .text()
                .trim();

            const sellingRate = parseRate($(element)
                .find(".exchange_rate_2.mobile_change_layout_table_cell > div:nth-of-type(2)")
                .first()
                .text(), false);

            const buyingTTRate = parseRate($(element)
                .find(".exchange_rate_2.mobile_change_layout_table_cell > div:nth-of-type(2)")
                .eq(1)
                .text(), false);

            const buyingDDRate = parseRate($(element)
                .find(".exchange_rate_3.mobile_change_layout_table_cell > div:nth-of-type(2)")
                .text(), false);

            const currency: Currency = {
                code,
                name,
                sellingRate,
                buyingTTRate,
                buyingDDRate,
            };

            data.currencies.push(currency);
        });

        // Add HKD
        data.currencies.push({
            code: "HKD",
            name: "Hong Kong Dollar",
            sellingRate: 1.0000,
            buyingTTRate: 1.0000,
            buyingDDRate: 1.0000,
        });

        return NextResponse.json({ data });

    } catch (error) {
        console.error("Unexpected error occurred:", error);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}

