import { http } from "./http.js";

let API_KEY = "TBL9WNG4CFWI9APR";

let data = null;
let elems = null;
let instances = null;

document.addEventListener("DOMContentLoaded", function() {
  elems = document.querySelectorAll(".autocomplete");
  instances = M.Autocomplete.init(elems, {
    data,
    minLength: 0
  });
});

document
  .querySelector("#autocomplete-input")
  .addEventListener("keyup", function(e) {
    // let instance = M.Autocomplete.getInstance(elems[0]);
    // console.log(instance);
    let searchResultResponse = getSearchResult(e.target.value);
    searchResultResponse
      .then(data => {
        let formattedData = formatData(data);
        updateSearchResult(formattedData);
      })
      .catch(err => console.log(err));
  });

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
