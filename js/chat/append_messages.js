function append_user(message, full) {
  let template = `<div class="message-content human-message h-auto w-[99%] flex p-2" content='${Stable_encoder(full)}'>
    <div class="w-[90%] bg-dark-2 ml-[10%] p-2 rounded-md space-y-2">${message}</div>
  </div>`
  $('#message_container').append(template)
  MathJax.typesetPromise()
}
function append_ai(message, content) {
  var converter = new showdown.Converter();
  let m = converter.makeHtml(content);
  let template = `<div class="message-content AI-message h-auto w-[99%] flex p-2" content="${Stable_encoder(content)}">
    <div class="w-[100%] bg-dark-2 rounded-l-md p-2 min-h-[20vh]">${m}</div>
    
  </div>`
  $('#message_container').append(template);
  MathJax.typesetPromise();
  code_block_handler().then(r=>{
  NormalCodeBlock()
  console.log('final')
  })
}

async function NormalCodeBlock() {
  const codeElements = document.querySelectorAll('code[class*="language-"]');

  // Iterate through the selected elements
  codeElements.forEach((element) => {
    const className = element.getAttribute('class');
    const match = className.match(/language-([a-zA-Z]+)/);
    if (match) {
      hljs.highlightElement(element);
    }
  })
}

async function code_block_handler() {
  const response = await fetch(`/js/chat/filename.json`);
  const languages = await response.json();
  console.log(languages)
  const codeElements = $('code[class*="language-"]');

  // Iterate through the selected elements
  codeElements.each(function () {
    console.log('For Each Called')
    // Extract the language name using a regular expression
    let className = $(this).attr('class');
    let match = className.match(/language-([a-zA-Z]+)/);

    if (match) {
      console.log('matched')
      let language = match[1];
      let codecontent = $(this).text();

      if (languages[language.toLowerCase()] !== undefined && languages[language.toLowerCase()] !== null && languages[language.toLowerCase()]['filename'] !== undefined && languages[language.toLowerCase()]['filename'] !== null) {
        console.log('not Undefined')
        // Generate a unique IDf
        let filename = languages[language.toLowerCase()]['filename'];
        let thisid = generate_class();
        while ($(`#${thisid}`).length > 0) {
          thisid = generate_class();
        }

        // Clear the content of the code element and insert the iframe
        let selectedblock = $(this)
        $(this).empty();
        $(selectedblock).removeClass(`language-${language}`);
        $(this).html(`<iframe
        id="${thisid}"
        frameBorder="0"
        height="450px"
        src="https://onecompiler.com/embed/${language}?listenToEvents=true&theme=dark" 
        width="100%"
      ></iframe>`);

        // Add load event listener to the iframe
        $(`#${thisid}`).on('load', function () {
          // let contentDoc = $(this).content();
          // console.log(contentDoc);
          // let status_code = contentDoc.get(0).status_code;
          // alert(status_code)
          status_code = 200;
          if (status_code == 200) {
            console.log('status code OK')
            console.log([language, codecontent])
            this.contentWindow.postMessage({
              eventType: 'populateCode',
              language: language,
              files: [
                {
                  "name": filename,
                  "content": codecontent
                }
              ]
            }, "*");
          } else {
            selectedblock.html('');
            selectedblock.text('');
            selectedblock.text(codecontent);
            // NormalCodeBlock()
          }
        });
      } else {
        console.log('undefined Found')
        alert('No FileName Found')
        // NormalCodeBlock()
      }
    } else {
      console.log('match Not Satisifed')
    }
  });
  return(true)
}

// Mock function to generate unique IDs
function generate_class() {
  return 'oc-editor-' + Math.random().toString(36).substr(2, 9);
}

