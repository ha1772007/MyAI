
from Providers.mygroq import *
def MyGroq(messages,key,model='llama-3-70b'):
    
    if(key):
        pass
    else:
        return 'Provide a Valid API key'
    print(type(messages))
    print(model)
    try:
        messages = json.loads(messages)
    except:
        return 'Type: Invalid Message Formate \nType of Message is Not JSON santizable'
    if(model == 'llama-3-70b'):
        return GroqMyClient.Groq_ask(messages=messages,model='llama3-70b-8192',key=key)
    elif(model == 'llama-3-8b'):
        return GroqMyClient.Groq_ask(messages=messages,model='llama3-8b-8192',key=key)

    elif(model == 'mixtral-8x7b'):
        return GroqMyClient.Groq_ask(messages=messages,model='mixtral-8x7b-32768',key=key)
    else:
        return 'Now a known Model'
    return 'Under Maintainance'