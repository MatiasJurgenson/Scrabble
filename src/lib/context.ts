// https://www.youtube.com/watch?v=XBVujg6Fn3A

import type { letterTile } from "../types/tiles"

const squareContext = new Map

export function setsquareContext(key: any, value: letterTile) {
    for (let squareContext_key of squareContext.keys()) {
        let squareContext_value = getsquareContext(squareContext_key)
        // vaatame, et ei tekkiks dublikaate
        if (squareContext_value.id === value.id) {
                squareContext.delete(squareContext_key);
        }   
    }
    squareContext.set(key, value) 
}

export function getsquareContext(key: any) {
    return squareContext.get(key)
}

export function hassquareContext(key:any) {
    return squareContext.has(key)
}

export function getAllsquareContext() {
    return squareContext
}

const squareDisabled = new Map

export function setsquareDisabled() {
    for (let squareContext_key of squareContext.keys()) {
        squareDisabled.set(squareContext_key, true)  
    }
    
}

export function getsquareDisabled(key: any) {
    return squareDisabled.get(key)
}

export function hassquareDisabled(key:any) {
    return squareDisabled.has(key)
}

export function getAllsquareDisabled() {
    return squareDisabled
}