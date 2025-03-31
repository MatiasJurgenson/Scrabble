from estnltk import Text
from estnltk.wordnet import Wordnet
from estnltk import download
import nltk

nltk.download('punkt_tab')

# ver: estwordnet_2023-07-20, estwordnet_2020-06-30
download('estwordnet_2023-07-20')

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

print(teema_to_sõnastik('mees'))