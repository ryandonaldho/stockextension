import { ui } from "./ui.js";
import {
  getSymbol,
  getStockQuote,
  getMutipleStocks,
  formatData,
} from "./helpers.js";

let data = null;
let elems = null;
let instances = null;
let state = {
  selectedStock: "",
  selectedStockToDelete: "",
};

document.addEventListener("DOMContentLoaded", function () {
  elems = document.querySelectorAll(".autocomplete");
  instances = M.Autocomplete.init(elems, {
    data,
    minLength: 1,
  });
  let confirmDeleteModal = document.querySelectorAll(".modal");
  let modalInstance = M.Modal.init(confirmDeleteModal, {
    dismissible: true,
  });

  let searchResultResponse = getSymbol();
  searchResultResponse
    .then((data) => {
      let formattedData = formatData(data);
      //console.log(formattedData);
      updateSearchResult(formattedData);
    })
    .catch((err) => console.log(err));

  initialize();

  document
    .querySelector(".autocomplete-content.dropdown-content")
    .addEventListener("click", handleStockSelection);

  // Add Button Listener
  document
    .querySelector("#add-button")
    .addEventListener("click", handleAddStock);

  // Delete Stock Button Listener
  document
    .querySelector("#watch-list tbody")
    .addEventListener("click", getStockToBeDeleted);

  // Confirm Delete Stock Button Listener
  document
    .querySelector("#confirm-delete-button")
    .addEventListener("click", handleDelete);

  // Opening link to yahoo finance for symbol
  document
    .querySelector("#card-link")
    .addEventListener("click", handleOpenNewTab);
});

function initialize() {
  ui.hideStockInfoCard();
  getDataAndDisplay();
}

function handleOpenNewTab(e) {
  //console.log(event.target.href);
  chrome.tabs.create({ url: event.target.href, active: false });
}

function updateSearchResult(data) {
  let instance = M.Autocomplete.getInstance(elems[0]);
  instance.updateData(data);
}

async function handleStockSelection(e) {
  let target = e.target;
  // Get Stock Symbol
  if (target) {
    let symbol = e.target.parentElement.getAttribute("data-stock-symbol");
    document.querySelector("#autocomplete-input").value = "";
    try {
      let quoteResultResponse = await getStockQuote(symbol);
      console.log(quoteResultResponse);
      ui.displayCard(quoteResultResponse);
      state["selectedStock"] = quoteResultResponse;
    } catch (e) {
      console.error(e);
    }
  }
}

function handleAddStock(e) {
  let stocks = [];
  stocks = JSON.parse(localStorage.getItem("stocks"));
  if (stocks == undefined) {
    stocks = [];
  }
  const stockToAdded = state["selectedStock"]["symbol"];
  const found = stocks.find((stock) => stock == stockToAdded);
  if (found) {
    ui.displayToastMessage(
      `${state["selectedStock"]["symbol"]} already exists in the watchlist`,
      "error"
    );
  } else {
    stocks.push(stockToAdded);
    localStorage.setItem("stocks", JSON.stringify(stocks));
  }
  getDataAndDisplay();
}

// return a string with the symbols seperated by commas
function formatSymbols(symbols) {
  return symbols.join();
}

async function getDataAndDisplay() {
  let stocks = [];
  let watchlist = [];
  stocks = JSON.parse(localStorage.getItem("stocks"));
  if (stocks == undefined) {
    stocks = [];
  }
  if (stocks.length > 0) {
    let stocksString = formatSymbols(stocks);
    let response = await getMutipleStocks(stocksString);
    // convert to array
    for (const stock in response) {
      watchlist.push(response[stock]["quote"]);
    }
  }
  ui.displayPortfolio(watchlist);
}

function getStockToBeDeleted(e) {
  if (e.target.parentElement.classList.contains("btn-delete")) {
    const stockSymbol = e.target.parentElement.parentElement.parentElement.getAttribute(
      "data-id"
    );
    console.log(stockSymbol);
    state.selectedStockToDelete = stockSymbol;
  }
}

function handleDelete(e) {
  const stockSymbol = state.selectedStockToDelete;
  console.log(stockSymbol);
  if (stockSymbol !== "") {
    // delete from localstorage
    let stocks = [];
    stocks = JSON.parse(localStorage.getItem("stocks"));
    if (stocks == undefined) {
      stocks = [];
    }
    stocks = stocks.filter((stock) => stock !== stockSymbol);
    localStorage.setItem("stocks", JSON.stringify(stocks));
    state.selectedStockToDelete = "";
    ui.displayToastMessage(
      `${stockSymbol} have been successfully deleted from the watchlist`,
      "success"
    );
  } else {
    console.log("Error selectedStockToDelete is empty");
  }
  getDataAndDisplay();
}
