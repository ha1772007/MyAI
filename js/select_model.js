function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Remove trailing '='
}
function select_model() {
  location.href = "MyAI/select_model.html";

}
let models;

fetch("models/models.json?m=12")
  .then(response => response.json())  // Parse the JSON from the response
  .then(data => {
    console.log(data);  // You can now use the `data` object, which is your JSON
    models = data;       // Assign the JSON data to the `models` variable
    insert_model_list(); // Call the function after data is fetched
  })
  .catch(error => {
    console.error('Error fetching the JSON:', error);
  });


function select_key(model, provider) {
  let product_id = generateRandomNumber(10)
  let api_keys;
  if ($.parseJSON(getCookie('api')) == undefined) {
    api_keys = {}
  } else {
    api_keys = $.parseJSON(getCookie('api'))[provider]
  }
  let toappendstr = ``
  for (let key in api_keys) {
    toappendstr += `<div onclick="select_default_api('${model}','${provider}','${key}','${api_keys[key]}')" class="h-[6vh] flex p-2 space-x-2 rounded-xl text-white hover:border-2 hover:border-green-500">
        <div class="px-2">${key}</div>
        <div class="flex-grow text-center">${api_keys[key]}</div>
      </div>`
  }
  let default_api_index =1;
  for (let key in models['Chat Models'][provider]['default_api']){
    let illu = models['Chat Models'][provider]['default_api']
    toappendstr += `<div onclick="select_default_api('${model}','${provider}','default-${default_api_index}','${illu[key]}')" class="h-[6vh] flex p-2 space-x-2 rounded-xl text-white hover:border-2 hover:border-green-500">
        <div class="px-2">default-${default_api_index}</div>
        <div class="flex-grow text-center">${illu[key]}</div>
      </div>`;
      default_api_index++;
  }
  let html_content = `<div class="absolute z-10 w-full h-full bg-black opacity-35"></div>
  <div class="bg-gray-900 flex flex-col absolute z-40 w-[75%] mx-[12.5%] h-[60%] my-[10%] border-2 rounded-lg py-2">
    <div id='append_api_${product_id}' class="h-[90%] overflow-auto p-2 ">
    ${toappendstr}
    </div>
    <div class="h-[10%] flex w-full space-x-2 px-1">
      <input class="h-full w-1/3 rounded-md p-1" type="text" name="" id="add_api_name_${product_id}" placeholder="API key Name">
      <input class="h-full w-1/3 rounded-md p-1" type="text" name="" id="add_api_value_${product_id}" placeholder="API key">
      <button onclick="add_api('${product_id}','${provider}','${model}')" class="h-full w-1/3 bg-green-400 rounded-md">Add/Update API</button>
    </div>
  </div>`
  $('body').prepend(html_content);
}
function select_default_api(model, provider, api_name, api_key) {
  default_set = {
    'model': model,
    'provider': provider,
    'api': api_key,
    'api_name': api_name
  }
  setCookie('default', default_set)
  location.href = "MyAI/index.html"
}
function add_api(product_id, provider, model) {

  let add_api_name = $(`#add_api_name_${product_id}`).val();
  let add_api_value = $(`#add_api_value_${product_id}`).val();
  let if_redirec_at_end = false;
  if ($.parseJSON(getCookie('api')) !== undefined && $.parseJSON(getCookie('api')) !== null) {
    if ($.parseJSON(getCookie('api'))[provider] !== undefined) {
      if ($.parseJSON(getCookie('api'))[provider][add_api_name] === undefined) {
        console.log($.parseJSON(getCookie('api'))[provider][add_api_name]);
        console.log($.parseJSON(getCookie('api'))[provider][add_api_name] === undefined);
        $(`#append_api_${product_id}`).append(`<div onclick="select_default_api('${model}','${provider}','${add_api_name}','${add_api_value}')" class="h-[6vh] flex p-2 space-x-2 rounded-xl text-white hover:border-2 hover:border-green-500">
            <div class="px-2">${add_api_name}</div>
            <div class="flex-grow text-center">${add_api_value}</div>
          </div>`);
      }
    }
  } else {
    if_redirec_at_end = true;
  }

  let intitial_cookie = $.parseJSON(getCookie("api"))
  if (intitial_cookie == undefined) {
    intitial_cookie = {}
  }
  if (intitial_cookie[provider] == undefined || intitial_cookie[provider] == null) {
    intitial_cookie[provider] = {}
  }
  intitial_cookie[provider][add_api_name] = add_api_value;
  setCookie("api", intitial_cookie);
  console.log("add API");
  if(if_redirec_at_end){
    location.reload()
  }

}

