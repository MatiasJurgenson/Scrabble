from estnltk import Text
from estnltk.wordnet import Wordnet
from flask import Flask, request, jsonify

import nltk
nltk.download('punkt_tab')

app = Flask(__name__)

@app.route('/api')
def api_data():
    sõne = request.args.get('sone')
    synod = Wordnet()[sõne]
    teema = [s.name.split('.') for s in synod]
    
    data = {'sõnastik': teema}
    return jsonify(data)

#debugger 
if __name__ == "__main__":
    app.run(debug=True)
    app.run(host='localhost', port=5000)