// baaskood: https://www.sveltelab.dev/xzz3zkyjzwe6kfk
import type { PageServerLoad } from './$types';
import { create_letter_bag } from '$lib/letter_bag.js';
import type { letterTile } from '../../types/tiles';
import { board } from '$lib/board.js';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const url = 'https://scrabble.matias.ee/api/sonastik?nr=3';
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
        console.log('Fetched data:', data);

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

        console.log('sõnad:', sõnad);

        let letter_bag = create_letter_bag(stats);
        let hand: letterTile[] = [];

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