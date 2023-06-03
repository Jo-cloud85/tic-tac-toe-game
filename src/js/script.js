const markBtnGrp = document.querySelector('#mark-btn-grp'),
      crossMark = document.querySelector('#x-mark'),
      circleMark = document.querySelector('#o-mark'),

      newGameBtnGrp = document.querySelector('#new-game-btn-grp'),
      vsCpuBtn = document.querySelector('#vs-cpu-btn'),
      vsPlayerBtn = document.querySelector('#vs-player-btn'),

      newGameMenuStart = document.querySelector("#new-game-menu-start-container"),
      chooseDifficulty = document.querySelector("#choose-difficulty-container"),
      chooseDifficultyLvl = document.querySelector("#choose-difficulty-lvl"),
      easyBtn = document.querySelector('#easy-btn'),
      mediumBtn = document.querySelector('#medium-btn'),
      hardBtn = document.querySelector('#hard-btn'),

      gameboardStart = document.querySelector('#gameboard-start-container'),

      gameBoard = document.querySelector("#gameboard"),
      turn = document.querySelector('#turn'),
      resetBtn = document.querySelector("#reset-btn"),

      resultsContainerBg = document.querySelector('#results-container-bg'),
      resultsContainer = document.querySelector('#results-container'),
      resultsMain = document.querySelector('#results-main'),
      resultsNote = document.querySelector('#results-note'),
      resultsImg = document.querySelector('#results-main > img'),
      resultsText = document.querySelector('#results-main > p'),

      restartContainer = document.querySelector('#restart-container'),
  
      quitOrNextRoundBtnGrp = document.querySelector('#quit-or-nextround'),
      quitBtn = document.querySelector("#quit-btn"),
      nextRoundBtn = document.querySelector('#next-round-btn'),
  
      cancelOrRestartBtnGrp = document.querySelector('#cancel-or-restart'),
      noCancelBtn = document.querySelector('#no-cancel-btn'),
      yesRestartBtn = document.querySelector('#yes-restart-btn');
      
let currentPlayer = 'x',
    selectedPlayer1Mark,
    selectedPlayer2,
    player1,
    currentDifficulty = null,
    startCells = ["", "", "", "", "", "", "", "", ""];

let xScore = 0,
    tiesScore = 0,
    oScore = 0,
    xScoreLabel = document.querySelector ('#x-score p:first-child'),
    xScoreNum = document.querySelector ('#x-score-num'),
    tiesScoreLabel = document.querySelector ('#ties-score p:first-child'),
    tiesScoreNum = document.querySelector ('#ties-score-num'),
    oScoreLabel = document.querySelector ('#o-score p:first-child'),
    oScoreNum = document.querySelector ('#o-score-num');


// Choose player 1's mark
const pickPlayer1Mark = () => {
    gameboardStart.style.display = "none";
    resultsContainerBg.style.display = "none";

    if (selectedPlayer1Mark === crossMark) {
        player1 = 'x';
        crossMark.classList.add('active');
        circleMark.classList.remove('active');
    } else {
        player1 = 'o';
        circleMark.classList.add('active');
        crossMark.classList.remove('active');
    }

    return player1;
}

// Choose player - cpu or another player
const pickPlayer2 = () => {
    player1 = pickPlayer1Mark();
    
    if (selectedPlayer2 === vsCpuBtn) {
        if (player1 === 'x') {
            xScoreLabel.innerHTML = "X (YOU)";
            oScoreLabel.innerHTML = "O (CPU)";
        } else {
            xScoreLabel.innerHTML = "X (CPU)";
            oScoreLabel.innerHTML = "O (YOU)";
        }
        playWithCpu();
    } else {
        if (player1 === 'x') {
            xScoreLabel.innerHTML = "X (P1)";
            oScoreLabel.innerHTML = "O (P2)";
        } else if (player1 === 'o') {
            xScoreLabel.innerHTML = "X (P2)";
            oScoreLabel.innerHTML = "O (P1)";
        }
        playWithPlayer();
    }
}

function createBoard() {
    gameBoard.innerHTML = "";

    resultsContainer.setAttribute('id', 'results-container');
    resultsNote.setAttribute('id', 'results-note');

    if (!resultsContainer.contains(resultsMain)) {
        resultsContainer.insertBefore(resultsMain, quitOrNextRoundBtnGrp);
    }

    startCells.forEach((_cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('square-cell');
        cellElement.id = index;
        cellElement.addEventListener('mouseover', chooseMove);
        // Add conditional event listener based on the current player
        if (currentPlayer === player1 || (currentPlayer !== player1 && currentDifficulty !== null && startCells.includes(""))) {
            cellElement.addEventListener('click', makeMove);
        } else {
            cellElement.addEventListener('click', makeMove);
        }
        gameBoard.append(cellElement);
    })

    // Trigger CPU's move if player1 is 'o' and it's CPU's turn
    if (player1 === 'o' && currentPlayer !== player1 && currentDifficulty !== null) {
        setTimeout(makeCpuMove, 750);
    }
}

