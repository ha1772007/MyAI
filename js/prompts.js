function generate_rand(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return result;
  }
  function h_get(statement){
    let rand_id = generate_rand(10);
    let dummy_get = `<div id="${rand_id}" class="rounded-lg p-1 overflow-auto space-y-2 w-[60vw] h-[30vh] border-blue-400 border-2 absolute z-40 mx-[20vw] bg-slate-900 my-[40vh] flex flex-col items-center">
    <span class="w-full h-1/3 text-white p-2 overflow-auto"><center>${statement}</center></span>
    <input class="w-[90%] mx-[5%] h-1/3 p-2 rounded-lg bg-black text-white hover:bg-slate-800 " type="text" id="input-${rand_id}">
    <div class="flex justify-between w-[80%] h-1/3 mx-[10%]">
      <button class="w-[20%] rounded-md bg-blue-400 hover:bg-green-400 px-2 h-full">close</button>
      <button class="w-[20%] rounded-md bg-blue-400 hover:bg-green-400 px-2 h-full">confirm</button>
    </div>
  </div>`
  let html = $.parseHTML(dummy_get);
  $('body').prepend(html);
    return new Promise(resolve => {
        $('#' + rand_id).on('click', 'button:last-child', function() {
            let inputValue = $('#' + rand_id).find('input')[0].value;
            $('#' + rand_id).remove();
            resolve(inputValue);
        });
    });
}

// h_get('Your statement here').then(inputValue => {
//     console.log(inputValue);
// });