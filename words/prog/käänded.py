from estnltk.vabamorf.morf import synthesize



mitmus = ['sg', 'pl']
käänded = ['ab', 'abl', 'ad', 'adt', 'all', 'el', 'es', 'g', 'ill', 'in', 'kom', 'n', 'p', 'ter', 'tr']

vaadatud = 0

tähed = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 'š', 'z', 'ž', 't', 'u', 'v', 'W', 'õ', 'ä', 'ö', 'ü', 'x', 'y']

# käime kõik tähed läbi
for täht in tähed:
    sõnad = []
    with open("words/koik_kokku.txt", "r", encoding='utf-8-sig') as my_file_read:
        with open("words/koik_kaanded/" + täht +".txt", "w", encoding='utf-8-sig') as my_file_write:
            for rida in my_file_read:

                # kui esimene täht on sama
                if rida[0] == täht:
                    rida = rida.strip()
                    vaadatud += 1
                    if vaadatud % 1110 == 0:
                        print(str((vaadatud / 111000) * 100) + "%")

                    # lisame algse sõna
                    sõnad.append(rida)
                    my_file_write.write(rida + '\n')

                    # käime kõik käänded läbi
                    for mitmene in mitmus:
                        for kääne in käänded:

                            # loome käände ja lisame kui juba pole
                            synths = synthesize(rida, mitmene + ' ' + kääne)
                            for synth in synths:
                                if synth not in sõnad:
                                    sõnad.append(synth)
                                    my_file_write.write(synth + '\n')
                
