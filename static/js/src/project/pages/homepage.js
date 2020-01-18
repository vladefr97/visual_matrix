import '../command.buttons'
import {vmChart} from "../charts/vm-chart";


var charts = {
    'ux-x': {
        'initialized': false,
        'chart': new vmChart("UX(X)", '#ux-x')
    },
    'uy-x': {
        'initialized': false,
        'chart': new vmChart("UY(X)", '#uy-x')
    },
    'uz-x': {
        'initialized': false,
        'chart': new vmChart("UZ(X)", '#uz-x')
    },
    'phi-x': {
        'initialized': false,
        'chart': new vmChart("Phi(X)", '#phi-x')
    },
    'ux-y': {
        'initialized': false,
        'chart': new vmChart("UX(y)", '#ux-y')
    },
    'uy-y': {
        'initialized': false,
        'chart': new vmChart("UY(Y)", '#uy-y')
    },
    'uz-y': {
        'initialized': false,
        'chart': new vmChart("UZ(Y)", '#uz-y')
    },
    'phi-y': {
        'initialized': false,
        'chart': new vmChart("Phi(Y)", '#phi-y')
    },
    'ux-z': {
        'initialized': false,
        'chart': new vmChart("UX(Z)", '#ux-z')
    },
    'uy-z': {
        'initialized': false,
        'chart': new vmChart("UY(Z)", '#uy-z')
    },
    'uz-z': {
        'initialized': false,
        'chart': new vmChart("UZ(Z)", '#uz-z')
    },
    'phi-z': {
        'initialized': false,
        'chart': new vmChart("Phi(Z)", '#phi-z')
    },

};
$(document).ready(function () {
    //
    // vmDarkChart.init();
    toggleVMChartVisible('#ux-x');
    charts['ux-x']['initialized'] = true;
    charts['ux-x']['chart'].init();


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


    });

    // let radiobtns = document.querySelector('.datatype-area p');
    let radiobtns = Array.from($('.type-option'));
    $.each(radiobtns, function (index, value) {
        $(value).on('click', function () {
            let datatypeArea = $('.datatype-area');
            let dependencyType = $($(this).children()[0]).attr('value');
            $(datatypeArea).attr('data-dependency-type', dependencyType);
        })

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
        let divText = document.createElement('div');
        $(divText).addClass('vector-text');
        let index = i + 1;
        divText.innerHTML = 'Vector - ' + index + ' (' + filename + '), Value = ' + eigenvalues[i];
        // divText.append(p);
        vectorDivs[i].append(divText);

        let iconsDiv = document.createElement('div');
        $(iconsDiv).addClass('vector-icons');
        $(iconsDiv).attr('data-eigenvalue', eigenvalues[i]);
        $(iconsDiv).attr('data-vmf-id', vmfId);
        $(iconsDiv).attr('data-vector-id', i);

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
        $(div).attr('data-eigenvalue', eigenvalues[i]);
        $(div).attr('data-vmf-id', vmfId);
        $(div).attr('data-vector-id', i);
        $(div).on('click', saveVectorToDB);
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


        //Иконка для отображения 3d графика
        div = document.createElement('div');
        $(div).addClass('vector-icon');
        icon = document.createElement('i');
        $(icon).addClass('fa fa-cube');
        div.append(icon);
        $(div).attr('data-eigenvalue', eigenvalues[i]);
        $(div).attr('data-vmf-id', vmfId);
        $(div).attr('data-vector-id', i);
        $(div).on('click', open3DPage);
        iconsDiv.append(div);


        //Иконка для отображения таблицы со значениями
        div = document.createElement('div');
        $(div).addClass('vector-icon');
        icon = document.createElement('i');
        $(icon).addClass('fa fa-eye');
        $(div).on('click', displayVector);
        div.append(icon);
        iconsDiv.append(div);

        vectorDivs[i].append(iconsDiv);

    }

    container.append(vectorDivs)


}

//Нарисовать 2D график зависимости собственного вектора
function addVectorToChart() {
    let val = $(this).attr('data-eigenvalue');
    let vmfId = $(this).attr('data-vmf-id');
    let vectorId = $(this).attr('data-vector-id');
    let dependencyType = $('.datatype-area').attr('data-dependency-type');
    console.log(dependencyType);
    $.ajax({
            url: '/get-2d-dependence',
            data: {
                "vmf_id": vmfId,
                "eigenvalue": val,
                'vector_id': vectorId,
                'dependency_type': dependencyType
            },
            success: function (response) {
                console.log(response);
                let index = Number(vectorId) + 1;
                let legend = 'Vector - ' + index + ', Value = ' + val;
                if (charts[dependencyType]['initialized']) {
                    charts[dependencyType]['chart'].appendSeries(response.points, legend);
                } else {
                    charts[dependencyType]['initialized'] = true;
                    toggleVMChartVisible('#' + dependencyType);
                    charts[dependencyType]['chart'].init();
                    charts[dependencyType]['chart'].appendSeries(response.points, legend);
                }
                // vmDarkChart.appendSeries(response.points, legend)

            },
            error: function (error) {

            }
        }
    )
}

//Открыть страницу со значениями вектора
function displayVector() {
    let parent = $(this).parent();
    let eigenvalue = $(parent).attr('data-eigenvalue');
    let vmf_id = $(parent).attr('data-vmf-id');
    let vector_id = $(parent).attr('data-vector-id');
    let queryStr = `/vector-view?eigenvalue=${eigenvalue}&vmf_id=${vmf_id}&vector_id=${vector_id}`;

    var win = window.open(queryStr, '_blank');
    win.focus();
}

//Открыть страницу 3d графика
function open3DPage() {

    let eigenvalue = $(this).attr('data-eigenvalue');
    let vmf_id = $(this).attr('data-vmf-id');
    let vector_id = $(this).attr('data-vector-id');
    let queryStr = `/3d-view?eigenvalue=${eigenvalue}&vmf_id=${vmf_id}&vector_id=${vector_id}`;

    var win = window.open(queryStr, '_blank');
    win.focus();

}

//Сохранить вектор в базу данных
function saveVectorToDB() {
    let eigenvalue = $(this).attr('data-eigenvalue');
    let vmfId = $(this).attr('data-vmf-id');
    let vectorId = $(this).attr('data-vector-id');
    $.ajax({
        url: '/save-vector',
        data: {
            "vmf_id": vmfId,
            "eigenvalue": eigenvalue,
            'vector_id': vectorId
        },
        method: 'POST',
        success: function (response) {
            // console.log(response);
            // let index = Number(vectorId) + 1;
            // let legend = 'Vector - ' + index + ', Value = ' + val;
            // if (charts[dependencyType]['initialized']) {
            //     charts[dependencyType]['chart'].appendSeries(response.points, legend);
            // } else {
            //     charts[dependencyType]['initialized'] = true;
            //     toggleVMChartVisible('#' + dependencyType);
            //     charts[dependencyType]['chart'].init();
            //     charts[dependencyType]['chart'].appendSeries(response.points, legend);
            // }
            // vmDarkChart.appendSeries(response.points, legend)

        },
        error: function (error) {

        }
    })

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

function toggleVMChartVisible(chartID) {
    $($($($(chartID).parent()).parent()).parent()).toggleClass('visible');

}
