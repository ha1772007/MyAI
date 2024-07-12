function load_settings() {
  // intialization of cookies
  if($.parseJSON(getCookie('default')) == undefined ||$.parseJSON(getCookie('default')).api == undefined || $.parseJSON(getCookie('default')).model == undefined){
    setCookie('default',{'model':{'provider':null,'model':null},'api':{'provider':null,'api':null}})
  }
  // Reset all changes
  main_settings = `<div class='w-full h-full overflow-auto'>
                    <div class="w-full p-4 space-y-4">
                      <div class='w-full border-white border-2 rounded-lg p-2'><a class="w-full"
                          href='https://console.groq.com/keys'>Groq Models</a></div>
                      <div class="models  grid grid-cols-3 space-x-2 ml-2">
                        <div onclick="set_default_model('groq','llama3-70b-8192')" modelid="groq-llama3-70b-8192"  class="cursor-pointer rounded-md border-2 p-2 hover:border-green-600 border-blue-600">llama-3-70B
                        </div>
                        <div onclick="set_default_model('groq','llama3-8b-8192')" modelid="groq-llama3-8b-8192"  class="cursor-pointer rounded-md border-2 p-2 hover:border-green-600 border-blue-600">llama-3-8B
                        </div>
                      </div>
                      <div Apihandle="Groq" class="models  grid grid-cols-3 space-x-2 ml-2">
                        <div onclick='add_api("groq")' k class="cursor-pointer rounded-md border-2 p-2 hover:border-blue-600 border-red-600 flex"><img
                            src="assests/plus-circle.svg" style="filter: invert(1);" class="h-full aspect-square" alt=""><span
                            class="ml-2"> Add API</span></div>
                      </div>
                    </div>
                  </div>`
  $('#settings_main').html(main_settings);
  // Part 1 hangle Groq APIs
  try {
    var groqData = $.parseJSON(getCookie('groq'));
    if (groqData && groqData.api && Array.isArray(groqData.api)) {
      for (var g_i = 0; g_i < groqData.api.length; g_i++) {
        var g_api = groqData.api[g_i];
        console.log(g_api);
        if ($('[Apihandle="Groq"]').length == 1) {
          var Groq_API_append = `<div api="`+ g_api+`" onclick="set_default_api('groq', '${g_api}')" class="cursor-pointer rounded-md border-2 p-2 hover:border-red-600 border-blue-600 flex"><span class="ml-2">${g_api.substring(0, 2)}..${g_api.substring(g_api.length - 2, g_api.length)}</span></div>`;
          $('[Apihandle="Groq"]').append(Groq_API_append);
        } else {
          alert('Error while handling groq API');
        }
      }
    } else {
      console.log('Invalid groq data structure');
    }
  } catch (error) {
    console.log(error.message);
  }
  // set Default Border Colour
  try{
    $('[modelid=' +$.parseJSON(getCookie('default')).model.provider+'-'+$.parseJSON(getCookie('default')).model.model + ']').removeClass('border-blue-600');
    $('[modelid=' +$.parseJSON(getCookie('default')).model.provider+'-'+$.parseJSON(getCookie('default')).model.model + ']').addClass('border-green-600');
  } catch (error) {
    console.log(error.message)
  }
  try{
    d_api = $.parseJSON(getCookie('default')).api.key
    $('[api="'+d_api+'"]').removeClass('border-blue-600')
    $('[api="'+d_api+'"]').addClass('border-green-600')
  }catch(error){
    console.log(error.message)
  }
}

function set_default_api(provider,api) {
  var previous =  $.parseJSON(getCookie('default'))
  previous.api.provider = provider;
  previous.api.key = api;
  setCookie('default',previous)
  load_settings()
}
function set_default_model(provider,model){
  console.log('Set default model called')
  var previous =  $.parseJSON(getCookie('default'))
  previous.model.provider = provider;
  previous.model.model = model;
  setCookie('default',previous)
  load_settings()
}