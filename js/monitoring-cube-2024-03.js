$(document).ready(function() {

    if ($('.cube').length > 0) {

        var face1Labels = [];
        var face1DataActually = [];
        var face1DataForecast = [];

        for (var i = 0; i < face1data.length; i++) {
            var curYear = face1data[i];
            face1Labels.push(curYear.year);

            if (curYear.type !== 'forecast') {
                face1DataActually.push({"year": curYear.year, "place": Number(curYear.value)});
                face1DataForecast.push(null);
            } else {
                face1DataActually.push(null);
                face1DataForecast.push(Number(curYear.value));
            }
        }

        $('.cube-face').eq(0).find('.face-1-chart').width(face1Labels.length * 79 - 37);

        var minPlace = 9999;
        var maxPlace = 0;
        var curScroll = 0;

        for (var i = 0; i < face1DataActually.length; i++) {
            if (face1DataActually[i] != null) {
                if (face1DataActually[i].place < minPlace) {
                    minPlace = face1DataActually[i].place * 1;
                }
                if (face1DataActually[i].place > maxPlace) {
                    maxPlace = face1DataActually[i].place * 1;
                }
            }
        }

        for (var i = 0; i < face1DataForecast.length; i++) {
            if (face1DataForecast[i] != null) {
                if (face1DataForecast[i] * 1 < minPlace) {
                    minPlace = face1DataForecast[i];
                }
                if (face1DataForecast[i] * 1 > maxPlace) {
                    maxPlace = face1DataForecast[i];
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
                var curX = (i * 79);
                var curY = ((face1DataForecast[i] - minPlace) / (maxPlace - minPlace)) * $('.cube-face').eq(0).find('.face-1-chart-graph').height();
                if (face1DataForecast[i - 1] != null) {
                    var prevX = ((i - 1) * 79);
                    var prevY = ((face1DataForecast[i - 1] - minPlace) / (maxPlace - minPlace)) * $('.cube-face').eq(0).find('.face-1-chart-graph').height();
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    $('.cube-face').eq(0).find('.face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
                }
                $('.cube-face').eq(0).find('.face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span style="top:15px"><strong>' + face1DataForecast[i] + '</strong>место</span></div>');
            }
        }
        for (var i = 0; i < face1DataActually.length; i++) {
            if (face1DataActually[i] != null) {
                var curX = (i * 79);
                curScroll = curX;
                var curY = ((face1DataActually[i].place - minPlace) / (maxPlace - minPlace)) * $('.cube-face').eq(0).find('.face-1-chart-graph').height();
                if (face1DataActually[i - 1] != null) {
                    var prevX = ((i - 1) * 79);
                    var prevY = ((face1DataActually[i - 1].place - minPlace) / (maxPlace - minPlace)) * $('.cube-face').eq(0).find('.face-1-chart-graph').height();
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    $('.cube-face').eq(0).find('.face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
                }
                $('.cube-face').eq(0).find('.face-1-chart-graph').append('<div class="face-1-chart-point active" data-year="' + face1DataActually[i].year + '" style="left:' + curX + 'px; top:' + curY + 'px"><span style="top:15px"><strong><em>' + face1DataActually[i].place + '</em></strong><em>место</em></span></div>');
            }
        }



        for (var i = 0; i < face1Labels.length; i++) {
            if (face1DataActually[i] != null) {
                $('.cube-face').eq(0).find('.face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * 79) + 'px"><a _href="#" data-year="' + face1Labels[i] + '">' + face1Labels[i] + '</a></div>');
            } else {
                $('.cube-face').eq(0).find('.face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * 79) + 'px"><span>' + face1Labels[i] + '</span></div>');
            }
        }

        $('.cube-face').eq(0).find('.face-1-container').mCustomScrollbar({
            axis: 'x',
            setLeft: '-' + (curScroll - $('.cube-face').eq(0).find('.face-1-container').width() / 2) + 'px',
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