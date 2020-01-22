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
    $('#modal-form_info .modal-body p').text("Вектор добавлен на главную страницу");
    $('#overlay_info').fadeIn(400,
        function () {
            $('#modal-form_info')
                .css('display', 'block')
                .animate({opacity: 1, top: '50%'}, 200);
        });


    $('#modal-close_info, #overlay_info, #cancel-btn_info').click(function () {
        $('#submit-btn_info').off('click');

        $('#modal-form_info')
            .animate({opacity: 0, top: '45%'}, 200,
                function () {
                    $(this).css('display', 'none');
                    $('#overlay_info').fadeOut(400);
                }
            );


    });

    $('#submit-btn_info').on('click', function () {

        $('#modal-form_info')
            .animate({opacity: 0, top: '45%'}, 200,
                function () {
                    $(this).css('display', 'none');
                    $('#overlay_info').fadeOut(400);
                }
            );


    });

}
