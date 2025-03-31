<!-- svelte-ignore state_referenced_locally -->
<!-- baasfail: https://svelte.dev/playground/ed2e138417094281be6db1aef23d7859?version=3.59.2-->

<script lang="ts">
	import { type letterTile } from '../../types/tiles';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
	import { Content, Trigger, Modal } from 'sv-popup';
	
	import Tile from './Tile.svelte';

	import { setsquareContext } from '$lib/context';
    import Select from './Select.svelte';


	let items: letterTile[] = $state([]);

	let { letter = $bindable(null), pointValue = $bindable(0), dragDisabled = $bindable(false), color, type, mult, squere_id}: {letter: letterTile | null, pointValue: number, dragDisabled: boolean, color: string, type: string, mult: number, squere_id: number} = $props();

	function handleDnd(e: any) {
		items = e.detail.items;
	}

	function setTileBlank() {
		items[0].letter = '?';
	}

	let pointerDown = $state(true);

	function tilePoints() {
		items.forEach((item, index) => {
			if (pointValue >= item.points) {
				return pointValue
			} else {
				return item.points
			}	
		});
		
	}

	let options = $derived({
			dropFromOthersDisabled: items.length > 0,
			items: items,
			dropTargetStyle: {},
			flipDurationMs: 100,
			dragDisabled: dragDisabled
		});

	$effect(() => {
		options
		items
		letter
		pointValue

		// kui ruudule pantakse ?
		items.forEach((item, index) => {
			// kui on liigutav
			if (item.points === 0 && !dragDisabled) {
				item.letter = '?';
			}

			// kui on boonusruute kasutatud, muudame punktisummat
		});

		return () => {
			items = (letter !== null) ? [letter] : items;
		}
	})

</script>

{#if type === 'word'}
<div class="square prevent-select" style="{items.find(tile => tile[SHADOW_ITEM_MARKER_PROPERTY_NAME]) ? 'background: rgba(255, 255, 255, 0.2)': ''}; background-color: {color}" use:dndzone={options} onconsider={handleDnd} onfinalize={handleDnd}>
	{#if items.length}
		{#each items as tile(tile.id)}
			{setsquareContext(squere_id, tile)}
			{#if tile.points === 0 && !dragDisabled && tile.letter === '?'}
			<Modal basic close={tile.letter !== '?'} button={false}> 
				{#if !pointerDown }
				<Content>
					{setTileBlank()}
					<Select bind:tile_letter={tile.letter}/>
				</Content>
				{/if}	
				<Trigger>
					<Tile bind:pointerDown={pointerDown} bind:letter={tile.letter} bind:points={tile.points}/>
				</Trigger>
				
			  </Modal>
			{:else}
				<Tile bind:pointerDown={pointerDown} bind:letter={tile.letter} bind:points={tile.points}/>
			{/if}
		{/each}
	{:else}		
		{mult}W
	{/if}
</div>

{:else if type === 'letter'}
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="square prevent-select" style="{items.find(tile => tile[SHADOW_ITEM_MARKER_PROPERTY_NAME]) ? 'background: rgba(255, 255, 255, 0.2)': ''}; background-color: {color}" use:dndzone={options} onconsider={handleDnd} onfinalize={handleDnd}>
	{#if items.length}
		{#each items as tile(tile.id)}
			{setsquareContext(squere_id, tile)}
			{#if tile.points === 0 && !dragDisabled && tile.letter === '?'}
			<Modal basic close={tile.letter !== '?'} button={false}> 
				{#if !pointerDown }
				<Content>
					{setTileBlank()}
					<Select bind:tile_letter={tile.letter}/>
				</Content>
				{/if}	
				<Trigger>
					<Tile bind:pointerDown={pointerDown} bind:letter={tile.letter} bind:points={tile.points}/>
				</Trigger>
				
			  </Modal>
			{:else}
				<Tile bind:pointerDown={pointerDown} bind:letter={tile.letter} bind:points={tile.points}/>
			{/if}
		{/each}
	{:else}
		{mult}L
	{/if}
</div>

{:else}
<div class="square prevent-select" style=" background-color: {color}" use:dndzone={options} onconsider={handleDnd} onfinalize={handleDnd}>
	{#each items as tile(tile.id)}
		{setsquareContext(squere_id, tile)}
		{#if tile.points === 0 && !dragDisabled && tile.letter === '?'}
			<Modal basic close={tile.letter !== '?'} button={false}> 
				{#if !pointerDown }
				<Content>
					{setTileBlank()}
					<Select bind:tile_letter={tile.letter}/>
				</Content>
				{/if}	
				<Trigger>
					<Tile bind:pointerDown={pointerDown} bind:letter={tile.letter} bind:points={tile.points}/>
				</Trigger>
				
			  </Modal>
			{:else}
				<Tile bind:pointerDown={pointerDown} bind:letter={tile.letter} bind:points={tile.points}/>
			{/if}	
	{/each}
</div>

{/if}

<style>
	.square {
		border: 1px solid #828282;
		border-radius: calc(min(5vmin, 50px) / 6.25);
		height: calc(2px + min(5vmin, 50px));
		width: calc(2px + min(5vmin, 50px));
		text-align: center;
		font-size: 1.5rem;
		display: grid;
		justify-content: center;
		align-items: center;
		color: #484848;
	}

	.prevent-select {
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
}
</style>