import { type boardTile } from "../types/tiles";

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
            letter: undefined,
            type: "center",
            color: "black"
          }
        // kui on 3x sõna
        } else {
          board[row][collumn] = {
            id: tile_id,
            multipliyer: 3,
            letter: undefined,
            type: "word",
            color: "#FF4141"
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
            letter: undefined,
            type: "word",
            color: "#FFBC41"
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
            letter: undefined,
            type: "letter",
            color: "#416DFF"
        }
      }
      // keskmised read
      if ((collumn % 4 === 1) && (row === 5 || row === 9)) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 3,
            letter: undefined,
            type: "letter",
            color: "#416DFF"
        }
      }
    }

    // 2x täht i jagub 7-ga
    if (row % 7 === 0) {
      if (collumn === 3 || collumn === 11) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 2,
            letter: undefined,
            type: "letter",
            color: "#41DCFF"
        }
      }
    }
    // 2x täht 2 ja 12
    if (row === 2 || row === 12) {
      if (collumn === 6 || collumn === 8) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 2,
            letter: undefined,
            type: "letter",
            color: "#41DCFF"
        }
      }
    }
    // 2x täht j jagub 7-ga
    if (row === 3 || row === 11) {
      if (collumn % 7 === 0) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 2,
            letter: undefined,
            type: "letter",
            color: "#41DCFF"
        }
      }
    }
    // 2x täht rida 6 ja 8
    if (row === 6 || row === 8) {
      if (collumn === 2 || collumn === 6 || collumn === 8 || collumn === 12) {
        board[row][collumn] = {
            id: tile_id,
            multipliyer: 2,
            letter: undefined,
            type: "letter",
            color: "#41DCFF"
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
          letter: undefined,
          type: "normal",
          color: "bisque"
      }
    }
  }
}

export { board };