let boxes = document.querySelectorAll('.box');
let reset = document.querySelector('#reset');
let newGamebtn = document.querySelector("#new-btn");
let msgcontanier = document.querySelector(".msg-contanier");
let massage = document.querySelector("#massage");

let turn0 = true;
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
    enableboxes();
    msgcontanier.classList.add('hide');
    massage.innerText = "";
};

boxes.forEach((box) => {
    box.addEventListener('click', () => {
        if (box.innerText !== "") return;

        if (turn0) {
            box.innerText = "💹";
            turn0 = false;
        } else {
            box.innerText = "❌";
            turn0 = true; 
        }

        box.disabled = true;

        const winner = checkWinner();
        if (winner) {
            showWinner(winner);
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
        box.innerText = "";
    });
};

const showWinner = (winner) => {
    massage.innerText = `Congratulations 🎉 Winner is ${winner}`;
    msgcontanier.classList.remove("hide");
    disableboxes();
};

const checkWinner = () => {
    for (let pattern of winningPattren) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val !== "" && pos1val === pos2val && pos2val === pos3val) {
            return pos1val;
        }
    }
    return null;
};

newGamebtn.addEventListener('click', resetGame);
reset.addEventListener('click', resetGame);
