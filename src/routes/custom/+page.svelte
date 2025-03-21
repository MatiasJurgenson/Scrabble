<script lang="ts">
    import { setGameType, setWordlist, setDifficulty, getGame, setTeema } from "$lib/game_type";

    let game = getGame();
    let type = "custom";

    let difficultys: {id: number, text: string}[] = $state([
        { id: 1, text: "Kerge" },
        { id: 2, text: "Keskmine" },
        { id: 3, text: "Raske" }
    ]);
    let wordlists: {id: number, text: string}[] = $state([
        { id: 1, text: "EKK sõnastik" },
        { id: 2, text: "EKI sõnastik" },
        { id: 3, text: "Genereeritud" }
    ]);


	let selected_type: {id: number, text: string} = $state({ id: 2, text: "Keskmine" });
    let selected_wordlist: {id: number, text: string} = $state({ id: 1, text: "EKK sõnastik" });

    let teema = $state("");

	function handleSubmit(e: any) {
		e.preventDefault();
        // kui on custom, siis peab olema ka teema
        if (selected_wordlist.id === 3) {
            if (teema === "") {
                alert("Sisesta teema!");
                return;
            } else {
                
            }
            
        }
        

        setGameType(type);
        setWordlist(selected_wordlist.text);
        setDifficulty(selected_type.text);
        if (selected_wordlist.id == 3) {
            setTeema(teema);
        }

        
	}
    
</script>

<h2>Kohandatud mängu valikud</h2>

<form onsubmit={handleSubmit}>
	<select
		bind:value={selected_type}>
		{#each difficultys as question}
			<option value={question}>
				{question.text}
			</option>
		{/each}
	</select>

    <select
		bind:value={selected_wordlist}>
		{#each wordlists as question}
			<option value={question}>
				{question.text}
			</option>
		{/each}
	</select>

    {#if selected_wordlist.id == 3}
        <input bind:value={teema} type="text" placeholder="Sisesta teema" />
    {/if}

	<button type="submit">
		Mängi
	</button>
</form>

<p>
	selected question {selected_type
		? selected_type.id
		: '[waiting...]'}
    selected question {selected_wordlist
		? selected_wordlist.id
		: '[waiting...]'}
</p>

<style>

</style>
