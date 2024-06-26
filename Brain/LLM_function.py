import json
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

def Groq(messages,key,model='llama-3-70b'):
    from groq import Groq
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
        client = Groq(
        api_key=key,
        )
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-70b-8192",
        )  
        return(groq_response_senitizer(chat_completion))
    elif(model == 'llama-3-8b'):
        client = Groq(
        api_key=key,
        )

        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-8b-8192",
        )
        return(groq_response_senitizer(chat_completion))

    elif(model == 'mixtral-8x7b'):
        client = Groq(
        api_key=key,
        )

        chat_completion = client.chat.completions.create(
            messages=messages,
            model="mixtral-8x7b-32768",
        )
        return(groq_response_senitizer(chat_completion))
    else:
        return 'Invaide Model'
    return 'Under Maintainance'