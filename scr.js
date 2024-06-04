const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const twoPlayerButton = document.getElementById('two-player');
const vsAIButton = document.getElementById('vs-ai');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeButton = document.querySelector('.close-button');

let currentPlayer = 'X';
let gameState = Array(9).fill('');
let gameMode = 'twoPlayer'; // Default mode
let scoreX = 0;
let scoreO = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (gameState[index] !== '' || checkWin()) {
        return;
    }

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    if (checkWin()) {
        showModal(`${currentPlayer} wins!`);
        updateScore();
    } else if (gameState.every(cell => cell !== '')) {
        showModal('It\'s a tie!');
    } else {
        if (gameMode === 'twoPlayer') {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        } else {
            if (currentPlayer === 'X') {
                currentPlayer = 'O';
                setTimeout(aiMove, 500); // AI move after a short delay
            }
        }
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => gameState[index] === currentPlayer);
    });
}

function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXElement.textContent = scoreX;
    } else {
        scoreO++;
        scoreOElement.textContent = scoreO;
    }
}

function restartGame() {
    gameState = Array(9).fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
    currentPlayer = 'X';
    closeModal();
}

function aiMove() {
    const emptyCells = gameState.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIndex] = 'O';
    const aiCell = document.querySelector(`.cell[data-index='${randomIndex}']`);
    aiCell.textContent = 'O';
    aiCell.classList.add('O');

    if (checkWin()) {
        showModal('O wins!');
        updateScore();
    } else if (gameState.every(cell => cell !== '')) {
        showModal('It\'s a tie!');
    } else {
        currentPlayer = 'X';
    }
}

function setGameMode(mode) {
    gameMode = mode;
    restartGame();
}

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
twoPlayerButton.addEventListener('click', () => setGameMode('twoPlayer'));
vsAIButton.addEventListener('click', () => setGameMode('vsAI'));
closeButton.addEventListener('click', closeModal);
window.addEventListener('click', event => {
    if (event.target === modal) {
        closeModal();
    }
});
