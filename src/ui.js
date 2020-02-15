class UI {
    constructor() {
        this.cardElement = document.querySelector('.stock-info');
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
        this.table = document.querySelector('#watch-list');
        this.container = document.querySelector('.container');
        this.emptyMessage = document.querySelector('#empty-message');
    }

    hideStockInfoCard() {
        this.cardElement.style.display = "none";
    }

    displayCard(data) {
        // Get Values
        let title = data.companyName;
        let symbolValue = data.symbol;
        let openValue = data.open;
        let highValue = data.high;
        let lowValue = data.low;
        let priceValue = data.latestPrice;
        let volumeValue = data.volume;
        let latestTradingDayValue = data.latestTime;
        let previousCloseValue = data.previousClose;
        let changeValue = data.change;
        let changePercentValue = data.changePercent;

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
        if (stocks.length != 0) {
            this.table.style.display = "block";
            this.emptyMessage.style.display = "none";
            let output = '';
            stocks.forEach(stock => {
                output += `
                <tr data-id=${stock.symbol}> 
                <td> ${stock.companyName}  </td>
                <td> 
                ${stock.symbol} 
                </td>
                <td> ${stock.latestPrice} 
                </td>
                <td>
                <a class="btn-delete modal-trigger" href="#confirm-delete-modal"> <i class="material-icons">delete</i> </a>
                </td>
                </tr>`
            });
            this.tableElement.innerHTML = output;
        }
        else {
            this.table.style.display = "none";
            this.emptyMessage.style.display = "block";
        }
    }

    displayToastMessage(message, type) {
        M.toast({ html: message, displayLength: 2000, classes: `${type}` })
    }
}


export const ui = new UI();