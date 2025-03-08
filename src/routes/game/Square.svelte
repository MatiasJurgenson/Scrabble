<!-- baasfail: https://svelte.dev/playground/ed2e138417094281be6db1aef23d7859?version=3.59.2-->

<script lang="ts">
	import type { letterTile } from '../../types/tiles';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
	
	import Tile from './Tile.svelte';

	import { setsquareContext } from '$lib/context';

	let items: letterTile[] = $state([]);

	let { dragDisabled = $bindable(false), color, type, mult, squere_id}: {dragDisabled: boolean, color: string, type: string, mult: number, squere_id: number} = $props();

	function handleDnd(e: any) {
		items = e.detail.items;
	}


	let options = $derived({
			dropFromOthersDisabled: items.length,
			items,
			dropTargetStyle: {},
			flipDurationMs: 100,
			dragDisabled: dragDisabled
		});

	$effect(() => {
		options
	})

</script>

{#if type === 'word'}
<div class="square prevent-select" style="{items.find(tile => tile[SHADOW_ITEM_MARKER_PROPERTY_NAME]) ? 'background: rgba(255, 255, 255, 0.2)': ''}; background-color: {color}" use:dndzone={options} onconsider={handleDnd} onfinalize={handleDnd}>
	{#if items.length}
		{#each items as tile(tile.id)}
			{setsquareContext(squere_id, tile)}
			<Tile bind:letter={tile.letter} bind:points={tile.points}/>
		{/each}
	{:else}		
		{mult}W
	{/if}
</div>

{:else if type === 'letter'}
<div class="square prevent-select" style="{items.find(tile => tile[SHADOW_ITEM_MARKER_PROPERTY_NAME]) ? 'background: rgba(255, 255, 255, 0.2)': ''}; background-color: {color}" use:dndzone={options} onconsider={handleDnd} onfinalize={handleDnd}>
	{#if items.length}
		{#each items as tile(tile.id)}
			{setsquareContext(squere_id, tile)}
			<Tile bind:letter={tile.letter} bind:points={tile.points}/>
		{/each}
	{:else}
		{mult}L
	{/if}
</div>

{:else}
<div class="square" style="{items.find(tile => tile[SHADOW_ITEM_MARKER_PROPERTY_NAME]) ? 'background: rgba(255, 255, 255, 0.2)': ''}; background-color: {color}" use:dndzone={options} onconsider={handleDnd} onfinalize={handleDnd}>
	{#each items as tile(tile.id)}
		{setsquareContext(squere_id, tile)}
		<Tile bind:letter={tile.letter} bind:points={tile.points}/>
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
	}

	.prevent-select {
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
}
</style>