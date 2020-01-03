import { ui } from "./ui.js";
import { getSearchResult, getStockQuote, debounce, formatData } from "./helpers.js";

let data = null;
let elems = null;
let instances = null;
let state = {
  selectedStock: '',
  selectedStockToDelete: ''
};

document.addEventListener("DOMContentLoaded", function () {
  elems = document.querySelectorAll(".autocomplete");
  instances = M.Autocomplete.init(elems, {
    data,
    minLength: 0
  });
  let confirmDeleteModal = document.querySelectorAll('.modal');
  let modalInstance = M.Modal.init(confirmDeleteModal, {
    dismissible: true
  });

  ui.initialState();
  getDataAndDisplay();

  document.querySelector("#autocomplete-input").addEventListener(
    "keyup", debounce((e) => handleStockSearch(e), 1000));

  document
    .querySelector(".autocomplete-content.dropdown-content")
    .addEventListener("click", handleStockSelection);


  // Add Button Listener
  document.querySelector('#add-button').addEventListener("click", handleAddStock);

  // Delete Stock Button Listener
  document.querySelector('#watch-list tbody').addEventListener("click", getStockToBeDeleted);

  // Confirm Delete Stock Button Listener
  document.querySelector('#confirm-delete-button').addEventListener("click", handleDelete);
});


function getStockToBeDeleted(e) {
  if (e.target.parentElement.classList.contains('btn-delete')) {
    const stockSymbol = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");
    console.log(stockSymbol);
    state.selectedStockToDelete = stockSymbol;
  }
}

function handleDelete(e) {
  const stockSymbol = state.selectedStockToDelete;
  if (stockSymbol !== '') {
    // get sync storage and update 
    deleteFromWatchList(stockSymbol).then(() => getDataAndDisplay())
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
        return stock["01. symbol"] !== stockSymbol;
      });
      console.log(watchlist);
      chrome.storage.local.set({ stocks: watchlist });
      resolve();
    });
  })
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
  //console.log('clicked', state["selectedStock"]);
  let stock = state["selectedStock"]
  // Add stock to portfolio state
  addStockToPortfolio(stock).then(() => getDataAndDisplay());
  // get sync storage and update ui
  //getDataAndDisplay();
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
      console.log("adding..", watchlist);
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