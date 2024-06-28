import json
from groq import Groq
class GroqMyClient():
    def Groq_ask(messages,model,key):
        client = Groq(
        api_key=key,
        )
        try:
            chat_completion = client.chat.completions.create(
                messages=messages,
                model=model,
            )  
            return(groq_response_senitizer(chat_completion))
        except Exception as e:
            return e
def check_groq_api(key):
    return True
def groq_response_senitizer(response):
    final = {}
    try:
        answer = []
        for choice in response.choices:
            answer.append(choice.message.content)
        final['output'] = answer
    except:
        print('Unable to parse Response choices \n',response)
        return False
    try:
        final['Other'] = {}
    except:
        print('Unexpected Error')
        return False
    try:
        final['Other']['id'] = response.id
    except:
        print('Unable to get ID')
    return final

def MyGroq(messages,key,model='llama-3-70b'):
    
    if(key):
        if(check_groq_api(key)):
            pass
        else:
            return 'Not Working API key'
    else:
        return 'Provide a Valid API key'
    print(type(messages))
    print(model)
    try:
        messages = json.loads(messages)
    except:
        return 'Type: Invalid Message Formate \nType of Message is Not JSON santizable'
    if(model == 'llama-3-70b'):
        return GroqMyClient.Groq_ask(messages,'llama3-70b-8192',key)
    elif(model == 'llama-3-8b'):
        return GroqMyClient.Groq_ask(messages,'llama3-8b-8192',key)

    elif(model == 'mixtral-8x7b'):
        return GroqMyClient.Groq_ask(messages,'mixtral-8x7b-32768',key)
    else:
        return 'Now a known Model'
    return 'Under Maintainance'