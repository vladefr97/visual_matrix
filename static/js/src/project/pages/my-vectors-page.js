$(document).ready(function () {
    setPageEvents()
});

function setPageEvents() {
    let addIcons = Array.from($('.add-icon'));
    $.each(addIcons, function (index, value) {
        $(value).on('click', addToBuffer)
    })
}


function addToBuffer() {

    let vector_id = ($(this).parent()).attr('data-vector-id');
    $.ajax({
        url: '/buffer-add-vector',
        data: {
            "vector_id": vector_id
        },
        // method: 'POST',
        success: function (response) {


        },
        error: function (error) {
            alert('Произошла ошибка!')

        }
    })
    displayModal()


}
function displayModal() {
    $('#modal-form_save .modal-body p').text("Вектор добавлен на главную страницу");
    $('#overlay_save').fadeIn(400,
        function () {
            $('#modal-form_save')
                .css('display', 'block')
                .animate({opacity: 1, top: '50%'}, 200);
        });


    $('#modal-close_save, #overlay_save, #cancel-btn_save').click(function () {
        $('#submit-btn_save').off('click');

        $('#modal-form_save')
            .animate({opacity: 0, top: '45%'}, 200,
                function () {
                    $(this).css('display', 'none');
                    $('#overlay_save').fadeOut(400);
                }
            );


    });

    $('#submit-btn_save').on('click', function () {

        $('#modal-form_save')
            .animate({opacity: 0, top: '45%'}, 200,
                function () {
                    $(this).css('display', 'none');
                    $('#overlay_save').fadeOut(400);
                }
            );


    });

}
