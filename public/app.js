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
            // location.reload();
        }
    );
});

$(".submitComment").on("click", function(event) {
    event.preventDefault();
    var itemId = $(this).data("id");
    var posted = $("#exampleFormControlTextarea1").val();
    console.log(posted);
    console.log(itemId);
    //this is the POST ROUTE for comments
    $.ajax("/comment/"+itemId, {
        type: "POST",
        data: {body: posted}
    }).then(
        function(newPage) {
            location.reload();
            // document.write(newPage);
        }
    );
});

$(".delComment").on("click", function(event) {
    event.preventDefault();
    var itemId = $(this).data("id");
    alert("btn clcked");
    alert(itemId);
    $.ajax("/comment/"+itemId, {
        type:"DELETE"
    }).then(
        function() {
            // window.location.href = "/comments";
            // location.reload();
            console.log("wait");
        }
    );
});



}); //end doc ready 