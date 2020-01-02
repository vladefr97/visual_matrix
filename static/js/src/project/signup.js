var signup = function () {
    $('#btnSignUp').click(function () {

        $.ajax({
            url: '/signup',
            data: $('form').serialize(),
            type: 'POST',
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

};

export {signup}