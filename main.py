from estnltk import Text
from estnltk.wordnet import Wordnet
from flask import Flask, request, jsonify
from estnltk import download
import nltk

import sys
sys.path.append('/words/prog')
from words.prog import stats

nltk.download('punkt_tab')

global checked_syns
checked_syns = []

# teeme synsetist sõna
def syn_to_word(syn):
    return syn.name.split('.')[0]

def get_hypernyms(syn):
    hypernyms = []
    if syn.hypernyms == []:
        return hypernyms
    for hypernym in syn.hypernyms:
        # lisame ülemmõiste sõnastikku
        hypernym_word = syn_to_word(hypernym)
        if hypernym_word not in hypernyms:
            hypernyms.append(hypernym_word)

        # lisame ülemmõiste lemmad sõnastikku
        for lemma in hypernym.lemmas:
            if lemma not in hypernyms:
                hypernyms.append(lemma)

        # vaatame ülemmõiste ülemmõisteid
        hypernyms += get_hypernyms(hypernym)
        
    return hypernyms

def get_hyponyms(syn):
    hyponyms = []
    if syn.hyponyms == []:
        return hyponyms
    for hyponym in syn.hyponyms:
        # lisame alammõiste sõnastikku
        hyponym_word = syn_to_word(hyponym)
        if hyponym_word not in hyponyms:
            hyponyms.append(hyponym_word)

        # lisame alammõiste lemmad sõnastikku
        for lemma in hyponym.lemmas:
            if lemma not in hyponyms:
                hyponyms.append(lemma)

        # vaatame alammõiste alammõisteid
        hyponyms += get_hyponyms(hyponym)
        
    return hyponyms

def get_meronyms(syn):
    meronyms = []
    if syn.meronyms == []:
        return meronyms
    for meronym in syn.meronyms:
        # lisame osamõiste sõnastikku
        meronym_word = syn_to_word(meronym)
        if meronym_word not in meronyms:
            meronyms.append(meronym_word)

        # lisame osamõiste lemmad sõnastikku
        for lemma in meronym.lemmas:
            if lemma not in meronyms:
                meronyms.append(lemma)

        # vaatame osamõiste osamõisteid
        new_meronyms = get_holonyms(meronym)
        if new_meronyms != None:
           meronyms += get_meronyms(meronym)
        

        # leiame osamõiste muud mõisted
        #if meronym not in checked_syns:
        #    checked_syns.append(meronym)
        #    meronyms += teema_to_sõnastik(meronym_word)
        
    return meronyms

def get_holonyms(syn):
    holonyms = []
    if syn.holonyms == []:
        return holonyms
    for holonym in syn.holonyms:
        # lisame tervikmõiste sõnastikku
        holonym_word = syn_to_word(holonym)
        if holonym_word not in holonyms:
            holonyms.append(holonym_word)

        # lisame tervikmõiste lemmad sõnastikku
        for lemma in holonym.lemmas:
            if lemma not in holonyms:
                holonyms.append(lemma)

        # vaatame tervikmõiste tervikmõisteid
        new_holonyms = get_holonyms(holonym)
        if new_holonyms != None:
            holonyms += get_holonyms(holonym)

        # leiame tervikmõiste muud mõisted
        #if holonym not in checked_syns:
        #    checked_syns.append(holonym)
        #    holonyms += teema_to_sõnastik(holonym_word)

def teema_to_sõnastik(teema):
    sõnastik = []

    text = Text(teema).tag_layer()
    lemma =  text.words.lemma[0][0]
    synod = Wordnet()[lemma]
    
    for syn in synod:
        #print (syn, "syn")
        #print(syn.lemmas, "lemmas")
        #print(syn.hypernyms, "hypernyms") # ülemmõisted
        #print(syn.hyponyms, "hyponyms") # alammõisted
        #print(syn.meronyms, "meronyms") # osamõisted - täpsemalt 
        #print(syn.holonyms, "holonyms") # tervikmõisted

        checked_syns.append(syn)

        # lisame algse sõna sõnastikku
        syn_word = syn_to_word(syn)
        if syn_word not in sõnastik:
            sõnastik.append(syn_word)

        # lisame lemmad sõnastikku
        for lemma in syn.lemmas:
            if lemma not in sõnastik:
                sõnastik.append(lemma)

        # lisame ülemmõisted sõnastikku
        hypernyms = get_hypernyms(syn)
        for hypernym in hypernyms:
            if hypernym not in sõnastik:
                sõnastik.append(hypernym)

        # lisame alammõisted sõnastikku
        hyponyms = get_hyponyms(syn)
        for hyponym in hyponyms:
            if hyponym not in sõnastik:
                sõnastik.append(hyponym)

        # lisame osamõisted sõnastikku
        meronyms = get_meronyms(syn)
        for meronym in meronyms:
            if meronym not in sõnastik:
                sõnastik.append(meronym)

        # lisame tervikmõisted sõnastikku
        holonyms = get_holonyms(syn)
        if holonyms != None:
            for holonym in holonyms:
                if holonym not in sõnastik:
                    sõnastik.append(holonym)

    return sõnastik

#print(teema_to_sõnastik('mees'))


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
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# teema genereerimise jaoks
@app.route('/teema')
def teema_data():
    sõne = request.args.get('sone')

    teema = teema_to_sõnastik(sõne)

    statistika = stats.letter_stats_gen(teema)
    
    data = {'sõnastik': teema, 'stats': statistika}

    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/tahendus')
def tahendus_data():
    sõne = request.args.get('sone')
    synod = sõne_to_synod(sõne.lower())
    
    tähendused = []
    for asi in synod:
        tähendused.append(asi.definition)

    if len(tähendused) == 0:
        tähendused.append("Tähendust ei leitud")

    data = {'sõnastik': tähendused}
    response = jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

#debugger 
if __name__ == "__main__":
    app.run(debug=True)
    app.run(host='localhost', port=5000)