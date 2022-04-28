function darkmode() {
    var html = document.querySelector("html");
    var logo = document.querySelector(".card-logo")
    if (html.classList.contains("light-mode")) {
        html.classList.remove("light-mode");
        html.classList.add("dark-mode");
        // logo.setAttribute('src', "assets/imgs/light-front-face.png")
        document.querySelector(".dark-mode-toggle").innerHTML = "🌙";
    }
    else {
        html.classList.remove("dark-mode");
        html.classList.add("light-mode");
        logo.setAttribute('src', "assets/imgs/front-face.png")
        document.querySelector(".dark-mode-toggle").innerHTML = "☀️"
    }
};
// My JQuery **WOW**
$('#strt_form').on('keyup keypress', function(e) {
    if (e.key == "Enter") {
        e.preventDefault();
    }
})

// Declare global Variables
var current = {username: "", card_number: ""}
var moves = 0
var score = 0
var flipped_cards = []
var flipped_cards_ids = []
var timer_interval
var first_click = false
var started = false
var won = false
var collected = []
var card_backs = [
    "cat-1.jpg", 
    "cat-2.jpg",
    "cat-3.jpg", 
    "cat-4.jpg", 
    "cat-5.jpg", 
    "cat-6.jpg",
    "cat-7.jpg", 
    "cat-8.jpg", 
    "cat-9.jpg", 
    "cat-10.jpg"
]

document.querySelector('#start-button').addEventListener('click', startGame);
document.querySelector('#reset-btn').addEventListener('click', restart)
document.querySelector('#start-over').addEventListener('click', startOver)
document.querySelector("#start-over-2").addEventListener('click', startOver)
document.querySelector("#help-btn").addEventListener('click', helpModal)
// Skip form => 'Debug' Mode
var debugMode = false
$('body').on('keypress', function(e) {
    if (debugMode == false) {
        switch(e.key) {
            case "/":
                current.username = "debugger"
                current.card_number = "10"
                debugMode = true
                started = true
                displayGame()
                modal("start")
                break
            case "*":
                current.username = "debugger"
                current.card_number = "20"
                debugMode = true
                started = true
                displayGame()
                modal("start")
                break
        }
    }
    if (started == true) {
        if (e.key == "r" && started == true) {
            restart()
    }
    }
    
})


function startGame() {
    current.username = document.querySelector('#username').value;
    var number_cards_field = document.getElementsByName("number_cards");
    for (var i = 0; i < number_cards_field.length; i++) {
        if (number_cards_field[i].checked) {
            current.card_number = number_cards_field[i].value
        }
	}
    switch (current.username) {
        case "Scallop":
            current.username = "Imposter";
        case "scallop":
            current.username = "Imposter";
        default:
            if (current.card_number == "" && current.username == "") {
                alert("You forgot to input your name and select the number of cards you'd like.");
            }
            else if (current.username == "") {
                alert("You forgot to state your name");
            }
            else if (current.card_number == "") {
                alert("You forgot to select the number of cards you want");
            }
            else {
                current.username = current.username[0].toUpperCase() + current.username.slice(1)
                displayGame()
                started = true
                modal("start")
            } 
    }
    
}
function displayGame() {
    var startElements = document.querySelectorAll(".start");
    for (var i = 0; i < startElements.length; i++) {
        startElements[i].style.display = "none"
    }
    document.querySelector(".game-content").style.display = "flex";

    var i = 0
    do {
        var card = document.querySelector("#card-" + i)
        card.addEventListener('click', turnOver)
        var front = document.createElement('div')
        var img_url = 'assets/imgs/front-face.png'
        front.setAttribute('class', "front-face")
        if (debugMode == true) {
            front.style.display = "none"
        }
        else {
            front.style.display = "flex"
        }
        card.appendChild(front)
        var front_img = document.createElement('img')
        front_img.setAttribute('src', img_url)
        front_img.setAttribute('class', "front-face-img")
        front_img.setAttribute("draggable", false);
        front.appendChild(front_img)
        
        i++;
    } 
    while (i < current.card_number)
    shuffled_backs = shuffle()
    var j = 0
    while (j < shuffled_backs.length) {
        var img_url = "assets/imgs/backs/" + shuffled_backs[j]
        // console.log(img_url)
        var card = document.querySelector("#card-" + j)
        var imgIndex = shuffled_backs.indexOf(shuffled_backs[j], shuffled_backs)
        card.setAttribute('data-card', imgIndex)
        var back = document.createElement('img')
        back.setAttribute('src', img_url)
        back.setAttribute('class', 'back-face')
        if (debugMode == true) {
            back.style.display = 'flex'
        }
        else {
            back.style.display = 'none'
        }
        card.appendChild(back)
        j++
    }
    // console.log(shuffled_backs[0])
}

