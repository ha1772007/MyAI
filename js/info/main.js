

async function remove(id,time){
    setTimeout(() => {
        $(`.${id}`).remove();
    }, time*1000);
}
async function create_info(message,color) {
    if(color == undefined || color == null){
        color = "normal"
    }
    if(color == "normal"){
        loader_color = "bg-blue-400"
    }else if(color == "danger"){
        loader_color = "bg-red-400"
    }else{
        loader_color == "bg-blue-400"
    }
    let id = generate_class()
    ifmaked = false
    while (ifmaked) {
        if ($(`.${id}`).length > 0) {
            id = generate_class()
        } else {
            ifmaked = false
        }
    }
    console.log(id)
    context = `<div class="${id} bg-dark-300 bg-opacity-80 mt-[2vh] w-[100%] border-2 border-green-500 p-2 rounded-md">
            <div style='animation: increaseWidth 2s ease-in' class=' h-1 ${loader_color}'></div>
            <div class="w-full h-auto">
            ${message} is message info
            </div>
        </div>`
    $('#infobox').append(context)
    return new Promise((resolve) => {
        resolve(remove(id,2))

    });
}
function create_error(head,message){
    let id = generate_class()
    ifmaked = false
    while (ifmaked) {
        if ($(`.${id}`).length > 0) {
            id = generate_class()
        } else {
            ifmaked = false
        }
    }
    let content = `<div class="${id} h-auto w-[99%] flex p-2">
                    <div
                        class="border-2 border-red-600 flex-col flex w-[50%] justify-between items-center space-x-2 bg-dark-400 rounded-md p-2">
                        <div class="w-full flex justify-between items-center">
                            <span class="text-red-600 text-2xl">Error :- ${head}</span>
                            <span onclick="remove_and_exe('${id}',chain_started_after_error)">
                                <span class="text-4xl material-symbols-outlined cursor-pointer">
                                    frame_reload
                                </span>
                            </span>
                        </div>
                        <span>${message}</span>
                    </div>
                </div>`
    $('#message_container').append(content)
}
function remove_and_exe(classtoremove,exe_function){
    $(`.${classtoremove}`).remove();
    exe_function();
}

function generate_class() {
    return `id-${Math.floor(Math.random() * 100000000)}`
}