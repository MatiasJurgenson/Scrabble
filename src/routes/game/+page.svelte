<script lang="ts">
	import { draw_tiles } from '$lib/letter_bag.js';

	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	
	import Tile from './Tile.svelte';
	import Square from './Square.svelte';
    import { getAllsquareContext, getAllsquareDisabled, setsquareDisabled } from '$lib/context';

	export let data;


	let items = data.hand;
	let letter_bag = data.letter_bag;
	let board = data.board;
		
	function draw_hand() {
		let new_hand
		[new_hand, letter_bag] = draw_tiles(letter_bag, 8-items.length)

		items = items.concat(new_hand)

		setsquareDisabled()
		board.forEach(col => {col.forEach(square => {
			for (let squareDisabled_key of getAllsquareDisabled().keys()) {
					if (squareDisabled_key === square.id) {
						square.dragDisabled = true 
					}
    			}
			});
		});

		board = structuredClone(board);
	}

	draw_hand()
	
	function handleDnd(e: any) {
		items = e.detail.items;
	}

	function info() {
		let stuff = getAllsquareContext()
		let stuff_2 = getAllsquareDisabled()
		console.log(stuff, stuff_2)
	}
	
	const flipDurationMs = 300;
	
$: options = {
	items,
	flipDurationMs,
	morphDisabled: true
};
</script>

<!--baaskood: https://www.sveltelab.dev/xzz3zkyjzwe6kfk-->

<button on:click={draw_hand} id="end-round">Käigu Lõpp</button>

<button on:click={info}>
	Get info
</button>


<div class="game-container">
	<div class="grid" >
		{#each board as col, colIndex}
			<div class="col">
				{#each col as square, cellIndex (board[colIndex][cellIndex].id)}
					<Square dragDisabled={ square.dragDisabled } color={ square.color } type={ square.type } mult={ square.multipliyer }  squere_id={ board[colIndex][cellIndex].id } />
				{/each}
			</div>
		{/each}
	</div>
	
	<div class="rack" use:dndzone={options} on:consider={handleDnd} on:finalize={handleDnd}>
		{#each items as item(item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<Tile bind:letter={item.letter} bind:points={item.points}/>
			</div>
		{/each}
	</div>
	
</div>

<style>
	
	.game-container {
		display: flex;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.grid {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	.col {
		display: flex;
		flex-direction: column;
	}
	
	.rack {
		display: flex;
		justify-content: flex-start;
		flex-grow: 0;
		width: calc((min(5vmin, 50px) + 4px) * 7)
	}
	.rack > * {
		margin: 2px;
	}
</style>