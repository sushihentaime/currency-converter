import React from "react";

export const runtime = "edge";

const currencyRateResponse = JSON.stringify({
  "data": {
    "date": "2024-08-19",
    "base": "HKD",
    "rates": {
      "AUD": {
        "selling": 5.283,
        "buyingTT": 5.1225,
        "buyingDD": 5.0905
      },
      "BND": {
        "selling": 5.99,
        "buyingTT": 5.8605,
        "buyingDD": 5.8505
      },
      "CAD": {
        "selling": 5.7795,
        "buyingTT": 5.617,
        "buyingDD": 5.597
      }
    }
  }
}, null, 2);


const midMarketRateResponse = JSON.stringify({
  "data": {
    "date": "2024-08-19",
    "base": "HKD",
    "rates": {
      "AUD": 5.19475,
      "BND": 5.922750000000001,
      "CAD": 5.69325,
      "DKK": 1.1435,
      "INR": 0.092075,
      "JPY": 0.052675,
      "MYR": 1.7633750000000001,
      "NZD": 4.71525,
      "NOK": 0.7286250000000001,
      "PKR": 0.02725,
      "PHP": 0.13545000000000001,
      "SGD": 5.922750000000001,
      "ZAR": 0.43525,
      "SEK": 0.7455499999999999,
      "CHF": 8.9815,
      "THB": 0.22517500000000001,
      "USD": 7.78875,
      "EUR": 8.58675,
      "WON": 0.00575,
      "NTD": 0.24245,
      "GBP": 10.07875,
      "CNY": 1.08755,
      "CNH": 1.0883500000000002,
      "HKD": 1
    }
  }
}, null, 2);

const DocumentationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <main className="w-full max-w-4xl p-8 mx-auto">
        <section id="rates" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Documentation</h2>
          <p className="mb-4">These APIs provide currency exchange information published by the Hong Kong Association of Banks. The data refreshes around 09:00 (GMT+8) every working day.</p>

          {/* Currency Rates API */}
          <h3 className="text-xl font-semibold mb-2">Currency Rates API</h3>
          <p className="mb-4">This API provides the latest buying and selling rates for various currencies.</p>
          <div className="bg-white shadow-md rounded-md mb-4">
            <div className="p-4">
              <pre className="overflow-x-auto text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>
                <code>
                  GET https://currency-converter-3ti.pages.dev/api/rates HTTP/1.1
                </code>
              </pre>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md mb-4">
            <div className="p-4">
              <pre className="overflow-x-auto text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>
                <code>
                  {currencyRateResponse}
                </code>
              </pre>
            </div>
          </div>

          {/* Mid-Market Rates API */}
          <h3 className="text-xl font-semibold mb-2">Mid-Market Rates API</h3>
          <p className="mb-4">This API provides the mid-market rates, which is calculated by the average of the buying and selling rates.</p>
          <div className="bg-white shadow-md rounded-md mb-4">
            <div className="p-4">
              <pre className="overflow-x-auto text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>
                <code>
                  GET https://currency-converter-3ti.pages.dev/api/mid-market HTTP/1.1
                </code>
              </pre>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md">
            <div className="p-4">
              <pre className="overflow-x-auto text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>
                <code>
                  {midMarketRateResponse}
                </code>
              </pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DocumentationPage;
