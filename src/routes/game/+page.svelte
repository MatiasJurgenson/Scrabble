<script lang="ts">
	import { draw_tiles } from '$lib/letter_bag.js';

	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	
	import Tile from './Tile.svelte';
	import Square from './Square.svelte';
    import { getAllsquareContext, getAllsquareDisabled, setHand, setsquareDisabled, getsquareContext } from '$lib/context';
    import { checkKäik, getPoints } from '$lib/käigud';
    import { setWords } from '$lib/wordList';
	import { Content, Trigger, Modal } from 'sv-popup';

	export let data;


	let items = data.hand;
	let letter_bag = data.letter_bag;
	let board = data.board;
	let sõnad = data.sõnad;
	setWords(sõnad)

	let points = 0;
		
	function draw_hand() {
		let new_hand
		[new_hand, letter_bag] = draw_tiles(letter_bag, 8-items.length)

		items = items.concat(new_hand)

		setsquareDisabled()
		board.forEach(col => {col.forEach(square => {
			for (let squareDisabled_key of getAllsquareDisabled().keys()) {
					if (squareDisabled_key === square.id) {
						square.dragDisabled = true 
						square.value = getsquareContext(square.id).points
					}
    			}
			});
		});

		board = structuredClone(board);
	}

	draw_hand()

	function käiguLõpp() {
		let tulemus = checkKäik()
		console.log(tulemus)
		if (tulemus) {
			draw_hand()
			points = getPoints();
			visible = false
		} else {
			visible = true
		}
	}

 	let visible = false;
	let isValid = false;
	$: isValid 
	$: points
	$: visible
	
	function handleDnd(e: any) {
		items = e.detail.items;
		setHand(items)
		
		
	}

	function info() {
		//let stuff = getAllsquareContext()
		//let stuff_2 = getAllsquareDisabled()
		//console.log(stuff, stuff_2)
		checkKäik()
	}
	
	const flipDurationMs = 300;

	$: options = {
		items,
		flipDurationMs,
		morphDisabled: true
	};
</script>

<div class="game">
	<Modal basic> 
		{#if visible }
		<Content>
    		<p style= "color: red; font-size: 2em; text-align: center;">
        		POLE SÕNA
    		</p>	
		</Content>
		{/if}	
		<Trigger>
			<button on:click={käiguLõpp} id="end-round">Käigu Lõpp</button>
		</Trigger>
	  </Modal>


<!--baaskood: https://www.sveltelab.dev/xzz3zkyjzwe6kfk-->
<div class="game-container">
	<div class="grid" >
		{#each board as col, colIndex}
			<div class="col">
				{#each col as square, cellIndex (board[colIndex][cellIndex].id)}
					<Square bind:pointValue={square.value} dragDisabled={ square.dragDisabled } color={ square.color } type={ square.type } mult={ square.multipliyer }  squere_id={ board[colIndex][cellIndex].id } />
				{/each}
			</div>
		{/each}
	</div>
	
	<div class="rack" use:dndzone={options} on:consider={handleDnd} on:finalize={handleDnd}>
		{#each items as item(item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<Tile letter={item.letter} points={item.points}/>
			</div>
		{/each}
	</div>
	
</div>

<span class="points"> Punkte: {points}</span>


</div>
<style>
	button {
        background-color: #5e77ad;
        color: white;   
        border-radius: 15px;
        font-size: 1.5em;
        width: 8em;
        height: 2em;
		margin-right: 1em;
    }

	.points {
		background-color: #5e77ad;
        color: white;   
        border-radius: 15px;
        font-size: 1.5em;
        width: 8em;
        height: 2em;
		margin-left: 1em;
		justify-content: center;
		align-items: center;
		display: flex;

	}

	.game {
		display: flex;
		flex-direction: row;
		white-space: 1em;
		width: 100%;
		padding: 1em;
		
	}
	
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