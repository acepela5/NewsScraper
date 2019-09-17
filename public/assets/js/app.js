console.log("APP JS IS CONNECTED")
$(document).ready(function () {
  $('.modal').modal();

  //GET articles
  // $.getJSON("/index", function(data){
  //     for(var i=0; i < data.length; i++){
  //         $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  //     }
  // });

  // Empty Notes on P Click
  $(document).on("click", "#note", function () {
    $('#modal1').modal('open');
    $("#notes").empty();

    var thisId = $(this).parent().attr("data-id");
    console.log(thisId, "#####thisId#####")
    //AJAX Call for Articles Page
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function (data) {
      console.log(data);
      //opening notes the articles
      $("#notes").append("<h4>" + data.title + "</h4>");
      $('#notes').append("<label for='bodyinput'>Write your thoughts about this article here!</label>")
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#notes").append("<button data-id='" + thisId + "' id='savenote' class='btn orange darken-1'>Save Note</button>");
      console.log(`THIS IS THE NOTE'S ID ${thisId}`)

      if (data.note) {
        $("#oldNotes").append("<ul>")
        $("#oldNotes").append("<li>" + data.note.body + "</li>")
        $("#oldNotes").append("</ul>")
        console.log(data.note.body + "NOTE BODY")
        console.log(">>>>" + data.note._id + "NOTE ID")
      }
    });
    ;
  })

  // On Click Save NOTE
  $(document).on("click", "#savenote", function () {
    $('.modal').modal('close');
    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: $("#bodyinput").val()
      }
    }).then(function (data) {
      console.log(data);
      $("#notes").empty();
    });
    $("#bodyinput").val("");
  });

  // On Click Save Article Button
  $(document).on("click", "#saveBtn", function (event) {
    event.preventDefault()
    var thisId = $(this).attr("data-id");
    console.log("id:", thisId)
    $.ajax({
      method: "PUT",
      url: "/articles/" + thisId,

    }).then(function (data) {
      console.log(data);
      location.reload()

    });


  });

  $(document).on("click", "#deleteBtn", function () {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "/delete",

      success: function(response){
        $(".list-group-item").empty();

      }
    })

    console.log("deleted article")
  })

});