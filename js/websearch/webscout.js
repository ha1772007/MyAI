function search(query){
    return new Promise((resolve,reject) =>{
        $.ajax({
            url: 'https://mangoman7002-webapi.hf.space/', // Replace with your endpoint URL
            type: 'GET',
            contentType: 'application/json',
            data: {
                'q':encodeURIComponent(query),
                'ifextract':0
            },
            success: function (response) {
                toreturn = ""
                try{
                response['result'].forEach(element => {
                    toreturn = toreturn + `Title: ${element.Title}\nLink: ${element['URL']}\nBody: ${element['Abstract']}\n`
                });
                resolve('Here is search result:'+toreturn+'\n')
            }catch(error){
                console.log(error)
                resolve("");
                }
            },
            error: function (xhr, status, error) {
                reject('xhr response\n' + xhr + '\n' + 'status response\n' + status + '\n' + 'error\n' + error + '\n')
                console.log({ message: error, type: 'Error' })
            }
        });
    }) 
}