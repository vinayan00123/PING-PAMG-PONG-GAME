let player1Name, player2Name, currentPlayer, gameMode;
let boardState = ['', '', '', '', '', '', '', '', ''];
let playerScores = { X: 0, O: 0 };

document.getElementById('start-game').addEventListener('click', function() {
    player1Name = document.getElementById('player1').value;
    player2Name = document.getElementById('player2').value;
    if (player1Name && player2Name) {
        document.getElementById('registration-form').style.display = 'none';
        document.getElementById('game-mode').style.display = 'block';
    }
});

document.getElementById('player-vs-player').addEventListener('click', function() {
    gameMode = 'PvP';
    startGame('X', 'O');
});

document.getElementById('player-vs-computer').addEventListener('click', function() {
    gameMode = 'PvC';
    startGame('X', 'O');
});

function startGame(player1, player2) {
    currentPlayer = player1;
    boardState.fill('');
    document.getElementById('game-mode').style.display = 'none';
    document.getElementById('game-board').style.display = 'block';
    renderBoard();
}

function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    boardState.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.innerText = cell;
        cellDiv.addEventListener('click', () => handleCellClick(index));
        board.appendChild(cellDiv);
    });
    updateScoreboard();
}

function handleCellClick(index) {
    if (boardState[index] !== '') return;
    boardState[index] = currentPlayer;
    document.querySelectorAll('.cell')[index].classList.add('selected');
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch players
    if (gameMode === 'PvC' && currentPlayer === 'O') {
        computerMove();
    }
    renderBoard();
}

function computerMove() {
    const emptyCells = boardState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    if (randomIndex !== undefined) {
        boardState[randomIndex] = 'O';
        checkWinner();
        currentPlayer = 'X'; // Switch back to player
        renderBoard();
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            setTimeout(() => {
                alert(`Player ${boardState[a]} wins!`);
                updateScores(boardState[a]);
                renderBoard();
                document.getElementById('restart-game').style.display = 'block';
            }, 100);
            return;
        }
    }

    if (!boardState.includes('')) {
        setTimeout(() => {
            alert('It\'s a draw!');
            document.getElementById('restart-game').style.display = 'block';
        }, 100);
    }
}

function updateScores(winner) {
    if (winner === 'X') {
        playerScores.X++;
    } else if (winner === 'O') {
        playerScores.O++;
    }
    updateScoreboard();
}

function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = `
        <p>${player1Name} (X): ${playerScores.X} points</p>
        <p>${player2Name} (O): ${playerScores.O} points</p>
    `;
}

document.getElementById('restart-game').addEventListener('click', function() {
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('restart-game').style.display = 'none';
    document.getElementById('registration-form').style.display = 'block';
});
