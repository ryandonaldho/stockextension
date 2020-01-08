import { ui } from "./ui.js";
import { getSymbol, getStockQuote, getMutipleStocks, formatData } from "./helpers.js";

let data = null;
let elems = null;
let instances = null;
let symbolsData = null;
let regExp = /\(([^)]+)\)/;
let state = {
  selectedStock: '',
  selectedStockToDelete: ''
};

document.addEventListener("DOMContentLoaded", function () {
  elems = document.querySelectorAll(".autocomplete");
  instances = M.Autocomplete.init(elems, {
    data,
    minLength: 1,
  });
  let confirmDeleteModal = document.querySelectorAll('.modal');
  let modalInstance = M.Modal.init(confirmDeleteModal, {
    dismissible: true
  });

  let searchResultResponse = getSymbol();
  searchResultResponse
    .then(data => {
      let formattedData = formatData(data);
      //console.log(formattedData);
      updateSearchResult(formattedData);
    })
    .catch(err => console.log(err));

  initialize();

  document
    .querySelector(".autocomplete-content.dropdown-content")
    .addEventListener("click", handleStockSelection);


  // Add Button Listener
  document.querySelector('#add-button').addEventListener("click", handleAddStock);

  // Delete Stock Button Listener
  document.querySelector('#watch-list tbody').addEventListener("click", getStockToBeDeleted);

  // Confirm Delete Stock Button Listener
  document.querySelector('#confirm-delete-button').addEventListener("click", handleDelete);

  document.querySelector('#card-link').addEventListener("click", handleOpenNewTab);
});

function initialize() {
  ui.hideStockInfoCard();
  getLatestUpdate().then(() => {
    getDataAndDisplay();
  })
}

function getLatestUpdate() {
  return new Promise((resolve) => {
    getAllStocksInWatchlist().then((symbols) => {
      console.log(symbols);
      let stocksString = formatSymbols(symbols);
      console.log(stocksString);
      getMutipleStocks(stocksString).then((data) => {
        let watchlist = [];
        for (const stock in data) {
          watchlist.push(data[stock]["quote"]);
        }
        //console.log(watchlist);
        console.log("setting local storage with new data");
        chrome.storage.local.set({ stocks: watchlist });
        resolve();
      });
    })
  })
}

function getAllStocksInWatchlist() {
  return new Promise(resolve => {
    chrome.storage.local.get(['stocks'], function (result) {
      let symbols = [];
      if (result.stocks != undefined) {
        console.log(result.stocks);
        result.stocks.forEach((stock) => {
          symbols.push(stock.symbol);
        })
      }
      console.log(symbols);
      resolve(symbols);
    });
  })

}

// return a string with the symbols seperated by commas
function formatSymbols(symbols) {
  return symbols.join();
}

function getStockToBeDeleted(e) {
  if (e.target.parentElement.classList.contains('btn-delete')) {
    const stockSymbol = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");
    console.log(stockSymbol);
    state.selectedStockToDelete = stockSymbol;
  }
}

function handleDelete(e) {
  const stockSymbol = state.selectedStockToDelete;
  console.log(stockSymbol);
  if (stockSymbol !== '') {
    // get sync storage and update 
    deleteFromWatchList(stockSymbol).then(() => getDataAndDisplay());
    state.selectedStockToDelete = '';
  }
  else {
    console.log("Error selectedStockToDelete is empty")
  }

}

function deleteFromWatchList(stockSymbol) {
  //console.log(stockSymbol);
  return new Promise(resolve => {
    chrome.storage.local.get(['stocks'], function (result) {
      let watchlist = result.stocks;
      console.log(watchlist);
      watchlist = watchlist.filter(function (stock) {
        return stock.symbol !== stockSymbol;
      });
      console.log(watchlist);
      chrome.storage.local.set({ stocks: watchlist });
      resolve();
    });
  })
}


function handleStockSearch(e) {
  console.log(instances);
  let searchResultResponse = getSymbol();
  searchResultResponse
    .then(data => {
      console.log(data);
      let formattedData = formatData(data);
      //console.log(formattedData);
      updateSearchResult(formattedData);
    })
    .catch(err => console.log(err));
}

function handleStockSelection(e) {
  let target = e.target;
  // Get Stock Symbol
  if (target) {
    let symbol = e.target.parentElement.getAttribute("data-stock-symbol");
    document.querySelector('#autocomplete-input').value = '';
    let quoteResultResponse = getStockQuote(symbol);
    quoteResultResponse.then(data => {
      console.log(data);
      ui.displayCard(data);
      updateSelectedStock(data);
    }).catch(err => console.log(err));
  }
}

function handleAddStock(e) {
  //console.log('clicked', state["selectedStock"]);
  let stock = state["selectedStock"]
  // Add stock to portfolio state
  addStockToPortfolio(stock).then(() => getDataAndDisplay());
  // get sync storage and update ui
  //getDataAndDisplay();
}

function handleOpenNewTab(e) {
  //console.log(event.target.href);
  chrome.tabs.create({ url: event.target.href, active: false });
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
  return new Promise(resolve => {
    chrome.storage.local.get(['stocks'], function (result) {
      //console.log(result.stocks);
      if (result.stocks != null) {
        watchlist = result.stocks;
        //console.log(watchlist);
      }
      watchlist.push(stock);
      //console.log("adding..", watchlist);
      chrome.storage.local.set({ stocks: watchlist });
      resolve();
    });
  })

}

function getDataAndDisplay() {
  chrome.storage.local.get(['stocks'], function (result) {
    console.log('display', result);
    if (result.stocks != undefined)
      ui.displayPortfolio(result.stocks);
  });
}