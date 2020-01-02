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

let co2Data = [];


// let chartData = []
let maxCount = 30;

function insertPoints(date, co2Value) {

    if (co2Data.length < maxCount) {
        co2Data.push({
            x: date,
            y: co2Value
        });


    } else if (co2Data.length === maxCount) {
        co2Data.shift();

        co2Data.push({
            x: date,
            y: co2Value
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
        name: "Vector №1",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    xaxis: {
        type: 'category',
        categories: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        // categories: dates,
        labels: {
            show: true,
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,


        }
    },
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
    document.querySelector("#co2-chart"),
    optionsLine
);
var co2Chart = function () {

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
        update: function (date, co2Value) {
            insertPoints(date, co2Value);
            chartLine.updateSeries([{data: co2Data}])

        }


    }

};


export {co2Chart}


//--------------------------------
//--------------------------------
//--------------------------------



