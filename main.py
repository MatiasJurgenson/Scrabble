from estnltk import Text
from estnltk.wordnet import Wordnet
from flask import Flask, request, jsonify
from estnltk import download
import nltk

import sys
sys.path.append('/words/prog')
from words.prog import stats

nltk.download('punkt_tab')


# ver: estwordnet_2023-07-20, estwordnet_2020-06-30
download('estwordnet_2023-07-20')

def fail_to_list(failinimi):
    wordlist = []
    with open(failinimi, 'r', encoding='utf-8') as fail:
        for rida in fail:
            rida = rida.strip()
            wordlist.append(rida)
    return wordlist

app = Flask(__name__)

def sõne_to_synod(sõne):
    text = Text(sõne).tag_layer()
    lemma =  text.words.lemma[0][0]
    synod = Wordnet()[lemma]
    return synod

@app.route('/')
def test():
    return "API is working"

# olemasolevate sõnade jaoks
@app.route('/sonastik')
def sonastik_data():
    number = request.args.get('nr')
    match number:
        case '1':
            # kõik käändetega sõnad, vajab eraldi funktsiooni
            sõnastik = ['käänded']
            statistika = {'TODO'}
        case '2':
            # erinevad.txt
            sõnastik = fail_to_list('words/erinevad.txt')
            statistika = stats.letter_stats_gen(sõnastik)
        case '3':
            # lemmad_alfa.txt
            sõnastik = fail_to_list('words/lemmad_alfa.txt')
            statistika = stats.get_stats_original()
        case '4':
            # vormid_kokku.txt
            sõnastik = fail_to_list('words/vormid_kokku.txt')
            statistika = stats.letter_stats_gen(sõnastik)
        case '5':
            # vormid_lemma.txt
            sõnastik = fail_to_list('words/vormid_lemma.txt')
            statistika = stats.letter_stats_gen(sõnastik)

    data = {'sõnastik': sõnastik, 'stats': statistika}
    return jsonify(data)

# teema genereerimise jaoks
@app.route('/teema')
def teema_data():
    sõne = request.args.get('sone')
    synod = sõne_to_synod(sõne)

    #synod = Wordnet(version='2.3.2')[sõne]
    teema = [s.name.split('.') for s in synod]

    # TODO - statistika
    statistika = {}
    
    data = {'sõnastik': teema, 'stats': statistika}
    return jsonify(data)

@app.route('/tahendus')
def tahendus_data():
    sõne = request.args.get('sone')
    synod = sõne_to_synod(sõne)
    
    tähendused = []
    for asi in synod:
        tähendused.append(asi.definition)

    if len(tähendused) == 0:
        tähendused.append("Tähendust ei leitud")

    data = {'sõnastik': tähendused}
    return jsonify(data)

#debugger 
if __name__ == "__main__":
    app.run(debug=True)
    app.run(host='localhost', port=5000)