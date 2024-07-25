const { getCookies } = require("undici-types");

function load_settings() {
  // intialization of cookies
  if ($.parseJSON(getCookie('default')) == undefined) {
    setCookie('default', { 'model': null, 'api': null, 'provider': null })
  }
  // Reset all changes
  $('#setting_toappend').html('');
  $('#type_bar').html('');
  // Making the setting
  let toappend = ""
  let typebar = ""
  fetch('models/models.json?r=1').then(response => response.json()).then(models => {
    // Setting Up HTML
    console.log(models)
    for (let type in models) {
      typebar += `<li class='border-blue-500 border-2 w-full p-2 rounded-md text-md bg-dark-400 hover:bg-dark-200 cursor-pointer'>
              ${type}
            </li>`
      for (let provider in models[type]) {
        toappend += `<div class='w-full border-white border-2 rounded-lg p-2'><a class="w-full"
          href='${provider['api_url']}'>${provider}</a></div>`
        toappend += `<div class="models space-y-2 grid grid-cols-3 space-x-2 ml-2">`
        console.log(models[type][provider])
        models[type][provider]['models'].forEach(model => {
          toappend += `<div onclick="set_default_model('${models[type][provider]['provider_id']}','${model}')" modelid="${models[type][provider]['provider_id']}-${model}"
            class="cursor-pointer rounded-md border-2 p-2 hover:border-green-600 border-blue-600">
            ${model}
          </div>`
        })
        toappend += `</div>`;
        toappend += `<div class="models grid grid-cols-3 ml-2">`;
        toappend += `<div onclick='add_api("${models[type][provider]['provider_id']}")'
        class="cursor-pointer rounded-md border-2 p-2 hover:border-blue-600 border-red-600 flex"><img
          src="assests/plus-circle.svg" style="filter: invert(1);" class="h-full aspect-square" alt=""><span
          class="ml-2"> Add API</span></div>`
        try{
        thisapi = $.parseJSON(getCookie(models[type][provider]['provider_id'])).api
        console.log(thisapi)
        console.log(`Starting for  ${thisapi} provider`)
        if (thisapi !== undefined | thisapi !== null) {
          thisapi.forEach(oneapi => {
            toappend += `<div onclick='set_default_api("${models[type][provider]['provider_id']}","${oneapi}")'
            apiid="${models[type][provider]['provider_id']}-${thisapi}" class="cursor-pointer rounded-md border-2 p-2 hover:border-green-600 border-blue-600 flex"><span
                class="ml-2">${oneapi.substr(0, 2)}...${oneapi.substr(-2, 2)}</span></div>`
          })
        } else {
          console.log(`No ${provider} API Found in Cookies`)
        }
        
      }catch(error){
        console.log(error)
      }
      toappend += `</div>`
      }
    }
    console.log(toappend);
    console.log(typebar)
    $('#setting_toappend').html(toappend);
    $('#type_bar').html(typebar);
    // TO Change Colour of Ddefaults
    //@ 1. TO change Colour of Default Chat Models
    modelid = `${$.parseJSON(getCookie('default')).provider}-${$.parseJSON(getCookie('default')).model}`;
    $('[modelid="' + modelid + '"]').removeClass('hover:border-green-600 border-blue-600');
    $('[modelid="' + modelid + '"]').addClass('border-green-600 hover:border-blue-600');
    // @2. To Change Colour of Default API
    apiid = `${$.parseJSON(getCookie('default')).provider}-${$.parseJSON(getCookie('default')).api}`;
    $('[apiid="'+apiid+'"]').removeClass('hover:border-green-600 border-blue-600');
    $('[apiid="'+apiid+'"]').addClass('border-green-600 hover:border-blue-600');
  });


}
function set_default_api(provider, api) {
  var previous = $.parseJSON(getCookie('default'))
  previous.api = api;
  previous.provider = provider;
  setCookie('default', previous)
  load_settings()
}
function set_default_model(provider, model) {
  console.log('Set default model called')
  var previous = $.parseJSON(getCookie('default'))
  previous.provider = provider;
  previous.model = model;
  setCookie('default', previous)
  load_settings()
}