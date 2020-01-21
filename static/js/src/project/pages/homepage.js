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
    setPageEvents()


});

function setPageEvents() {

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

    let deleteIcons = Array.from($('.delete-icon'));
    $.each(deleteIcons, function (index, value) {
        $(value).on('click', deleteVector)
    })

    let saveIcons = Array.from($('.save-icon'));
    $.each(saveIcons, function (index, value) {
        $(value).on('click', saveVectorToDB)
    })

    let chartIcons = Array.from($('.chart-icon'))
    $.each(chartIcons, function (index, value) {
        $(value).on('click', addVectorToChart)
    })

    let icons3D = Array.from($('.volume-icon'))
    $.each(icons3D, function (index, value) {
        $(value).on('click', open3DPage)
    })

    let displayIcons = Array.from($('.display-icon'))
    $.each(displayIcons, function (index, value) {
        $(value).on('click', displayVector)
    })


}

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
        $(iconsDiv).attr('data-vector-type', 0);

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
        $(div).on('click', saveVectorToDB);
        iconsDiv.append(div);

        //Иконка для отображения вектора на графике
        div = document.createElement('div');
        $(div).addClass('vector-icon');
        icon = document.createElement('i');
        $(icon).addClass('fa fa-line-chart');
        div.append(icon);
        $(div).on('click', addVectorToChart);
        iconsDiv.append(div);


        //Иконка для отображения 3d графика
        div = document.createElement('div');
        $(div).addClass('vector-icon');
        icon = document.createElement('i');
        $(icon).addClass('fa fa-cube');
        div.append(icon);
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
    let parent = $(this).parent();
    let val = $(parent).attr('data-eigenvalue');

    let vectorId = $(parent).attr('data-vector-id');
    let dependencyType = $('.datatype-area').attr('data-dependency-type');
    let vectorType = $(parent).attr('data-vector-type');
    let vmfId;
    //0 - Vector from file
    //1 - Vector from DB
    if (vectorType === "0")
        vmfId = $(parent).attr('data-vmf-id');
    else vmfId = "666";
    console.log(dependencyType);
    $.ajax({
            url: '/get-2d-dependence',
            data: {
                "vmf_id": vmfId,
                "eigenvalue": val,
                'vector_id': vectorId,
                'vector_type': vectorType,
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
    let vector_id = $(parent).attr('data-vector-id');
    let vector_type = $(parent).attr('data-vector-type');
    let vmf_id;
    //0 - Vector from file
    //1 - Vector from DB
    if (vector_type === "0")
        vmf_id = $(parent).attr('data-vmf-id');
    else vmf_id = "666";

    let queryStr = `/vector-view?eigenvalue=${eigenvalue}&vmf_id=${vmf_id}&vector_id=${vector_id}&vector_type=${vector_type}`;

    var win = window.open(queryStr, '_blank');
    win.focus();
}

//Открыть страницу 3d графика
function open3DPage() {
    let parent = $(this).parent();
    let eigenvalue = $(parent).attr('data-eigenvalue');

    let vector_id = $(parent).attr('data-vector-id');
    let vector_type = $(parent).attr('data-vector-type');
    let vmf_id;
    //0 - Vector from file
    //1 - Vector from DB
    if (vector_type === "0")
        vmf_id = $(parent).attr('data-vmf-id');
    else vmf_id = "666";
    let queryStr = `/3d-view?eigenvalue=${eigenvalue}&vmf_id=${vmf_id}&vector_id=${vector_id}&vector_type=${vector_type}`;

    var win = window.open(queryStr, '_blank');
    win.focus();

}

//Сохранить вектор в базу данных
function saveVectorToDB() {
    let parent = $(this).parent();
    let eigenvalue = $(parent).attr('data-eigenvalue');
    let vmfId = $(parent).attr('data-vmf-id');
    let vectorId = $(parent).attr('data-vector-id');
    $.ajax({
        url: '/save-vector',
        data: {
            "vmf_id": vmfId,
            "eigenvalue": eigenvalue,
            'vector_id': vectorId
        },
        method: 'POST',
        success: function (response) {


        },
        error: function (error) {
            alert('Не удалось сохранить вектор!')

        }
    })
    displaySaveVectorModal(eigenvalue, vmfId, vectorId);


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

function displaySaveVectorModal() {
    $('#modal-form_save .modal-body p').text("Вектор сохранен в базу данных!");
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


function toggleVMChartVisible(chartID) {
    $($($($(chartID).parent()).parent()).parent()).toggleClass('visible');

}
