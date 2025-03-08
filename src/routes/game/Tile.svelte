<!-- baasfail: https://svelte.dev/playground/ed2e138417094281be6db1aef23d7859?version=3.59.2-->

<script lang='ts'>
    let { letter = $bindable('X'), points = $bindable(0)} = $props();
    let points_str = $state(points.toString())
</script>
  
<div class="square">
    <div class="letter no-select" bind:textContent={letter} contenteditable="false">
    </div>
    <div class="points" bind:textContent={points_str} contenteditable="false"></div>
</div>
  
<style>
    .square {
        border: 1px solid #828282;
        border-radius: calc(min(5vmin, 50px) / 6.25);
        height: calc(min(5vmin, 50px));
        width: calc(min(5vmin, 50px));
        position: relative;
        display: grid;
        justify-content: center;
        align-items: center;
        background-color: #FFF6EB;
    }
  
    .letter {
        font-size: 2.5vmin;
        grid-column: 1;
        grid-row: 1;
        text-align: center;
        font-style: bold;
    }

    .points {
        font-size: 1.5vmin;
        grid-column: 1;
        grid-row: 1;
        position: absolute;
        bottom: 3px;
        right: 3px;
        font-style: bold;
    }

  </style>