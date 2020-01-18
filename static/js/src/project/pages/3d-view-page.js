$(document).ready(function () {


    let container3d = $('#view3d');
    let vmfId = $(container3d).attr('data-vmf-id');
    let vectorId = $(container3d).attr('data-vector-id');

    $.ajax({
        url: '/get-3d-points',
        data: {
            "vmf_id": vmfId,
            'vector_id': vectorId

        },
        type: 'GET',
        success: function (response) {
            let x = response.x;
            let y = response.y;
            let z = response.z;
            Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/alpha_shape.csv', function (err, rows) {


                var data = [{
                    x: x,
                    y: y,
                    z: z,
                    mode: 'markers',
                    type: 'scatter3d',
                    marker: {
                        color: 'rgb(230, 90, 20)',
                        size: 2
                    }
                }];

                var layout = {
                    autosize: true,
                    height: 480,
                    scene: {
                        aspectratio: {
                            x: 1,
                            y: 1,
                            z: 1
                        },
                        camera: {
                            center: {
                                x: 0,
                                y: 0,
                                z: 0
                            },
                            eye: {
                                x: 1.25,
                                y: 1.25,
                                z: 1.25
                            },
                            up: {
                                x: 0,
                                y: 0,
                                z: 1
                            }
                        },
                        xaxis: {
                            type: 'linear',
                            zeroline: false
                        },
                        yaxis: {
                            type: 'linear',
                            zeroline: false
                        },
                        zaxis: {
                            type: 'linear',
                            zeroline: false
                        }
                    },
                    title: '3d point clustering',
                    width: 800
                };

                Plotly.newPlot('view3d', data, layout);

            });


            Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/alpha_shape.csv', function (err, rows) {


            });


        },
        error: function (error) {
            console.log(error)
        }
    });


});
