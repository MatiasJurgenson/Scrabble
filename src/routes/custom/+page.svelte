<script lang="ts">
    import { gen_teema } from "$lib/gen_teema";
    import { wordlistStore, statsStore } from "$lib/wordList";
    import { gameInfo } from '$lib/game_type';
    import { get } from 'svelte/store'

    gameInfo.reset();

    gameInfo.update(n => {
        return {
            ...n,
            type: "custom"
        }
    });

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
    let gen = $state(false);

	async function handleSubmit(e: any) {
		e.preventDefault();
        // kui on custom, siis peab olema ka teema
        let game = get(gameInfo);
        if (selected_wordlist.id === 3) {
            if (teema === "") {
                alert("Sisesta teema!");
                return;
            } else {
                gen = true;
                let data = await gen_teema(teema);
                let sõnastik = data.sõnastik;
                console.log("sõnastik");
                if (sõnastik.length < 1) {
                    alert("Teemaga ei leitud sõnu!");
                    return;
                } else {
                    wordlistStore.set({ sõnastik: sõnastik });
                    statsStore.set({ stats: data.stats });
                }
            }
            
        }

        gameInfo.update(n => {
            return {
                ...n,
                teema: teema,
                wordlist: selected_wordlist.text,
                difficulty: selected_type.text
            }
        });

        game = get(gameInfo);
        console.log(game);

        window.location.href = "/game";
        
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

	<button type="submit" >
		Mängi
	</button>
</form>

{#if gen}
    <p>Genereerime sõnastikku. Palun oodake</p>
{/if}

<style>

</style>
