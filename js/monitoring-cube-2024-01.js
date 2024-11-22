$(document).ready(function() {

    if ($('.cube').length > 0) {

        var face1Labels = [];
        var face1DataActually = [];
        var face1DataForecast = [];

        for (var i = 0; i < face1data.length; i++) {
            var curYear = face1data[i];
            face1Labels.push(curYear.year);

            var curValue = Number(curYear.value.replace(',', '.'));

            if (curYear.type == 'actually') {
                face1DataActually.push({'year': curYear.year, 'value': curYear.value});
            } else {
                face1DataActually.push(null);
            }
            if (curYear.type == 'forecast') {
                face1DataForecast.push({'year': curYear.year, 'value': curYear.value});
            } else {
                face1DataForecast.push(null);
            }
        }

        $('.face-1-chart').width(face1Labels.length * 79 - 37);

        var minValue = 9999;
        var maxValue = 0;
        var curScroll = 0;

        for (var i = 0; i < face1DataActually.length; i++) {
            if (face1DataActually[i] != null) {
                var curValue = Number(face1DataActually[i].value.replace(',', '.'));
                if (curValue < minValue) {
                    minValue = curValue;
                }
                if (curValue > maxValue) {
                    maxValue = curValue;
                }
            }
        }

        for (var i = 0; i < face1DataForecast.length; i++) {
            if (face1DataForecast[i] != null) {
                var curValue = Number(face1DataForecast[i].value.replace(',', '.'));
                if (curValue < minValue) {
                    minValue = curValue;
                }
                if (curValue > maxValue) {
                    maxValue = curValue;
                }
            }
        }

        function angle_point(a, b, c) {
            var x1 = a[0] - b[0];
            var x2 = c[0] - b[0];
            var y1 = a[1] - b[1];
            var y2 = c[1] - b[1];

            var d1 = Math.sqrt(x1 * x1 + y1 * y1);
            var d2 = Math.sqrt(x2 * x2 + y2 * y2);
            return Math.acos((x1 * x2 + y1 * y2) / (d1 * d2)) * 180 / Math.PI;
        }

		for (var i = 0; i < face1DataForecast.length; i++) {
            if (face1DataForecast[i] != null) {
                var curValue = Number(face1DataForecast[i].value.replace(',', '.'));
                var curX = (i * 79);
                var curY = $('.face-1-chart-graph').height()-((curValue - minValue) / (maxValue - minValue)) * $('.face-1-chart-graph').height();
                if (face1DataForecast[i - 1] != null) {
                    var prevValue = Number(face1DataForecast[i - 1].value.replace(',', '.'));
                    var prevX = ((i - 1) * 79);
                    var prevY = $('.face-1-chart-graph').height()-((prevValue - minValue) / (maxValue - minValue)) * $('.face-1-chart-graph').height();
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }

                    $('.face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
                }
                $('.face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong style="margin-top:-40px;">' + face1DataForecast[i].value + '</strong></span></div>');
            }
        }
        for (var i = 0; i < face1DataActually.length; i++) {
            if (face1DataActually[i] != null) {
                var curValue = Number(face1DataActually[i].value.replace(',', '.'));
                var curX = (i * 79);
                curScroll = curX;
                var curY = $('.face-1-chart-graph').height()-((curValue - minValue) / (maxValue - minValue)) * $('.face-1-chart-graph').height();
                if (face1DataActually[i - 1] != null) {
                    var prevValue = Number(face1DataActually[i - 1].value.replace(',', '.'));
                    var prevX = ((i - 1) * 79);
                    var prevY = $('.face-1-chart-graph').height()-((prevValue - minValue) / (maxValue - minValue)) * $('.face-1-chart-graph').height();
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    $('.face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
                }
                $('.face-1-chart-graph').append('<div class="face-1-chart-point " data-year="' + face1DataActually[i].year + '" style="background: #fe6600;left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataActually[i].value + '</strong></span></div>');
            }
        }


        for (var i = 0; i < face1Labels.length; i++) {
            if (face1DataActually[i] != null) {
                $('.face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * 79) + 'px"><span style="border-radius: 5px;background: rgba(255, 220, 197, 0.67);transition: all 0.2s;">' + face1Labels[i] + '</span></div>');/*<a href="#" data-year="' + face1Labels[i] + '">' + face1Labels[i] + '</a>*/
            } else {
                $('.face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * 79) + 'px"><span>' + face1Labels[i] + '</span></div>');
            }
        }

        $('.face-1-container').mCustomScrollbar({
            axis: 'x',
            setLeft: '-' + (curScroll - $('.face-1-container').width() / 2) + 'px',
            scrollButtons: {
                enable: true
            }
        });

    }

});

$(window).on('load', function() {

    if ($('.cube').length > 0) {
        $('.cube-face').eq(0).addClass('active');
        $('.cube').css({'margin-bottom': $('.cube-face').eq(0).find('.cube-face-footer').outerHeight()});
    }

});