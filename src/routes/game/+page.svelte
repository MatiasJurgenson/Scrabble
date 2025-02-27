<script>
    import { board } from '$lib/board.js';
	import { dropzone, draggable } from '$lib/dnd';

	export let data;

	export { board } from '$lib/board.js';
</script>

<!--baaskood: https://www.sveltelab.dev/xzz3zkyjzwe6kfk-->



<button id="end-round">Käigu Lõpp</button>

<ul>
	{#each data.columns as column}
		{@const cards = data.cards.filter((c) => c.column === column.id)}
		<li
			class="column"
			use:dropzone={{
				on_dropzone(card_id) {
					const card = data.cards.find((c) => c.id === card_id);
					card.column = column.id;
					data = data;
				}
			}}
		>
			<h2>{column.label}</h2>
			{#if cards.length > 0}
				<ul class="cards">
					{#each cards as card}
						<li use:draggable={card.id}>
							{card.title}
						</li>
					{/each}
				</ul>
			{:else}
				<p>No Cards...</p>
			{/if}
		</li>
	{/each}
</ul>

<table>
	<tbody>
		{#each board as row, rowIndex}
			<tr>
				{#each row as tile, cellIndex (board[rowIndex][cellIndex])}
					{#if tile.type === 'word'}
						<td class="tile" style="background-color: {tile.color}"> {tile.multipliyer}W </td> <!-- {rowIndex} {cellIndex} {tile.id} -->
					{:else if tile.type === 'letter'}
						<td class="tile" style="background-color: {tile.color}"> {tile.multipliyer}L </td> <!-- {rowIndex} {cellIndex} {tile.id} -->
					{:else}
						<td class="tile" style="background-color: {tile.color}"></td> <!-- {rowIndex} {cellIndex} {tile.id} -->
					{/if}
					
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	@import '/static/game.css';

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 1rem;
	}

	li {
		padding: 1rem;
		background-color: var(--sk-back-1);
		
		border-radius: 0.5rem;
		border-color: var(--sk-back-5);
	}

	.column {
		min-width: 25ch;
	}

	h2 {
		margin-block-start: 0;
		margin-block-end: 0.5rem;
	}

	.cards {
		flex-direction: column;
	}

	.column:global(.droppable) {
		outline: 0.1rem solid var(--sk-theme-1);
		outline-offset: 0.25rem;
	}

	.column:global(.droppable) * {
		pointer-events: none;
	}

	table {
		border-collapse: collapse;
	}

	.tile {
		border: 1px solid black;
		border-radius: 0;
		width: 48px;
		height: 48px;
		text-align: center;
		font-size: 1.5rem;
	}
</style>