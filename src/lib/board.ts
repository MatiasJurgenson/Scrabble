import { type boardTile } from "../types/tiles";

let midagi = false;

let board: boardTile[][] = Array(15).fill(Array(15));

for (let i = 0; i < 15; i++) {
  for (let j = 0; j < 15; j++) {
    let tile_id = i * 15 + j;
    if (midagi) {
        // pane siia erandid
    }
    else {
        board[i][j] = {
            id: tile_id,
            multipliyer: 1,
            letter: undefined,
            type: "normal"
        }
    };
  }
}