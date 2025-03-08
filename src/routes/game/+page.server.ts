// baaskood: https://www.sveltelab.dev/xzz3zkyjzwe6kfk
import type { PageServerLoad } from './$types';
import { create_letter_bag } from '$lib/letter_bag.js';
import type { letterTile } from '../../types/tiles';
import { board } from '$lib/board.js';

export const load: PageServerLoad = async ({ fetch }) => {

	const url = 'http://localhost:5000/sonastik?nr=3';
	const response = await fetch(url);
	const data = await response.json();
	const stats = data.stats;
	const sõnad = data.sõnastik;
	let letter_bag = create_letter_bag(stats);
	let hand: letterTile[] = [];

	

	return {
		board,
		letter_bag,
		hand,
	}
};