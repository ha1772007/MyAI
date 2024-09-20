// import {langchain_connect, qwen_space} from "/js/chain/functions.js";
function checknu(param){
    return(param !== undefined && param !== null)
}


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
    creation_chain(conversation, others = { 'tools': ['search'] }).then(answer => {
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
    $('#send_input').val('')
    if (message_context !== '' && message_context !== null && message_context !== undefined) {
        append_user(message_context, message_context)
        let id = create_ai_id();
        conversation.push({ 'role': 'user', 'context': message_context });
        creation_chain(conversation, others = { 'tools': ['search'] }).then(answer => {
            append_ai(id,answer.content, answer.DirectResult)
        })

    } else {
        console.log('Plz provide a valid user message')
    }
    console.log(conversation)

}

function creation_chain(conversation, others) {
    return new Promise(resolve => {
        fetch('models/models.json').then(response => response.json()).then(listofmodel => {
            let con = conversation;
            if (checknu(listofmodel) && checknu(getCookie('default')) && checknu($.parseJSON(getCookie('default')).provider)) {
                let functionname = undefined
                for (let thisprovider in listofmodel['Chat Models']) {
                    let chat_models = listofmodel['Chat Models'];
                    thisprovider = chat_models[thisprovider]
                    console.log(thisprovider)
                    if (thisprovider['provider_id'] == $.parseJSON(getCookie('default')).provider) {
                        functionname = thisprovider['function']
                    }
                }
                if (checknu(functionname)) {
                    console.log(functionname)
                    window[functionname](con, others = others).then(response => {
                        if (response.additional_kwargs == undefined || response.additional_kwargs.tool_calls == undefined || response.additional_kwargs.tool_calls.length < 1 || response.additional_kwargs.tool_calls == null) {
                            console.log('No tool confirm')
                            resolve(response)
                        } else {
                            console.log('tool confirm')
                            if (con[con.length - 1]['role'] == 'user') {
                                let lastmessage = con[con.length - 1]['context']
                                processTools(response, lastmessage).then(response => {
                                    con[con.length - 1]['context'] = response;
                                    creation_chain(con, others = {}).then(finalresp => {
                                        resolve(finalresp)
                                    })
                                })

                            } else {
                                create_error('last Message is not from User')
                            }
                        }
                    })
                } else {
                    create_error('Provider Unavailable')
                }
            } else {
                create_error('Default Setting is Not As Expecting try Clearing Up Catches and other browsing data')
            }
        })
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
    let finalOutput = `Here is User Query ${lastmessage}\n <tool-call-output>` + calloutputs.join('\n') + `</tool-call-output>`;
    console.log(finalOutput);
    return finalOutput;
}