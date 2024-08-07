function append_user(message,full){
    let template = `<div class="message-content human-message h-auto w-[99%] flex p-2" content='${Stable_encoder(full)}'>
    <div class="w-[90%] bg-dark-2 ml-[10%] p-2 rounded-md">${message}</div>
  </div>`
  $('#message_container').append(template)
}
function append_ai(message,content){
    let template = `<div class="message-content AI-message h-auto w-[99%] flex p-2" content="${Stable_encoder(content)}">
    <div class="w-[100%] bg-dark-2 rounded-l-md p-2 min-h-[20vh]">${message}</div>
    
  </div>`
  $('#message_container').append(template)
}