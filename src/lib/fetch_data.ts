// baaskood: https://www.sveltelab.dev/xzz3zkyjzwe6kfk
import { create_letter_bag } from '$lib/letter_bag.js';
import { board } from '$lib/board.js';
import { gameInfo } from '$lib/game_type';
import { wordlistStore, statsStore } from '$lib/wordList';
import { get } from 'svelte/store'
import type { letterTile } from '../types/tiles';

export async function load() {
    try {
        let game = get(gameInfo);
        console.log('game:', game);
        let url = '';
        if (game.type === 'classic') {
            //url = 'http://localhost:5000/sonastik?nr=3';
            url = 'https://scrabble.matias.ee/api/sonastik?nr=3';
        } else if (game.type === 'custom') {
            if (game.wordlist === 'EKK sõnastik') {
                url = 'https://scrabble.matias.ee/api/sonastik?nr=3';
            } else if (game.wordlist === 'EKI sõnastik') {
                url = 'https://scrabble.matias.ee/api/sonastik?nr=5';
            } else if (game.wordlist === 'Genereeritud') {
                let stats = get(statsStore);
                let letter_bag = create_letter_bag(stats.stats);
                let sõnad = get(wordlistStore).sõnastik;
                
                return {
                    board,
                    letter_bag: letter_bag,
                    hand: [],
                    sõnad: sõnad
                };
                
            }
        }


        const response = await fetch(url);

        if (!response.ok) {
            console.error('Failed to fetch data:', response.statusText);
            return {
                board,
                letter_bag: [],
                hand: [],
				sõnad: []
            };
        }

        const data = await response.json();

        const stats = data.stats;
        const sõnad = data.sõnastik;

        if (!sõnad) {
            console.error('sõnad is undefined');
            return {
                board,
                letter_bag: [],
                hand: [],
				sõnad: []
            };
        }

        let letter_bag = create_letter_bag(stats);
        let hand: letterTile[] = [];
        wordlistStore.set({ sõnastik: sõnad });
        statsStore.set({ stats: stats});

        console.log(get(wordlistStore));
        console.log(get(statsStore));

        return {
            board,
            letter_bag,
            hand,
			sõnad
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            board,
            letter_bag: [],
            hand: [],
			sõnad: []
        };
    }
};