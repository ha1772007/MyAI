// import {langchain_connect, qwen_space} from "/js/chain/functions.js";
function checknu(param){
    return(param !== undefined && param !== null)
}


function chain_started_after_error() {
    $('#send_buttton').prop('disabled', true)
    let conversation = [
        {
          role: 'system',
          context: `You are a helpful and intelligent AI managed by MyAI. You have access to multiple tools, and you will receive the output of these tools embedded in user queries. Do not call a function again if it has already been called, even if it did not return valid output. If a message contains "<tool-call-output>tool call info</tool-call-output>", do not call the same tool again.
            
            For mathematical expressions:
            - Use \\( ... \\) for inline math expressions that are part of a text.
            - Use \\[ ... \\] or $$ ... $$ for display math when the expression should appear centered on its own line, separated from the surrounding text.
            - Do not use $ ... $ instead use \\( ... \\) since one $ is most command and can make errors
            examples:
            \\(y=mx\\)
            ... \\[y=mx\\] ...
            Ensure LaTeX formatting is accurate and used appropriately for presenting mathematical equations.`
        }
      ];
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
    let conversation = [
        {
          role: 'system',
          context: `You are a helpful and intelligent AI managed by MyAI. You have access to multiple tools, and you will receive the output of these tools embedded in user queries. Do not call a function again if it has already been called, even if it did not return valid output. If a message contains "<tool-call-output>tool call info</tool-call-output>", do not call the same tool again.
            
            For mathematical expressions:
            - Use \\( ... \\) for inline math expressions that are part of a text.
            - Use \\[ ... \\] or $$ ... $$ for display math when the expression should appear centered on its own line, separated from the surrounding text.
            - Do not use $ ... $ instead use \\( ... \\) since one $ is most command and can make errors
            examples:
            \\(y=mx\\)
            ... \\[y=mx\\] ...
            Ensure LaTeX formatting is accurate and used appropriately for presenting mathematical equations.`
        }
      ];
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
        creation_chain(conversation, others = { 'tools': ['search']}).then(answer => {
            append_ai(id,answer.content, answer.DirectResult)
        })

    } else {
        console.log('Plz provide a valid user message')
    }
    console.log(conversation)

}

function creation_chain(conversation, others) {
    return new Promise(resolve => {
        fetch('models/models.json?r=100').then(response => response.json()).then(listofmodel => {
            let con = conversation;
            let flash_tool = false
            if (checknu(listofmodel) && checknu(getCookie('default')) && checknu($.parseJSON(getCookie('default')).provider)) {
                let functionname = undefined
                for (let thisprovider in listofmodel['Chat Models']) {
                    let chat_models = listofmodel['Chat Models'];
                    thisprovider = chat_models[thisprovider]
                    console.log(thisprovider)
                    if (thisprovider['provider_id'] == $.parseJSON(getCookie('default')).provider) {
                        functionname = thisprovider['function'];
                        if(others['tools'] !== undefined){
                        flash_tool = thisprovider['flash_tool']
                    }
                    }
                }
                if (checknu(functionname)) {
                    console.log(functionname)
                    others['flash_tool'] = flash_tool
                    console.log("Flash Tool is "+others['flash_tool'])
                    window[functionname](con, others = others).then(response => {
                        if (response.additional_kwargs == undefined || response.additional_kwargs.tool_calls == undefined || response.additional_kwargs.tool_calls.length < 1 || response.additional_kwargs.tool_calls == null) {
                            console.log('No tool confirm')
                            if(others['flash_tool']){
                                creation_chain(con, others = {}).then(finalresp => {
                                    resolve(finalresp)
                                })
                            }else{
                            resolve(response)
                        }
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