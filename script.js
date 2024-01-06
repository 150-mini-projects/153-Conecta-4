const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const startScreen = document.querySelector(".startScreen");
const startButton = document.getElementById("start");
const message = document.getElementById("message");

let initialMatrix = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

let currentPlayer;

const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const verifyArray = (arrayElement) => {
  let bool = false;
  let elementCount = 0;
  arrayElement.forEach((element, index) => {
    if (element == currentPlayer) {
      elementCount += 1;
      if (elementCount == 4) {
        bool = true;
      }
    } else {
      elementCount = 0;
    }
  });
  return bool;
};

const gameOverCheck = () => {
  let truthCount = 0;
  for (let innerArray of initialMatrix) {
    if (innerArray.every((val) => val != 0)) {
      truthCount += 1;
    }
  }
  if (truthCount == 6) {
    message.innerText = "Game Over";
    startScreen.classList.remove("hide");
  }
};

const checkAdjacentColumnValues = (column) => {
  let colWinCount = 0,
    colWinBool = false;
  initialMatrix.forEach((element, index) => {
    if (element[column] == currentPlayer) {
      colWinCount += 1;
      if (colWinCount == 4) {
        colWinBool = true;
      }
    } else {
      colWinCount = 0;
    }
  });
  return colWinBool;
};

const getRightDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let rightDiagonal = [];
  while (rowCount > 0) {
    if (columnCount >= columnLength - 1) {
      break;
    }
    rowCount -= 1;
    columnCount += 1;
    rightDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount < 0) {
      break;
    }
    rightDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount -= 1;
  }
  return rightDiagonal;
};

const getLeftDiagonal = (row, column, rowLength, columnLength) => {
  let rowCount = row;
  let columnCount = column;
  let leftDiagonal = [];
  while (rowCount > 0) {
    if (columnCount <= 0) {
      break;
    }
    rowCount -= 1;
    columnCount -= 1;
    leftDiagonal.unshift(initialMatrix[rowCount][columnCount]);
  }
  rowCount = row;
  columnCount = column;
  while (rowCount < rowLength) {
    if (columnCount >= columnLength) {
      break;
    }
    leftDiagonal.push(initialMatrix[rowCount][columnCount]);
    rowCount += 1;
    columnCount += 1;
  }
  return leftDiagonal;
};

const checkAdjacentDiagonalValues = (row, column) => {
  let diagWinBool = false;
  let tempChecks = {
    leftTop: [],
    rightTop: [],
  };
  let columnLength = initialMatrix[row].length;
  let rowLength = initialMatrix.length;

  tempChecks.rightTop = [
    ...getLeftDiagonal(row, column, rowLength, columnLength),
  ];

  tempChecks.rightTop = [
    ...getRightDiagonal(row, column, rowLength, columnLength),
  ];

  diagWinBool = verifyArray(tempChecks.rightTop);
  if (!diagWinBool) {
    diagWinBool = verifyArray(tempChecks.leftTop);
  }
  return diagWinBool;
};

const winCheck = (row, column) => {
  return checkAdjacentColumnValues(column)
    ? true
    : checkAdjacentDiagonalValues(row, column)
    ? true
    : false;
};

const setPiece = (startCount, colValue) => {
  let rows = document.querySelectorAll(".grid-row");
  if (initialMatrix[startCount][colValue] != 0) {
    startCount -= 1;
    setPiece(startCount, colValue);
  } else {
    let currentRow = rows[startCount].querySelectorAll(".grid-box");
    currentRow[colValue].classList.add("filled", `player${currentPlayer}`);
    initialMatrix[startCount][colValue] = currentPlayer;
    if (winCheck(startCount, colValue)) {
      message.innerHTML = `Jugador<span> ${currentPlayer}</span> Gana!`;
      startScreen.classList.remove("hide");
      return false;
    }
  }
  gameOverCheck();
};

const fillBox = (e) => {
  let colValue = parseInt(e.target.getAttribute("data-value"));
  setPiece(5, colValue);
  currentPlayer = currentPlayer == 1 ? 2 : 1;
  playerTurn.innerHTML = `Turno Del Jugador <span>${currentPlayer}</span> `;
};

const matrixCreator = () => {
  for (let i in initialMatrix) {
    let outerDiv = document.createElement("div");
    outerDiv.classList.add("grid-row");
    outerDiv.setAttribute("data-value", i);
    for (let j in initialMatrix[i]) {
      initialMatrix[i][j] = 0;
      let innerDiv = document.createElement("div");
      innerDiv.classList.add("grid-box");
      innerDiv.setAttribute("data-value", j);
      innerDiv.addEventListener("click", (e) => {
        fillBox(e);
      });
      outerDiv.appendChild(innerDiv);
    }
    container.appendChild(outerDiv);
  }
};

startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  startGame();
});

async function startGame() {
  currentPlayer = generateRandomNumber(1, 3);
  container.innerHTML = "";
  await matrixCreator();
  playerTurn.innerHTML = `Turno Del Jugador <span>${currentPlayer}</span> `;
}
