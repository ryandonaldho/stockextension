import { ui } from "./ui.js";
import { getSearchResult, getStockQuote, debounce, formatData } from "./helpers.js";

let data = null;
let elems = null;
let instances = null;
let state = {
  selectedStock: '',
};

document.addEventListener("DOMContentLoaded", function () {
  elems = document.querySelectorAll(".autocomplete");
  instances = M.Autocomplete.init(elems, {
    data,
    minLength: 0
  });

  ui.initialState();
  chrome.storage.local.get(['stocks'], function (result) {
    if (result.stocks != undefined)
      ui.displayPortfolio(result.stocks);
  });

  document.querySelector("#autocomplete-input").addEventListener(
    "keyup", debounce((e) => handleStockSearch(e), 1500));

  document
    .querySelector(".autocomplete-content.dropdown-content")
    .addEventListener("click", handleStockSelection);


  // Add Button Listener
  document.querySelector('#add-button').addEventListener("click", handleAddStock);

  // Delete Stock Button Listener
  document.querySelector('#watch-list tbody').addEventListener("click", handleDelete);
});




function handleDelete(e) {
  if (e.target.parentElement.classList.contains('btn-delete')) {
    const stockSymbol = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");
    deleteFromWatchList(stockSymbol);
    // get sync storage and update ui
    chrome.storage.local.get(['stocks'], function (result) {
      ui.displayPortfolio(result.stocks);
    });
  }
}

function deleteFromWatchList(stockSymbol) {
  console.log(stockSymbol);
  chrome.storage.local.get(['stocks'], function (result) {
    let watchlist = result.stocks;
    console.log(watchlist);
    watchlist = watchlist.filter(function (stock) {
      return stock["01. symbol"] !== stockSymbol;
    });
    console.log(watchlist);
    chrome.storage.local.set({ stocks: watchlist });
  });
}


function handleStockSearch(e) {
  console.log(instances);
  let searchResultResponse = getSearchResult(e.target.value);
  searchResultResponse
    .then(data => {
      let formattedData = formatData(data);
      updateSearchResult(formattedData);
    })
    .catch(err => console.log(err));
}

function handleStockSelection(e) {
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
}

function handleAddStock(e) {
  console.log('clicked', state["selectedStock"]);
  let stock = state["selectedStock"]
  // Add stock to portfolio state
  addStockToPortfolio(stock);
  // get sync storage and update ui
  chrome.storage.local.get(['stocks'], function (result) {
    ui.displayPortfolio(result.stocks);
  });
  //ui.displayPortfolio(state["watchlist"]);
}

function updateSearchResult(data) {
  let instance = M.Autocomplete.getInstance(elems[0]);
  instance.updateData(data);
}

// update state
function updateSelectedStock(data) {
  console.log(data);
  state["selectedStock"] = data;
}

// add stock to watchlist state
function addStockToPortfolio(stock) {
  let watchlist = [];
  chrome.storage.local.get(['stocks'], function (result) {
    //console.log(result.stocks);
    if (result.stocks != null) {
      watchlist = result.stocks;
      //console.log(watchlist);
    }

    watchlist.push(stock);
    chrome.storage.local.set({ stocks: watchlist });
  });
}