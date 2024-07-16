function chain_started() {
    $('#send_buttton').prop('disabled',true)
    let conversation = [];
    $('.message-content').each(function (i, current) {
        if (current.classList.contains('human-message')) {
            try {
                let context = $(current).attr('content');;
                conversation.push({ 'role': 'user', 'context': atob(decodeURIComponent(context)) });
            } catch (error) {
                console.log('Error while making conversation lists\n', error.toString());
            }
        }else if(current.classList.contains('AI-message')){
            try {
                let context = $(current).attr('content')
                conversation.push({ 'role': 'ai', 'context': atob(decodeURIComponent(context)) });
            } catch (error) {
                console.log('Error while making conversation lists\n', error.toString());
            }
        }

    });
    message_context = $('#send_input').val()
    if (message_context !== '' && message_context !== null && message_context !== undefined) {
        append_user(message_context,message_context)
        $('#send_input').val('')
        search_data = search(message_context).then((response)=>{
            final_content = `Here is Websearch Data:\n${response}\nHere is user Question:\n${message_context}`
            conversation.push({ 'role': 'user', 'context': final_content});
            create_conversation(conversation);
        })
    } else {
        console.log('Plz provide a valid user message')
    }
    console.log(conversation)
    
}

function create_conversation(chain) {
    try {
        if ($.parseJSON(getCookie('default')) && $.parseJSON(getCookie('default')).model.provider == $.parseJSON(getCookie('default')).api.provider) {
            jsonData = { conversation: chain, provider: $.parseJSON(getCookie('default')).model.provider,model: $.parseJSON(getCookie('default')).model.model, api: $.parseJSON(getCookie('default')).api.key }
            $.ajax({
                url: 'https://ha1772007-langchain-simple-server.hf.space/', // Replace with your endpoint URL
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(jsonData),
                success: function (response) {
                    try{
                        response = $.parseJSON(response)
                    }catch(error){
                        console.log(error.toString())
                    }
                    console.log({ message: response, type: 'Success' });
                    try{
                        append_ai(response.content,response.DirectResult)
                    }catch(error){
                        console.log(error.toString())
                    }
                },
                error: function (xhr, status, error) {
                    console.log('xhr response\n' + xhr + '\n' + 'status response\n' + status + '\n' + 'error\n' + error + '\n')
                    console.log({ message: error, type: 'Error' })
                }
            });
        } else {
            console.log({ message: 'default setting is not as expected', type: 'Error' })
        }
    } catch (error) {
        console.log({ message: error.message, type: 'Error' })
    }
}