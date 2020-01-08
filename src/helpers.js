import { TEST_IEX_API_KEY, IEX_API_KEY, FINN_HUB_API_KEY } from "./secrets.js";
import { http } from "./http.js";

export async function getSymbol() {
    const results = await http.get(
        // `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${search_term}&apikey=${API_KEY}`
        `https://sandbox.iexapis.com/stable/ref-data/symbols?token=${TEST_IEX_API_KEY}`
        //`https://cloud.iexapis.com/stable/ref-data/symbols?token=${IEX_API_KEY}`
    );
    return results;
}

export async function getStockQuote(symbol) {
    const results = await http.get(
        `https://sandbox.iexapis.com/stable/stock/${symbol}/quote?displayPercent=true&token=${TEST_IEX_API_KEY}`
    );
    return results;
}

export async function getMutipleStocks(symbols) {
    // const results = await http.get(`https://cloud.iexapis.com/stable/stock/market/batch?symbols=${symbols}&types=quote&last=5&token=${IEX_API_KEY}`);
    const results = await http.get(`https://sandbox.iexapis.com/stable/stock/market/batch?symbols=${symbols}&types=quote&last=5&token=${TEST_IEX_API_KEY}`);
    return results;
}

export function formatData(data) {
    //console.log(data);
    let formattedData = {};
    data.forEach(item => {
        let name = `${item.symbol}`;
        formattedData[name] = `(${item.name})`;
    });
    return formattedData;
}

