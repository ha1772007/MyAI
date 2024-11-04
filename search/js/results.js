function generateRandomString(length, characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
function results() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  console.log(query);
  $('#results_search').val(query);

  const url = `https://mangoman7002-webapi.hf.space/?q=${query}&ifextract=0`;

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json()) // Properly handle the promise returned by response.json()
    .then(final => {  // Use the resolved JSON data
      let toappend = ``;
      if (final && final.result && Array.isArray(final.result)) { // Check if 'result' exists and is an array
        for (let index in final.result) {  // Use 'in' for arrays or 'of'
          let z = final.result[index];
          let thiscontainerid = generateRandomString(10);
          toappend += `
            <div class="flex flex-col" id="containerid_${thiscontainerid}" abstract="${Stable_encoder(z['Abstract'] || "")}" url="${Stable_encoder(z['URL'] || '')}">
              <a href="${z['URL']}" target="_blank" class="flex justify-between max-h-[6.6vh] space-x-2 items-center">
                <div class="image p-2 h-full aspect-square BORDER-1 border-neutral-700">
                  <img class="h-full rounded-full aspect-square"
                    src="https://www.google.com/s2/favicons?sz=32&domain_url=${encodeURIComponent(z['URL'])}" alt="" srcset="">
                </div>
                <div class="flex-grow flex text-white justify-end h-full flex-col text-lg">
                  <div class="text-sm">${z['Title'] || ""}</div>
                  <div class="text-sm line-clamp-1">${z['URL'] || ""}</div>
                </div>
              </a>
              <div onclick="show_content('show_${thiscontainerid}')" id="show_${thiscontainerid}"
                class="mt-2  transition-all duration-500 ease-in-out p-1 cursor-pointer hover:bg-neutral-800 rounded-lg line-clamp-3 hover:line-clamp-none text-sm  text-neutral-300">
                ${z['Abstract'] || ""}
              </div>
              <div class="px-2 py-1 flex justify-between items-center text-sm">
                <div class="flex flex-grow space-x-2">
                  <div onclick="start_chat('${z['URL']}')" class="h-full max-h-[5vh] p-1 aspect-square rounded-full hover:bg-neutral-800 transition-all duration-300">
                    <img class="h-full  aspect-square" src="https://img.icons8.com/sf-black/100/FFFFFF/chat.png" alt="chat" />
                  </div>
                </div>
                <div class="flex space-x-2 text-neutral-400">
                  <div onclick="summary('${thiscontainerid}')" id="summary_${thiscontainerid}" class="all_${thiscontainerid} px-1 hover:border-b-cyan-600 hover:border-b-2 cursor-pointer">Summary</div>
                  <div onclick="original('${thiscontainerid}')" id="original_${thiscontainerid}" class="px-1 hover:border-b-cyan-600 hover:border-b-2 cursor-pointer">Original</div>
                  <div onclick="alert('This Feature is Currently Unavailable')" id="featured_${thiscontainerid}" class="all_${thiscontainerid} px-1 hover:border-b-cyan-600 hover:border-b-2 cursor-pointer border-b-green-900 border-b-2">Featured
                  </div>
                </div>
              </div>
            </div>
              `;

        }
      } else {
        toappend = "<div>No results found or invalid data format.</div>"; // Handle cases where 'result' is missing or not an array
      }
      $('#results').html(toappend);
      generate(final, query)
    })
    .catch(error => {  // Handle potential errors
      console.error("Error fetching data:", error);
      $('#results').html("<div>Error fetching results.</div>");
    });
}
