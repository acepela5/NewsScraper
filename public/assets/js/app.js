console.log("APP JS IS CONNECTED")

//GET articles
// $.getJSON("/index", function(data){
//     for(var i=0; i < data.length; i++){
//         $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
// });

// Empty Notes on P Click
$(document).on("click", "p", function(){
    $("#notes").empty();
    var thisId = $(this).parent().attr("data-id");
console.log(thisId)
    //AJAX Call for Articles Page
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(data){
        console.log(data);
//posting notes the articles
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data.id + "' id='savenote'>Save Note</button>");

        if(data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
;})

// On Click Save NOTE
$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

// On Click Save Button
$(document).on("click", "#saveBtn", function(event){
    event.preventDefault()
    var thisId = $(this).attr("data-id");
    console.log("id:" , thisId)
    $.ajax({
        method: "PUT",
        url: "/articles/" + thisId,
    
    }).then(function(data){
        console.log(data);
        location.reload()
      
    });


});