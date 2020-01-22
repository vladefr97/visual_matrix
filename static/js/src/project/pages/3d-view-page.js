$(document).ready(function () {
    let radiobtns = Array.from($('.type-option'));
    $.each(radiobtns, function (index, value) {
        $(value).on('click', function () {
            let datatypeArea = $('.datatype-area');
            let dependencyType = $($(this).children()[0]).attr('value');
            $(datatypeArea).attr('data-dependency-type', dependencyType);
        })

    });


    $('#get-points_btn').on('click', function () {
        let container3d = $('#view3d');
        let vmfId = $(container3d).attr('data-vmf-id');
        let vectorId = $(container3d).attr('data-vector-id');
        let vectorType = $(container3d).attr('data-vector-type');
        let dependencyType = $('.datatype-area').attr('data-dependency-type');
        $.ajax({
            url: '/get-3d-points',
            data: {
                "vmf_id": vmfId,
                'vector_id': vectorId,
                'vector_type': vectorType,
                'dependency_type': dependencyType

            },
            type: 'GET',
            success: function (response) {
                let x = response.x;
                let y = response.y;
                let z = response.z;
                let func = response.func;
                Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv', function (err, rows) {
                    function unpack(rows, key) {
                        return rows.map(function (row) {
                            return row[key];
                        });
                    }

                    // var z_data = [[2,3,4,5],
                    //     [0,4,1,65],
                    //     [9,3,-15,],
                    //     [10,4,40,5],
                    //     [2,2,-4,4],
                    //     [9,3,9,1],
                    //     [1,3,0,2],
                    //     [4,4,4,4],
                    //   ]

                    // for (i = 0; i < 24; i++) {
                    //     z_data.push(unpack(rows, i));
                    // }

                    var data = [{
                        type: "mesh3d",
                        x: x,
                        y: y,
                        z: z,
                        // i: [0, 0, 0, 1],
                        // j: [1, 2, 3, 2],
                        // k: [2, 3, 1, 3],
                        intensity: func,
                        colorscale: [
                            [1, 'rgb(0, 0, 255)'],
                            [0.5, 'rgb(0, 255, 0)'],
                            [0, 'rgb(255, 0, 0)']

                        ]
                    }];

                    var layout = {
                        title: 'Трехмерное отображение',
                        autosize: false,
                        width: 800,
                        height: 800,
                        margin: {
                            l: 65,
                            r: 50,
                            b: 65,
                            t: 90,
                        }
                    };
                    Plotly.newPlot('view3d', data, layout);
                });

            },
            error: function (error) {
                console.log(error)
            }
        });
    });


});
