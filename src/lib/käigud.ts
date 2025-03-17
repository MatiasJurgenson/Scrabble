import { getAllsquareContext, hassquareContext, setsquareContextPoints } from "./context";
import type { boardTile, letterTile } from "../types/tiles";
import { board } from '$lib/board.js';
import { getWords } from './wordList';

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

let vanadRuudud: number[][] = [];
let uuedRuudud: number[][] = [];
let allPoints: number = 0;
let roundPoints: number = 0;
let pointsboard: number[][] = Array.from({ length: 15 }, () => Array(15).fill(null));
let pointsboardUus = structuredClone(pointsboard);
let uuedPunktid = new Map;

export function getPoints(): number {
    return allPoints;
}

// paneme uued punktiväärtused lauale
function setPoints() {
    pointsboard = pointsboardUus;

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

function getBoard() {
    let letter_board: letterTile[][] = Array.from({ length: 15 }, () => Array(15).fill(null));
    getAllsquareContext().forEach((value, key) => {
        let coord_x = key % 15;
        let coord_y = Math.floor(key / 15);
        letter_board[coord_y][coord_x] = value;
        pointsboard[coord_y][coord_x] = value.points;
    });

    return letter_board;
}

function isLineX(): boolean {
    
    // https://stackoverflow.com/questions/74984461/how-to-check-array-have-same-values-in-typescript

    const secondValue = uuedRuudud[0][1]; // kas y-telg on sama
    const isSameTwo = uuedRuudud.every((y) => y[1] === secondValue);

    return isSameTwo;
}

function isLineY(): boolean {
    
    // https://stackoverflow.com/questions/74984461/how-to-check-array-have-same-values-in-typescript
    const firstValue = uuedRuudud[0][0]; // kas x-telg on sama
    const isSameOne = uuedRuudud.every((x) => x[0] === firstValue);

    return isSameOne;
}

function InVanadruudud(x: number, y: number): boolean {
    return vanadRuudud.some((ruut) => {
        return ruut[0] === x && ruut[1] === y
    })
}

function inUuedruudud(x: number, y: number): boolean {
    return uuedRuudud.some((ruut) => {
        return ruut[0] === x && ruut[1] === y
    })
}

function getKäik(): string[]{
    
    let sõnad: string[] = [];

    // genereerime tähtede laua
    let letterBoard: letterTile[][] = getBoard()

    let connected = false;

    // vaatame mis on uued tähed
    letterBoard.forEach((row, row_idx) => {
        row.forEach((tile, tile_idx) => {
            if (tile !== null) {
                if (!InVanadruudud(row_idx, tile_idx)) {
                    uuedRuudud.push([row_idx, tile_idx])
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

    if (!connected && vanadRuudud.length !== 0) {
        return [];
    }
    // vaatame kas ruut on laual
    function getLetter(x: number, y: number): string | null {
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

    function getPoint(x: number, y: number): number {
        if (letterBoard[x][y] !== null) {
            let tile = letterBoard[x][y]
            if (inUuedruudud(x, y)) {
                let [mult, type] = getMult(x, y)
                if (type === 'letter') {
                    pointsboardUus[x][y] = tile.points * mult
                    return tile.points * mult
                } else {
                    pointsboardUus[x][y] = tile.points * mult
                    return tile.points
                } 
            } else {
                return tile.points
            }
        } else {
            return 0
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

    function getLeftPoints(x: number, y: number): number {
        let point = 0;
        for (let i = x; i >= 0; i--) {
            if (pointsboardUus[i][y] !== null) {
                point += getPoint(i, y)
            } else {
                break;
            }
        }
        return point
    }

    function getRightPoints(x: number, y: number): number {
        let point = 0;
        for (let i = x; i < 15; i++) {
            if (pointsboardUus[i][y] !== null) {
                point += getPoint(i, y)
            } else {
                break;
            }
        }
        return point
    }

    function getUpPoints(x: number, y: number): number {
        let point = 0;
        for (let i = y; i >= 0; i--) {
            if (pointsboardUus[x][i] !== null) {
                point += getPoint(x, i)
            } else {
                break;
            }
        }
        return point
    }

    function getDownPoints(x: number, y: number): number {
        let point = 0;
        for (let i = y; i < 15; i++) {
            if (pointsboardUus[x][i] !== null) {
                point += getPoint(x, i)
            } else {
                break;
            }
        }
        return point
    }

    function updatePointsboard(x: number, y: number, mult: number, axis: string) {
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
    }

    // uuendame punktide arvutamist
        // paneme uued punktid lauale
        // kui on 2/3x sõna siis korruta teljel järjest
    

    // kui lisati ainult üks täht
    if (uuedRuudud.length === 1) {
        let x = uuedRuudud[0][0];
        let y = uuedRuudud[0][1];
        let xWord = getLetter(x, y);
        let yWord = getLetter(x, y);

        let xPoints = getPoint(x, y);
        let yPoints = getPoint(x, y);

        let multipliyer = getMult(x, y)

        let upWord = getUpWord(x, y - 1);
        let downWord = getDownWord(x, y + 1);
        let leftWord = getLeftWord(x - 1, y);
        let rightWord = getRightWord(x + 1, y);

        let upPoints = getUpPoints(x, y - 1);
        let downPoints = getDownPoints(x, y + 1);
        let leftPoints = getLeftPoints(x - 1, y);
        let rightPoints = getRightPoints(x + 1, y);

        if (upWord.length) {
            yWord = upWord + yWord;
            yPoints += upPoints;
        }
        if (downWord.length) {
            yWord += downWord;
            yPoints += downPoints;
        }
        if (yWord !== null && yWord.length !== 1) {
            
            if (multipliyer[1] === 'word') {
                roundPoints += yPoints * multipliyer[0];
                updatePointsboard(x, y, multipliyer[0], 'y')
            } else {
                roundPoints += yPoints;
            }
            sõnad.push(yWord);
        }

        if (leftWord.length) {
            xWord = leftWord + xWord;
            xPoints += leftPoints;
        }
        if (rightWord.length) {
            xWord += rightWord;
            xPoints += rightPoints;
        }
        if (xWord !== null && xWord.length !== 1) {
            if (multipliyer[1] === 'word') {
                roundPoints += xPoints * multipliyer[0];
                updatePointsboard(x, y, multipliyer[0], 'x')
            } else {
                roundPoints += xPoints;
            }
            sõnad.push(xWord);
        }
    }
    // kui vanad tähed on reas
    else if (isLineX()) {
        console.log("x-telg")
        // lisa punkti arvutamine

        let wordMult = 1;

        let x_min = uuedRuudud[0][0];
        let x_max = uuedRuudud[uuedRuudud.length - 1][0];
        let y = uuedRuudud[0][1];
        for (let i = x_min; i <= x_max; i++) {
            let tile = getLetter(i, y);

            // sõna korrutaja
            let [mult, type] = getMult(i, y)
            if (type === 'word') {
                wordMult *= mult
            }

            if (tile === null) {
                // tagastame tühja massiivi, kuna uute ruutudega ei saa sõna moodustada
                return sõnad;
            }
        }

        if (!hasKäigud(1)) {
            let sõna: string = '';

            for (let i = x_min; i <= x_max; i++) {
                roundPoints += getPoint(i, y)
                sõna += getLetter(i, y);
            }
            sõnad.push(sõna);
            
            roundPoints *= wordMult;
            uuedPunktid.forEach((value, key) => {
                uuedPunktid.set(key, value * wordMult)
            })

            // kui esimene käik siis pole vaja kontrollida, kas ühendatud
            return sõnad;
        }

        // leiame ühendatud ruudud
        uuedRuudud.forEach((tile) => {
            let x = tile[0];
            let y = tile[1];
            let wordpunktid = getPoint(x, y);
            // kui esimene vaatame kas enne ruutu on täht
            if (tile === uuedRuudud[0]) {
                let left = getLetter(x - 1, y);
                let word = getLetter(x, y);
                if (left !== null) {
                    word = getLeftWord(x - 1, y) + word;
                    wordpunktid += getLeftPoints(x - 1, y);
                    
                }
                let rigthWord = getRightWord(x + 1, y);
                if (rigthWord.length) {
                    word += rigthWord
                    wordpunktid += getRightPoints(x + 1, y);
                }
                if (word !== null) {
                    roundPoints += wordpunktid * wordMult;
                    updatePointsboard(x, y, wordMult, 'x')
                    sõnad.push(word);
                }
            }


            // igal juhul vaatame ülesse ja alla kas on täht
            let up = getLetter(x, y - 1);
            let down = getLetter(x, y + 1);

            let upPoints = getUpPoints(x, y - 1);
            let downPoints = getDownPoints(x, y + 1);
            let multipliyer = getMult(x, y)

            let word = getLetter(x, y);
            if (word !== null) {
                if (up !== null) {
                    //connected = true;
                    word = getUpWord(x, y - 1) + word;
                    wordpunktid += upPoints;
                } 
                if (down !== null) {
                    //connected = true;
                    word += getDownWord(x, y + 1);
                    wordpunktid += downPoints;
                }
                if (word.length !== 1) {
                    if (multipliyer[1] === 'word') {
                        roundPoints += wordpunktid * multipliyer[0];
                        updatePointsboard(x, y, multipliyer[0], 'y')
                    } else {
                        roundPoints += wordpunktid;
                    }
                    sõnad.push(word);
                }
            }
        })
    } 
    
    else if (isLineY()) {
        // lisa punkti arvutamine
        console.log("y-telg")

        let wordMult = 1;

        let y_min = uuedRuudud[0][1];
        let y_max = uuedRuudud[uuedRuudud.length - 1][1];
        let x = uuedRuudud[0][0];
        for (let i = y_min; i <= y_max; i++) {
            let tile = getLetter(x, i);

            // sõna korrutaja
            let [mult, type] = getMult(x, i)
            if (type === 'word') {
                wordMult *= mult
            }
            if (tile === null) {
                // tagastame tühja massiivi, kuna uute ruutudega ei saa sõna moodustada
                return sõnad;
            }
        }

        if (!hasKäigud(1)) {
            let sõna: string = '';

            for (let i = y_min; i <= y_max; i++) {
                roundPoints += getPoint(x, i)
                sõna += getLetter(x, i);
            }
            sõnad.push(sõna);

            roundPoints *= wordMult;
            uuedPunktid.forEach((value, key) => {
                uuedPunktid.set(key, value * wordMult)
            })

            // kui esimene käik siis pole vaja kontrollida, kas ühendatud
            return sõnad;
        }

        // leiame ühendatud ruudud
        uuedRuudud.forEach((tile) => {
            let x = tile[0];
            let y = tile[1];
            let wordpunktid = getPoint(x, y);
            // kui esimene vaatame kas ruudu üleval on täht
            if (tile === uuedRuudud[0]) {
                let up = getLetter(x, y - 1);
                let word = getLetter(x, y);
                if (up !== null) {
                    word = getUpWord(x, y - 1) + word;
                    wordpunktid += getUpPoints(x, y - 1);
                    
                }
                let downWord = getDownWord(x, y + 1);
                if (downWord.length) {
                        word += downWord
                        wordpunktid += getDownPoints(x, y + 1);
                }
                if (word !== null) {
                    roundPoints += wordpunktid * wordMult;
                    updatePointsboard(x, y, wordMult, 'x')
                    sõnad.push(word);
                }
                
            }


            // igal juhul vaatame ülesse ja alla kas on täht
            let left = getLetter(x - 1, y);
            let right = getLetter(x + 1, y);

            let leftPoints = getLeftPoints(x, y - 1);
            let rightPoints = getRightPoints(x, y + 1);
            let multipliyer = getMult(x, y)

            let word = getLetter(x, y);
            if (word !== null) {
                if (left !== null) {
                    word = getLeftWord(x - 1, y) + word;
                    wordpunktid += leftPoints;
                } 
                if (right !== null) {
                    word += getRightWord(x + 1, y);
                    wordpunktid += rightPoints
                }
                if (word.length !== 1) {
                    if (multipliyer[1] === 'word') {
                        roundPoints += wordpunktid * multipliyer[0];
                        updatePointsboard(x, y, multipliyer[0], 'x')
                    } else {
                        roundPoints += wordpunktid;
                    }
                    sõnad.push(word);
                }
            }
        })

    }

    //if (connected) {
    //    return sõnad;
    //} else {
    //    return [];
    //}
    return sõnad;
}


function checkWord(word: string): boolean {
    word = word.toLowerCase();
    // kontrollime kas sõna on olemas
    const wordlist = getWords();
    
    if (wordlist.includes(word)) {
        return true;
    }
    return false;
}

export function checkKäik(): boolean {
    if (!hasKäigud(1)) {
        if (!hassquareContext(112)) {
            roundPoints = 0;
            uuedRuudud = [];
            return false;
        }
    }

    let käik = getKäik();


    console.log(käik)

    // kui ei leidu sõnu
    if (käik.length === 0) {
        roundPoints = 0;
        uuedRuudud = [];
        return false;
    } else {
        // vaatame kas sõnad on olemas
        // Check if the words exist
        for (const word of käik) {
            if (!checkWord(word)) {
                console.log('ei ole olemas');
                roundPoints = 0;
                uuedRuudud = [];
                return false;
            }
        }
    }

    allPoints += roundPoints;
    roundPoints = 0;
    setPoints();

    setKäigud(käik);
    vanadRuudud = vanadRuudud.concat(uuedRuudud);
    uuedRuudud = [];

    console.log(pointsboard)

   return true;
}
