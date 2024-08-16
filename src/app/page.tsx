"use client";

import { useState } from "react";

export const runtime = "edge";

export default function Home() {
  const [baseCurrency, setBaseCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [amount, setAmount] = useState<number | string>(0);
  const [rate, setRate] = useState<number | string>(0);
  const [result, setResult] = useState<null | {
    marketRateDate: string;
    marketRate: number;
    providedRate: number;
    expectedAmount: number;
    receivedAmount: number;
    profitOrLoss: number;
  }>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (baseCurrency === "" || targetCurrency === "" || amount === 0 || rate === 0) {
      alert("Please fill in all fields.");
      return;
    }

    const response = await fetch("/api/mid-market");
    if (!response.ok) {
      alert("Failed to fetch currency data. Please try again.");
      return;
    }

    const result = await response.json();
    const currencyData: ProcessedCurrencyData = result.data;

    const baseCurrencyData = currencyData.currencies.find((currency) => currency.code === baseCurrency);
    const targetCurrencyData = currencyData.currencies.find((currency) => currency.code === targetCurrency);
    if (!baseCurrencyData || !targetCurrencyData) {
      alert("Currency not found in the data. Please try again.");
      return;
    }

    const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    const parsedRate = typeof rate === "string" ? parseFloat(rate) : rate;
    if (isNaN(parsedAmount) || isNaN(parsedRate)) {
      alert("Invalid amount or rate. Please try again.");
      return;
    }

    let expectedAmount = 0;
    let receivedAmount = 0;
    let expectedRate = 0;

    if (baseCurrency === targetCurrency) {
      alert("The base currency and target currency are the same. No conversion is needed.");
      return;
    } else if (baseCurrency === "HKD" && targetCurrency !== "HKD") {
      expectedRate = 1/targetCurrencyData.rate;
      console.log(`Expected rate: ${expectedRate}`);
      expectedAmount = parsedAmount * expectedRate;
      receivedAmount = parsedAmount * parsedRate;
      console.log(`Expected amount: ${expectedAmount}`);
      console.log(`Received amount: ${receivedAmount}`);
    } else if (baseCurrency !== "HKD" && targetCurrency === "HKD") {
      expectedRate = baseCurrencyData.rate;
      console.log(`Expected rate: ${expectedRate}`);
      expectedAmount = parsedAmount * expectedRate;
      receivedAmount = parsedAmount * parsedRate;
      console.log(`Expected amount: ${expectedAmount}`);
      console.log(`Received amount: ${receivedAmount}`);
    } else {
      expectedRate = baseCurrencyData.rate / targetCurrencyData.rate
      console.log(`Expected rate: ${expectedRate}`);
      expectedAmount = parsedAmount * expectedRate;
      receivedAmount = parsedAmount * parsedRate;
      console.log(`Expected amount: ${expectedAmount}`);
      console.log(`Received amount: ${receivedAmount}`);
    }

    const profitOrLoss = receivedAmount - expectedAmount;

    setResult({
      marketRateDate: currencyData.date,
      marketRate: expectedRate,
      providedRate: parsedRate,
      expectedAmount,
      receivedAmount,
      profitOrLoss,
    });
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Currency Converter</h1>
        <p className="text-gray-600 text-center mb-4">
        Currency rates tracks foreign exchange references rates published by the Hong Kong Association of Banks. For more details, visit {" "}
          <a href="https://www.hkab.org.hk/en/rates/exchange-rates" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">HKAB</a>.</p>
        <p className="text-gray-600 text-center mb-6">The data refreshes at around 09:00 (GMT+8) every working day.</p>

        <form id="currencyForm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="baseCurrency" className="block text-gray-700 font-medium mb-2">Base Currency:</label>
            <input type="text" id="baseCurrency" placeholder="e.g., HKD" list="currencies" value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
          </div>

          <div className="mb-4">
            <label htmlFor="targetCurrency" className="block text-gray-700 font-medium mb-2">Target Currency:</label>
            <input type="text" id="targetCurrency" placeholder="e.g., USD" list="currencies" value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">Amount:</label>
            <input type="number" id="amount" placeholder="e.g., 100" value={amount} onChange={(e) => { const value = e.target.value; setAmount(value === '' ? '' : parseFloat(value));}} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
          </div>

          <div className="mb-6">
            <label htmlFor="rate" className="block text-gray-700 font-medium mb-2">Third-Party Conversion Rate (In Target Currency):</label>
            <input type="number" id="rate" placeholder="e.g., 7.75" value={rate} onChange={(e) => {const value = e.target.value; setRate(value === '' ? '' : parseFloat(value));}} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">Convert</button>
        </form>

        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Conversion Result</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Market Date:</span>{" "} 
              {result.marketRateDate}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Market Conversion Rate:</span>{" "} 
              {result.marketRate.toFixed(4)}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Provided Conversion Rate:</span>{" "}{result.providedRate.toFixed(4)}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Expected Amount:</span>{" "}{result.expectedAmount.toFixed(2)} {targetCurrency}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Received Amount:</span>{" "}{result.receivedAmount.toFixed(2)} {targetCurrency}
            </p>
            <p className={`text-gray-700 mb-2 ${result.profitOrLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <span className="font-medium">Profit/Loss:</span>{" "}
              {result.profitOrLoss.toFixed(2)} {targetCurrency}{" "}
              ({result.profitOrLoss >= 0 ? "Profit" : "Loss"})
            </p>
          </div>
        )}

      <datalist id="currencies">
        <option value="AUD"></option>
        <option value="BND"></option>
        <option value="CAD"></option>
        <option value="CHF"></option>
        <option value="DKK"></option>
        <option value="EUR"></option>
        <option value="HKD"></option>
        <option value="INR"></option>
        <option value="JPY"></option>
        <option value="MYR"></option>
        <option value="NOK"></option>
        <option value="NTD"></option>
        <option value="NZD"></option>
        <option value="PHP"></option>
        <option value="PKR"></option>
        <option value="CNY"></option>
        <option value="CNH"></option>
        <option value="SEK"></option>
        <option value="SGD"></option>
        <option value="THB"></option>
        <option value="USD"></option>
        <option value="WON"></option>                                         
        <option value="ZAR"></option>
      </datalist>
      </div>
    </div>
    </div>
  );
}
