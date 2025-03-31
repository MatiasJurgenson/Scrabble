import { persisted } from 'svelte-persisted-store'

let wordlist: string[] = []
let stats: any = {}

export const wordlistStore = persisted('wordlistStore', {
    sõnastik: wordlist,
})

export const statsStore = persisted('statsStore', {
    stats: stats,
})


//export function setWords(words: string[]) {
//    wordlist = words
//}
//export function getWords() {
//    return wordlist
//}

//export function setStats(new_stats: any) {
//    stats = new_stats
//}

//export function getStats() {
//    return stats
//}