function shuffle() {
    if (current.card_number == "10") {
        // console.log("original " + card_backs)
        
        //remove last 5 in card_backs
        var sliced_backs = card_backs.slice(0, 5)
        // console.log("sliced " + sliced_backs)
        //concat card_backs into itself
        var concated = sliced_backs.concat(sliced_backs)
        // console.log("concat " + concated)
        //shuffle/sort the list
        var shuffled_backs = concated.sort(() => 0.5 - Math.random())
        // console.log('final: ' + shuffled_backs)
        // console.log(shuffled_backs.length)
        return shuffled_backs
    }
    
    else {
        var concated = card_backs.concat(card_backs)
        // console.log("concat " + concated)
        var shuffled_backs = concated.sort(() => 0.5 - Math.random())
        // console.log('final: ' + shuffled_backs)
            return shuffled_backs
    }
}
//check match
function checkFlippedCards() {
    if (flipped_cards[0] == flipped_cards[1] && flipped_cards_ids[0] != flipped_cards_ids[1]) {
        for (p = 0; p < 2; p++) {
            var cardId = document.querySelector("#" + flipped_cards_ids[p])
            // console.log(flipped_cards_ids[p])
            cardId.removeChild(cardId.lastChild)
            var empty_div = document.createElement('div')
            empty_div.setAttribute('class', "back-face")
            empty_div.style.cursor = "unset"
            cardId.appendChild(empty_div)
            collected.push(flipped_cards_ids[p])
        }
        // console.log("collected: ", collected)
        score++
        moves++
        flipped_cards = []
        flipped_cards_ids = []
        movesTally()
        checkWin()
    }
    else {
        if (debugMode == false) {
            for (u = 0; u < 2; u++) {
                // console.log(flipped_cards_ids[u])
                var parent = document.querySelector("#" + flipped_cards_ids[u])
                parent.querySelector(".front-face").style.display = "flex";
                parent.querySelector(".back-face").style.display = "none";
            }
        }
        flipped_cards = []
        flipped_cards_ids = []
        moves++
        movesTally()
    }
    // console.log("Moves: ", moves)
    // console.log("Score: ", score)
}
// turn over card
function turnOver() {
    if (first_click == false) {
        first_click = true
        timer()
    }
    if (flipped_cards.length != 2) {
        var data = this.getAttribute('data-card')
        var cardId = this.getAttribute("id")
        if (collected.includes(cardId) == false && flipped_cards_ids.includes(cardId) == false) {
            if (debugMode == false) {
                this.firstChild.style.display = "none"
                this.lastChild.style.display = "flex"
            }
            flipped_cards.push(shuffled_backs[data])
            flipped_cards_ids.push(cardId)
            if (flipped_cards.length == 2){
                if (debugMode == false) {
                    setTimeout(checkFlippedCards, 500);
                }
                else {
                    checkFlippedCards()
                }
            }

        }
        
    }
}
function checkWin() {
    if (current.card_number == "10") {
        if (score == 5) {
            won = true
            clearInterval(timer_interval)
            setTimeout(() => {
                modal("win")
            }, 500);
        }
    }
    else {
        if (score == 10) {
            won = true
            clearInterval(timer_interval)
            setTimeout(() => {
                modal("win")
            }, 500);
        }
    }

}
function movesTally() {
    var movesElement = document.querySelector("#try-count")
    var tally = moves.toString()
    if (moves > 0) {
        if (tally.length == 1) {
            movesElement.innerHTML = "0" + moves
        }
        else {
            movesElement.innerHTML = moves
        }
    }
    
}

