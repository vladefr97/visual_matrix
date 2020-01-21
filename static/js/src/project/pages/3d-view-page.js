$(document).ready(function () {


    let container3d = $('#view3d');
    let vmfId = $(container3d).attr('data-vmf-id');
    let vectorId = $(container3d).attr('data-vector-id');
    let vectorType = $(container3d).attr('data-vector-type');

    $.ajax({
        url: '/get-3d-points',
        data: {
            "vmf_id": vmfId,
            'vector_id': vectorId,
            'vector_type': vectorType

        },
        type: 'GET',
        success: function (response) {
            let x = response.x;
            let y = response.y;
            let z = response.z;
            let ux = response.ux;
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
                    intensity: ux,
                    colorscale: [
                        [0, 'rgb(255, 0, 0)'],
                        [0.5, 'rgb(0, 255, 0)'],
                        [1, 'rgb(0, 0, 255)']
                    ]
                }];

                var layout = {
                    title: 'Mt Bruno Elevation',
                    autosize: false,
                    width: 500,
                    height: 500,
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
