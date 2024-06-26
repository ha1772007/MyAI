from flask import Flask, request, jsonify

app = Flask(__name__)

from AiList import AIs
AIs = AIs()
@app.route('/home', methods=['POST'])
def home():
    try:
        messages = request.json.get('messages')
        if not messages:
            return 'Plz Enter Valid Message in JSON Formate', 400
    except:
        return 'Plz Enter Valid Message in JSON Formate', 400
    
    try:
        provider = request.json.get('provider')
        if not provider:
            return 'Plz Provide valid Provider', 400
    except:
        return 'Plz Provide valid Provider', 400
    
    try:
        api = request.json.get('api')
        if not api:
            return 'Plz Provide valid API', 400
    except:
        return 'Plz Provide valid API', 400
    
    try:
        model = request.json.get('model')
        if not model:
            return 'Plz Provide a model', 400
    except:
        return 'Plz Provide a model', 400
    
    try:
        tosearch = provider + '-' + model
        if tosearch in AIs:
            return jsonify(AIs[tosearch]['function'](messages, api, model=model))
        else:
            return 'Provider or model not matched with the available Model and provider List', 404
    except:
        return 'Error in Processing the Request', 500

if __name__ == '__main__':
    app.run(debug=True)