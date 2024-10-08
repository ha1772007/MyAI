var converter = new showdown.Converter();
function append_user(message, full) {
  let id = "usermessage-" + Math.random().toString(36).substr(2, 9);
  let template = `<div class="message-content human-message h-auto w-[99%] flex p-2" content='${Stable_encoder(full)}'>
    <div id="${id}" class="w-[90%] bg-dark-2 ml-[10%] p-2 rounded-md space-y-2"></div>
  </div>`
  $('#message_container').append(template);
  $(`#${id}`).text(message)
  MathJax.typesetPromise()
}
function append_ai(id, message, content) {

  let m = converter.makeHtml(content.replaceAll("\\(", "bracketo")
    .replaceAll("\\)", "bracketc")
    .replaceAll("\\[", "bracketsquareo")
    .replaceAll("\\]", "bracketsquarec")
    .replace(/\$\$.*?\$\$|\\squarebracketo(.*?)\\squarebracketc|\\bracketo(.*?)\\bracketc/g, (match, p1) => {
      return "base64str" + Stable_encoder(match) + "base64str"; // Replace $$...$$ with the modified content
    }));
  m = m.replace(/base64str(.*?)base64str/g, (match, p1) => {
    console.log(p1)
    return Stable_decoder(p1)
  }).replaceAll("bracketo", "\\(")
  .replaceAll("bracketc", "\\)")
  .replaceAll("bracketsquareo", "\\[")
  .replaceAll("bracketsquarec", "\\]")
  .replace(/<em>(.*?)<\/em>/g, (match, p1) => {
    return p1; // This returns just the text inside the <em> tags
});
  $(`#${id}`).attr("content", Stable_encoder(content));
  $(`#${id}`).find(`div`).first().html(m)
  MathJax.typesetPromise();
  code_block_handler().then(r => {
    NormalCodeBlock()
    console.log('final')
  })
}
function create_ai_id() {
  let made_class = generate_class()
  let loading_template = `
  <div class="p-4 w-full">
  <div class="animate-pulse w-full ">
    
    <div class="flex-1 space-y-4 py-1 w-[90%]">
      <div class="h-4 bg-[#55679C] opacity-2 rounded w-1/4"></div>
      <div class="space-y-2 w-full">
        <div class="h-4 bg-[#55679C] rounded w-3/4"></div>
        <div class="h-4 bg-[#55679C] rounded w-5/6"></div>
      </div>
    </div>
  </div>
</div>
  `
  let template = `<div id="${made_class}" class="message-content AI-message h-auto w-[99%] flex p-2">
    <div class="w-[100%] bg-dark-2 rounded-l-md space-y-2 p-2 min-h-[20vh]">${loading_template}</div>
    
  </div>`
  $('#message_container').append(template);
  return made_class
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
  const response = await fetch(`https://ha1772007.github.io/MyAI/js/chat/filename.json`);
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
  return (true)
}

// Mock function to generate unique IDs
function generate_class() {
  return 'oc-editor-' + Math.random().toString(36).substr(2, 9);
}

function make_random() {
  return 'ai_' + Math.random().toString(36).substr(2, 9);
}

