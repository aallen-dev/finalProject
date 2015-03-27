

bw.app.views.salesByCategories = React.createClass({
    _goBack:function() {
        React.render(
            React.createElement(bw.app.views.main) ,
            $('.container')[0]
        );
    } ,
    componentDidMount:function() {
        $(function () {
            $('.chart').css({width:'100%'}).highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Sales by Category March 2014'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: ' ',
                    data: [
                        ['Burgers',   45.0],
                        ['Alcohol',       26.8],
                        {
                            name: 'Soft Drinks',
                            y: 12.8,
                            sliced: true,
                            selected: true
                        },
                        ['Sandwiches',    8.5],
                        ['Steaks',     6.2],
                        ['Sides',   0.7]
                    ]
                }]
            });
        });
    } ,
    render:function() {
        return d('div', [
                
            d('div.title@title' , [d('button.back@back' , {onClick:this._goBack} , 'back') ,'']),
            
            d('div.content.chart')
        ])
    }

});



bw.app.views.alcoholSales = React.createClass({
    _goBack:function() {
        React.render(
            React.createElement(bw.app.views.main) ,
            $('.container')[0]
        );
    } ,
    componentDidMount:function() {
        $(function () {
            $('.chart').css({width:'100%'}).highcharts({
               navigation: {
                        buttonOptions: {
                            enabled: false
                        }
                    },
                title: {
                    text: 'Alcohol Sales by Hour by Day March 2014',
                    x: -20 //center
                },
                xAxis: {
                    categories: ['11am', '12pm', '1pm', '2pm', '3pm', '4pm',
                        '5pm', '6pm', '7pm', '8pm', '9pm', '10pm']
                },
                yAxis: {
                    title: {
                        text: 'Thousands'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Beer',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'Wine',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Liquour',
                    data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                }, {
                    name: 'Other',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]
            });
        });

        $('#export_all').click(function () {
            var doc = new jsPDF();
            
            // chart height defined here so each chart can be palced
            // in a different position
            var chartHeight = 80;
            
            // All units are in the set measurement for the document
            // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
            doc.setFontSize(40);
            doc.text(35, 25, "My Exported Charts");
            
            //loop through each chart
            $('.chart').each(function (index) {
                var imageData = $(this).highcharts().createCanvas();
                
                // add image to doc, if you have lots of charts,
                // you will need to check if you have gone bigger 
                // than a page and do doc.addPage() before adding 
                // another image.
                
                /**
                * addImage(imagedata, type, x, y, width, height)
                */
                doc.addImage(imageData, 'JPEG', 45, (index * chartHeight) + 40, 120, chartHeight);
            });
            

            doc.output('dataurlnewwindow');


        });
    } ,
    render:function() {
        return d('div', [
                
            d('div.title@title' , [d('button.back@back' , {onClick:this._goBack} , 'back') ,'']),
            d('button#export_all' , 'export') ,
            
            d('div.content.grid.chart')
        ])
    }

});







// create canvas function from highcharts example http://jsfiddle.net/highcharts/PDnmQ/
(function (H) {
    H.Chart.prototype.createCanvas = function (divId) {
        var svg = this.getSVG(),
            width = parseInt(svg.match(/width="([0-9]+)"/)[1]),
            height = parseInt(svg.match(/height="([0-9]+)"/)[1]),
            canvas = document.createElement('canvas');

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        if (canvas.getContext && canvas.getContext('2d')) {

            canvg(canvas, svg);

            return canvas.toDataURL("image/jpeg");

        } 
        else {
            alert("Your browser doesn't support this feature, please use a modern browser");
            return false;
        }

    }
}(Highcharts));
