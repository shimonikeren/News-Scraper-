$(".saveBtn").on("click", function(event) {
    event.preventDefault();
    var itemId = $(this).data("id");
    var query = "/gems/vote/like/" + itemId;
    $.ajax(query, {
        type: "PUT"
    }).then(
        function(something) {
            location.reload();
        }
    );
});