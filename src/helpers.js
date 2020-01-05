import { API_KEY, FINN_HUB_API_KEY } from "./secrets.js";
import { http } from "./http.js";

export async function getSymbols() {
    const results = await http.get(
        // `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${search_term}&apikey=${API_KEY}`
        `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${FINN_HUB_API_KEY}`
    );
    return results;
}

export async function getStockQuote(search_term) {
    const results = await http.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search_term}&apikey=${API_KEY}`
    );
    return results;
}

export function formatData(data) {
    //console.log(data);
    let formattedData = {};
    data.forEach(item => {
        let name = `${item["symbol"]}`;
        formattedData[name] = `(${item["description"]})`;
    });
    return formattedData;
}

export const debounce = (func, delay) => {
    let inDebounce;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
};

