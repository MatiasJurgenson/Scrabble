
<script lang="ts">

let letters = [ 'A', 'B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Š', 'Z', 'Ž', 'T', 'U', 'V', 'Õ', 'Ä', 'Ö', 'Ü' ]

let { tile_letter = $bindable('?')} = $props();

</script>    

<div>
{#each letters as letter}
    <button
        onclick={() => {
            tile_letter = letter;
        }}> {letter} 
    </button>
{/each}
</div>

<style>
    button {
        border: 1px solid #d3a27f;
        border-radius: calc(min(5vmin, 50px) / 6.25);
        height: calc(min(5vmin, 50px));
        width: calc(min(5vmin, 50px));
        position: relative;
        display: grid;
        justify-content: center;
        align-items: center;
        background-color: #f9cbbd;
        font-size: 2.5vmin;
        text-align: center;
        font-style: bold;
        color: #484848;
    }
  
    div {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
        z-index: 100;
    }
</style>