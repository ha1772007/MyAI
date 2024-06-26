def Groq():
    return 'Under Maintainance'
def AIs():
    list = [{
        'name': 'llama-3-70b',
        'provider': 'Groq',
        'function':Groq
        },{
        'name': 'llama-3-8b',
        'provider': 'Groq',
        'function':Groq
        },{
        'name': 'mixtral-8x7b',
        'provider': 'Groq',
        'function':Groq
        },]
    return list