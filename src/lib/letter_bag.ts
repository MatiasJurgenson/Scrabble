import { type letterTile } from "../types/tiles";

export function create_letter_bag(stats: any) {
    let letter_bag: letterTile[] = [];
    let punktid: { [punkt: number]: string[]} = {
        1:['a', 'e', 'i', 's', 't', 'k', 'l', 'o', 'u'], 
        2:['d', 'm', 'n', 'r'], 
        3:['g', 'v'], 
        4:['h', 'j', 'p', 'õ', 'b'], 
        5:['ä', 'ü'], 
        6:['ö'], 
        8:['f'], 
        10:['š','z','ž']}
    
    let idx = 0
    for (let key in punktid) {
        punktid[key].forEach((letter: string) => {
            let number = parseInt(key);
            for (let i = 0; i < stats[letter]; i++) {
                let tile: letterTile = {
                    points: number,
                    letter: letter.toUpperCase(),
                    id: idx++,
                }
                letter_bag.push(tile);
            }
        });
    }

    // lisame ka kaks jokkerit
    for (let i = 0; i < 2; i++) {
        let tile: letterTile = {
            points: 0,
            letter: '?',
            id: idx++,
        }
        letter_bag.push(tile);
    }

    return letter_bag;
}

// tõmbab sõnakotist ühe sõna ja eeemaldab selle kotist
function draw_tile(letter_bag: letterTile[]): [letterTile, letterTile[]] {
    let random = Math.floor(Math.random() * letter_bag.length);
    let tile = letter_bag[random];
    letter_bag.splice(random, 1);
    return [tile, letter_bag];
}

export function draw_tiles(letter_bag: letterTile[], amount: number): [letterTile[], letterTile[]]{
    let tiles: letterTile[] = [];
    for (let i = 0; i < amount; i++) {
        let [tile, new_bag] = draw_tile(letter_bag);
        tiles.push(tile);
        letter_bag = new_bag;
    }
    return [tiles, letter_bag];
}