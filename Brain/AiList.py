from LLM_function import *
def AIs():
    llm_list = {'Groq-llama-3-70b':
            {
            'name': 'llama-3-70b',
            'provider': 'Groq',
            'function':Groq,
            'paramters':['messages','key','model']
            },
        'Groq-llama-3-8b':
            {
            'name': 'llama-3-8b',
            'provider': 'Groq',
            'function':Groq,
            'paramters':['messages','key','model']
            },
        'Groq-mixtral-8x7b':
            {
            'name': 'mixtral-8x7b',
            'provider': 'Groq',
            'function':Groq,
            'paramters':['messages','key','model']
            },
            }
    return llm_list