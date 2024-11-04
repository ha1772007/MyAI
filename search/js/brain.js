function generateRandomString(length, characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
var converter = new showdown.Converter();
function chat() {
    alert("This Feature is Currently Disabled.Plz Wait For This To become Completely Ready")
}
function regenerate() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query == null || query === undefined) {
        alert("Plz enter some search query")
    } else {

    }
}
let models;

fetch("../models/models.json?m=12")
    .then(response => response.json())  // Parse the JSON from the response
    .then(data => {
        console.log(data);  // You can now use the `data` object, which is your JSON
        models = data;       // Assign the JSON data to the `models` variable
    })
    .catch(error => {
        console.error('Error fetching the JSON:', error);
    });
function generate(response, search_query) {
    $("#AI_answer").html(`
        <div class="h-full w-full animate-plus space-y-2 py-2 mb-2">
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-4/5"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-full"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-6/12"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-5/12"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-6/12"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-4/12"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-10/12"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-3/5"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-10/12"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-5/12"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-full"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-full"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-full"></div>
                            <div class="bg-cyan-900 rounded-md h-[5vh] w-full"></div>
                    </div>
        `)
    let cookie = $.parseJSON(getCookie("default")) || {"model": '72B', "provider": 'qwen_space', "api": 'No API', "api_name": 'default-1'};
    if (cookie == undefined || cookie == null) {
        cookie = {"model": '72B', "provider": 'qwen_space', "api": 'No API', "api_name": 'default-1'}
    }
    if (models == null || models == undefined) {
        console.log("Model List is Not Loaded Properly")
        return ""
    }
    let result = response.result;
    if (result == undefined) {
        console.log("No Response For Search")
    }
    let userContent = `
    Here is Internet Search Result
    ${JSON.stringify(result)}

    Here is Search Query
    ${search_query}
    `;
    let messages = [
        { 'role': 'system', 'context': "You are an expert AI search Engined Buil by MyAI. You Are Provided Internet search result and user query for the response of which you provide Appropriate output which best answers the user query" },
        { 'role': 'user', 'context': userContent }
    ]
    let other = {}
    let AI_response;
    window[models['Chat Models'][cookie.provider]["function"]](messages, other).then(AI_response => {

        console.log(AI_response);
        $('#AI_answer').html(`<div class="mb-2 w-full h-full">
            ${converter.makeHtml(AI_response.content)}
            </div>`)
    });

}

function make_summary(webpage,container_id) {
    let cookie = $.parseJSON(getCookie("default")) || {"model": '72B', "provider": 'qwen_space', "api": 'No API', "api_name": 'default-1'};
    let userContent = `
    Summarize in about 500 words
    Here is webpage
    ${webpage}
    
    `;
    let messages = [
        { 'role': 'system', 'context': "You are an expert Text summarizer you have to extract out important information from text in about 100 words" },
        { 'role': 'user', 'context': userContent }
    ]
    window[models['Chat Models'][cookie.provider]["function"]](messages, {}).then(AI_response => {

        console.log(`
            Here is AI generated Webpage Summary
            ${AI_response.content}`);
        $(`#show_${container_id}`).html(AI_response.content)
        $(`#containerid_${container_id}`).attr('summary',Stable_encoder(AI_response.content))
    });
}

function summary(container_id) {
    $(`.all_${container_id}`).css("border","none")
    $(`#summary_${container_id}`).css({ "border-bottom": "2px solid rgb(8, 145, 178)"})
    $(`#show_${container_id}`).html("Generating Summary Please Wait ...")
    let previous_summary = $(`#containerid_${container_id}`).attr('summary')
    if (previous_summary === undefined || previous_summary === null) {
        let previous_webpage = $(`#containerid_${container_id}`).attr('webpage')
        if (previous_webpage == undefined || previous_webpage == null) {
            let url = Stable_decoder($(`#containerid_${container_id}`).attr('url'))
            fetch(`https://mangoman7002-webapi.hf.space/webpage`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "url": url
                })
            })
                .then(response => response.json())
                .then(content => {
                    console.log(content)
                    $(`#containerid_${container_id}`).attr('webpage',Stable_encoder(content.webpage))
                    result_embedding[url] = content.embedding_data;
                    make_summary(content.webpage,container_id)
                })
                .catch(error => console.error(error));

        } else {
            make_summary(previous_webpage,container_id)
        }

    } else {
        $(`#show_${container_id}`).html(Stable_decoder(previous_summary))
    }
}
function show_content(id){
    $("#content_view").css("display","flex")
    $("#content_view_inner").html(converter.makeHtml($(`#${id}`).html().trim()))
}

function original(id){
    $(`.all_${id}`).css("border","none")
    $(`#original_${id}`).css({ "border-bottom": "2px solid rgb(8, 145, 178)"})
    let previous_original = $(`#containerid_${id}`).attr('abstract')
    $(`#show_${id}`).html(Stable_decoder(previous_original))

}