function start_chat(url){
    $("#iframe").attr("src",url)
    $("#conversation_history").html("")
    $("#chat_with_webpage").show();
}
function generate_random_id_for_make_chat(){
    let random_string = generateRandomString(7)
    if($(`#chat_${random_string}`).length == 0){
        return random_string
    }else{
        return generate_random_id_for_make_chat()
    }
}
function make_chat() {
    if (window['if_message_allowed'] != false) {
        // Part 1 (Make a Loading Message Output Box and Pause Send Message)
        let conversation_history = [{ 'role': 'system', 'context': "Some Message" }];
        window["if_message_allowed"] = false;
        let user_message = $("#conversation_message").val()
        if(user_message.length <1){
            console.log("User Message is Empty")
            window['if_message_allowed'] = true

            return "Return With Error"
        }
        $('#conversation_history').append(`<div class="user_message w-full h-auto p-2 space-y-2 bg-neutral-800 text-neutral-200 rounded-lg" content="${Stable_encoder(user_message.trim())}">${user_message.trim()}</div>`)
       
        let id_id = generate_random_id_for_make_chat()
        // Part 2 (Conversation History Getter)
        $('#conversation_history').find("div").each(function () {
            if ($(this).hasClass("user_message")) {
                conversation_history.push({ 'role': 'user', 'context': Stable_decoder($(this).attr("content")).trim() });
            } else if ($(this).hasClass("ai_message")) {
                conversation_history.push({ 'role': 'ai', 'context': Stable_decoder($(this).attr("content")).trim() });
            }
        });
        console.log(conversation_history);
        $('#conversation_history').append(`<div id="${id_id}" class="ai_message w-full h-auto p-2 space-y-2 bg-neutral-800 text-neutral-200 rounded-lg">Getting Response ... </div>`)
        // Part 3 (Send to AI)
        let cookie = $.parseJSON(getCookie('default')) || {"model": '72B', "provider": 'qwen_space', "api": 'No API', "api_name": 'default-1'};
        if(cookie == undefined || cookie == null){
            cookie = {"model": '72B', "provider": 'qwen_space', "api": 'No API', "api_name": 'default-1'}
        }
        window[models['Chat Models'][cookie.provider]["function"]](conversation_history, {}).then(AI_response => {

            console.log(AI_response);
            $(`#${id_id}`).attr("content",Stable_encoder(AI_response.content))
            $(`#${id_id}`).html(converter.makeHtml(AI_response.content.trim()))
            window['if_message_allowed'] = true
        });
    } else {
        console.log("previous Response is not still completed wait for it to complete")
    }
}