function chooseMove(e) {
    if (currentPlayer === 'x') {
        e.target.classList.add('x-outline'); 
        e.target.addEventListener('mouseout', () => {
            e.target.classList.remove('x-outline');
        });
    } else if (currentPlayer === 'o') {
        e.target.classList.add('o-outline'); 
        e.target.addEventListener('mouseout', () => {
            e.target.classList.remove('o-outline');
        });
    }
}

function makeMove(e) {
    const cellIndex = parseInt(e.target.id);
    if (startCells[cellIndex] === "") {
        startCells[cellIndex] = currentPlayer;
        e.target.classList.add(currentPlayer);
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x'; 

        turn.querySelector('#mark').src = `./public/assets/icon-${currentPlayer}-gray.svg`;
        
        const winner = checkWin();

        if (winner) {
            endGameRound(false);
            calculateAndDisplayResult(winner);
        } else if (isBoardFull()) {
            endGameRound(true);
            tiesScore++;
            tiesScoreNum.textContent = tiesScore;
        } else if (currentPlayer !== player1 && currentDifficulty !== null) {
            setTimeout(makeCpuMove, 500);
        }
    }
    e.target.removeEventListener("mouseover", chooseMove);
    e.target.removeEventListener("click", makeMove);
}

function playWithPlayer() {
    currentDifficulty = null;
    newGameMenuStart.style.display = 'none';
    gameboardStart.style.display = "flex";
    createBoard();
}

function playWithCpu() {
    newGameMenuStart.style.display = 'none';
    chooseDifficulty.style.display = 'flex';
}

function makeCpuMove() {
    let index;
    if (currentDifficulty === easyBtn) {
        index = getRandomEmptyCell();
    } else if (currentDifficulty === mediumBtn) {
        index = getMediumDifficultyMove();
    } else if (currentDifficulty === hardBtn) {
        index = getHardDifficultyMove();
    }
    // console.log("CPU move index:", index); // To check the obtained index

    if (index !== null) {
        const simulatedEvent = { target: document.getElementById(index.toString()) };
        makeMove(simulatedEvent);
    }
}

markBtnGrp.addEventListener('click', (e) => {
    selectedPlayer1Mark = e.target.closest('.mark-btn'); // Store the selected mark in the global variable
    pickPlayer1Mark(); // Call pickPlayer1Mark to set player1
});

newGameBtnGrp.addEventListener('click', (e) => {
    selectedPlayer2 = e.target.closest('.new-game-btn');
    pickPlayer2();
});

chooseDifficultyLvl.addEventListener('click', (e) => {
    currentDifficulty = e.target.closest('.next-action-btn');
    chooseDifficulty.style.display = 'none';
    gameboardStart.style.display = "flex";
    createBoard();
})


// Check win, end game, calculate & display result----------------------------
function checkWin() {
    const winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (startCells[a] !== "" && startCells[a] === startCells[b] && startCells[a] === startCells[c]) {
            gameBoard.children[a].classList.add(`${startCells[a]}-win`);
            gameBoard.children[b].classList.add(`${startCells[b]}-win`);
            gameBoard.children[c].classList.add(`${startCells[c]}-win`);
            return startCells[a];
        }
    }
    return false;
}

function isBoardFull() {
    return startCells.every((cell) => cell !== "");
}

function endGameRound(isDraw) {
    if (isDraw) {
        restartContainer.style.display = "none";
        resultsContainerBg.style.display = "block";
        resultsContainer.setAttribute('id', 'round-tied-container');
        resultsNote.setAttribute('id', 'round-tied-note');
        resultsNote.textContent = "Round tied";
        resultsContainer.removeChild(resultsMain);
    }
}

