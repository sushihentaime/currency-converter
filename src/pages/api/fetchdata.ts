import type { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";
import * as cheerio from "cheerio";

export const runtime = "edge";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = "https://www.hkab.org.hk/en/rates/exchange-rates";
    const data: CurrencyData = {
        date: "",
        base: "HKD",
        currencies: [],
    };

    try {
        const response = await axios.get(url);

        const $ = cheerio.load(response.data);

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

        res.status(200).json({ data });

    } catch (error) {
        res.status(500).json({ error });
    }
}
