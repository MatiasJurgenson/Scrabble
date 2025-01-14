from estnltk import Text
from estnltk.wordnet import Wordnet
from flask import Flask, request, jsonify

import nltk
nltk.download('punkt_tab')

wn = Wordnet()

sent = Text("test").tag_layer()

print("1")
print(sent)
print("2")


app = Flask(__name__)

@app.route('/test', methods=['POST'])

def msg():
    return jsonify(request.json)