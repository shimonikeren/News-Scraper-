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




});