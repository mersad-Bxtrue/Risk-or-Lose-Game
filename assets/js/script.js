'use strict';

// Select the element
const score0_Element = document.getElementById('score--0');
const score1_Element = document.getElementById('score--1');
const current0_Element = document.getElementById("current--0");
const current1_Element = document.getElementById("current--1");
const dice_Element = document.querySelector(".dice");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");
const player1 = document.querySelector(".player--0");
const player2 = document.querySelector(".player--1");
const victoryMessage = document.querySelector(".victory-message");
const overlay = document.querySelector(".overlay");
const closeWindow = document.querySelector(".close-window");
const messageTitle = document.querySelector(".mesage-title");
const sendButton = document.querySelector(".send-btn");
const showMessage = document.querySelector(".show-message");
const playerMessage = document.querySelector(".player-message");
const rollAudio = new Audio("assets/audio/rolling-dice.mp3");
const winMatch = new Audio("assets/audio/match-winner.mp3");
const sendMessage_audio = new Audio("assets/audio/success_send_message.mp3");


// Starting values ​​of the game
let scores, currentScore, activePlayer, playing, lastWinner = null;


// Restart Function
const init = function () {
    scores = [0, 0];
    currentScore = 0;
    activePlayer = lastWinner !== null ? lastWinner : 0;
    score0_Element.textContent = 0;
    score1_Element.textContent = 0;
    current0_Element.textContent = 0;
    current1_Element.textContent = 0;

    // player1.classList.toggle("player--active", activePlayer === 0);
    // player2.classList.toggle("player--active", activePlayer === 1);
    if (activePlayer === 0) {
        player1.classList.add("player--active");
        player2.classList.remove("player--active");
    } else {
        player1.classList.remove("player--active");
        player2.classList.add("player--active");
    }
    player1.classList.remove("player--winner");
    player2.classList.remove("player--winner");
    dice_Element.classList.add("hidden");
    playing = true;

    showMessage.classList.add("hidden");
    document.querySelector(".input-message").value = "";
}
init();

// switchPlayer Function
const switchPlayer = function () {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    currentScore = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    player1.classList.toggle("player--active");
    player2.classList.toggle("player--active");
}

// windowCloser Function
const windowCloser = function () {
    victoryMessage.classList.add("hidden");
    overlay.classList.add("hidden");
}

// showMessageWithDelay Function
const showMessageWithDelay = function () {
    setTimeout(function () {
        showMessage.classList.remove("hidden");
        showMessage.classList.add("fade-in");
        document.querySelector(".input-message").value = "";
    }, 100);
};


// Rolling dice Function
btnRoll.addEventListener('click', function () {
    if (playing) {
        // Random dice roll
        rollAudio.currentTime = 0;
        rollAudio.play();
        const diceNumber = Math.trunc(Math.random() * 6) + 1;

        // add rotate dice class and display it
        dice_Element.classList.remove("hidden");
        dice_Element.src = `assets/image/dice-${diceNumber}.png`;
        dice_Element.classList.add("rotate-dice");

        setTimeout(function () {
            // Remove the rotate-dice class to reset the animation for the next roll
            dice_Element.classList.remove("rotate-dice");

            // Check for rolled 1 or not
            if (diceNumber !== 1) {
                currentScore += diceNumber;
                document.getElementById(`current--${activePlayer}`).textContent = currentScore;
            } else {
                switchPlayer();
            }
        }, 500);
    }
});


// Save points
btnHold.addEventListener('click', function () {
    if (playing) {
        // Add the current score to the total score of the active player
        scores[activePlayer] = scores[activePlayer] + currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

        // Check if player's score is >= 100
        if (scores[activePlayer] >= 100) {
            // Finish the game
            winMatch.play();
            victoryMessage.classList.add("small");
            document.querySelector(`.player--${activePlayer}`).classList.add("player--winner");
            // document.querySelector(`.player--${activePlayer}`).classList.remove("player--active");
            dice_Element.classList.add("hidden");
            lastWinner = activePlayer;
            playing = false;

            // show window message
            victoryMessage.classList.remove("hidden");
            overlay.classList.remove("hidden");
            messageTitle.textContent = `Player ${activePlayer + 1} are winner 🏆`;

            // click to send message
            sendButton.addEventListener("click", function () {
                showMessageWithDelay();
                sendMessage_audio.currentTime = 0;
                sendMessage_audio.play();
                const inputMessage = document.querySelector(".input-message").value;
                showMessage.textContent = `Player ${activePlayer + 1} : ${inputMessage}`;
            });

            // Close window message
            closeWindow.addEventListener("click", windowCloser);
            overlay.addEventListener("click", windowCloser);
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && !victoryMessage.classList.contains('hidden')) {
                    windowCloser();
                }
            });
        } else {
            // Switch to the next player
            switchPlayer();
        }
    }

});


// Restart the game
btnNew.addEventListener('click', init);

