import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";
let available_tools = [
    {
        "name": "search",
        "description": "Search Internet For Related Query and Provide Uptodate query",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search Query Follow the General Search Methods to get better result"
                }
            },
            "required": ["query"]
        }
    },
]
function langchain_connect(chain, others) {
    let provider;
    let endpoint;
    console.log(others)
    if (others['flash_tool']) {
        provider = "Flash-Tool"
        endpoint = "https://ha1772007-flash-tool.hf.space/"

    } else {
        provider = $.parseJSON(getCookie('default')).provider
        endpoint = 'https://ha1772007-langchain-simple-server.hf.space/'
    }
    return new Promise(resolve => {
        try {
            if ($.parseJSON(getCookie('default')) !== undefined && $.parseJSON(getCookie('default')) !== null && $.parseJSON(getCookie('default')).api !== null && $.parseJSON(getCookie('default')).provider !== null && $.parseJSON(getCookie('default')).model !== null) {
                let jsonData;
                try {
                    jsonData = { conversation: chain, provider: provider, model: $.parseJSON(getCookie('default')).model, api: $.parseJSON(getCookie('default')).api, other: others };
                    console.log(jsonData)
                } catch (error) {
                    create_error('settings', 'Default model or provider is not as expected')
                }
                $.ajax({
                    url: endpoint, // Replace with your endpoint URL
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
                        console.log(response)
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
};


async function qwen_space(chain, other) {
    if (other["flash_tool"]) {
        return await langchain_connect(chain, other)
    }
    let asks = qwen_space_parser(chain);
    if (checknu(asks)) {
        let client = await Client.connect("Qwen/Qwen2-72B-Instruct");
        let result = await client.predict("/model_chat", {
            query: asks[1],
            history: asks[2],
            system: asks[0],
        });
        console.log(result.data)
        console.log(result.data.at(1).at(-1).at(-1));
        return {
            "content": result.data.at(1).at(-1).at(-1),
            "additional_kwargs": {},
            "type": "ai",
            "name": null,
            "example": false,
            "tool_calls": [],
            "invalid_tool_calls": [],
            "usage_metadata": {},
            "DirectResult": result.data.at(1).at(-1).at(-1)
        }

    }
};

function qwen_space_parser(chain) {
    console.log(chain)
    let system_message = "";
    let toreturn = [];
    let user_message = ""
    let i = 0
    while (i <= chain.length - 1) {
        if (chain[i]['role'] == 'user' && checknu(chain[i + 1]) && chain[i + 1]['role'] == 'ai') {
            toreturn.push([chain[i]['context'], chain[i + 1]['context']])
            i += 2
        } else if (chain[i]['role'] == 'system') {
            system_message += chain[i]['context']
            i += 1
        } else if (i == chain.length - 1 && chain[i]['role'] == 'user') {
            user_message = chain[i]['context']
            i += 1;
        } else {
            create_info('unexpected user AI message Template', 'danger')
            i += 1;
        }
    }
    console.log([system_message, user_message, toreturn])
    if (system_message == '') {
        system_message = "You are an Helpfull AI assistant"
    }
    if (user_message == '') {
        create_error('User Message', 'No User Message')
        return null
    } else {
        return [system_message, user_message, toreturn]
    }


};
async function openai_completions(conversationz, other, param) {
    if (other["flash_tool"]) {
        return await langchain_connect(conversationz, other)
    } else {
        let conversation = []
        for (let c in conversationz) {
            c = conversationz[c]
            console.log(c)
            if (c["role"] == "ai") {
                c["role"] = "assistant"
            }
            conversation.push({ "role": c['role'], "content": c['context'] })
        }
        let endpoint = param.endpoint;
        let data_to_send = {
            model: $.parseJSON(getCookie('default')).model,
            messages: conversation
        }
        let tools = []
        if (param['tools'] === true) {
            for (let c in other['tools']) {
                c = other['tools'][c]
                for (let index in available_tools) {
                    let value = available_tools[index];
                    if (value['name'] = c) {
                        tools.push({ "type": "function", "function": value })
                    }
                }
            }
            if(tools.length > 0){
            data_to_send.tools = tools;
            }
        }
        console.log(tools)
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${$.parseJSON(getCookie('default')).api}`
            },
            body: JSON.stringify(data_to_send)
        });
        console.log("Response Status Code" + structuredClone(response.status))

        const data = await response.json();
        if (response.status !== 200) {
            try {
                // return {
                //     "content": data.choices[0].message.content,
                //     "additional_kwargs": impulsive_parser(),
                //     "type": "ai",
                //     "name": null,
                //     "example": false,
                //     "tool_calls": [],
                //     "invalid_tool_calls": [],
                //     "usage_metadata": {},
                //     "DirectResult": data.choices[0].message.content
                // }
                // Inpulisve Caller Code To be Added If required
            } catch {
                throw new Error("Unable to get valid response from API")
            }
        } else {
            let final = data.choices[0].message
            if (checknu(final['tool_calls'])) {
                let additional_kwargs = {
                    "tool_calls": final.tool_calls
                };
                return {
                    "content": "TOOL_CALL",
                    "additional_kwargs": additional_kwargs,
                    "type": "ai",
                    "name": null,
                    "example": false,
                    "tool_calls": [],
                    "invalid_tool_calls": [],
                    "usage_metadata": {},
                    "DirectResult": "TOOL_CALL"
                }
            } else if (checknu(final['content'])) {
                return {
                    "content": final.content,
                    "additional_kwargs": {},
                    "type": "ai",
                    "name": null,
                    "example": false,
                    "tool_calls": [],
                    "invalid_tool_calls": [],
                    "usage_metadata": {},
                    "DirectResult": final.content
                }
            } else {
                throw new Error("Response With Blank content")
            }
        }
    }
}
function openai_model(param) {
    return new Promise(resolve => {
        $.ajax({
            url: param['endpoint'] + "models", // Replace with your endpoint URL
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {

                let modellist = []
                response.forEach(element => {
                    modellist.push(element['name'])
                });
                // console.log(modellist)
                resolve(modellist)
            },
            error: function (xhr, status, error) {
                create_error('Conection', `Unable to connect to Retrive model List From ${param['endpoint']}`)
                console.log('xhr response\n' + xhr + '\n' + 'status response\n' + status + '\n' + 'error\n' + error + '\n')
                console.log({ message: error, type: 'Error' })
                resolve([])
            }
        });
    })
}
window.available_tools = available_tools;
window.openai_completions = openai_completions
window.openai_model = openai_model
window.qwen_space = qwen_space;
window.langchain_connect = langchain_connect;