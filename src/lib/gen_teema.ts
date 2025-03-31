export async function gen_teema(teema: string): Promise<{stats: any, sõnastik: string[]}> {
    const url = 'http://localhost:5000/teema?sone=' + teema;
    // const url = 'https://scrabble.matias.ee/api/teema?sone=' + teema;
    const response = await fetch(url);

    if (!response.ok) {
        console.error('Failed to fetch data:', response.statusText);
        return {stats: {}, sõnastik: []};
    }

    const data = await response.json();
    console.log('Fetched data:', data);
    let stats = data.stats;
    let sõnastik = data.sõnastik;

    return {stats: stats, sõnastik: sõnastik};
}