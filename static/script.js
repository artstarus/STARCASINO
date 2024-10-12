document.addEventListener("DOMContentLoaded", function () {

    const redPopup = document.getElementById('red-popup');
    const greenPopup = document.getElementById('green-popup');
    const blackPopup = document.getElementById('black-popup');
    const spinButton = document.getElementById('spin-button');
    const boardImage = document.querySelector(".board-img");
    let isSpinning = false;
    let degreesSpun = 0;
    let clicked = false;

    let redBetAmount = 0;
    let greenBetAmount = 0;
    let blackBetAmount = 0;
    let wagerTotal = 0;

    // Update bet amounts when user input changes.
    document.getElementById("redBet").addEventListener('input', function () {
        redBetAmount = parseFloat(this.value);
        calculateWagerTotal();
    });

    document.getElementById("greenBet").addEventListener('input', function () {
        greenBetAmount = parseFloat(this.value);
        calculateWagerTotal();
    });

    document.getElementById("blackBet").addEventListener('input', function () {
        blackBetAmount = parseFloat(this.value);
        calculateWagerTotal();
    });

    // abstracted out wager totaling.
    function calculateWagerTotal() {
        wagerTotal = redBetAmount + greenBetAmount + blackBetAmount;
    }


    spinButton.addEventListener('click', () => {
        console.log('spin button clicked'); //debug

        //parseFloat and not int because we do this to stop non-integer bets!
        const cashDisplay = document.getElementById("cash-display");
        console.log('redbet: ' + redBetAmount);//debug
        console.log('total: ' + wagerTotal);//debug
        console.log('total % 1 :' + (wagerTotal % 1));//debug

        if (blackBetAmount === ""){ //debug
            console.log('blackbetAmount is an empty string...');//debug
        }
        console.log(blackBetAmount);//debug
        console.log(cashDisplay);//debug

        if (wagerTotal > parseInt(cashDisplay.textContent)) {
            console.log('wagerTotal > cash');//debug
            alert("Insufficient funds! Please place a valid bet.");
            return;
        }
        if (wagerTotal % 1 != 0) {
            console.log('non-integer bet');//debug
            alert("Please make sure your bets are whole numbers!");
            return;
        }
        if (redBetAmount === "" || blackBetAmount === "" || greenBetAmount === "") {
            console.log('empty string bet');//debug
            alert("Can't place empty bets! Please include a '0' in the appropriate field if you do not wish to wager on that specific color!")
            return;
        }
        if (wagerTotal < 0) {
            console.log('negative bet');//debug
            alert("Invalid bet! Wager cannot be negative.")
            return;
        }


        redPopup.style.display = 'block';
        greenPopup.style.display = 'block';
        blackPopup.style.display = 'block';

        //i used this clicked not clicked stuff in a previous implementation, its not really needed anymore.
        clicked = true;
        const isClicked = document.getElementById("is-clicked");
        isClicked.textContent = clicked;

        if (!isSpinning) {
            isSpinning = true;

            const spins = 1080;
            degreesSpun = Math.floor(Math.random() * spins) + 720;

            // Reset board
            boardImage.style.transition = "none";
            boardImage.style.transform = "rotate(-5.5deg)";

            setTimeout(() => {
                boardImage.style.transition = "transform 6s ease-out";
                boardImage.style.transform = `rotate(${degreesSpun}deg)`;
                spinButton.disabled = true;
                document.getElementById("redBet").disabled = true;
                document.getElementById("greenBet").disabled = true;
                document.getElementById("blackBet").disabled = true;
            });

            // Check when animation is over
            boardImage.addEventListener("transitionend", function handleTransitionEnd() {
                if (!isSpinning)
                    return;
                isSpinning = false;
                spinStats(degreesSpun, wagerTotal, cashDisplay, blackBetAmount, redBetAmount, greenBetAmount);
                spinButton.disabled = false;
                document.getElementById("redBet").disabled = false;
                document.getElementById("greenBet").disabled = false;
                document.getElementById("blackBet").disabled = false;

                redPopup.style.display = 'none';
                greenPopup.style.display = 'none';
                blackPopup.style.display = 'none';
            });
        }
    });


    function spinStats(degrees, wagerTotal, cashDisplay, blackBetAmount, redBetAmount, greenBetAmount) {
        let realDegrees = degrees % 360
        const board = [0,26,3,35,12,28,7,29,18,22,9,31,14,20,1,33,16,24,5,10,23,8,30,11,36,13,27,6,34,17,25,2,21,4,19,15,32,0];
        const red = [3,12,7,18,9,14,1,16,5,23,30,36,27,34,25,21,19,32];
        const green = 0;
        let spinValue = Math.floor(realDegrees/9.7);
        let spin = board[spinValue];
        const degreesSpunDisplay = document.getElementById("degrees-spun-display");
        degreesSpunDisplay.textContent = degrees;
        const spinDisplay = document.getElementById("spin-display");
        spinDisplay.textContent = spin;
        const spinDisplay2 = document.getElementById("spin-display2");
        spinDisplay2.textContent = spin;

        var circleColor = "";
        var circleImage = document.getElementById("circleImage");

        if (red.indexOf(spin) >= 0) {
            circleImage.src = "/static/red_circle.png";
            circleColor = "Red"
        }
        else if (spin === 0) {
            circleImage.src = "/static/green_circle.png";
            circleColor = "Green"
        }
        else {
            circleImage.src = "/static/black_circle.png";
            circleColor = "Black"
        }
        const spinColor = document.getElementById("spin-color");
        spinColor.textContent = circleColor;


        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/roulette', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
            }
        };
        xhr.send(JSON.stringify({ circleColor: circleColor, blackAmount: blackBetAmount, redAmount: redBetAmount, greenAmount: greenBetAmount}));


/////////////////////////////cashupdate///////////////////////
        var newCashBalance = 0;
        var netSpoils = 0;
        var wagerSpoils = 0;
        var wagerTotal = wagerTotal;

        if (circleColor === "Red") {
            newCashBalance = parseInt(cashDisplay.textContent) + parseInt(redBetAmount - blackBetAmount - greenBetAmount);
            netSpoils = redBetAmount - blackBetAmount - greenBetAmount;
            wagerSpoils = redBetAmount * 2;
        }
        if (circleColor === "Green") {
            newCashBalance = parseInt(cashDisplay.textContent) + parseInt((greenBetAmount * 34) - blackBetAmount - redBetAmount);
            netSpoils = (greenBetAmount * 34) - blackBetAmount - redBetAmount;
            wagerSpoils = greenBetAmount * 35;
        }
        if (circleColor === "Black") {
            newCashBalance = parseInt(cashDisplay.textContent) + parseInt(blackBetAmount - redBetAmount - greenBetAmount);
            netSpoils = blackBetAmount - redBetAmount - greenBetAmount;
            wagerSpoils = blackBetAmount * 2;
        }
        cashDisplay.textContent = newCashBalance;
        console.log(newCashBalance); //debug
        const netS = document.getElementById("net-spoils");
        netS.textContent = netSpoils;
        const wagerT = document.getElementById("wager-total");
        wagerT.textContent = wagerTotal;
        const wagerS = document.getElementById("wager-spoils");
        wagerS.textContent = wagerSpoils;
/////////////////////////////cashupdate///////////////////////
    }
});