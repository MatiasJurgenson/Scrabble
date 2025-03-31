<script lang="ts">

import CollapsibleSection from './CollapsibleSection.svelte'

let {words = $bindable()}: {words: string[]} = $props()

// leitud tähendused
let meanings = $state(new Map<string, string[]>())

async function getMeaning(word: string) {
    
    let response = await fetch('https://scrabble.matias.ee/api/tahendus?sone=' + word)
    let data = await response.json()
    return data.sõnastik
}

function findMeanings() {
    // sõnade leidmine
    words.forEach(async (word) => {
        if (!meanings.has(word)) {
            let meaning = await getMeaning(word)
            console.log(meaning, "meaning")
            meanings = new Map(meanings);
            meanings.set(word, meaning);
        }
    })
    console.log(meanings, "meanings")
}
// kui sõnu tuleb juurde jooksutadakse sõnade leidmine uuesti
$effect(() => {
words
meanings

return () => {
			findMeanings()
		}
})

</script>


<!--https://svelte.dev/playground/90d1f85a07134b3aa7d9d265f836d771?version=5.25.3#H4sIAAAAAAAACm1SPW_bMBD9KwdmkAMkldN2UiwXhX9GmIGW6JgoTRLiOYlBaHDRoW2Gdgo6dsrapejYPyMEQf5Fj_qo7aLQQr73-O7dnQIzYiVZxmZWa-G8ZCdsobT0LLsIDDcuchEgvFe-de6Fv5YaIzYXXv4PL6xBaZBs2MQXlXI45UatnK0QAnitSgk1LCq7gqR7lGIljFeorEm44YYcPMLgAzlcJP3lLDmB4fxy7_wqueRGSwS_tDezDqN3yZ7dUphSy5lWxTtiRk5stBXlMeRTCNwApClwfPry--nzr-f7u2b7odk-NO_vHr__fPz6sdn-eL7_1Gy_EUKWeFim94I8zw8CvKEAkA00NzU3k_TvSLgJR1IUy12jwg_nqCzVdVThZL5GtAbiRnLOuhtnYE1WxG7yMGq72Gtw1Nsc19MwOE7S7mXrGY7U4nBWFH1Xm4o62C0la5eWhwDluhItAq_HY6gP7F3nnKpF22cXP6SxxWhpJh43WrYi4uLQOXJ0oiyVucrgbOxuYXzeoXNblbI6nVtKvCKOKG8pBNDE4tfKWlfSduPp_VaiulKUb7wvcf-yXbGdiNbShqPfF-Utsgyrtawv6SaUvlGmZNlCaC_rP16mwVM1AwAA-->


<section>
    {#each meanings as content}
        <CollapsibleSection headerText={content[0]} >
            {#each content[1] as tähendused}
                <div class="content">
                    <p>{tähendused}</p>
                </div>
            {/each}
            
        </CollapsibleSection>
    {/each}
    </section>


<style>
	section {
		width: 300px;
        display: flex;
		height: 100%;
		flex-direction: column;
	}
	
	.content {
		background-color: #f4f4f4;
		padding: 0.5em;
	}
</style>