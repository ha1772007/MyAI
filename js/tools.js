function hide_show(toshow,tohide){
    console.log(toshow);
    console.log(tohide)
    tohide.forEach(thishide =>{
        $('#'+thishide).hide()
    })
    $('#'+toshow).show();
}