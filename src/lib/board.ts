import { type boardTile, type letterTile } from "../types/tiles";
import { getAllsquareContext } from "./context";

let board: boardTile[][] = Array.from({ length: 15 }, () => Array(15).fill(null));

for (let row = 0; row < 15; row++) {
  for (let collumn = 0; collumn < 15; collumn++) {
    let tile_id = row * 15 + collumn;

    // 3x sõna ja keskpunkt
    if (row % 7 === 0) {
      if (collumn % 7 === 0) {
        // kui on keskpunkt
        if (row === 7 && collumn === 7) {
          board[row][collumn] = {
            id: tile_id,
            multipliyer: 1,
            dragDisabled: false,
            type: "center",
            color: "#d3d3d3", // pastel gray
            letter: null,
            value: 0
          }
        // kui on 3x sõna
        } else {
          board[row][collumn] = {
            id: tile_id,
            multipliyer: 3,
            dragDisabled: false,
            type: "word",
            color: "#ff9999", // pastel red
            letter: null,
            value: 0
          }
        } 
      }
    }

    // 2x sõna
    if ((row > 0 && row < 5) || (row > 9 && row < 14)) {
      if (row === collumn || row + collumn === 14) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 2,
            dragDisabled: false,
            type: "word",
            color: "#ffcc99", // pastel orange
            letter: null,
            value: 0
        }
      }
    }

    // 3x täht
    if (row % 4 === 1) {
      // ülemine ja alumine rida
      if ((row === 1 || row === 13) && (collumn === 5 || collumn === 9)) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 3,
            dragDisabled: false,
            type: "letter",
            color: "#99ccff", // pastel blue
            letter: null,
            value: 0
        }
      }
      // keskmised read
      if ((collumn % 4 === 1) && (row === 5 || row === 9)) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 3,
            dragDisabled: false,
            type: "letter",
            color: "#99ccff", // pastel blue
            letter: null,
            value: 0
        }
      }
    }

    // 2x täht i jagub 7-ga
    if (row % 7 === 0) {
      if (collumn === 3 || collumn === 11) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 2,
            dragDisabled: false,
            type: "letter",
            color: "#99ffcc", // pastel green
            letter: null,
            value: 0
        }
      }
    }
    // 2x täht 2 ja 12
    if (row === 2 || row === 12) {
      if (collumn === 6 || collumn === 8) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 2,
            dragDisabled: false,
            type: "letter",
            color: "#99ffcc", // pastel green
            letter: null,
            value: 0
        }
      }
    }
    // 2x täht j jagub 7-ga
    if (row === 3 || row === 11) {
      if (collumn % 7 === 0) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 2,
            dragDisabled: false,
            type: "letter",
            color: "#99ffcc", // pastel green
            letter: null,
            value: 0
        }
      }
    }
    // 2x täht rida 6 ja 8
    if (row === 6 || row === 8) {
      if (collumn === 2 || collumn === 6 || collumn === 8 || collumn === 12) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 2,
            dragDisabled: false,
            type: "letter",
            color: "#99ffcc", // pastel green
            letter: null,
            value: 0
        }
      }
    }
  }
}

// tavalised ruudud 
for (let row = 0; row < 15; row++) {
  for (let collumn = 0; collumn < 15; collumn++) {
    if (board[row][collumn] === null) {
      board[row][collumn] = {
          id: row * 15 + collumn,
          multipliyer: 1,
          dragDisabled: false,
          type: "normal",
          color: "#ffe4c4", // pastel bisque
          letter: null,
          value: 0
      }
    }
  }
}

export { board };



let letter_board: letterTile[][] = Array.from({ length: 15 }, () => Array(15).fill(null));
let pointsboard: number[][] = Array.from({ length: 15 }, () => Array(15).fill(null));
let vanadRuudud: number[][] = [] 

export function getPointsBoard(): number[][] {
    return pointsboard;
}

export function setPointsBoard(points: number[][]): void {
    pointsboard = points;
}

export function addToVanadRuudud(x: number, y: number): void {
  vanadRuudud.push([x, y]);
}
    

export function getVanadRuudud(): number[][] {
    return vanadRuudud;
}

export function setBoard() {
  vanadRuudud = [];
  getAllsquareContext().forEach((value, key) => {
      let coord_x = key % 15;
      let coord_y = Math.floor(key / 15);
      letter_board[coord_y][coord_x] = value;
      vanadRuudud.push([coord_y, coord_x]);
  });

  return letter_board;
}

export function getTempBoard() {
  let temp_board: letterTile[][] = Array.from({ length: 15 }, () => Array(15).fill(null));
  getAllsquareContext().forEach((value, key) => {
      let coord_x = key % 15;
      let coord_y = Math.floor(key / 15);
      pointsboard[coord_y][coord_x] = value.points;
      temp_board[coord_y][coord_x] = value;
  });

  return temp_board;
}

export function getBoard() {
  return letter_board;
}