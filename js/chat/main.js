function chain_started() {
    $('#send_buttton').prop('disabled',true)
    let conversation = [];
    $('.message-content').each(function (i, current) {
        if (current.classList.contains('human-message')) {
            try {
                let context = $(current).find('.main-content').html();
                conversation.push({ 'role': 'user', 'context': context });
            } catch (error) {
                console.log('Error while making conversation lists\n', error.toString());
            }
        }else if(current.classList.contains('AI-message')){
            try {
                let context = $(current).find('.main-content').html();
                conversation.push({ 'role': 'ai', 'context': context });
            } catch (error) {
                console.log('Error while making conversation lists\n', error.toString());
            }
        }

    });
    message_context = $('#send_input').val()
    if (message_context !== '' && message_context !== null && message_context !== undefined) {
        append_user(message_context)
        $('#send_input').val('')
        conversation.push({ 'role': 'user', 'context': message_context })
    } else {
        console.log('Plz provide a valid user message')
    }
    console.log(conversation)
    create_conversation(conversation)
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
                        append_ai(response.content)
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