function calculateAndDisplayResult (winnerIs) {
    resultsContainerBg.style.display = "block";
    resultsContainer.style.display = "flex";
    resultsImg.src = `./public/assets/icon-${winnerIs}.svg`;
    resultsImg.alt = `icon-${winnerIs}`;

    if (winnerIs === player1 && player1 === 'o') {
        oScore++;
        resultsNote.textContent = "You won!";
        resultsText.style.color = "var(--light-yellow)";
    } else if (winnerIs === player1 && player1 === 'x') {
        xScore++;
        resultsNote.textContent = "You won!";
        resultsText.style.color = "var(--light-blue)";
    } else if (winnerIs !== player1 && player1 === 'o') {
        xScore++;
        resultsNote.textContent = "Oh no, you lost...";
        resultsText.style.color = "var(--light-blue)";
    } else if (winnerIs !== player1 && player1 === 'x') {
        oScore++;
        resultsNote.textContent = "Oh no, you lost...";
        resultsText.style.color = "var(--light-yellow)";
    }

    xScoreNum.textContent = xScore;
    oScoreNum.textContent = oScore;
}


// Next action moves ---------------------------------------------------------
const quitOrNextRound = (e) => {
    const nextStep = e.target.closest('.next-action-btn');
    if (nextStep === quitBtn) {
        resultsContainerBg.style.display = "block";
        restartContainer.style.display = "flex";
    } else if (nextStep === nextRoundBtn) {
        resultsContainerBg.style.display = "none";
        startCells = ["", "", "", "", "", "", "", "", ""];
        createBoard();
    }
}

const cancelOrRestart = (e) => {
    const toRestart = e.target.closest('.next-action-btn');
    if (toRestart === noCancelBtn) {
        restartContainer.style.display = "none";
    } else if (toRestart === yesRestartBtn) {
        startOrRestartGame();
    }
}

const startOrRestartGame = () => {
    currentPlayer = 'x';
    selectedPlayer1Mark;
    selectedPlayer2;
    xScore = 0;
    tiesScore = 0;
    oScore = 0;
    xScoreNum.textContent = xScore;
    tiesScoreNum.textContent = xScore;
    oScoreNum.textContent = xScore;
    currentDifficulty = null;
    startCells = ["", "", "", "", "", "", "", "", ""];
    turn.querySelector('#mark').src = `./public/assets/icon-x-gray.svg`;
    newGameMenuStart.style.display = "flex";
    resultsContainerBg.style.display = "none";
    chooseDifficulty.style.display = "none";
    gameboardStart.style.display = "none";
} 

const resetGame = () => {
    startCells = ["", "", "", "", "", "", "", "", ""];
    createBoard();
}

quitOrNextRoundBtnGrp.addEventListener('click', quitOrNextRound);
cancelOrRestartBtnGrp.addEventListener('click', cancelOrRestart);
resetBtn.addEventListener('click', resetGame);


// Helper functions for Cpu's moves -------------------------------------------
function getRandomEmptyCell() {
    const emptyCells = startCells.reduce((acc, cell, index) => {
        if (cell === "") {
            acc.push(index);
        }
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    } else {
        return null;
    }
}

function getMediumDifficultyMove() {
    // Check for winning move
    const winningMove = getWinningMove("o");
    if (winningMove !== null) {
        return winningMove;
    }
    // Check for blocking move
    const blockingMove = getWinningMove("x");
    if (blockingMove !== null) {
        return blockingMove;
    }
    // If no winning or blocking move, choose random empty cell
    return getRandomEmptyCell();
}

function getHardDifficultyMove() {
    // Check for winning move
    const winningMove = getWinningMove("o");
    if (winningMove !== null) {
        return winningMove;
    }
    // Check for blocking move
    const blockingMove = getWinningMove("x");
    if (blockingMove !== null) {
        return blockingMove;
    }
    // Check for strategic moves
    const strategicMove = getStrategicMove();
    if (strategicMove !== null) {
        return strategicMove;
    }
    // If no strategic move, choose random empty cell
    return getRandomEmptyCell();
}

// Function to get all possible moves (empty cells) on the game board
function getPossibleMoves() {
    const possibleMoves = [];
    for (let i = 0; i < startCells.length; i++) {
      if (startCells[i] === "") {
        possibleMoves.push(i);
      }
    }  
    return possibleMoves;
}

function getWinningMove(symbol) {
    const possibleMoves = getPossibleMoves();
    for (let move of possibleMoves) {
        startCells[move] = symbol;
        
        if (checkWin()) {
            startCells[move] = ""; // Reset the board
            return move;
        }
        
        startCells[move] = ""; // Reset the board
    }
    return null;
}

function getStrategicMove() {
    const strategicMoves = [4, 0, 2, 6, 8];
    for (let move of strategicMoves) {
        if (startCells[move] === "") {
            return move;
        }
    }
    return null;
}