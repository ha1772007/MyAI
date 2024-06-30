import google.generativeai as genai
def gemini_history_senitizer(messages):
    try:
        ifsystemadded = False
        ifprevioususer = False
        lastmessage = 'not added Up to Now'
        for no,message in enumerate(messages):
            current_role = message['role']
            if(no != (len(messages) - 1)):
                if(current_role == 'System' and ifsystemadded == False):
                    ifsystemadded = True
                elif(current_role == 'System' and ifsystemadded == False):
                    raise Exception('System Prompt added More Than One Time')
                elif(current_role == 'user' and ifprevioususer == False):
                    ifprevioususer = True
                    pass
                elif(current_role == 'user' and ifprevioususer == True):
                    raise Exception('User Prompt added More Than One Time In Sequence')
                elif(current_role == 'model' and ifprevioususer == True):
                    ifprevioususer = False
                    pass
                elif(current_role == 'model' and ifprevioususer == False):
                    raise Exception('Model Prompt added More Than One Time In Sequence')
                else:
                    raise Exception('Role Not Recognized')
            else:
                if(current_role == 'user' and ifprevioususer == False):
                    lastmessage = message
                    ifprevioususer = True
                else:
                    raise Exception('Either Last message is not from user ,Two simulatneous user messages were added or System prompt were given more than two times')
        return [messages[:-1],lastmessage.text]
    except Exception as e:
        return e 

class GeminiMyClient():
    def Gemini_ask(messages,model,api):
        genai.configure(api_key=api)
        generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
        }
        model = genai.GenerativeModel(
        model_name="gemini"+"-"+model,
        generation_config=generation_config,
        )
        history = gemini_history_senitizer(messages)
        chat_session = model.start_chat(
        history=history[0]
        )

        response = chat_session.send_message(history[1])

        return response
