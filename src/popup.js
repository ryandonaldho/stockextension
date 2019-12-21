import { http } from "./http.js";
import { ui } from "./ui.js";

let API_KEY = "TBL9WNG4CFWI9APR";

let data = null;
let elems = null;
let instances = null;
let state = {
  selectedStock: '',
};

// update state
function updateSelectedStock(data) {
  console.log(data);
  state["selectedStock"] = data;
}

// add stock to watchlist state
function addStockToPortfolio(stock) {
  let watchlist = [];
  chrome.storage.local.get(['stocks'], function (result) {
    console.log(result.stocks);
    if (result.stocks != null) {
      watchlist = result.stocks;
      console.log(watchlist);
    }

    watchlist.push(stock);
    chrome.storage.local.set({ stocks: watchlist });
  });
}

// 


document.addEventListener("DOMContentLoaded", function () {
  elems = document.querySelectorAll(".autocomplete");
  instances = M.Autocomplete.init(elems, {
    data,
    minLength: 0
  });

  ui.initialState();

  document
    .querySelector(".autocomplete-content.dropdown-content")
    .addEventListener("click", function (e) {
      let target = e.target;
      // Get Stock Symbol
      if (target) {
        let regExp = /\(([^)]+)\)/;
        let matches = regExp.exec(e.target.innerHTML);
        console.log(matches);
        let symbol = matches[1];
        let title = document.querySelector('#autocomplete-input').value;
        let stockName = title.split(" (")[0];
        console.log(stockName);
        document.querySelector('#autocomplete-input').value = '';
        let quoteResultResponse = getStockQuote(symbol);
        quoteResultResponse.then(data => {
          //console.log(data)
          ui.displayCard(title, data);
          let stockNameObject = { name: stockName };
          let newObject = Object.assign({}, data["Global Quote"], stockNameObject);
          //console.log(newObject);
          updateSelectedStock(newObject);
        }).catch(err => console.log(err));
      }
    });
});


// Add Button Listener
document.querySelector('#add-button').addEventListener("click", function (e) {
  console.log('clicked', state["selectedStock"]);
  let stock = state["selectedStock"]
  // Add stock to portfolio state
  addStockToPortfolio(stock);
  // get sync storage and update 
  chrome.storage.local.get(['stocks'], function (result) {
    ui.displayPortfolio(result.stocks);
  });
  //ui.displayPortfolio(state["watchlist"]);
});

const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

// document
//   .querySelector("#autocomplete-input")
//   .addEventListener("click", function(e) {
//     if (e.target.lastChild) {
//       let selectedValue = document.querySelector("#autocomplete-input").value;
//       //document.querySelector("#autocomplete-input").value = "";
//       console.log(selectedValue);
//     }
//   });

document.querySelector("#autocomplete-input").addEventListener(
  "keyup",
  debounce(function (e) {
    console.log(instances);
    let searchResultResponse = getSearchResult(e.target.value);
    searchResultResponse
      .then(data => {
        let formattedData = formatData(data);
        updateSearchResult(formattedData);
      })
      .catch(err => console.log(err));
  }, 1500)
);

function updateSearchResult(data) {
  let instance = M.Autocomplete.getInstance(elems[0]);
  instance.updateData(data);
}

function formatData(data) {
  console.log(data);
  let formattedData = {};
  data.bestMatches.forEach(item => {
    let name = `${item["2. name"]} (${item["1. symbol"]})`;
    formattedData[name] = null;
  });
  return formattedData;
}

async function getSearchResult(search_term) {
  const results = await http.get(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${search_term}&apikey=${API_KEY}`
  );
  return results;
}

async function getStockQuote(search_term) {
  const results = await http.get(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search_term}&apikey=${API_KEY}`
  );
  return results;
}