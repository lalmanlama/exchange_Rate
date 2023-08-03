key = "keyForCurrencyRate";
let exchangeRatesObj = {
    updateExchangeRates: function() {
        let time = this.timeUpdate();
        console.log(time);
       if (time > 3600000) {    // update the data if fetched dada is older than 1 hour
            fetch('https://api.fastforex.io/fetch-all?api_key=fa13a7ec75-72e25e691c-ryi50q')// fetching data from server
            .then((res) => res.json())
            .then((data) => {
                console.log(data.results);
                localStorage.setItem(key,JSON.stringify(data.results));//store data to localstorage
            });
            let savedDate = Date.now();
            localStorage.setItem("savedTime",savedDate); // fetched timeis stored in localstorage
        }
    },
    getExchangeRatesLocally: function() {
        let newObj;
        if (localStorage.getItem(key) != null) {
           newObj = JSON.parse(localStorage.getItem(key)); //reading data from localstorage  
        } return newObj;
    },
    timeUpdate: function() {
        let oldMillisecond = localStorage.getItem("savedTime");
        let newMillisecond = Date.now();
        let time = newMillisecond - oldMillisecond;
        return time;
    }
};

document.addEventListener ('DOMContentLoaded',function() {
    exchangeRatesObj.updateExchangeRates();  //call updateExchngeRate method
    let newObj = exchangeRatesObj.getExchangeRatesLocally();    //call getExchangeRateLocally method
    if (localStorage.getItem(key) != null) {
        var anc = Object.keys(newObj);  // getting keys from newObj
        let x = document.getElementById("currencyOne"); //creating object of first dropdown list
        let y = document.getElementById("currencyTwo");  //creating object of second dropdown list

        for (let i=0; i < anc.length; i++) {
            let para = document.createElement('option'); //creating option element and append it to x
            para.setAttribute("value", anc[i]);
            para.innerHTML = anc[i];
            x.appendChild(para);
        }
        x[anc.indexOf('INR') +1].setAttribute("selected","selected");//INR will get selected

        for (let i=0; i < anc.length; i++) {
            let para = document.createElement('option'); //creating option element and append it to y
            para.setAttribute("value", anc[i]);
            para.innerHTML = anc[i];
            y.appendChild(para);
        }
        y[anc.indexOf('NPR') + 1].setAttribute("selected","selected"); //NPR will get selected
    }
});

    let btnCalculate = document.getElementById("rate");
    btnCalculate.addEventListener("click", (event) => {
    event.preventDefault();
    if (localStorage.getItem(key) != null) {
    let newObj = exchangeRatesObj.getExchangeRatesLocally();
    let inputValue = document.getElementById("displayRate"),
        inputValue1 = document.getElementById("inputNumber"),
        currencyEl = document.getElementById("currencyOne");
    var currency = currencyEl.value,
        currencyEl1 = document.getElementById("currencyTwo"),
        currency2 = currencyEl1.value;

    if (currency != 'USA') {
        let rate1 = newObj[currency],
            rate2 = newObj[currency2],
            inputValue2 = Number(inputValue1.value),     //get amount to convert
            oneInputValue1 = (1 / rate1),
            convertedDollar =(oneInputValue1 * inputValue2),
            outputValue = rate2 * convertedDollar;
        inputValue.value = "Rate of 1  " + currency+"  = " + (oneInputValue1 * rate2 ) + ' ' + currency2;              
        document.getElementById("demo").value  = outputValue;
    } else {
        let rate = newObj[currency2], 
            inputValue2 = Number(inputValue1.value),      //get input amount to convert 
            outputValue = rate * inputValue2;
        inputValue.value = "Rate of 1  " + currency+"  = " + rate + ' ' + currency2;
        document.getElementById("demo").value  = outputValue;
    }
    if (currency2 == 'USA') {
        let rate1 = newObj[currency],
            rate = 1/rate1,
            inputValue2 = Number(inputValue1.value),
            convertedDollar =(rate * inputValue2);
        inputValue.value = "Rate of 1  " + currency+"  = " + rate + ' ' + currency2;
        document.getElementById("demo").value  = convertedDollar;       
    }
}
                    
});
