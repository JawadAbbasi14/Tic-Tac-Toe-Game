// Select all necessary DOM elements
let boxes = document.querySelectorAll('.box');
let reset = document.querySelector('#reset');
let newGamebtn = document.querySelector("#new-btn");
let msgcontanier = document.querySelector(".msg-container");
let massage = document.querySelector("#massage");

// New LLM-related DOM elements
let getInsightBtn = document.querySelector("#get-insight-btn");
let getFactBtn = document.querySelector("#get-fact-btn");
let llmOutputDiv = document.querySelector("#llm-output");

// Game state variables
let turn0 = true; // true for player 0 (💹), false for player X (❌)
let count = 0;    // To track the number of filled boxes for tie game detection

// All possible winning patterns
const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

/**
 * Resets the game to its initial state.
 * Clears all boxes, enables them, hides the message container,
 * and resets the turn and move count. Disables the insight button.
 */
const resetGame = () => {
    turn0 = true; // Player 0 starts
    count = 0;    // Reset move counter
    enableBoxes(); // Make all boxes playable
    msgcontanier.classList.add('hide'); // Hide win/tie message
    massage.innerText = ""; // Clear any previous message
    getInsightBtn.disabled = true; // Disable insight button on reset
    llmOutputDiv.innerHTML = "<p>AI insights will appear here!</p>"; // Clear LLM output
    llmOutputDiv.classList.remove('loading');
};

// Add event listeners to each game box
boxes.forEach((box) => {
    box.addEventListener('click', () => {
        // If the box is already filled, do nothing
        if (box.innerText !== "") {
            return;
        }

        // Place the appropriate symbol based on the current turn
        if (turn0) {
            box.innerText = "💹";
            box.style.color = '#f4a261';
            turn0 = false;
        } else {
            box.innerText = "❌";
            box.style.color = '#ef4444';
            turn0 = true;
        }

        box.disabled = true;
        count++;

        // Check for a winner after each move
        const winner = checkWinner();

        // If there's a winner, show the winner message
        if (winner) {
            showWinner(winner);
            getInsightBtn.disabled = false; // Enable insight button after win
        } else if (count === 9) {
            // If all 9 boxes are filled and no winner, it's a tie
            showTie();
            getInsightBtn.disabled = false; // Enable insight button after tie
        }
    });
});

/**
 * Disables all game boxes, preventing further moves.
 */
const disableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = true;
    });
};

/**
 * Enables all game boxes and clears their content.
 */
const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
        box.style.color = '';
    });
};

/**
 * Displays the winner message and disables the game board.
 * @param {string} winner - The symbol of the winning player (e.g., "💹" or "❌").
 */
const showWinner = (winner) => {
    massage.innerText = `Congratulations 🎉 Winner is ${winner}`;
    msgcontanier.classList.remove("hide");
    disableBoxes();
};

/**
 * Displays the tie game message and disables the game board.
 */
const showTie = () => {
    massage.innerText = `It's a Tie! 🤝`;
    msgcontanier.classList.remove("hide");
    disableBoxes();
};

/**
 * Checks if there's a winner based on the current state of the board.
 * @returns {string|null} The symbol of the winner ("💹" or "❌") if found, otherwise null.
 */
const checkWinner = () => {
    for (let pattern of winningPatterns) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val !== "" && pos1val === pos2val && pos2val === pos3val) {
            return pos1val;
        }
    }
    return null;
};

// Add event listeners for the "New Game" and "Reset Game" buttons
newGamebtn.addEventListener('click', resetGame);
reset.addEventListener('click', resetGame);

// --- Gemini API Integration ---

/**
 * Calls the Gemini API with a given prompt.
 * @param {string} promptText The text prompt for the LLM.
 * @returns {Promise<string>} The generated text from the LLM.
 */
async function callGeminiAPI(promptText) {
    llmOutputDiv.classList.add('loading');
    llmOutputDiv.innerHTML = '<p>Thinking...</p>'; // Loading indicator

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: promptText }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will automatically provide the API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "No meaningful response from AI.";
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Failed to get AI response. Please try again.";
    } finally {
        llmOutputDiv.classList.remove('loading');
    }
}

/**
 * Generates an insight about the current Tic Tac Toe game.
 * This button is enabled only after a game concludes (win or tie).
 */
getInsightBtn.addEventListener('click', async () => {
    const boardState = Array.from(boxes).map(box => box.innerText === "" ? "_" : box.innerText).join('');
    const gameResult = massage.innerText;

    const prompt = `Analyze this Tic Tac Toe game. The final board state (read left to right, top to bottom, '_' for empty) is: "${boardState}". The game result was: "${gameResult}". Provide a short, insightful, and slightly informal comment on the game.`;

    const insight = await callGeminiAPI(prompt);
    llmOutputDiv.innerHTML = `<p>${insight}</p>`;
});

/**
 * Generates a fun fact about Tic Tac Toe.
 * This button can be clicked at any time.
 */
getFactBtn.addEventListener('click', async () => {
    const prompt = "Tell me a fun and interesting fact about the game Tic Tac Toe, keep it concise and engaging.";
    const fact = await callGeminiAPI(prompt);
    llmOutputDiv.innerHTML = `<p>${fact}</p>`;
});