function restart() {
    document.querySelector("#restart-title").innerHTML = "Restart, you sure?"
    var restartModal = document.querySelector("#restart-modal")
    if (won == false) {
        document.querySelector("#restart-yes").addEventListener('click', yes)
        document.querySelector("#restart-no").addEventListener('click', no)
        restartModal.style.display = "block";
    }
    else {
        for (k = 0; k < shuffled_backs.length; k++) {
            var card = document.querySelector("#card-" + k)
            while (card.firstChild) {
                card.removeChild(card.lastChild)
            }
        }
        flipped_cards = []
        flipped_cards_ids = []
        collected = []
        score = 0
        moves = 0
        first_click = false
        won = false
        clearInterval(timer_interval)
        document.querySelector("#try-count").innerHTML = "00"
        document.querySelector("#minutes").innerHTML = "00"
        document.querySelector("#seconds").innerHTML = "00"
        document.querySelector("#win-modal").style.display = "none"
        displayGame()
    }
    function yes() {
        for (k = 0; k < shuffled_backs.length; k++) {
            var card = document.querySelector("#card-" + k)
            while (card.firstChild) {
                card.removeChild(card.lastChild)
            }
        }
        flipped_cards = []
        flipped_cards_ids = []
        collected = []
        score = 0
        moves = 0
        first_click = false
        clearInterval(timer_interval)
        document.querySelector("#try-count").innerHTML = "00"
        document.querySelector("#minutes").innerHTML = "00"
        document.querySelector("#seconds").innerHTML = "00"
        document.querySelector("#win-modal").style.display = "none"
        restartModal.style.display = "none";
        displayGame()
    }
    function no() {
        restartModal.style.display = "none";
    } 
}
function startOver() {
    document.querySelector("#restart-title").innerHTML = "Start over, you sure?"
    var restartModal = document.querySelector("#restart-modal")
    if (won == false) {
        document.querySelector("#restart-yes").addEventListener('click', yes)
        document.querySelector("#restart-no").addEventListener('click', no)
        restartModal.style.display = "block";
    }
    else {
        for (k = 0; k < shuffled_backs.length; k++) {
            var card = document.querySelector("#card-" + k)
            while (card.firstChild) {
                card.removeChild(card.lastChild)
            }
        }
        flipped_cards = []
        flipped_cards_ids = []
        collected = []
        score = 0
        moves = 0
        won = false
        current.username, current.card = ""
        startElements = false
        first_click = false
        clearInterval(timer_interval)
        document.querySelector("#try-count").innerHTML = "00"
        document.querySelector("#minutes").innerHTML = "00"
        document.querySelector("#seconds").innerHTML = "00"
        document.querySelector("#win-modal").style.display = "none"
        debugMode = false
        document.querySelector(".game-content").style.display = 'none'
        var startElements = document.querySelectorAll(".start");
        for (var i = 0; i < startElements.length; i++) {
            startElements[i].style.display = "unset"
        }
    }
    function yes() {
        for (k = 0; k < shuffled_backs.length; k++) {
            var card = document.querySelector("#card-" + k)
            while (card.firstChild) {
                card.removeChild(card.lastChild)
            }
        }
        flipped_cards = []
        flipped_cards_ids = []
        collected = []
        score = 0
        moves = 0
        won = false
        started = false
        current.username, current.card = ""
        startElements = false
        first_click = false
        clearInterval(timer_interval)
        document.querySelector("#try-count").innerHTML = "00"
        document.querySelector("#minutes").innerHTML = "00"
        document.querySelector("#seconds").innerHTML = "00"
        document.querySelector("#win-modal").style.display = "none"
        debugMode = false
        document.querySelector(".game-content").style.display = 'none'
        var startElements = document.querySelectorAll(".start");
        for (var i = 0; i < startElements.length; i++) {
            startElements[i].style.display = "unset"
        }
        restartModal.style.display = "none";
    }
    function no() {
        restartModal.style.display = "none";
    }
}
function timer() {
    if (first_click == true) {
        var sec = 0;
        function pad ( val ) { return val > 9 ? val : "0" + val; }
        timer_interval = setInterval( function(){
            $("#seconds").html(pad(sec++ % 60));
            $("#minutes").html(pad(parseInt(sec / 60, 10)));
        }, 1000);
    }
}
function helpModal() {
    bubble()
    var modal = document.querySelector("#help-modal")
    modal.style.display = "block"
    var dateElement = document.querySelector("#help-date")
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    setInterval(() => {
        var d = new Date();
        var month = months[d.getMonth()]
        var day = d.getDate()
        var year = d.getFullYear()
        var hour = d.getHours()
        var minute = d.getMinutes()
        if (minute.length = 1) {
            minute = "0" + minute
        }
        dateElement.innerHTML = month + " " + day + ", " + year + " " + hour + ":" + minute
    }, 500);
    document.querySelector("#close-help").addEventListener('click', closeHelp)
    function closeHelp() {
        modal.style.display = "none"
    }
}

function modal(task) {
    var modal = document.getElementById("win-modal");
    // var close = document.getElementsByClassName("close")[0];
    var win_reset = document.getElementById('win-restart')
    win_reset.addEventListener('click', restart)
    // Close the modal when clicking outside the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    if (task == "start") {
        document.querySelector("#win-title").innerHTML = "Congrats " + current.username + "!!!"
    }
    // display modal
    else {
        document.getElementById("total-moves").innerHTML = moves.toString()
        var minutes = document.querySelector("#minutes").innerHTML
        if (minutes[0] == "0") {
            document.querySelector("#win-min").innerHTML = minutes[1]
        }
        else {
            document.querySelector("#win-min").innerHTML = minutes
        }
        var seconds = document.querySelector("#seconds").innerHTML
        if (seconds[0] == "0") {
            document.querySelector("#win-sec").innerHTML = seconds[1]
        }
        else {
            document.querySelector("#win-sec").innerHTML = seconds
        }
        modal.style.display = "block";

    }
}

function bubble() {
    var ctx = document.getElementById('canvas-bubble').getContext('2d');
    var x = 4
    var y = 4
    var w = 230
    var h = 130
    var radius = 20
    var r = x + w;
    var b = y + h;
    var hi = "Hi I'm Clippy! 👋"
    ctx.font="18px grenadine-mvb";
	ctx.fillText(hi,20,40);
    ctx.fillText("I also dont know how", 20, 70)
    ctx.fillText("to play. But you can", 20, 90)
    ctx.fillText("have the today's date.", 20, 110)
    ctx.beginPath();
    ctx.strokeStyle="#4d3d57";
    ctx.lineWidth="4";
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + radius * 2, y);
    ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    ctx.lineTo(r, y+h-radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();
}
