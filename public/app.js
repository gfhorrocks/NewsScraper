// Grab the articles as a json
$(document).ready( displayArticles() );  //if page is refreshed, display data

function displayArticles(){
  $.get("/articles", function (data) {

    $("#articles").empty();
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      if (i % 2 == 0) {
        $("#articles").append("<div class='dataRow' style='background-color:lightgray;' data-id='" + data[i]._id + "'><img src=" + data[i].imageUrl + "> <a href='" + data[i].link + "'>" + data[i].title + "</a></div><div id='" + data[i]._id + "' ></div>");
      }
      else {
        $("#articles").append("<div class='dataRow' style='background-color:eggshell;' data-id='" + data[i]._id + "'><img src=" + data[i].imageUrl + "> <a href='" + data[i].link + "'>" + data[i].title + "</a></div><div id='" + data[i]._id + "' ></div>");
      }
    }
  });
}
// Whenever someone clicks a p tag
$(document).on("click", "div.dataRow", function () {

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Empty the notes from the note section
  $("#" + thisId).empty();

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article

      $("#" + data._id).append("<h4>CREATE A NOTE</h4>");
      // An input to enter a new title
      $("#" + data._id).append("<input id='titleinput' name='title' placeholder='Title'>");
      // A textarea to add a new note body
      $("#" + data._id).append("<textarea id='bodyinput' name='body' placeholder='Comment'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#" + data._id).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#" + data._id).empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click","#scrape",function(){
  $.get("/scrape",function(res){
    alert(res);                 //alerts user that scrape is complete
  }).then( displayArticles() ); //displays the data on screen
});