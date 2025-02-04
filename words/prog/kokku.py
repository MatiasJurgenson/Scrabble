def kokku(sõna, vaadatud, sõnad):
    vaadatud += 1
    if vaadatud % 1500 == 0:
        print(str(vaadatud / 150000 * 100) + "%")
    if sõna not in sõnad:
        sõnad.append(sõna)
    
    return vaadatud, sõnad

vaadatud = 0
sõnad = []

sõnad_alfa = []
sõnad_vormid = []

with open("words/lemmad_alfa.txt", "r", encoding='utf-8-sig') as my_file:
    for rida in my_file:
        rida = rida.strip()
        if rida not in sõnad_alfa:
            sõnad_alfa.append(rida)
        vaadatud, sõnad = kokku(rida, vaadatud, sõnad)

with open("words/vormid_lemma.txt", "r", encoding='utf-8-sig') as my_file:
    for rida in my_file:
        rida = rida.strip()
        if rida not in sõnad_vormid:
            sõnad_vormid.append(rida)
        vaadatud, sõnad =  kokku(rida, vaadatud, sõnad)
        
with open("words/koik_kokku.txt", "w", encoding='utf-8-sig') as my_file:
    for sõna in sõnad:
        my_file.write(sõna + '\n')

with open("words/erinevad.txt", "w", encoding='utf-8-sig') as my_file:
    for sõna in sõnad_alfa:
        if sõna not in sõnad_vormid:
            my_file.write(sõna + '\n')
    for sõna in sõnad_vormid:
        if sõna not in sõnad_alfa:
            my_file.write(sõna + '\n')