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

let rhData = [];


// let chartData = []
let maxCount = 30;

function insertPoints(date, rhValue) {

    if (rhData.length < maxCount) {
        rhData.push({
            x: date,
            y: rhValue
        });


    } else if (rhData.length === maxCount) {
        rhData.shift();

        rhData.push({
            x: date,
            y: rhValue
        });


    }

}


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
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        width: 5,
    },
    grid: {
        padding: {
            left: 0,
            right: 0
        }
    },
    markers: {
        size: 5,
        hover: {
            size: 7
        }
    },
    series: [{
        name: "Vector №2",
        data: [10, 41, 3, 51, 4, 62, 69, 30, 18]
    }],
    xaxis: {
        type: 'category',
         categories: [10, 14, 3, 51, 4, 2, 69, 30, 128],
        labels: {
            show: true,
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,


        }
    },
    title: {
        text: 'Vector №2',
        align: 'center',
        style: {
            fontSize: '16px'
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
    document.querySelector("#rh-chart"),
    optionsLine
);
var rhChart = function () {

    return {
        init: function () {
            chartLine.render();

            // window.setInterval(function () {
            //     getMQTTData()
            //
            //     // chart.updateSeries([{
            //     //     data: coes,
            //     //
            //     // }])
            //     // chart.updateOptions(options)
            //     barChart.updateSeries([{data: chartData}])
            // }, 1000)

        },
        update: function (date, rhValue) {
            insertPoints(date, rhValue);
            chartLine.updateSeries([{data: rhData}])

        }


    }

};


export {rhChart}


//--------------------------------
//--------------------------------
//--------------------------------



