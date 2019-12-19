class UI {
    constructor() {
        this.cardElement = document.querySelector('#main-card');
        this.cardTitle = document.querySelector('.card-title');
        this.cardOpenPrice = document.querySelector('#open-value');
        this.cardHighPrice = document.querySelector('#high-value');
        this.cardLowPrice = document.querySelector('#low-value');
        this.cardPrice = document.querySelector('#price-value');
        this.cardVolume = document.querySelector('#volume-value');
        this.cardTradingDay = document.querySelector('#tradeday-value');
        this.cardPreviousClose = document.querySelector('#prevclose-value');
        this.cardChange = document.querySelector('#change-value');
        this.cardPercent = document.querySelector('#percent-value');
        this.cardLink = document.querySelector('#card-link');

        this.tableElement = document.querySelector('#watch-list tbody');
    }

    initialState() {
        this.cardElement.style.display = "none";
    }

    displayCard(title, data) {
        // Get Values
        let symbolValue = data["Global Quote"]["01. symbol"];
        let openValue = data["Global Quote"]["02. open"];
        let highValue = data["Global Quote"]["03. high"];
        let lowValue = data["Global Quote"]["04. low"];
        let priceValue = data["Global Quote"]["05. price"];
        let volumeValue = data["Global Quote"]["06. volume"];
        let latestTradingDayValue = data["Global Quote"]["07. latest trading day"];
        let previousCloseValue = data["Global Quote"]["08. previous close"];
        let changeValue = data["Global Quote"]["09. change"];
        let changePercentValue = data["Global Quote"]["10. change percent"];

        //console.log(data);

        // Set Card Element Values
        this.cardElement.style.display = "block";
        this.cardTitle.innerHTML = title;

        this.cardOpenPrice.innerHTML = openValue;
        this.cardHighPrice.innerHTML = highValue;
        this.cardLowPrice.innerHTML = lowValue;
        this.cardPrice.innerHTML = priceValue;
        this.cardVolume.innerHTML = volumeValue;
        this.cardTradingDay.innerHTML = latestTradingDayValue;
        this.cardPreviousClose.innerHTML = previousCloseValue;
        this.cardChange.innerHTML = changeValue;
        this.cardPercent.innerHTML = changePercentValue;
        this.cardLink.href = `https://finance.yahoo.com/quote/${symbolValue}`
    }

    displayPortfolio(stocks) {
        let output = '';
        stocks.forEach(stock => {
            output += `
            <tr> 
            <td> ${stock["name"]}  </td>
            <td> 
            ${stock["01. symbol"]} 
            </td>
            <td> ${stock["05. price"]} 
            </td>
            <td>
            <i class="material-icons">edit</i><i class="material-icons">delete</i>
            </td>
            </tr>`
        });
        this.tableElement.innerHTML = output;

    }
}


export const ui = new UI();