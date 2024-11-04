// Here is the Set Favourite Model Code
{/* <div
                class="inline-block cursor-pointer text-neutral-300 hover:text-white rounded-md px-4 py-1 hover:bg-neutral-900 hover:shadow-md hover:px-6 hover:shadow-neutral-700 transition-all ease-in-out duration-300">
                Model1</div> */}

function set_list() {
    let default_list = $.parseJSON(getCookie('favourite'))
    let model_list_cookies = default_list?.models
    if (model_list_cookies === undefined || model_list_cookies == null) {
        model_list_cookies = []
    }
    toappend = ``
    if (model_list_cookies.length > 0) {
        for (let index in model_list_cookies) {
            let z = model_list_cookies[index];
            toappend += `<div onclick="set_model('${z.model}','${z.provider}')" class="inline-block cursor-pointer text-neutral-300 hover:text-white rounded-md px-4 py-1 hover:bg-neutral-900 hover:shadow-md  hover:shadow-neutral-700 transition-all ease-in-out duration-300">
                ${z.provider}/${z.model}</div>`
        }
    }
    toappend+= `<div class="w-full flex justify-center items-center">
                <div onclick="location.href = 'select_model.html'" class="flex space-x-2 cursor-pointer p-2 rounded-md bg-neutral-950 hover:bg-neutral-900 hover:shadow-sm hover:shadow-neutral-600 transition-all ease-in-out duration-300">
                  <img class="max-h-[5vh] aspect-square" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png" alt="brain"/>
                  <div>Add Model</div>
                </div>
              </div> `
    default_list.models = model_list_cookies;
    setCookie('favourite', default_list)
    $('#favourite_models').html(toappend)
}
set_list()
function set_model(model, provider) {
    console.log(`set Model Called \nModel : ${model}\nProvider : ${provider}`)
}
// Here is the Menu JS Code
function set_tool_type(name, option, GivenId, options) {
    console.log(`Here is the Given ID ${GivenId}`)
    let target = "tool_config_select"
    let cookies_get = $.parseJSON(getCookie('tools'))?.selected;
    if (cookies_get === undefined || cookies_get === undefined) {
        cookies_get = []
    }
    let didset = false;
    for (let z in cookies_get) {
        let index = z
        z = cookies_get[z];
        if (z.name === name) {
            didset = true;
            z.type = option;
            $(`[id*=tool_option_]`).css("background-color", "transparent")
            $(`#${GivenId}`).css("background-color", "green")

        }
        cookies_get[index] = z
    }
    if (!didset) {
        cookies_get.push({ "name": name, "type": option });
        set_tool_config(name, target, options, option);
        $(`[id*=tool_option_]`).css("background-color", "transparent");
        $(`#${GivenId}`).css("background-color", "green");
    }
    toappend = $.parseJSON(getCookie('tools'))
    toappend.selected = cookies_get
    setCookie('tools', toappend)
}
function set_tool_config(name, target, options, bydefault, ofset) {
    if (ofset === undefined) {
        ofset = true;
        console.log(`Ofset Value ${ofset}`)
    }
    let tools_cookies = $.parseJSON(getCookie('tools')) || {}; // Simplify initialization
    tools_cookies.selected = tools_cookies.selected || [];
    if (tools_cookies.selected === undefined) {
        tools_cookies.selected = []
    }

    let existingToolIndex = -1;
    for (let i = 0; i < tools_cookies.selected.length; i++) {
        if (tools_cookies.selected[i].name === name) {
            existingToolIndex = i;
            break;
        }
    }
    console.log(existingToolIndex);

    if (existingToolIndex === -1) {
        if (ofset) {
            tools_cookies.selected.push({ name: name, type: bydefault });

            $(`#tool_${encodeURIComponent(name)}`).css('background-color', 'green');
            $(`#${target}`).css('background-color', '#525252');
        }
    } else {
        if (ofset) {
            tools_cookies.selected.splice(existingToolIndex, 1);
            $(`#tool_${encodeURIComponent(name)}`).css('background-color', 'transparent'); // Remove class when removed
        }
        $(`#${target}`).html(``);
    }
    $(`[id*=tool_parent_]`).css('background-color', 'transparent')
    $(`#tool_parent_${encodeURIComponent(name)}`).css('background-color', '#525252');

    setCookie('tools', tools_cookies); // Set cookie with stringified object

    let toAppend = '';
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let thisid = `tool_option_${encodeURIComponent(name)}_${encodeURIComponent(option)}`;
        let set_colour = "";
        if (option === bydefault) {
            set_colour = "bg-[green]"
        }
        toAppend += `<div onclick='set_tool_type("${name}","${option}","${thisid}",${JSON.stringify(options)})' id="${thisid}" class="inline-block cursor-pointer text-neutral-300 hover:text-white rounded-md px-4 py-2 hover:bg-neutral-900 hover:shadow-md hover:px-6 hover:shadow-neutral-700 transition-all ${set_colour} ease-in-out duration-300">${option}</div>`;
    }
    $(`#${target}`).html(toAppend);
}
let intervalId = setInterval(() => {
    console.log("Executed")
    if (typeof getCookie !== 'undefined') {
        clearInterval(intervalId); // Stop the interval once the condition is met

        let current_tool_cookies = $.parseJSON(getCookie('tools'))?.selected;
        if (current_tool_cookies) { // Check if current_tool_cookies is defined and not null
            for (let z of current_tool_cookies) { // Use "of" instead of "in" to iterate over array elements
                console.log([z.name, 'tool_config_select', ['Fast', 'Optimized', 'Expert'], false])
                let target = "tool_config_select";
                $(`#tool_${encodeURIComponent(z.name)}`).css('background-color', 'green');
                $(`[id*=tool_parent_]`).css('background-color', 'transparent')
                $(`#tool_parent_${encodeURIComponent(z.name)}`).css('background-color', '#525252');
                $(`#${target}`).css('background-color', '#525252');
                set_tool_config(z.name, 'tool_config_select', ['Fast', 'Optimized', 'Expert'], 'Optimized', false);
            }
        }
    } else {
        console.log("found Undefined")
    }

}, 100); // Check every 100 milliseconds