import math

# iga ühene (vajadusel ümebratud) on kui palju neid tähti esineb
# tähe väärtused jätta praeguseks samaks     

def letter_stats_gen(wordlist):
    # kokku ja eraldi tähed
    stats = {'kokku': 0}

    # käime iga sõna iga tähe läbi
    for word in wordlist:
        for letter in word:
            # kui täht on juba olemas, siis suurendame väärtust
            if letter in stats:
                stats[letter] += 1
            # kui ei ole, siis lisame uue võtme
            else:
                stats[letter] = 1
            # suurendame kogu tähtede arvu
            stats['kokku'] += 1

    kokku = 0
    for key in stats:
        if key == 'kokku':
            continue
        arv = (stats[key] / stats['kokku'] * 100)
        if arv > 1:
           stats[key] = round(arv, 0)
        else:
            stats[key] = 1
        
        kokku += stats[key]
    
    stats['kokku'] = kokku
    return stats

def get_stats_original():
    stats_original = {
        'kokku': 102,
        'a': 10, # 1
        'e': 9,
        'i': 9,
        's': 8,
        't': 7,
        'k': 5,
        'l': 5,
        'o': 5,
        'u': 5,

        'd': 4, # 2
        'm': 4,
        'n': 4,
        'r': 2,
        
        'g': 2, # 3
        'v': 2,

        'h': 2, # 4
        'j': 2,
        'p': 2,
        'õ': 2,
        'b': 1,

        'ä': 2, # 5
        'ü': 2, 

        'ö': 2, # 6

        'f': 1, # 8

        'š': 1, # 10
        'z': 1,
        'ž': 1
            }    

    #for key in stats:
    #    print(key, stats[key] / stats['kokku'] * 100)

    return stats_original



with open("words/lemmad_alfa.txt", "r", encoding='utf-8-sig') as my_file:
    wordlist = []
    for rida in my_file:
        rida = rida.strip()
        wordlist.append(rida)
    stats = letter_stats_gen(wordlist)

    for key in stats:
        print(key, stats[key])




