from estnltk import Text
from estnltk.wordnet import Wordnet
from flask import Flask, request, jsonify
from estnltk import download
import nltk

nltk.download('punkt_tab')


# ver: estwordnet_2023-07-20, estwordnet_2020-06-30
download('estwordnet_2023-07-20')

app = Flask(__name__)

def sõne_to_synod(sõne):
    text = Text(sõne).tag_layer()
    lemma =  text.words.lemma[0][0]
    synod = Wordnet()[lemma]
    return synod

@app.route('/')
def test():
    return "API is working"

# teema genereerimise jaoks
@app.route('/teema')
def teema_data():
    sõne = request.args.get('sone')
    synod = sõne_to_synod(sõne)

    #synod = Wordnet(version='2.3.2')[sõne]
    teema = [s.name.split('.') for s in synod]
    
    data = {'sõnastik': teema}
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