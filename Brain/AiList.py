from Brain.LLM_function import *
def AIs():
    llm_list = {
        'Groq-llama-3-70b':
            {
            'name': 'llama-3-70b',
            'provider': 'Groq',
            'function':MyGroq,
            'paramters':['messages','key','model']
            },
        'Groq-llama-3-8b':
            {
            'name': 'llama-3-8b',
            'provider': 'Groq',
            'function':MyGroq,
            'paramters':['messages','key','model']
            },
        'Groq-mixtral-8x7b':
            {
            'name': 'mixtral-8x7b',
            'provider': 'Groq',
            'function':MyGroq,
            'paramters':['messages','key','model']
            },
        'gemini-1.5-pro':
            {
            'name': '1.5-pro',
            'provider': 'gemini',
            'function':MyGemini,
            'paramters':['messages','key','model']
            },
        'gemini-1.5-flash':
            {
            'name': '1.5-flash',
            'provider': 'gemini',
            'function':MyGemini,
            'paramters':['messages','key','model']
            },
            }
    return llm_list