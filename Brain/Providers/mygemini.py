import google.generativeai as genai
def gemini_response_senitizer(message):
    pass
def gemini_history_senitizer(messages):
    ifsystemadded = False
    ifprevioususer = False
    lastmessage = 'not added Up to Now'
    for no, message in enumerate(messages):
        current_role = message['role']
        if no != (len(messages) - 1):
            if current_role == 'system' and not ifsystemadded:
                try:
                    system = message['content']
                except:
                    raise Exception('system Message was initaied but not given')
                ifsystemadded = True
            elif current_role == 'system' and ifsystemadded:
                raise Exception('System Prompt added More Than One Time')
            elif current_role == 'user' and not ifprevioususer:
                ifprevioususer = True
            elif current_role == 'user' and ifprevioususer:
                raise Exception('User Prompt added More Than One Time In Sequence')
            elif current_role == 'model' and ifprevioususer:
                ifprevioususer = False
            elif current_role == 'model' and not ifprevioususer:
                raise Exception('Model Prompt added More Than One Time In Sequence')
            else:
                raise Exception('Role Not Recognized')
        else:
            if current_role == 'user' and not ifprevioususer:
                lastmessage = message
                ifprevioususer = True
            else:
                raise Exception('Either Last message is not from user, Two simultaneous user messages were added, or System prompt were given more than two times')
    return [messages[:-1], lastmessage, system]


class GeminiMyClient():
    def Gemini_ask(messages,model,key):
        genai.configure(api_key=key)
        generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
        }
        history = gemini_history_senitizer(messages)
        try:
            model = genai.GenerativeModel(
            model_name="gemini"+"-"+model,
            generation_config=generation_config,
            system_instruction=messages[2],
            )
        except:
            model = genai.GenerativeModel(
            model_name="gemini"+"-"+model,
            generation_config=generation_config,
            )
        chat_session = model.start_chat(
        history=history[0]
        )

        response = chat_session.send_message(history[1]['content'])

        return response
