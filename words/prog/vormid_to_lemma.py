from estnltk import Text

vaadatud = 0
sõnad = []

with open("words/vormid_kokku.txt", "r", encoding='utf-8-sig') as my_file:
    for rida in my_file:
        vaadatud += 1
        if vaadatud % 2000 == 0:
            print(str((vaadatud / 200000) * 100) + "%")
        rida = rida.strip()
        text = Text(rida).tag_layer()
        for lemma in text.words.lemma[0]:
            if lemma not in sõnad:
                sõnad.append(lemma)

with open("words/vormid_lemma.txt", "w", encoding='utf-8-sig') as my_file:
    for sõna in sõnad:
        my_file.write(sõna + '\n')