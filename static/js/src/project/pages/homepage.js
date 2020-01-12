import '../command.buttons'
import {vmChart} from "../charts/vm-chart";
import {rhChart} from "../charts/rh";

let vmDarkChart = new vmChart();
let rhDarkChart = new rhChart();


$(document).ready(function () {
    vmDarkChart.init();
    rhDarkChart.init();

    $('#btn-upload').on('click', function () {
        displayUploadFileModal();

    });
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
                    $('#modal-form_upload')
                        .animate({opacity: 0, top: '45%'}, 200,
                            function () {
                                $(this).css('display', 'none');
                                $('#overlay_upload').fadeOut(400);
                            }
                        );
                    let vmfObject = response.vmf_object;
                    console.log(vmfObject.filename)
                    console.log(vmfObject.eigenvalues)


                    createVMFVectors(vmfObject.filename, vmfObject.eigenvalues, vmfObject.vmf_id)

                },
                error: function (error) {
                    console.log(error)
                }
            });

        };


    })
});


function createVMFVectors(filename, eigenvalues, vmfId) {

    let vectorDivs = [];
    let container = $('#vectors-container');
    console.log(eigenvalues.length);
    for (var i = 0; i < eigenvalues.length; i++) {

        vectorDivs[i] = document.createElement('div');
        $(vectorDivs[i]).addClass('vector');
        let p = document.createElement('p');
        let divText = document.createElement('div')
        $(divText).addClass('vector-text');
        let index = i + 1;
        divText.innerHTML = 'Vector - ' + index + ' (' + filename + '), Value = ' + eigenvalues[i];
        // divText.append(p);
        vectorDivs[i].append(divText);

        let iconsDiv = document.createElement('div');
        $(iconsDiv).addClass('vector-icons');

        //Иконка для удаления вектора
        let div = document.createElement('div');
        $(div).addClass('vector-icon');
        $(div).addClass('delete-icon');
        let icon = document.createElement('i');
        $(icon).addClass('fa fa-times');

        div.append(icon);
        iconsDiv.append(div);


        //Иконка для сохранения вектора в БД
        div = document.createElement('div');
        $(div).addClass('vector-icon');
        icon = document.createElement('i');
        $(icon).addClass('fa fa-save');
        div.append(icon);
        iconsDiv.append(div);

        //Иконка для отображения вектора на графике
        div = document.createElement('div');
        $(div).addClass('vector-icon');
        icon = document.createElement('i');
        $(icon).addClass('fa fa-line-chart');
        div.append(icon);
        $(div).attr('data-eigenvalue', eigenvalues[i]);
        $(div).attr('data-vmf-id', vmfId);
        $(div).attr('data-vector-id', i);
        $(div).on('click', addVectorToChart);
        iconsDiv.append(div);

        div = document.createElement('div');
        $(div).addClass('vector-icon');
        icon = document.createElement('i');
        $(icon).addClass('fa fa-eye');
        $(div).on('click', displayVector);
        div.append(icon);
        iconsDiv.append(div);


        vectorDivs[i].append(iconsDiv)
    }

    container.append(vectorDivs)


}

//Нарисовать 2D график зависимости собственного вектора
function addVectorToChart() {
    let val = $(this).attr('data-eigenvalue');
    let vmfId = $(this).attr('data-vmf-id');
    let vectorId = $(this).attr('data-vector-id');
    $.ajax({
            url: '/get-2d-dependence',
            data: {
                "vmf_id": vmfId,
                "eigenvalue": val,
                'vector_id': vectorId
            },
            success: function (response) {
                console.log(response);
                let index = Number(vectorId) + 1;
                let legend = 'Vector - ' + index + ', Value = ' + val;
                vmDarkChart.appendSeries(response.points, legend)

            },
            error: function (error) {

            }
        }
    )
}

//Открыть страницу со значениями вектора
function displayVector() {
    var win = window.open('/vector-view', '_blank');
    win.focus();
}

//Сохранить вектор в базу данных
function saveVectorToDB() {

}

//Удалить вектор
function deleteVector() {

}

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
