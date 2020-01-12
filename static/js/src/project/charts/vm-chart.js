window.Apex = {
    chart: {

        foreColor: '#fff',
        toolbar: {
            show: false
        },
    },

    // colors: ['#FCCF31', '#17ead9', '#f02fc2'],
    stroke: {
        width: 3
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        borderColor: "#40475D",
    },
    xaxis: {
        axisTicks: {
            color: '#333'
        },
        axisBorder: {
            color: "#333"
        }
    },


    yaxis: {
        decimalsInFloat: 2,
        opposite: true,
        labels: {
            offsetX: -10
        }
    }
};
//
// let vmData = [];


// // let chartData = []
// let maxCount = 30;

// function insertPoints(date, vmValue) {
//
//     if (vmData.length < maxCount) {
//         vmData.push({
//             x: date,
//             y: vmValue
//         });
//
//
//     } else if (vmData.length === maxCount) {
//         vmData.shift();
//
//         vmData.push({
//             x: date,
//             y: vmValue
//         });
//
//
//     }
//
// }


var optionsLine = {
    chart: {

        height: 350,
        type: 'line',
        stacked: true,
        animations: {
            enabled: false
        },
        dropShadow: {
            enabled: true,
            opacity: 0.3,
            blur: 5,
            left: -7,
            top: 22
        },

        toolbar: {
            show: true,
            tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true | '<img src="/static/icons/reset.png" width="20">',
                customIcons: []
            },
            autoSelected: 'zoom'
        }, stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 2,
            dashArray: 0,
        },
        zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: false,
            zoomedArea: {
                fill: {
                    color: '#90CAF9',
                    opacity: 0.4
                },
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        color: '#0D47A1',
        width: 1,
    },
    grid: {
        show: true,
    },
    markers: {
        size: 2,
        hover: {
            size: 7
        }
    },
    series: [],

    title: {
        text: 'Vector №1',
        align: 'center',
        style: {
            fontSize: '16px'
        }
    },
    fill: {
        fill: {
            colors: ['#F44336', '#E91E63', '#9C27B0']
        }
    },
    legend: {
        show: true,
        floating: true,
        horizontalAlign: 'left',
        onItemClick: {
            toggleDataSeries: false
        },
        position: 'top',
        offsetY: -33,
        offsetX: 60
    },
}

var chartLine = new ApexCharts(
    document.querySelector("#vm-chart"),
    optionsLine
);

var vmChart = function () {

    return {
        init: function () {
            chartLine.render();

        },
        // update: function (date, vmValue) {
        //     insertPoints(date, vmValue);
        //     chartLine.updateSeries([{data: vmChartData}])
        //
        // },
        setData: function (data) {

            chartLine.updateSeries([{data: data}])

        },
        appendSeries: function (series,legend) {
            // let mydata = [[3, 4], [5, 6], [5, 4]];
            chartLine.appendSeries({name: legend, data:series})

        }


    }

};


export {vmChart}


//--------------------------------
//--------------------------------
//--------------------------------



