// dawg algoritmi implementerrimine saadud siit: https://github.com/OlgaP21/scrabble-like-game-est/blob/main/public/logic/algorithm.mjs

import { getAllsquareContext, hassquareContext, setsquareContextPoints } from "./context";
import type { boardTile, letterTile } from "../types/tiles";
import { board, getBoard, getPointsBoard, setPointsBoard, getVanadRuudud } from '$lib/board';
import { wordlistStore } from './wordList';
import { get } from 'svelte/store';
import { dictionary } from "./dawg";
import { type AITrie } from "./dawg";
import { gameInfo } from '$lib/game_type';

const käigud = new Map;
let mitmes_käik = 1;

export function setKäigud(value: string[]) {
    käigud.set(mitmes_käik++, value);
}

export function getKäigud(key: number) {
    return käigud.get(key);
}

export function hasKäigud(key: number) {
    return käigud.has(key);
}   

export function getAllKäigud() {
    return käigud;
}

let allPoints: number = 0;
let pointsboard: number[][] = getPointsBoard();
let pointsboardUus = structuredClone(pointsboard);

let sõnad_x: string[] = []
let uuesõna_algus_x: number[][] = []
let sõnad_y: string[] = []
let uuesõna_algus_y: number[][] = []

export function getPoints(): number {
    return allPoints;
}

function getTempBoard() {
  let temp_board: letterTile[][] = Array.from({ length: 15 }, () => Array(15).fill(null));
  getAllsquareContext().forEach((value, key) => {
      let coord_x = key % 15;
      let coord_y = Math.floor(key / 15);
      temp_board[coord_y][coord_x] = value;
  });
    return temp_board;
}

// paneme uued punktiväärtused lauale
function setPoints(pointsboardUus: number[][]) {
    pointsboard = pointsboardUus;
    setPointsBoard(pointsboard);


    pointsboard.forEach((row, row_idx) => {
        row.forEach((tile, tile_idx) => {
            if (tile !== null) {
                let pointValue = pointsboard[row_idx][tile_idx]
                let id = row_idx * 15 + tile_idx
                if (hassquareContext(id)) {
                    setsquareContextPoints(id, pointValue)
                }
            }
        })
    })
}



function isLineX(uuedRuudud: number[][]): boolean {
    
    // https://stackoverflow.com/questions/74984461/how-to-check-array-have-same-values-in-typescript

    const secondValue = uuedRuudud[0][1]; // kas y-telg on sama
    const isSameTwo = uuedRuudud.every((y) => y[1] === secondValue);

    return isSameTwo;
}

function isLineY(uuedRuudud: number[][]): boolean {
    
    // https://stackoverflow.com/questions/74984461/how-to-check-array-have-same-values-in-typescript
    const firstValue = uuedRuudud[0][0]; // kas x-telg on sama
    const isSameOne = uuedRuudud.every((x) => x[0] === firstValue);

    return isSameOne;
}

function InVanadruudud(x: number, y: number): boolean {
    let vanadRuudud: number[][] = getVanadRuudud()
    return vanadRuudud.some((ruut) => {
        return ruut[0] === x && ruut[1] === y
    })
}

function inUuedruudud(x: number, y: number, uuedRuudud: number[][]): boolean {
    return uuedRuudud.some((ruut) => {
        return ruut[0] === x && ruut[1] === y
    })
}

