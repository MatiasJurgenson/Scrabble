sõnad = []
with open("words/vormid.txt", "r", encoding='utf-8-sig') as my_file:
    for rida in my_file:
        if "|" in rida:
            rida = "".join(rida.split("|"))
        sõnad.append(rida.strip())

with open("words/vormid_kokku.txt", "w", encoding='utf-8-sig') as my_file:
    for sõna in sõnad:
        my_file.write(sõna + '\n')