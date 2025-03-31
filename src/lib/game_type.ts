// klassikalise mängu seadistused
import { persisted } from 'svelte-persisted-store'

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const gameInfo = persisted('gameInfo', {
    type: "classic",
    wordlist: "EKK sõnastik",
    difficulty: "Keskmine",
    teema: ''
})

//export function setGameType(type: string) {
//    game.type = type
//}

//export function setWordlist(wordlist: string) {
//    game.wordlist = wordlist
//}

//export function setDifficulty(difficulty: string) {
//    game.difficulty = difficulty
//}

//export function setTeema(teema: string) {
//    game.teema = teema
//}

//export function getGame() {
//    return game
//}