function getKäik(letters: letterTile[]){
    // genereerime tähtede laua
    let letterBoard: letterTile[][] = getBoard()

    function getLetter(x: number, y: number, letterBoard: letterTile[][]): string | null {
        if (letterBoard[x][y] !== null) {
            return letterBoard[x][y].letter
        } else {
            return null
        }

    }

    // sõne ümberpööramiseks
    function reverse(sõna: string): string {
        return sõna.split("").reverse().join("");
    }

    // vasaku poole sõna saamiseks
    function getLeftWord(x: number, y: number): string {

        let word = "";
        for (let i = x; i >= 0; i--) {
            if (letterBoard[i][y] !== null) {
                word += letterBoard[i][y].letter
            } else {
                return reverse(word)
            }
        }

        return word
    }

    // parema poole sõna saamiseks
    function getRightWord(x: number, y: number): string {

        let word = "";
        for (let i = x; i < 15; i++) {
            if (letterBoard[i][y] !== null) {
                word += letterBoard[i][y].letter
            } else {
                return word
            }
        }

        return word
    }

    // ülemise sõna saamiseks
    function getUpWord(x: number, y: number): string {

        let word = "";
        for (let i = y; i >= 0; i--) {
            if (letterBoard[x][i] !== null) {
                word += letterBoard[x][i].letter
            } else {
                return reverse(word)
            }
        }

        return word
    }

    // alumise sõna saamiseks
    function getDownWord(x: number, y: number): string {      
        let word = "";
        for (let i = y; i < 15; i++) {
            if (letterBoard[x][i] !== null) {
                word += letterBoard[x][i].letter
            } else {
                return word
                }
        }
        return word
    }


    // punktide arvutamine

    function getPoint(x: number, y: number, uuedRuudud: number[][], letterBoard: letterTile[][], pointsboardUus: number[][]): [number, number[][]] {
        if (letterBoard[x][y] !== null) {
            let tile = letterBoard[x][y]
            if (inUuedruudud(x, y, uuedRuudud)) {
                let [mult, type] = getMult(x, y)
                if (type === 'letter') {
                    pointsboardUus[x][y] = tile.points * mult
                    return [tile.points * mult, pointsboardUus]
                } else {
                    pointsboardUus[x][y] = tile.points
                    return [tile.points, pointsboardUus]
                } 
            } else {
                return [tile.points, pointsboardUus]
            }
        } else {
            return [0, pointsboardUus]
        }
    }

    function getMult(x: number, y: number): [number, string] {
        let mult = board[x][y].multipliyer
        let type = board[x][y].type
        if (mult === 1) {
            return [1, '']
        } else {
            return [mult, type]
        }
    }

    function getLeftPoints(x: number, y: number, uuedRuudud: number[][], letterBoard: letterTile[][], pointsboardUus: number[][]): [number, number[][]] {
        let point = 0;
        for (let i = x; i >= 0; i--) {
            if (pointsboardUus[i][y] !== null) {
                let points = getPoint(i, y, uuedRuudud, letterBoard, pointsboardUus)
                pointsboardUus = points[1]
                point += points[0]
            } else {
                break;
            }
        }
        return [point, pointsboardUus]
    }

    function getRightPoints(x: number, y: number, uuedRuudud: number[][], letterBoard: letterTile[][], pointsboardUus: number[][]): [number, number[][]] {
        let point = 0;
        for (let i = x; i < 15; i++) {
            if (pointsboardUus[i][y] !== null) {
                let points = getPoint(i, y, uuedRuudud, letterBoard, pointsboardUus)
                pointsboardUus = points[1]
                point += points[0]
            } else {
                break;
            }
        }
        return [point, pointsboardUus]
    }

    function getUpPoints(x: number, y: number, uuedRuudud: number[][], letterBoard: letterTile[][], pointsboardUus: number[][]): [number, number[][]] {
        let point = 0;
        for (let i = y; i >= 0; i--) {
            if (pointsboardUus[x][i] !== null) {
                let points = getPoint(i, y, uuedRuudud, letterBoard, pointsboardUus)
                pointsboardUus = points[1]
                point += points[0]
            } else {
                break;
            }
        }
        return [point, pointsboardUus]
    }

    function getDownPoints(x: number, y: number, uuedRuudud: number[][], letterBoard: letterTile[][], pointsboardUus: number[][]): [number, number[][]] {
        let point = 0;
        for (let i = y; i < 15; i++) {
            if (pointsboardUus[x][i] !== null) {
                let points = getPoint(i, y, uuedRuudud, letterBoard, pointsboardUus)
                pointsboardUus = points[1]
                point += points[0]
            } else {
                break;
            }
        }
        return [point, pointsboardUus]
    }

    function updatePointsboard(x: number, y: number, mult: number, axis: string, pointsboardUus: number[][]) {
        if (axis === 'x') {
            for (let i = x; i < 15; i++) {
                if (pointsboardUus[i][y] !== null) {
                    pointsboardUus[i][y] *= mult
                } else {
                    break;
                }
            }
            for (let i = x - 1; i >= 0; i--) {
                if (pointsboardUus[i][y] !== null) {
                    pointsboardUus[i][y] *= mult
                } else {
                    break;
                }
            }
        } else if (axis === 'y') {
            for (let i = y; i < 15; i++) {
                if (pointsboardUus[x][i] !== null) {
                    pointsboardUus[x][i] *= mult
                } else {
                    break;
                }
            }
            for (let i = y - 1; i >= 0; i--) {
                if (pointsboardUus[x][i] !== null) {
                    pointsboardUus[x][i] *= mult
                } else {
                    break;
                }
            }
        }
        return pointsboardUus
    }

    function checkHand(letter: string, letters: letterTile[]): number {
        for (let i = 0; i < letters.length; i++) {
            if (letters[i].letter === letter) {
                return i
            }
        }
        return -1
    }
    function checkJoker(letters: letterTile[]): number {
        for (let i = 0; i < letters.length; i++) {
            let str: string = letters[i].letter
            if (letters[i].letter === '?' || str === str.toLowerCase()) {
                return i
            }
        }
        return -1
    }

    //algorithm
    // vaatame läbi kõik x telje ruudud
        // kui ruut on olemas
            // lähme vasakule 
            // anna pragesuse sõna edasi paremale
                // kui uus täht on vana üleval/all
                    // leiame ülesse sõna
                    // leiame alla sõna
                    // kontrollime kas sõna on olemas
    // käime olemasolevad kõik ruudud läbi
    // vaatame igasse suunda
    
    // info = [uuedruudud, sõnad, punktid]
    function getRight(word: string, letters: letterTile[], x: number, y: number, node: AITrie['root']['children'][string], start: [number, number]) {
        //console.log(node, word, letters, x, y)
        //console.log(x, y, test++)
        // piiridest väljas
        if (x === 15 || x === -1) {
            return
        }
        // käsi on tühi
        if (letters.length === 0 || node.isEnd) {

            let right_word = getRightWord(x + 1, y)
            if (right_word.length) {
                //console.log(word, right_word, x, y)
                word += right_word
                
                if (checkWord(word)) {
                    uuesõna_algus_x.push(start)
                    sõnad_x.push(word)
                }
            } else {
                //console.log(word, x, y)
                uuesõna_algus_x.push(start)
                sõnad_x.push(word)
            }
            return
        }
        else {
            if (letterBoard[x+1][y] !== null) {
                //console.log(letterBoard[x+1][y].letter, x, y)

                let letter = letterBoard[x+1][y].letter
                let new_word = word + letter

                if (letter in node.children) {
                    getRight(new_word, letters, x + 1, y, node.children[letter], start)
                } else {
                    return
                }  

            } else {
                //if (word.length === 1) {
                //    info[0].push(word)
                //}
                for (let letter in node.children) {
                    // kui järgmine ruut on olemas
                    let index = checkHand(letter, letters)
                    // kui ruut on tühi
                    if (index !== -1) {
                        let hand_letter = letters[index]
                        let new_letters = letters.filter(item => item !== hand_letter)
                        let new_word = word + letter
                        
                        //let new_info = structuredClone(info)
                        //new_info[0].push(letter)
                        getRight(new_word, new_letters, x + 1, y, node.children[letter.toUpperCase()], start)

                    } else if (checkJoker(letters) !== -1) { // kui jokker
                        let joker = letters[checkJoker(letters)]
                        let new_letters = letters.filter(item => item !== joker)
                        
                        let new_word = word + letter.toLowerCase()
                            
                        //let new_info = structuredClone(info)
                        //new_info[0].push(letter)
                        getRight(new_word, new_letters, x + 1, y, node.children[letter.toUpperCase()], start)
                    }
                }
            }
        }
    }

    // mine vasakule ja hakka sõna looma
    function goLeft(täht: string, letters: letterTile[], x: number, y: number, node: AITrie['root']['children'][string], limit: number, og_x: number) {
        if (x === 15 || x === -1) {
            return
        }
        // lähme kohe paremale
        getRight(täht, letters, x, y, node.children[täht.toUpperCase()], [x, y])
        
        if (limit > 0) {
            for (let letter in node.children) {
                let index = checkHand(letter, letters)
                if (index !== -1) {
                    let hand_letter = letters[index]
                    let new_letters = letters.filter(item => item !== hand_letter)
                    goLeft(letter, new_letters, x - 1, y, node, limit - 1, og_x)
                    
                }
                else if (checkJoker(letters) !== -1) { // kui jokker
                    let joker = letters[checkJoker(letters)]
                    let new_letters = letters.filter(item => item !== joker)
                    // lähme vasakule, kus uut sõna alustadakse antud tähest
                    goLeft(letter.toLowerCase(), new_letters, x - 1, y, node, limit - 1, og_x)
                }
            }
        }
    }

    // info = [uuedruudud, sõnad, punktid]
    function getDown(word: string, letters: letterTile[], x: number, y: number, node: AITrie['root']['children'][string], start: [number, number]) {
        //console.log(node, word, letters, x, y)
        //console.log(x, y, test++)
        // piiridest väljas
        if (y === 15 || y === -1) {
            return
        }
        // käsi on tühi
        if (letters.length === 0 || node.isEnd) {

            let up_word = getUpWord(x, y + 1)
            if (up_word.length) {
                //console.log(word, right_word, x, y)
                word += up_word
                
                if (checkWord(word)) {
                    uuesõna_algus_y.push(start)
                    sõnad_y.push(word)
                }
            } else {
                //console.log(word, x, y)
                uuesõna_algus_y.push(start)
                sõnad_y.push(word)
            }
            return
        }
        else {
            if (letterBoard[x][y+1] !== null) {
                //console.log(letterBoard[x+1][y].letter, x, y)

                let letter = letterBoard[x][y+1].letter
                let new_word = word + letter

                if (letter in node.children) {
                    getRight(new_word, letters, x, y + 1, node.children[letter], start)
                } else {
                    return
                }  

            } else {
                //if (word.length === 1) {
                //    info[0].push(word)
                //}
                for (let letter in node.children) {
                    // kui järgmine ruut on olemas
                    let index = checkHand(letter, letters)
                    // kui ruut on tühi
                    if (index !== -1) {
                        let hand_letter = letters[index]
                        let new_letters = letters.filter(item => item !== hand_letter)
                        let new_word = word + letter
                        
                        //let new_info = structuredClone(info)
                        //new_info[0].push(letter)
                        getDown(new_word, new_letters, x, y + 1, node.children[letter.toUpperCase()], start)

                    } else if (checkJoker(letters) !== -1) { // kui jokker
                        let joker = letters[checkJoker(letters)]
                        let new_letters = letters.filter(item => item !== joker)
                        
                        let new_word = word + letter.toLowerCase()
                            
                        //let new_info = structuredClone(info)
                        //new_info[0].push(letter)
                        getDown(new_word, new_letters, x, y + 1, node.children[letter.toUpperCase()], start)
                    }
                }
            }
        }
    }

    // mine vasakule ja hakka sõna looma
    function goUp(täht: string, letters: letterTile[], x: number, y: number, node: AITrie['root']['children'][string], limit: number, og_x: number) {
        if (x === 15 || x === -1) {
            return
        }
        // lähme kohe paremale
        getDown(täht, letters, x, y, node.children[täht.toUpperCase()], [x, y])
        
        if (limit > 0) {
            for (let letter in node.children) {
                let index = checkHand(letter, letters)
                if (index !== -1) {
                    let hand_letter = letters[index]
                    let new_letters = letters.filter(item => item !== hand_letter)
                    goUp(letter, new_letters, x, y - 1, node, limit - 1, og_x)
                    
                }
                else if (checkJoker(letters) !== -1) { // kui jokker
                    let joker = letters[checkJoker(letters)]
                    let new_letters = letters.filter(item => item !== joker)
                    // lähme vasakule, kus uut sõna alustadakse antud tähest
                    goUp(letter.toLowerCase(), new_letters, x, y - 1, node, limit - 1, og_x)
                }
            }
        }
    }

    console.log(letters)
    for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
            if (letterBoard[x][y] !== null && letterBoard[x-1][y] === null) {
                let letter = letterBoard[x][y].letter

                goLeft(letter, letters, x, y, dictionary.root, 7, x)
                goUp(letter, letters, x, y, dictionary.root, 7, x)              
            }
        }
    }

    function genLetter(letter: string): letterTile | null {
        // leia kottist täht
        let index = checkHand(letter, letters)
        if (index !== -1) {
            return letters[index]
        } else {
            let id = checkJoker(letters)
            if (id === -1) {
                return null
            }
            let joker = letters[id]
            joker.letter = letter
            return joker
        }

    }

    function getLetterTiles(ruudud_ccord: number[][], board: letterTile[][]): letterTile[] {
        let uuedruudud: letterTile[] = []
        ruudud_ccord.forEach((ruut) => {
            let x = ruut[0]
            let y = ruut[1]
            if (board[x][y] !== null) {
                uuedruudud.push(board[x][y])
            }
        })
        return uuedruudud
    }

    // asetab uued tähed lauale ja leiab nende puntkid
    function getPoints_x() {
        let info: any = []
        sõnad_x.forEach((word, i) => {
            function legalWord(): [letterTile[][], number[][]] | [] {
                let hand = letters
                let clone = getTempBoard()
                

                let uuedRuudud: number[][] = []
                let connected = false;
        
                let start = uuesõna_algus_x[i];
                let x = start[0];
                let y = start[1];
                word.split('').forEach((letter, j) => {
                    if (clone[x][y] === null) {
                        let letterTile = genLetter(letter)
                        hand = hand.filter(item => item !== letterTile)

                        uuedRuudud.push([x, y])
                        if (letterTile !== null) {
                            clone[x][y] = letterTile
                        }

                    }
                    x++ // liigume paremale
                })
                
                clone.forEach((row, row_idx) => {
                    row.forEach((tile, tile_idx) => {
                        if (tile !== null) {
                            if (!InVanadruudud(row_idx, tile_idx)) {
                                // kas on ühendatud ülevalt
                                if (InVanadruudud(row_idx, tile_idx - 1)) {
                                    connected = true;
                                }
                                // kas on ühendatud alt
                                if (InVanadruudud(row_idx, tile_idx + 1)) {
                                    connected = true;
                                }
                                // kas on ühendatud vasakult
                                if (InVanadruudud(row_idx - 1, tile_idx)) {
                                    connected = true;
                                }
                                // kas on ühendatud paremalt
                                if (InVanadruudud(row_idx + 1, tile_idx)) {
                                    connected = true;
                                }    
                            }
                        }
                    })
                })
            
                if (!connected) {
                    return[]
                }
                
                return [clone, uuedRuudud]

            }

            let result = legalWord()
            if (result.length !== 0) {
                let [newBoard, uuedRuudud] = result
                let pointsBoardClone = structuredClone(pointsboardUus)
                let current_words: string[] = []
                let current_points: number = 0

                let wordMult = 1;

                let x_min = uuedRuudud[0][0];
                let x_max = uuedRuudud[uuedRuudud.length - 1][0];
                let y = uuedRuudud[0][1];
                for (let i = x_min; i <= x_max; i++) {
                    let tile = getLetter(i, y, newBoard);

                    // sõna korrutaja
                    let [mult, type] = getMult(i, y)
                    if (type === 'word') {
                        wordMult *= mult
                    }

                    if (tile === null) {
                        console.log("null")
                        // tagastame tühja massiivi, kuna uute ruutudega ei saa sõna moodustada
                        return [];
                    }
                }

                // saame punktid ja vaatame kas üleval või all on sõnad

                //kui ainult 
                if (uuedRuudud.length === 1) {
                    
                    let x = uuedRuudud[0][0];
                    let y = uuedRuudud[0][1];

                    //console.log(uuedRuudud, newBoard[x][y].letter)
                    let yWord = getLetter(x, y, newBoard);
            
                    let xPoints = getPoint(x, y, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = xPoints[1]
                    let yPoints = getPoint(x, y, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = yPoints[1]
            
                    let multipliyer = getMult(x, y)
            
                    let upWord = getUpWord(x, y - 1);
                    let downWord = getDownWord(x, y + 1);
                    let leftWord = getLeftWord(x - 1, y);
                    let rightWord = getRightWord(x + 1, y);
            
                    let upPoints = getUpPoints(x, y - 1, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = upPoints[1]
                    let downPoints = getDownPoints(x, y + 1, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = downPoints[1]
                    let leftPoints = getLeftPoints(x - 1, y, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = leftPoints[1]
                    let rightPoints = getRightPoints(x + 1, y, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = rightPoints[1]
            
                    if (upWord.length) {
                        yWord = upWord + yWord;
                        yPoints[0] += upPoints[0];
                    }
                    if (downWord.length) {
                        yWord += downWord;
                        yPoints[0] += downPoints[0];
                    }
                    if (yWord !== null && yWord.length !== 1 && checkWord(yWord)) {
                        
                        if (multipliyer[1] === 'word') {
                            current_points += yPoints[0] * multipliyer[0];
                            pointsBoardClone = updatePointsboard(x, y, multipliyer[0], 'y', pointsBoardClone)
                        } else {
                            current_points += yPoints[0];
                        }
                        current_words.push(yWord)
                    }
            
                    if (leftWord.length) {
                        xPoints[0] += leftPoints[0];
                    }
                    if (rightWord.length) {
                        xPoints[0] += rightPoints[0];
                    }
                    if (multipliyer[1] === 'word') {
                        current_points += xPoints[0] * multipliyer[0];
                        pointsBoardClone = updatePointsboard(x, y, multipliyer[0], 'x', pointsBoardClone)
                    } else {
                        current_points += xPoints[0];
                    }
                    current_words.push(word)
                    info.push([newBoard, pointsBoardClone, current_words, current_points])
                    //console.log(info, "info 1")
                } else {
                    uuedRuudud.forEach((tile) => {
                        let x = tile[0];
                        let y = tile[1];

                        let sõna_punktid = 0;
                        let wordpunktid = getPoint(x, y, uuedRuudud, newBoard, pointsBoardClone);
                        sõna_punktid += wordpunktid[0]
                        pointsBoardClone = wordpunktid[1]
                        // kui esimene vaatame kas enne ruutu on täht
                        if (tile === uuedRuudud[0]) {
                            let left = getLetter(x - 1, y, newBoard);
                            let word = getLetter(x, y, newBoard);
                            if (left !== null) {
                                word = getLeftWord(x - 1, y) + word;
                                wordpunktid = getLeftPoints(x - 1, y, uuedRuudud, newBoard, pointsBoardClone);
                                sõna_punktid += wordpunktid[0]
                                pointsBoardClone = wordpunktid[1]
                                
                            }
                            let rigthWord = getRightWord(x + 1, y);
                            if (rigthWord.length) {
                                word += rigthWord
                                wordpunktid = getRightPoints(x + 1, y, uuedRuudud, newBoard, pointsBoardClone);
                                sõna_punktid += wordpunktid[0]
                                pointsBoardClone = wordpunktid[1]
                            }
                            if (word !== null) {
                                current_points = sõna_punktid * wordMult;
                                pointsBoardClone = updatePointsboard(x, y, wordMult, 'x', pointsBoardClone)
                                current_words.push(word)
                            }
                        }


                        // igal juhul vaatame ülesse ja alla kas on täht
                        let up = getLetter(x, y - 1, newBoard);
                        let down = getLetter(x, y + 1, newBoard);

                        let upPoints = getUpPoints(x, y - 1, uuedRuudud, newBoard, pointsBoardClone);
                        pointsBoardClone = upPoints[1]
                        let downPoints = getDownPoints(x, y + 1, uuedRuudud, newBoard, pointsBoardClone);
                        pointsBoardClone = downPoints[1]
                        let multipliyer = getMult(x, y)

                        let word = getLetter(x, y, newBoard);
                        if (word !== null) {
                            if (up !== null) {
                                //connected = true;
                                word = getUpWord(x, y - 1) + word;
                                sõna_punktid += upPoints[0];
                            } 
                            if (down !== null) {
                                //connected = true;
                                word += getDownWord(x, y + 1);
                                sõna_punktid += downPoints[0];
                            }
                            if (word.length !== 1) {
                                if (multipliyer[1] === 'word') {
                                    current_points += sõna_punktid * multipliyer[0];
                                    pointsBoardClone = updatePointsboard(x, y, multipliyer[0], 'y', pointsBoardClone)
                                } else {
                                    current_points += sõna_punktid;
                                }
                                current_words.push(word)
                            }
                        }

                    });
                    info.push([newBoard, pointsBoardClone, current_words, current_points])
                    //console.log(info, "info 2")  
                }
            }
        });
        return info
    }

    function getPoints_y() {
        let info: any = []
        sõnad_y.forEach((word, i) => {
            function legalWord(): [letterTile[][], number[][]] | [] {
                let hand = letters
                let clone = getTempBoard()
                

                let uuedRuudud: number[][] = []
                let connected = false;
        
                let start = uuesõna_algus_y[i]
                let x = start[0];
                let y = start[1];
                word.split('').forEach((letter, j) => {
                    if (clone[x][y] === null) {
                        let letterTile = genLetter(letter)
                        hand = hand.filter(item => item !== letterTile)

                        uuedRuudud.push([x, y])
                        if (letterTile !== null) {
                            clone[x][y] = letterTile
                        }

                    }
                    y++ // liigume paremale
                })
                
                clone.forEach((row, row_idx) => {
                    row.forEach((tile, tile_idx) => {
                        if (tile !== null) {
                            if (!InVanadruudud(row_idx, tile_idx)) {
                                // kas on ühendatud ülevalt
                                if (InVanadruudud(row_idx, tile_idx - 1)) {
                                    connected = true;
                                }
                                // kas on ühendatud alt
                                if (InVanadruudud(row_idx, tile_idx + 1)) {
                                    connected = true;
                                }
                                // kas on ühendatud vasakult
                                if (InVanadruudud(row_idx - 1, tile_idx)) {
                                    connected = true;
                                }
                                // kas on ühendatud paremalt
                                if (InVanadruudud(row_idx + 1, tile_idx)) {
                                    connected = true;
                                }    
                            }
                        }
                    })
                })
            
                if (!connected) {
                    return[]
                }
                
                return [clone, uuedRuudud]

            }

            let result = legalWord()
            if (result.length !== 0) {
                let [newBoard, uuedRuudud] = result
                let pointsBoardClone = structuredClone(pointsboardUus)
                let current_words: string[] = []
                let current_points: number = 0

                let wordMult = 1;

                let y_min = uuedRuudud[0][1];
                let y_max = uuedRuudud[uuedRuudud.length - 1][1];
                let x = uuedRuudud[0][0];
                for (let i = y_min; i <= y_max; i++) {
                    let tile = getLetter(x, i, newBoard);

                    // sõna korrutaja
                    let [mult, type] = getMult(x, i)
                    if (type === 'word') {
                        wordMult *= mult
                    }

                    if (tile === null) {
                        console.log("null")
                        // tagastame tühja massiivi, kuna uute ruutudega ei saa sõna moodustada
                        return [];
                    }
                }

                // saame punktid ja vaatame kas üleval või all on sõnad

                //kui ainult 
                if (uuedRuudud.length === 1) {
                    
                    let x = uuedRuudud[0][0];
                    let y = uuedRuudud[0][1];

                    //console.log(uuedRuudud, newBoard[x][y].letter)
                    let xWord = getLetter(x, y, newBoard);
            
                    let xPoints = getPoint(x, y, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = xPoints[1]
                    let yPoints = getPoint(x, y, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = yPoints[1]
            
                    let multipliyer = getMult(x, y)
            
                    let upWord = getUpWord(x, y - 1);
                    let downWord = getDownWord(x, y + 1);
                    let leftWord = getLeftWord(x - 1, y);
                    let rightWord = getRightWord(x + 1, y);
            
                    let upPoints = getUpPoints(x, y - 1, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = upPoints[1]
                    let downPoints = getDownPoints(x, y + 1, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = downPoints[1]
                    let leftPoints = getLeftPoints(x - 1, y, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = leftPoints[1]
                    let rightPoints = getRightPoints(x + 1, y, uuedRuudud, newBoard, pointsBoardClone);
                    pointsBoardClone = rightPoints[1]
            
                    if (leftWord.length) {
                        xWord = leftWord + xWord;
                        yPoints[0] += upPoints[0];
                    }
                    if (rightWord.length) {
                        xWord += rightWord;
                        yPoints[0] += downPoints[0];
                    }
                    if (xWord !== null && xWord.length !== 1 && checkWord(xWord)) {
                        
                        if (multipliyer[1] === 'word') {
                            current_points += xPoints[0] * multipliyer[0];
                            pointsBoardClone = updatePointsboard(x, y, multipliyer[0], 'x', pointsBoardClone)
                        } else {
                            current_points += xPoints[0];
                        }
                        current_words.push(xWord)
                    }
            
                    if (upWord.length) {
                        yPoints[0] += upPoints[0];
                    }
                    if (downWord.length) {
                        yPoints[0] += downPoints[0];
                    }
                    if (multipliyer[1] === 'word') {
                        current_points += yPoints[0] * multipliyer[0];
                        pointsBoardClone = updatePointsboard(x, y, multipliyer[0], 'y', pointsBoardClone)
                    } else {
                        current_points += yPoints[0];
                    }
                    current_words.push(word)
                    info.push([newBoard, pointsBoardClone, current_words, current_points])
                    //console.log(info, "info 1")
                } else {
                    uuedRuudud.forEach((tile) => {
                        let x = tile[0];
                        let y = tile[1];

                        let sõna_punktid = 0;
                        let wordpunktid = getPoint(x, y, uuedRuudud, newBoard, pointsBoardClone);
                        sõna_punktid += wordpunktid[0]
                        pointsBoardClone = wordpunktid[1]
                        // kui esimene vaatame kas enne ruutu on täht
                        if (tile === uuedRuudud[0]) {
                            let up = getLetter(x, y - 1, newBoard);
                            let word = getLetter(x, y, newBoard);
                            if (up !== null) {
                                word = getUpWord(x, y - 1) + word;
                                wordpunktid = getUpPoints(x, y - 1, uuedRuudud, newBoard, pointsBoardClone);
                                sõna_punktid += wordpunktid[0]
                                pointsBoardClone = wordpunktid[1]
                                
                            }
                            let downWord = getDownWord(x, y + 1);
                            if (downWord.length) {
                                word += downWord
                                wordpunktid = getDownPoints(x, y + 1, uuedRuudud, newBoard, pointsBoardClone);
                                sõna_punktid += wordpunktid[0]
                                pointsBoardClone = wordpunktid[1]
                            }
                            if (word !== null) {
                                current_points = sõna_punktid * wordMult;
                                pointsBoardClone = updatePointsboard(x, y, wordMult, 'x', pointsBoardClone)
                                current_words.push(word)
                            }
                        }


                        // igal juhul vaatame kõrvale kas on täht
                        let left = getLetter(x - 1, y, newBoard);
                        let right = getLetter(x + 1, y, newBoard);

                        let leftPoints = getLeftPoints(x - 1, y, uuedRuudud, newBoard, pointsBoardClone);
                        pointsBoardClone = leftPoints[1]
                        let rightPoints = getRightPoints(x + 1, y, uuedRuudud, newBoard, pointsBoardClone);
                        pointsBoardClone = rightPoints[1]
                        let multipliyer = getMult(x, y)

                        let word = getLetter(x, y, newBoard);
                        if (word !== null) {
                            if (left !== null) {
                                //connected = true;
                                word = getLeftWord(x, y - 1) + word;
                                sõna_punktid += leftPoints[0];
                            } 
                            if (right !== null) {
                                //connected = true;
                                word += getRightWord(x, y + 1);
                                sõna_punktid += rightPoints[0];
                            }
                            if (word.length !== 1) {
                                if (multipliyer[1] === 'word') {
                                    current_points += sõna_punktid * multipliyer[0];
                                    pointsBoardClone = updatePointsboard(x, y, multipliyer[0], 'x', pointsBoardClone)
                                } else {
                                    current_points += sõna_punktid;
                                }
                                current_words.push(word)
                            }
                        }

                    });
                    info.push([newBoard, pointsBoardClone, current_words, current_points])
                    //console.log(info, "info 2")  
                }
            }
        });
        return info
    }

    // getpoints
    let info = getPoints_x()
    info = info.concat(getPoints_y())
    // getinfo_y
    return info
}





function checkWord(word: string): boolean {
    word = word.toLowerCase();
    // kontrollime kas sõna on olemas
    let wordlist = get(wordlistStore).sõnastik;
    
    if (wordlist.includes(word)) {
        return true;
    }
    return false;
}

export function AIKäik(letters: letterTile[]): boolean | [letterTile[][], string[], number] {
    pointsboard = getPointsBoard();

    const start = new Date().getTime();
    let info = getKäik(letters)
    console.log(info, "info")

    let elapsed = new Date().getTime() - start;
    console.log('Execution time: ' + elapsed/1000 + 's');

    let game = get(gameInfo);
    let max = 0;
    let newBoard: letterTile[][] = [];
    let sõnad: string[] = []

    if (game.difficulty === "Kerge") {
        // võta esimene
        let [i_newBoard, i_pointsBoardClone, i_sõnad, i_points] = info[0]
        max = i_points;
        newBoard = i_newBoard;
        pointsboardUus = i_pointsBoardClone;
        sõnad = i_sõnad;

    } else if (game.difficulty === "Keskmine") {
        // võta juhuslik
        const random = Math.floor(Math.random() * info.length);
        let [i_newBoard, i_pointsBoardClone, i_sõnad, i_points] = info[random]
        max = i_points;
        newBoard = i_newBoard;
        pointsboardUus = i_pointsBoardClone;
        sõnad = i_sõnad;

    } else {
        // võta parim
        info.forEach((i: any, index: number) => {
            let [i_newBoard, i_pointsBoardClone, i_sõnad, i_points] = i
            console.log(i_points)
            if (i_points > max) {
                max = i_points;
                newBoard = i_newBoard;
                pointsboardUus = i_pointsBoardClone;
                sõnad = i_sõnad;
            }
        })
    }

    
    

    
    setPoints(pointsboardUus); //muuda hiljem

    console.log(pointsboardUus)

   return [newBoard, sõnad, max];
}