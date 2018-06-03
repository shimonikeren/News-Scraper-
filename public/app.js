$( document ).ready(function() {

$(".saveBtn").on("click", function() {
    console.log("save btn clicked");
    var itemId = $(this).data("id");
    console.log(itemId);
    // var itemId = $(this).attr("data-id");
    $.ajax("/saved/"+itemId, {
        type: "PUT"
    }).then(
        function() {
            location.reload();
        }
    );
});

$(".unsaveBtn").on("click", function() {
    console.log("unsave btn clicked");
    var itemId = $(this).data("id");
    console.log(itemId);
    // var itemId = $(this).attr("data-id");
    $.ajax("/unsaved/"+itemId, {
        type: "PUT"
    }).then(
        function() {
            location.reload();
        }
    );
});


$(".commentBtn").on("click", function() {
    console.log("comment btn clicked");
    var itemId = $(this).data("id");
    console.log(itemId);
    // var itemId = $(this).attr("data-id");
    //this is the GET ROUTE to comment form 
    $.ajax("/comment/"+itemId, {
        type: "GET"
    }).then(
        function() {
            $(location).attr('href', "/comment/"+itemId);
        }
    );
});

$(".delComment").on("click", function(event) {
    event.preventDefault();
    var itemId = $(this).data("id");
    $.ajax("/comment/delete/"+itemId, {
        type: "DELETE"
    }).then(
        function() {
            window.location.href = "/comments";
        }
    );
});



}); //end doc ready 