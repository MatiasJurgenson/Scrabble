
sõnad = []
with open("words/lemma_alfabeetilises.txt", "r", encoding='utf-8-sig') as my_file:
    for rida in my_file:
        
        try:
            sage, sõna = rida.strip().split(" ")
            sõnad.append(sõna.strip())

        except:
            continue

with open("words/lemmad_alfa.txt", "w", encoding='utf-8-sig') as my_file:
    for sõna in sõnad:
        my_file.write(sõna + '\n')
       

