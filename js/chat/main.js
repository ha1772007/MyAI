

function chain_started_after_error() {
    $('#send_buttton').prop('disabled', true)
    let conversation = [];
    $('.message-content').each(function (i, current) {
        if (current.classList.contains('human-message')) {
            try {
                let context = $(current).attr('content');;
                conversation.push({ 'role': 'user', 'context': Stable_decoder(context) });
            } catch (error) {
                console.log('Error while making conversation lists\n', error.toString());
            }
        } else if (current.classList.contains('AI-message')) {
            try {
                let context = $(current).attr('content')
                conversation.push({ 'role': 'ai', 'context': Stable_decoder(context) });
            } catch (error) {
                console.log('Error while making conversation lists\n', error.toString());
            }
        }

    });
    console.log(conversation)
    let message_context = conversation[conversation.length -1]
    if(message_context['role'] =='user'){
        message_context = message_context['context']
    search(message_context).then(search_final_result => {
        final_content = `${search_final_result}Here is user Query:${message_context}`
        conversation[-1] = { 'role': 'user', 'context': final_content }
        create_conversation(conversation);
    })}else{
        console.log('Last Message is not of user')
    }
    console.log(conversation)

}


function chain_started() {
    $('#send_buttton').prop('disabled', true)
    let conversation = [];
    $('.message-content').each(function (i, current) {
        if (current.classList.contains('human-message')) {
            try {
                let context = $(current).attr('content');;
                conversation.push({ 'role': 'user', 'context': Stable_decoder(context) });
            } catch (error) {
                console.log('Error while making conversation lists\n', error.toString());
            }
        } else if (current.classList.contains('AI-message')) {
            try {
                let context = $(current).attr('content')
                conversation.push({ 'role': 'ai', 'context': Stable_decoder(context) });
            } catch (error) {
                console.log('Error while making conversation lists\n', error.toString());
            }
        }

    });
    message_context = $('#send_input').val()
    if (message_context !== '' && message_context !== null && message_context !== undefined) {
        append_user(message_context, message_context)
        $('#send_input').val('')
        search(message_context).then(search_final_result => {
            final_content = `${search_final_result}Here is user Query:${message_context}`
            conversation.push({ 'role': 'user', 'context': final_content });
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
            jsonData = { conversation: chain, provider: $.parseJSON(getCookie('default')).provider, model: $.parseJSON(getCookie('default')).model, api: $.parseJSON(getCookie('default')).api ,other:$.parseJSON(getCookie('other'))}
            $.ajax({
                url: 'https://1777-01j14pts1jfj34jb8eh09cbgg1.cloudspaces.litng.ai', // Replace with your endpoint URL
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(jsonData),
                success: function (response) {
                    $('#send_buttton').prop('disabled', false)
                    try {
                        response = $.parseJSON(response)
                    } catch (error) {
                        create_error('JSON','Response is invalid JSON')
                        console.log(error.toString())
                    }
                    console.log({ message: response, type: 'Success' });
                    try {
                        
                        append_ai(response.content, response.DirectResult)
                    } catch (error) {
                        create_error('Response Output','Response Output does not gives "content" and "DirectResult"')
                        console.log(error.toString())
                    }
                },
                error: function (xhr, status, error) {
                    create_error('Conection','Unable to connect to Endpoint See console for more details')
                    console.log('xhr response\n' + xhr + '\n' + 'status response\n' + status + '\n' + 'error\n' + error + '\n')
                    console.log({ message: error, type: 'Error' })
                }
            });
        } else {
            create_error('Cookies','Setup Default Model and API from left setting ICON problem still remains same then Clear Cookies')
            create_info('Setup Default Model and API from left setting ICON problem still remains same then Clear Cookies')
            console.log({ message: 'default setting is not as expected', type: 'Error' })
        }
    } catch (error) {
        console.log({ message: error.message, type: 'Error' })
    }
}
