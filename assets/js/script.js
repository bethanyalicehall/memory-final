//Fact card page
const fcards = document.querySelectorAll(".fact-card");
//Function to flip fact card when the user clicks the image
function flipTheCard() {
    this.classList.toggle("flip");
  }
  fcards.forEach(fcard => fcard.addEventListener("click", flipTheCard));

//Level 1 and level 2 pages 

//The following code was adapted from webtips.dev, some of the code is directly taken and some has been adapted for my game - see credits section of README.md for further details on this.

//Selectors to simplify script
const selectors = {
    boardContainer: document.querySelector(".board-container"),
    board: document.querySelector(".board"),
    moves: document.querySelector(".moves"),
    timer: document.querySelector(".timer"),
    start: document.querySelector("button"),
    win: document.querySelector(".win")
};

//Setting the pre-game state of the game board including the cards, move counter and timer.
const state = {
    gameBegun: false,
    totalFlips: 0,
    totalTime: 0,
    flippedCards: 0,
    loop: null
};

//Shuffling the array to make sure each game has a different set/arrangement of cards
const shuffle = array => {
    const clonedArray = [...array];

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const original = clonedArray[index];

        clonedArray[index] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }

    return clonedArray;
};
// Picking random cards out of the shuffled array 
const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomSelects = [];

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);

        randomSelects.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomSelects;
};

// Generating the game board, each possible animal emoji is included below, the size of the card is taken from the level1 and level2 html, this is then multiplied by 2 to produce the game board dimensions.
const generateGame = () => {
    const sizes = selectors.board.getAttribute("data-dimension");
    const animals = ["🐶", "🦦", "🐯", "🐘", "🐧", "🐒", "🦙", "🦒", "🐬", "🦜", "🦋", "🐢", "🦁", "🦧", "🦓", "🐠", "🦥", "🐝"]
    const selects = pickRandom(animals,(sizes * 2));
    const items = shuffle([...selects, ...selects]);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${sizes}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `;
    
    const parser = new DOMParser().parseFromString(cards, "text/html");

    selectors.board.replaceWith(parser.querySelector(".board"));

};
// Code to run when the game has begun and the timer will start and moves will begin to be incremented
const startGame = () => {
    state.gameBegun = true;
    selectors.start.classList.add("disabled");

    state.loop = setInterval(() => {
        state.totalTime++;

        selectors.moves.innerText = `${state.totalFlips} moves`;
        selectors.timer.innerText = `time: ${state.totalTime} sec`;
    }, 1000);
};

// This is to flip cards back over if the two selected cards do not match
const flipBackCards = () => {
    document.querySelectorAll(".card:not(.matched)").forEach(card => {
        card.classList.remove("flipped");
    });

    state.flippedCards = 0;
};
// This is to ensure no more than two cards can be flipped over at one time
// Also this makes the cards that do match stay face up
const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameBegun) {
        startGame();
    }

    if (state.flippedCards <= 2) {
        card.classList.add("flipped");
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll(".flipped:not(.matched)");

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add("matched");
            flippedCards[1].classList.add("matched");
        }

        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }
    //This displays the win message when there are no further cards to be flipped over and all of the matches have been found. The stats are inputted within the HTML below.
    if (!document.querySelectorAll(".card:not(.flipped)").length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add("flipped");
            selectors.win.innerHTML = `
                <span class="win-text">
                    <h1 class="font-1">You won!</h1>
                    <p class="stats-text">You used <span class="highlight">${state.totalFlips}</span> moves</p>
                    <p class="stats-text">and took <span class="highlight">${state.totalTime}</span> seconds</p>
                    <button class="win-btn game-btn"><a href="level2.html">Brave enough for level 2?</a></button>
                    <br>
                    <button class="win-btn game-btn"><a href="level1.html">Practice more on level 1</a></button>
                </span>
            `;

            clearInterval(state.loop);
        }, 1000);
    }
};

// Event listners for card flipping
const attachEventListeners = () => {
    document.addEventListener("click", event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes("card") && !eventParent.className.includes("flipped")) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === "BUTTON" && !eventTarget.className.includes("disabled")) {
            startGame();
        }
    });
};

//Calling functions to generate the game once the game has begun and to attach the click event listeners
generateGame();
attachEventListeners();
