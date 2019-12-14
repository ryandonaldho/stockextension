class UI {
    constructor(){
        this.cardElement = document.querySelector('#main-card');
        this.cardTitle = document.querySelector('.card-title');
    }

    initialState(){
        this.cardElement.style.display = "none";
    }

    displayCard(title,data){
        console.log(data);
        this.cardElement.style.display = "block";
        console.log(title);
        this.cardTitle.innerHTML = title;
    }
}


export const ui = new UI();