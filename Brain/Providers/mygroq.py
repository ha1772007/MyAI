import json
from groq import Groq
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
            final['other'] = {}
        except:
            print('Unexpected Error')
            return False
        try:
            final['other']['id'] = response.id
        except:
            print('Unable to get ID')
        return final
class GroqMyClient():
    def __init__(self):
        pass
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
            return {
                'output':str(e),
                'other':{
                    'Type':'Error'
                }
            }
    
