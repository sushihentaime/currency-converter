import React from "react";

export const runtime = "edge";

const currencyRateResponse = JSON.stringify({
  "data": {
    "date": "2024-08-16",
    "base": "HKD",
    "currencies": [
      { "code": "AUD", "name": "Australian Dollars", "sellingRate": 5.2365, "buyingTTRate": 5.076, "buyingDDRate": 5.044 },
      { "code": "BND", "name": "Brunei Dollars", "sellingRate": 5.962, "buyingTTRate": 5.8325, "buyingDDRate": 5.8225 },
      { "code": "CAD", "name": "Canadian Dollars", "sellingRate": 5.759, "buyingTTRate": 5.5965, "buyingDDRate": 5.5765 },
      { "code": "CHF", "name": "Swiss Francs", "sellingRate": 9.0215, "buyingTTRate": 8.856, "buyingDDRate": 8.843 }
    ]
  }
}, null, 2);


const midMarketRateResponse = JSON.stringify({
  "data": {
    "date": "2024-08-16",
    "base": "HKD",
    "currencies": [
      { "code": "AUD", "name": "Australian Dollars", "rate": 5.1482 },
      { "code": "BND", "name": "Brunei Dollars", "rate": 5.8948 },
      { "code": "CAD", "name": "Canadian Dollars", "rate": 8.6728 },
      { "code": "CHF", "name": "Swiss Francs", "rate": 8.9355 },
    ]
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
