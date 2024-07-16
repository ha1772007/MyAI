function search(query){
    return new Promise((resolve,reject) =>{
        $.ajax({
            url: 'https://oevortex-webscout-api.hf.space/api/search', // Replace with your endpoint URL
            type: 'GET',
            contentType: 'application/json',
            data: {
                'q':encodeURIComponent(query),
                'max_results':5,
                'safesearch':'moderate',
                'region':'wt-wt',
                'backend':'api',
            },
            success: function (response) {
                toreturn = ""
                response.forEach(element => {
                    toreturn = toreturn + `Title: ${element.title}\nLink: ${element.href}\nBody: ${element.body}\n`
                });
                resolve(toreturn)
            },
            error: function (xhr, status, error) {
                reject('xhr response\n' + xhr + '\n' + 'status response\n' + status + '\n' + 'error\n' + error + '\n')
                console.log({ message: error, type: 'Error' })
            }
        });
    }) 
}