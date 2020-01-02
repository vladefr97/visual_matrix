import '../command.buttons'

$('#btn-upload').on('click', function () {
    displayUploadFileModal();
    const input = document.querySelector('input[type="file"]');
    input.addEventListener('change', function (e) {
        console.log(input.files);
        const reader = new FileReader();
        reader.readAsText(input.files[0]);

        reader.onload = function () {

            $.ajax({
                url: '/upload-vector',
                data: {
                    "filename": input.files[0].name,
                    "filedata": reader.result
                },
                type: 'POST',
                success: function (response) {
                    console.log('done')

                },
                error: function (error) {
                    console.log(error)
                }
            });

        };


    })
});

function displayUploadFileModal() {
    $('#modal-form_upload .modal-body p').text("Загрузить файл с векторами?");
    $('#overlay_upload').fadeIn(400,
        function () {
            $('#modal-form_upload')
                .css('display', 'block')
                .animate({opacity: 1, top: '50%'}, 200);

        });

    // $('#submit-btn_upload').on('click', deleteRequest);


    $('#modal-close_upload, #overlay_upload, #cancel-btn_upload').click(function () {
        $('#submit-btn_upload').off('click');

        $('#modal-form_upload')
            .animate({opacity: 0, top: '45%'}, 200,
                function () {
                    $(this).css('display', 'none');
                    $('#overlay_upload').fadeOut(400);
                }
            );

    });

}