function insert_model_list() {
  if (!models) return; // Ensure models is defined

  let chat_models = models['Chat Models'];
  let favourite_model_list = $.parseJSON(getCookie("favourite"))?.models || [];
  if(favourite_model_list === undefined || favourite_model_list === null){
    favourite_model_list = null
  }
  for (let key in chat_models) {
    if (chat_models.hasOwnProperty(key)) {
      let value = chat_models[key];
      value['models'].forEach(element => {
        let onclick_att =  null;
        let image_src = "https://img.icons8.com/ios/50/FFFFFF/star--v1.png";
        for(let index in favourite_model_list){
          if(favourite_model_list[index].model === element && favourite_model_list[index].provider === key){
            console.log("Found in favourite List")
            onclick_att = `remove_favourite('${element}','${key}')`
            image_src = "https://img.icons8.com/material-rounded/24/f71717/star--v1.png"
            break;
          }
        }
        if(onclick_att === null){
          onclick_att = `add_favourite(event,'${element}','${key}')`
        }
        // 
        let this_template = `
        <div onclick="select_key('${element}','${value['provider_id']}')" model_search="${element} ${key}" class="cursor-pointer w-[95%] ml-[2.5%] h-[12%] bg-black hover:shadow-xl shadow-water flex p-2 hover:border-1 transition-all duration-300 ease-out rounded-xl hover:border-white space-x-2">
          <div class="h-full aspect-square rounded-full">
            <img class="w-full h-full"
              src="${value?.meta?.image?.[element] || 'assests/myai.png'}"
              alt="" srcset="">
          </div>
          <div class="flex-grow flex h-full text-white">
            <div class="w-full h-full flex flex-col  space-y-1">
            <div class="h-[60%] w-full font-bold flex justify-between">
                <div>${element}</div>
                <div onclick="${onclick_att}" ><img  id="favouritie_${base64UrlEncode(element)}_${base64UrlEncode(key)}" width="24" height="24" src="${image_src}" alt="star--v1"/></div>
              </div>
              <div class="h-[40%] text-sm space-x-2 flex">
                <span class="">text-generation</span>
                <span class="">${key}</span>
                <span class="flex justify-center items-center h-full"><img class="h-full aspect-square"
                    src="https://img.icons8.com/?size=600&id=83988&format=png&color=FFFFFF" />122K</span>
              </div>
            </div>
          </div>
        </div>`;
        $("#model_div").append(this_template);
      });
    }
  }
}

function add_favourite(event, model, provider) {
  event.stopPropagation();
  console.log('Set Favourite Model Called');

  let default_list = $.parseJSON(getCookie('favourite') || "{}") || {};
  if (default_list == null || typeof default_list === 'undefined' || !default_list.models) {
    default_list = { models: [] };
  }

  let model_list_cookies = default_list.models;

  let alreadyExists = false; // Flag to track if the model is already present

  for (let index = 0; index < model_list_cookies.length; index++) { // Use a regular for loop for arrays
    let z = model_list_cookies[index];
    if (z.model === model && z.provider === provider) {
      console.log("Error: Model Already In favourite List");
      create_info("Model Already In Favorite List", "danger");
      alreadyExists = true;
      break; // Exit the loop if found
    }
  }

  // Add the model ONLY if it doesn't already exist
  if (!alreadyExists) {
    model_list_cookies.push({ model: model, provider: provider });
    default_list.models = model_list_cookies;
    setCookie("favourite", default_list); // Stringify before setting the cookie
    $(`#favouritie_${base64UrlEncode(model)}_${base64UrlEncode(provider)}`).attr("src", "https://img.icons8.com/material-rounded/24/f71717/star--v1.png");
  }
}
// select_model.js (56-67)
function model_search() {
  let model_search_value = $("#model_search_value").val().trim();
  console.log(model_search_value)

  $("#model_div").children("div").each(function () {
    let currentDiv = $(this);
    let modelSearchAttr = currentDiv.attr("model_search");

    if (!modelSearchAttr || !modelSearchAttr.toUpperCase().includes(model_search_value.toUpperCase())) {
      currentDiv.hide();
      console.log("hide")
    } else {
      currentDiv.show();
      console.log("show")
    }
  });
}
function generateRandomNumber(length) {
  // Calculate the maximum possible number of the specified length
  const max = Math.pow(10, length);

  // Calculate the minimum possible number of the specified length
  const min = max / 10;

  // Generate a random number between the minimum and maximum
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
