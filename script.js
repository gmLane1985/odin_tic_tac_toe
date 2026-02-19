/* 
================
gameboard
================
*/
const Gameboard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;

  const setCell = (index, marker) => {
    if (board[index] === '') {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  };

  return { getBoard, setCell, reset };
})();

/* 
================
player
================
*/
const Player = (name, marker) => {
  return { name, marker, score: 0 };
};

/* 
================
game
================
*/
const GameController = (() => {
  let playerX;
  let playerO;
  let currentPlayer;
  let gameOver = false;
  let winningCombo = null;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const startGame = (name1, name2) => {
    playerX = Player(name1 || 'Player 1', 'X');
    playerO = Player(name2 || 'Player 2', 'O');
    newGame();
  };

  const newGame = () => {
    currentPlayer = playerX;
    gameOver = false;
    winningCombo = null;

    Gameboard.reset();
    displayController.updateScoreboard(playerX, playerO);
    displayController.render();
    displayController.setMessage(
      `${currentPlayer.name}'s turn (${currentPlayer.marker})`,
    );
  };

  const resetScores = () => {
    if (playerX) playerX.score = 0;
    if (playerO) playerO.score = 0;
  };

  const playRound = (index) => {
    if (gameOver) return;

    const success = Gameboard.setCell(index, currentPlayer.marker);
    if (!success) return;

    if (checkWin()) {
      gameOver = true;
      currentPlayer.score++;
      displayController.updateScoreboard(playerX, playerO);
      displayController.render(winningCombo);
      displayController.setMessage(`${currentPlayer.name} wins!`);
      return;
    }

    if (checkTie()) {
      gameOver = true;
      displayController.render();
      displayController.setMessage("It's a tie!");
      return;
    }

    switchPlayer();
    displayController.render();
    displayController.setMessage(
      `${currentPlayer.name}'s turn (${currentPlayer.marker})`,
    );
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();
    for (let combo of winningCombos) {
      if (combo.every((i) => board[i] === currentPlayer.marker)) {
        winningCombo = combo;
        return true;
      }
    }
    return false;
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== '');
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
  };

  return { startGame, newGame, resetScores, playRound };
})();

/* 
================
display game
================
*/
const displayController = (() => {
  const boardContainer = document.querySelector('.board');
  const messageDisplay = document.querySelector('.message');
  const startBtn = document.querySelector('#startBtn');
  const newGameBtn = document.querySelector('#newGameBtn');
  const resetScoreBtn = document.querySelector('#resetScoreBtn');
  const scoreboardDisplay = document.querySelector('.scoreboard');
  const gameControlsDisplay = document.querySelector('.game-controls');
  const controlsDiv = document.querySelector('.controls');
  const player1Input = document.querySelector('#player1');
  const player2Input = document.querySelector('#player2');

  const scoreX = document.querySelector('#scoreX');
  const scoreO = document.querySelector('#scoreO');
  const nameX = document.querySelector('#nameX');
  const nameO = document.querySelector('#nameO');

  const render = (winningCombo = null) => {
    const board = Gameboard.getBoard();
    boardContainer.innerHTML = '';

    board.forEach((cell, index) => {
      const div = document.createElement('div');
      div.classList.add('cell');
      div.textContent = cell;
      div.dataset.index = index;

      if (cell !== '') {
        div.classList.add('animate');
        if (cell === 'X') {
          div.classList.add('x-marker');
        } else if (cell === 'O') {
          div.classList.add('o-marker');
        }
      }

      if (winningCombo && winningCombo.includes(index)) {
        div.classList.add('win');
      }

      div.addEventListener('click', () => {
        GameController.playRound(index);
      });

      boardContainer.appendChild(div);
    });
  };

  const setMessage = (msg) => {
    messageDisplay.textContent = msg;
  };

  const updateScoreboard = (playerXObj, playerOObj) => {
    nameX.textContent = playerXObj.name;
    nameO.textContent = playerOObj.name;
    scoreX.textContent = playerXObj.score;
    scoreO.textContent = playerOObj.score;
  };

  const toggleButtons = (gameStarted) => {
    if (gameStarted) {
      controlsDiv.style.display = 'none';
      messageDisplay.style.display = 'block';
      boardContainer.style.display = 'grid';
      scoreboardDisplay.style.display = 'flex';
      gameControlsDisplay.style.display = 'flex';
    } else {
      controlsDiv.style.display = 'flex';
      messageDisplay.style.display = 'none';
      boardContainer.style.display = 'none';
      scoreboardDisplay.style.display = 'none';
      gameControlsDisplay.style.display = 'none';
      player1Input.value = '';
      player2Input.value = '';
      messageDisplay.textContent = '';
      boardContainer.innerHTML = '';
    }
  };

  startBtn.addEventListener('click', () => {
    const name1 = document.querySelector('#player1').value;
    const name2 = document.querySelector('#player2').value;
    GameController.startGame(name1, name2);
    toggleButtons(true);
  });

  newGameBtn.addEventListener('click', () => {
    GameController.newGame();
  });

  resetScoreBtn.addEventListener('click', () => {
    GameController.resetScores();
    toggleButtons(false);
  });

  return { render, setMessage, updateScoreboard, toggleButtons };
})();
