

function chain_started_after_error() {
    $('#send_buttton').prop('disabled', true)
    let conversation = [{ 'role': 'system', 'context': 'You are an helpfull and intelligent AI managed By MyAI and you have access to mutiple tools and you will get output of them embedded in user query. Do not call function again and again if result already provided in query' }];
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
    creation_chain(conversation,others={'tools':['search']}).then(answer => {
        append_ai(answer.content, answer.DirectResult)
    })

    console.log(conversation)

}


function chain_started() {
    $('#send_buttton').prop('disabled', true)
    let conversation = [{ 'role': 'system', 'context': 'You are an helpfull and intelligent AI managed By MyAI and you have access to mutiple tools and you will get output of them embedded in user query. Do not call function again and again even it does not return valid output.If Message Contains <tool-call-output>tool call info</tool-call-putput> then do not call same tool again' }];
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
        append_user(message_context,message_context)
        conversation.push({ 'role': 'user', 'context': message_context });
        creation_chain(conversation).then(answer => {
            append_ai(answer.content, answer.DirectResult)
        })

    } else {
        console.log('Plz provide a valid user message')
    }
    console.log(conversation)

}

function creation_chain(conversation,others) {
    return new Promise(resolve => {
        let con = conversation
        create_conversation(con,others=others).then(response => {
            if (response.additional_kwargs.tool_calls == undefined || response.additional_kwargs.tool_calls.length < 1 || response.additional_kwargs.tool_calls == null) {
                console.log('No tool confirm')
                resolve(response)
            } else {
                console.log('tool confirm')
                if (con[con.length - 1]['role'] == 'user') {
                    let lastmessage = con[con.length - 1]['context']
                    processTools(response, lastmessage).then(response => {
                        con[con.length - 1]['context'] = response;
                        creation_chain(con,others={}).then(finalresp => {
                            resolve(finalresp)
                        })
                    })

                } else {
                    create_error('last Message is not from User')
                }
            }
        })
    })
}

function create_conversation(chain,others) {
    return new Promise(resolve => {
        try {
            if ($.parseJSON(getCookie('default')) !== undefined && $.parseJSON(getCookie('default')) !== null && $.parseJSON(getCookie('default')).api !== null && $.parseJSON(getCookie('default')).provider !== null && $.parseJSON(getCookie('default')).model !== null) {
                try {
                    jsonData = { conversation: chain, provider: $.parseJSON(getCookie('default')).provider, model: $.parseJSON(getCookie('default')).model, api: $.parseJSON(getCookie('default')).api, other: others }
                } catch (error) {
                    create_error('settings', 'Default model or provider is not as expected')
                }
                $.ajax({
                    url: 'http://localhost:1777', // Replace with your endpoint URL
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(jsonData),
                    success: function (response) {
                        $('#send_buttton').prop('disabled', false)
                        try {
                            response = $.parseJSON(response)
                        } catch (error) {
                            create_error('JSON', `Response is invalid JSON\n${response.toString()}`)
                            console.log(error.toString())
                        }
                        console.log({ message: response, type: 'Success' });
                        resolve(response)
                    },
                    error: function (xhr, status, error) {
                        create_error('Conection', 'Unable to connect to Endpoint See console for more details')
                        console.log('xhr response\n' + xhr + '\n' + 'status response\n' + status + '\n' + 'error\n' + error + '\n')
                        console.log({ message: error, type: 'Error' })
                    }
                });
            } else {
                create_error('Cookies', 'Setup Default Model and API from left setting ICON problem still remains same then Clear Cookies')
                create_info('Setup Default Model and API from left setting ICON problem still remains same then Clear Cookies')
                console.log({ message: 'default setting is not as expected', type: 'Error' })
            }
        } catch (error) {
            create_error('Error', error.message)
            console.log({ message: error.message, type: 'Error' })
        }
    })
}
async function processTools(response, lastmessage) {
    let calloutputs = [];
    let tools = response.additional_kwargs.tool_calls;

    for (let thistool of tools) {
        try {
            let funcName = thistool.function.name;
            let args = thistool.function.arguments ? JSON.parse(thistool.function.arguments) : {};
            let func = window[funcName];

            if (typeof func === 'function') {
                let result = await func(args);
                calloutputs.push(result);
            } else {
                console.error(`Function ${funcName} is not defined`);
            }
        } catch (error) {
            console.error(`Error calling function ${thistool.function.name}: ${error}`);
        }
    }

    // Return the result as an object
    let finalOutput = `Here is User Query ${lastmessage}\n <tool-call-output>` + calloutputs.join('\n')+`</tool-call-output>`;
    console.log(finalOutput);
    return finalOutput;
}