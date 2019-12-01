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
    getSearchResult(e.target.value);
  });

// document.addEventListener("DOMContentLoaded", function() {
//   getSearchResult("BA");
// });

function formatData(data) {
  console.log("format data", data.bestMatches);
  console.log(data);
  let formattedData = {};
  if (data) {
    data.bestMatches.forEach(item => {
      let name = `${item["2. name"]} (${item["1. symbol"]})`;
      formattedData[name] = null;
    });
    console.log(formattedData);
    let instance = M.Autocomplete.getInstance(elems[0]);
    instance.updateData(formattedData);
  }
}

function getSearchResult(search_term) {
  http
    .get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${search_term}&apikey=${API_KEY}`
    )
    .then(data => formatData(data))
    .catch(err => console.log(err));
}
