function set_defaults() {
  console.log('set Default called')
  let provider = $('#chat-provider').val();
  let model = $('#chat-model').val();
  let api = $('#chat-api').val();
  if (api == null) {
    create_info('Add a API or select existing. Default Model and API not updated');
  } else {
    set_default_model(provider, model);
    set_default_api(provider, api);
    // load_settings()

  }
}
function set_model_list() {
  return new Promise(resolve => {
    let thisprovider = $('#chat-provider').val()
    $('#chat-model').html('')
    fetch('models/models.json?r=10').then(response => response.json()).then(models => {
      let modellist = null;
      for (let provider in models['Chat Models']) {
        if (models['Chat Models'][provider]['provider_id'] == thisprovider) {
          modellist = models['Chat Models'][provider]['models'];
          break;
        }
      };
      console.log(modellist)
      modellist.forEach(thismodel => {
        console.log(thismodel)
        if ($.parseJSON(getCookie('default')) !== undefined && $.parseJSON(getCookie('default')) !== null && $.parseJSON(getCookie('default')).model !== undefined && $.parseJSON(getCookie('default')).model !== null) {
          if ($.parseJSON(getCookie('default')).model == thismodel) {
            $('#chat-model').append(`<option value="${thismodel}" selected>${thismodel}</option>`)
          } else {
            $('#chat-model').append(`<option value="${thismodel}">${thismodel}</option>`)

          }
        } else {
          $('#chat-model').append(`<option value="${thismodel}">${thismodel}</option>`)

        }

      });
      set_api_list().then(r => {
        set_defaults();
        resolve('');
      })

    })
  })
}

function set_api_list() {
  return new Promise(resolve => {
    let thisprovider = $('#chat-provider').val()
    $('#chat-api').html('')
    fetch('models/models.json?r=10').then(response => response.json()).then(models => {
      let defaultapilist = null;
      let apiprovider = null;
      for (let provider in models['Chat Models']) {
        if (models['Chat Models'][provider]['provider_id'] == thisprovider) {
          defaultapilist = models['Chat Models'][provider]['default_api'];
          apiprovider = models['Chat Models'][provider]['provider_id'];
          break;
        }
      }
      console.log(defaultapilist)
      defaultapilist.forEach(thisapi => {
        // console.log(thisapi)
        if ($.parseJSON(getCookie('default')) !== undefined && $.parseJSON(getCookie('default')) !== null && $.parseJSON(getCookie('default')).api == thisapi) {

          $('#chat-api').append(`<option value="${thisapi}" selected>${thisapi}</option>`)
        } else {
          $('#chat-api').append(`<option value="${thisapi}">${thisapi}</option>`)

        }
      })

      if ($.parseJSON(getCookie(apiprovider)) !== undefined && $.parseJSON(getCookie(apiprovider)) !== null) {
        if ($.parseJSON(getCookie(apiprovider)).api !== null && $.parseJSON(getCookie(apiprovider)).api !== undefined) {
          apilist = $.parseJSON(getCookie(apiprovider)).api;
          apilist.forEach(thisapi => {
            if ($.parseJSON(getCookie('default')) !== undefined && $.parseJSON(getCookie('default')) !== null && $.parseJSON(getCookie('default')).api == thisapi) {

              $('#chat-api').append(`<option value="${thisapi}" selected>${thisapi}</option>`)
            } else {
              $('#chat-api').append(`<option value="${thisapi}">${thisapi}</option>`)

            }
          })
        }
      }
      set_defaults()
      resolve()
    })

  })
}

function chat_models_list() {
  return new Promise(resolve => {
    console.log('chat model list called')
    fetch('models/models.json?r=2').then(response => response.json()).then(models => {
      // # Setup Provider List
      // ## for reset
      $('#chat-provider').html('')
      $('#chat-provider-search-list').html('')
      for (let thisprovider in models['Chat Models']) {
        thispval = models['Chat Models'][thisprovider]
        console.log(thispval)
        // ## Manage Option List
        if ($.parseJSON(getCookie('default')) !== undefined && $.parseJSON(getCookie('default')) !== null && $.parseJSON(getCookie('default')).provider !== undefined && $.parseJSON(getCookie('default')).provider !== null) {
          if ($.parseJSON(getCookie('default')).provider == thispval['provider_id']) {
            $('#chat-provider').append(`<option value="${thispval['provider_id']}" selected>${thisprovider}</option>`)
          } else {
            $('#chat-provider').append(`<option value="${thispval['provider_id']}">${thisprovider}</option>`)
          }
        } else {
          $('#chat-provider').append(`<option value="${thispval['provider_id']}">${thisprovider}</option>`)
          console.log('undefined default value of Provider')
        }
        // ## Manage Table List
        thismodels = thispval['models'];
        thismodels.forEach(thismodel => {
          $('#chat-provider-search-list').append(`<tr onclick='search_change_model("${thispval['provider_id']}","${thismodel}")' class="h-[7vh] hover:border-green-600 border-2">
            <td>${thisprovider}</td>
            <td>${thismodel}</td>
            <td id="status-${Stable_encoder(thisprovider)}-${Stable_encoder(thismodel)}"></td>
          </tr>`);
        });
      }
      resolve()
    })
  })

}

function load_settings() {
  // intialization of cookies
  if ($.parseJSON(getCookie('default')) == undefined) {
    setCookie('default', { 'model': null, 'api': null, 'provider': null })
  }
  // Call chat_models_list
  chat_models_list().then(resolve => {

    set_model_list().then(resolved =>{
      set_api_list()
    })
  }

  )
  // set  Default of API and load api list
  
  // Check and Set Default model Provider

  // IN end some importants
  $('.select2-container--default').css('width', '70%');

}
function set_default_api(provider, api) {
  var previous = $.parseJSON(getCookie('default'))
  previous.api = api;
  previous.provider = provider;
  setCookie('default', previous)

}
function set_default_model(provider, model) {
  console.log('Set default model called')
  var previous = $.parseJSON(getCookie('default'))
  previous.provider = provider;
  previous.model = model;
  setCookie('default', previous)

}

function search_change_model(provider, model) {
  set_default_model(provider, model)
  chat_models_list().then(resolve => {

    set_model_list()
    chat_models_list()
    // chat_models_setdefault()
    hide_show('model-chat-select', ['model-chat-select', 'model-chat-search'])

  })
}

function update_model_search() {
  search_value = $('#search-model').val();
  $('#chat-provider-search-list').find('tr').each(function () {
    if ($(this).find('td').eq(1).text().includes(search_value)) {
      $(this).show();
      console.log($(this));
    } else {
      $(this).hide();
    }
  });
}

load_settings()