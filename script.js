const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const GRIDSIZE = 19;
const DOTINDEXES = [3, 9, 15];
const SPACEBETWEENSTONES = 2;

const Stones = {
  EMPTY: 0,
  BLACK: 1,
  WHITE: 2,
};

const StoneMode = {
  ALTERNATE: "alternate",
  BLACK: "black",
  WHITE: "white",
};

const buttonConfigs = [
  {
    button: document.getElementById("alternate-stone"),
    mode: StoneMode.ALTERNATE,
    color: Stones.BLACK,
  },
  {
    button: document.getElementById("black-stone"),
    mode: StoneMode.BLACK,
    color: Stones.BLACK,
  },
  {
    button: document.getElementById("white-stone"),
    mode: StoneMode.WHITE,
    color: Stones.WHITE,
  },
];

const corners = [
  document.getElementById("corner-1"),
  document.getElementById("corner-2"),
  document.getElementById("corner-3"),
  document.getElementById("corner-4"),
];

let mouseX;
let mouseY;

let boardSize = 800;
let cellSize = boardSize / 20;
let offsetX = 0;
let offsetY = 0;

let selectedCorner;
let stoneMode = StoneMode.ALTERNATE;
let currentColor = 1;

let stones = emptyStones();

function emptyStones() {
  return Array.from({ length: 19 }, () => Array(19).fill(Stones.EMPTY));
}

function drawBoard() {
  boardSize = selectedCorner == undefined ? 800 : 1600;
  cellSize = boardSize / 20;

  if (selectedCorner == 0 || selectedCorner == undefined) {
    offsetX = 0;
    offsetY = 0;
  } else if (selectedCorner == 1) {
    offsetX = -boardSize / 2;
    offsetY = 0;
  } else if (selectedCorner == 2) {
    offsetX = 0;
    offsetY = -boardSize / 2;
  } else if (selectedCorner == 3) {
    offsetX = -boardSize / 2;
    offsetY = -boardSize / 2;
  }

  for (i = 1; i < GRIDSIZE - 1; i++) {
    ctx.strokeStyle = "black";

    // verticle lines
    ctx.beginPath();
    ctx.moveTo(cellSize + cellSize * i + offsetX, cellSize + offsetY);
    ctx.lineTo(
      cellSize + cellSize * i + offsetX,
      boardSize - cellSize + offsetY,
    );
    ctx.stroke();

    // horizontal lines
    ctx.beginPath();
    ctx.moveTo(cellSize + offsetX, cellSize + cellSize * i + offsetY);
    ctx.lineTo(
      boardSize - cellSize + offsetX,
      cellSize + cellSize * i + offsetY,
    );
    ctx.stroke();
  }
  // dots
  for (x of DOTINDEXES) {
    for (y of DOTINDEXES) {
      ctx.beginPath();
      ctx.arc(
        cellSize + cellSize * x + offsetX,
        cellSize + cellSize * y + offsetY,
        cellSize / 8,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  // outer line

  ctx.lineWidth = 2;
  ctx.strokeRect(
    cellSize + offsetX,
    cellSize + offsetY,
    boardSize - cellSize * 2,
    boardSize - cellSize * 2,
  );
  ctx.lineWidth = 1;
}

function drawPlacedStones() {
  for (let y = 0; y < GRIDSIZE; y++) {
    for (let x = 0; x < GRIDSIZE; x++) {
      if (stones[y][x] == 0) {
        continue;
      }
      color = stones[y][x] == 1 ? "black" : "white";
      ctx.fillStyle = color;
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.arc(
        cellSize + cellSize * x + offsetX,
        cellSize + cellSize * y + offsetY,
        (cellSize - SPACEBETWEENSTONES) / 2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
    }
  }
}

function drawHoverStone() {
  [x, y] = getXY();
  ctx.fillStyle = currentColor == Stones.BLACK ? "black" : "white";
  ctx.beginPath();
  ctx.arc(
    cellSize + cellSize * x,
    cellSize + cellSize * y,
    (cellSize - SPACEBETWEENSTONES) / 2,
    0,
    Math.PI * 2,
  );
  ctx.globalAlpha = 0.5;
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.globalAlpha = 1.0;
}

function getXY() {
  x = Math.floor((mouseX - cellSize / 2) / cellSize);
  y = Math.floor((mouseY - cellSize / 2) / cellSize);

  if (x < 0 || x > 18 || y < 0 || y > 18) {
    return [undefined, undefined];
  }
  return [x, y];
}

function swapColors() {
  currentColor = currentColor == Stones.BLACK ? Stones.WHITE : Stones.BLACK;
}

function saveCanvasAsImage() {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "canvas-image.png";
  link.click();
}

// Canvas

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
});

canvas.addEventListener("mouseleave", (event) => {
  mouseX = undefined;
  mouseY = undefined;
});

canvas.addEventListener("click", (_) => {
  [x, y] = getXY();
  if (x == undefined || y == undefined) {
    return;
  }

  if (stones[y][x] == 0) {
    stones[y][x] = currentColor;
    if (stoneMode == StoneMode.ALTERNATE) {
      swapColors();
    }
  } else {
    stones[y][x] = 0;
  }
});

// Buttons

function handleButtonClick(event) {
  buttonConfigs.forEach(({ button }) => {
    button.style.backgroundColor = "";
    button.style.color = "black";
  });
  event.currentTarget.style.backgroundColor = "green";
  event.currentTarget.style.color = "white";
}

for (const key in buttonConfigs) {
  buttonConfigs[key].button.addEventListener("click", handleButtonClick);
}

buttonConfigs.forEach(({ button, mode, color }) => {
  button.addEventListener("click", () => {
    stoneMode = mode;
    currentColor = color;
  });
});

corners.forEach((corner, index) => {
  corner.addEventListener("click", () => {
    console.log(selectedCorner, index);
    if (selectedCorner == index) {
      selectedCorner = undefined;
    } else {
      selectedCorner = index;
    }
  });
});

document.getElementById("reset").addEventListener("click", () => {
  stones = emptyStones();
});

document.getElementById("save").addEventListener("click", saveCanvasAsImage);

// Main

window.onload = function () {
  drawBoard();
  buttonConfigs[0].button.style.backgroundColor = "green";
  buttonConfigs[0].button.style.color = "white";
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();

  drawHoverStone();
  drawPlacedStones();
  requestAnimationFrame(draw);
}

draw();
