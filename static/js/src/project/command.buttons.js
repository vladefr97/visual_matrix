$('#read_btn').on('click', function () {
    $.ajax({
        url: '/read-file',
        type: 'GET',
        success: function (response) {
            console.log(response);
            alert(response)

        },
        error: function (error) {
            console.log(error);
            alert(error)
        }
    })


});
