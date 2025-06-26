let boxes = document.querySelectorAll('.box');
let reset = document.querySelector('#reset');
let newGamebtn = document.querySelector("#new-btn");
let msgcontanier = document.querySelector(".msg-contanier");
let massage = document.querySelector("#massage");

let turn0 = true; // true for player 0 (💹), false for player X (❌)
let count = 0;    // To track the number of filled boxes for tie game detection

const winningPattren = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const resetGame = () => {
    turn0 = true;
    count = 0; // Reset count on new game/reset
    enableboxes();
    msgcontanier.classList.add('hide');
    massage.innerText = ""; // Clear the message
};

boxes.forEach((box) => {
    box.addEventListener('click', () => {
        if (box.innerText !== "") return; // If box is already filled, do nothing

        if (turn0) {
            box.innerText = "💹";
            turn0 = false;
        } else {
            box.innerText = "❌";
            turn0 = true;
        }

        box.disabled = true; // Disable the clicked box
        count++; // Increment count of filled boxes

        const winner = checkWinner();

        if (winner) {
            showWinner(winner);
        } else if (count === 9) { // Check for tie only if no winner and all boxes are filled
            showTie();
        }
    });
});

const disableboxes = () => {
    boxes.forEach(box => {
        box.disabled = true;
    });
};

const enableboxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = ""; // Clear text from boxes
    });
};

const showWinner = (winner) => {
    massage.innerText = `Congratulations 🎉 Winner is ${winner}`;
    msgcontanier.classList.remove("hide");
    disableboxes(); // Disable all boxes once a winner is found
};

// New function to handle a tie game
const showTie = () => {
    massage.innerText = `It's a Tie! 🤝`;
    msgcontanier.classList.remove("hide");
    disableboxes(); // Disable all boxes on a tie
};

const checkWinner = () => {
    for (let pattern of winningPattren) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val !== "" && pos1val === pos2val && pos2val === pos3val) {
            return pos1val; // Return the winning symbol (💹 or ❌)
        }
    }
    return null; // No winner found
};

newGamebtn.addEventListener('click', resetGame);
reset.addEventListener('click', resetGame);
