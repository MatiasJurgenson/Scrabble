<script lang="ts">
	import { draw_tiles } from '$lib/letter_bag.js';

	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	
	import Tile from './Tile.svelte';
	import Square from './Square.svelte';
    import { getAllsquareContext, getAllsquareDisabled, setHand, setsquareDisabled, getsquareContext } from '$lib/context';
    import { checkKäik, getPoints } from '$lib/kaigud';
	import { Content, Trigger, Modal } from 'sv-popup';
    import { load } from '$lib/fetch_data';
	import { AIKäik } from '$lib/ai_kaik';

	import { onMount } from 'svelte';
    import type { boardTile, letterTile } from '../../types/tiles';
    import { initDictionary } from '$lib/dawg';
    import { addToVanadRuudud, getVanadRuudud, setBoard } from '$lib/board';
    import Meanings from './Meanings.svelte';
    import LetterBag from './LetterBag.svelte';

	// mängulaual olevad sõnad
	let laua_sõnad: string[] = [];


	let data: {hand: letterTile[], letter_bag: letterTile[], board: boardTile[][], sõnad: string[]} = {
		hand: [],
		letter_bag: [],
		board: [],
		sõnad: []
	};

	let loaded = false;
	let items: letterTile[] = []; // player hand
	let ai_hand: letterTile[] = []; // ai hand
	let letter_bag: letterTile[] = [];
	let board: boardTile[][] = [];
	let sõnastik: string[] = [];

	onMount(async () => {
		data = await load();

		items = data.hand;
	    letter_bag = data.letter_bag;
		board = data.board;
		sõnastik = data.sõnad;

		initDictionary(sõnastik);
		draw_hand_player();
		draw_hand_ai();

		loaded = true;
		console.log(sõnastik, "sõnad async")
		console.log(letter_bag, "letter_bag async")
		console.log(ai_hand, "ai async")
	});

	console.log(sõnastik, "sõnad tava")
	console.log(letter_bag , "letter_bag tava")

	let points = 0;
	let ai_points = 0;
		
	function draw_hand_player() {
		let new_hand
		[new_hand, letter_bag] = draw_tiles(letter_bag, 7-items.length)

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

	function draw_hand_ai() {
		let new_hand
		[new_hand, letter_bag] = draw_tiles(letter_bag, 7-ai_hand.length)

		ai_hand = ai_hand.concat(new_hand)
		
		console.log(ai_hand, "ai_hand")	
		
		// todo ai letter placement and disablening
		// todo remove from letter_bag
	}

	function checkHand(letter: string, letters: letterTile[]): number {
        for (let i = 0; i < letters.length; i++) {
            if (letters[i].letter === letter) {
                return i
            }
        }
        return -1
    }
    function checkJoker(letters: letterTile[]): number {
        for (let i = 0; i < letters.length; i++) {
            let str: string = letters[i].letter
            if (letters[i].letter === '?' || str === str.toLowerCase()) {
                return i
            }
        }
        return -1
    }

	function setLetter() {
		board.forEach(col => {col.forEach(square => {
			for (let squareDisabled_key of getAllsquareDisabled().keys()) {
					if (squareDisabled_key === square.id) {
						square.letter = getsquareContext(squareDisabled_key)
					}
    			}
			});
		});
	}

	function ai() {
		//AIKäik(ai_hand)

		let items = AIKäik(ai_hand)		
		if (Array.isArray(items)) {
			let [newBoard, sõnad, points] = items;
			console.log("newBoard", newBoard, sõnad, points)
			laua_sõnad = laua_sõnad.concat(sõnad)
			ai_points += points
			board.forEach((col: boardTile[], colIndex: number) => {
				col.forEach((square: boardTile, cellIndex: number) => {
					if (newBoard[colIndex][cellIndex] !== null && board[colIndex][cellIndex].letter === null && !getVanadRuudud().some((item: number[]) => item[0] === colIndex && item[1] === cellIndex)) {
						console.log("AI letter placement", colIndex, cellIndex, newBoard[colIndex][cellIndex].letter)
						let index = checkHand(newBoard[colIndex][cellIndex].letter, ai_hand)
						let jokerIndex = checkJoker(ai_hand)

						if (index !== -1) {
							let hand_letter = ai_hand[index]
                        	ai_hand = ai_hand.filter(item => item !== hand_letter)
							addToVanadRuudud(colIndex, cellIndex)
							square.letter = hand_letter
							square.dragDisabled = true
						} else {
							let hand_letter = ai_hand[jokerIndex]
							ai_hand = ai_hand.filter(item => item !== hand_letter)
							addToVanadRuudud(colIndex, cellIndex)
							square.letter = hand_letter
							square.dragDisabled = true
						}
					}
				});
			});
		}

		draw_hand_ai()
		board = structuredClone(board);
		console.log("vanad ruudud", getVanadRuudud())
	}

	function käiguLõpp() {
		let tulemus = checkKäik()
		console.log(tulemus)
		if (tulemus.length === 0) {
			visible = true
		} else {
			draw_hand_player()
			points = getPoints();
			visible = false 	
			laua_sõnad = laua_sõnad.concat(tulemus)
			console.log(laua_sõnad, "laua sõnad")
		}
	}

 	let visible = false;
	let isValid = false;

	$: laua_sõnad;
	$: board
	$: isValid 
	$: points
	$: ai_points
	$: visible
	
	function handleDnd(e: any) {
		items = e.detail.items;
		setHand(items)
	}
	
	const flipDurationMs = 300;

	$: options = {
		items,
		flipDurationMs,
		morphDisabled: true
	};
</script>

{#if !loaded}
	
	<p>Laadimine...</p>
{:else}

{console.log("loaded")}

<div class="game">
	<section style="padding-right: 25px;">
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


	<button on:click={ai}>AI Käik</button>

	<LetterBag bind:letters={letter_bag} />
</section>

<!--baaskood: https://www.sveltelab.dev/xzz3zkyjzwe6kfk-->
<div class="game-container">
	<div class="grid" >
		{#each board as col, colIndex}
			<div class="col">
				{#each col as square, cellIndex (board[colIndex][cellIndex].id)}
					<Square letter={square.letter} bind:pointValue={square.value} dragDisabled={ square.dragDisabled } color={ square.color } type={ square.type } mult={ square.multipliyer }  squere_id={ board[colIndex][cellIndex].id } />
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

<section style="padding-left: 25px;">
<span class="points"> Punkte: {points}</span>
<span class="points"> AI Punkte: {ai_points}</span>

<Meanings bind:words={laua_sõnad}/>
</section>

</div>

{/if}

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

	section {
		width: 300px;
        display: flex;
		height: 100%;
		flex-direction: column;
	}

	
</style>