function search(q){
    const query = q['query'];
    
    return new Promise((resolve) =>{
        $.ajax({
            url: 'https://mangoman7002-webapi.hf.space/', // Replace with your endpoint URL
            type: 'GET',
            contentType: 'application/json',

            data: {
                'q':encodeURIComponent(query),
                'ifextract':0
            },
            success: function (r) {
                let response = r

                console.log(response)
                toreturn = ""
                try{
                response.result.forEach(element => {
                    toreturn = toreturn + `Title: ${element.Title}\nLink: ${element['URL']}\nBody: ${element['Abstract']}\n`
                });
                resolve('Here is search result:'+toreturn+'\n')
            }catch(error){
                create_info("Search Failed: Invalid Output","danger")
                console.log(error)
                resolve("No Search Result Found");
                }
            },
            error: function (xhr, status, error) {
                create_info("Search Failed: Endpoint Error","danger");
                resolve("No Search Result")
                // reject('xhr response\n' + xhr + '\n' + 'status response\n' + status + '\n' + 'error\n' + error + '\n')
                console.log({ message: error, type: 'Error' })
            }
        });
    }) 
}