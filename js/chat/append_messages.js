function append_user(message){
    let template = `<div class="human-message h-auto w-[99%] flex p-2">
    <div class="w-[90%] bg-dark-200 ml-[10%] p-2 rounded-md">${message}</div>
  </div>`
  $('#message_container').append(template)
}
function append_ai(message){
    let template = `<div class="AI-message h-auto w-[99%] flex p-2">
    <div class="w-[70%] bg-dark-400 rounded-l-md p-2 min-h-[20vh]">${message}</div>
    <div class="w-[30%] bg-dark-400 auto-shrink h-full rounded-r-md p-2 ">
      <div class="w-full p-2 h-[7vh] flex flex-col">
        <div class="w-full h-[100%] flex space-x-2"
          h-hover="Wikipedia is a free content online encyclopedia written and maintained by a community of volunteers, known as Wikipedians, through open collaboration and the wiki software MediaWiki. Wikipedia is the largest and most-read reference work in history, and is consistently ranked among the ten most visited websites; as of May 2024 , it was ranked fifth by Semrush, and sixth by">
          <div class="aspect-sqaure h-full bg-white rounded-full p-1"><img class='h-full'
              src="https://th.bing.com/th?id=ODLS.9d837793-b21b-4809-aceb-f60f4a0b6408&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2"
              alt="" srcset=""></div>
          <div class="w-full flex-grow text-balance text-sm">Lorem</div>
        </div>
        <div class="w-full flex-grow"></div>
      </div>
      <div class="w-full p-2 h-[7vh] flex flex-col">
        <div class="w-full h-[100%] flex space-x-2"
          h-hover="Wikipedia is a free content online encyclopedia written and maintained by a community of volunteers, known as Wikipedians, through open collaboration and the wiki software MediaWiki. Wikipedia is the largest and most-read reference work in history, and is consistently ranked among the ten most visited websites; as of May 2024 , it was ranked fifth by Semrush, and sixth by">
          <div class="aspect-sqaure h-full rounded-full"><img class='h-full rounded-full'
              src="https://th.bing.com/th?id=ODLS.9d837793-b21b-4809-aceb-f60f4a0b6408&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2"
              alt="" srcset=""></div>
          <div class="flex-grow"> Wikipedia - Wikipedia </div>
        </div>
        <div class="w-full flex-grow"></div>
      </div>

    </div>
  </div>`
  $('#message_container').append(template)
}