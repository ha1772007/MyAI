function add_api(provider) {

    if (getCookie(provider) !== null && getCookie(provider) !== 'undefined') {
        var previousdata = JSON.parse(getCookie(provider))
        h_get("Add "+provider+" API Key Here").then(inputValue => {
            previousdata.api.push(inputValue)
        setCookie(provider, previousdata)
        load_settings()
        })
        
    } else {
        var inital_data = {
            api: []
        }
        h_get('Add '+provider+' API Key Here').then(inputValue => {
            inital_data.api.push(inputValue)
        setCookie(provider, inital_data)
        load_settings()
        })
        
    }
    
}

