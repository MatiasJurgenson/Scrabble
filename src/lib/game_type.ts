// klassikalise mängu seadistused
let game = {
    type: "classic",
    wordlist: "EKK sõnastik",
    difficulty: "Keskmine",
    teema: ''
}

export function setGameType(type: string) {
    game.type = type
}

export function setWordlist(wordlist: string) {
    game.wordlist = wordlist
}

export function setDifficulty(difficulty: string) {
    game.difficulty = difficulty
}

export function setTeema(teema: string) {
    game.teema = teema
}

export function getGame() {
    return game
}