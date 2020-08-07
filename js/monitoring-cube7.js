$(document).ready(function() {

    if ($('.cube').length > 0) {

        $('body').on('click', '.cube-menu a', function(e) {
            var curLi = $(this).parent();
            $('.cube-menu li.active').removeClass('active');
            curLi.addClass('active');

            var curIndex = $('.cube-menu li').index(curLi);

            switch(curIndex) {
                case 0:
                    viewport.move({x: -90, y: 0});
                    break;
                case 1:
                    viewport.move({x: 0, y: 0});
                    break;
                case 2:
                    viewport.move({x: 0, y: -90});
                    break;
                case 3:
                    viewport.move({x: 0, y: -180});
                    break;
                case 4:
                    viewport.move({x: 0, y: -270});
                    break;
                case 5:
                    viewport.move({x: 90, y: 0});
                    break;
                default:
            }

            e.preventDefault();
        });

        var el = document.createElement('div'),
            transformProps = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
            transformProp = support(transformProps),
            transitionDuration = 'transitionDuration WebkitTransitionDuration MozTransitionDuration OTransitionDuration msTransitionDuration'.split(' '),
            transitionDurationProp = support(transitionDuration);

        function support(props) {
            for(var i = 0, l = props.length; i < l; i++) {
                if(typeof el.style[props[i]] !== "undefined") {
                    return props[i];
                }
            }
        }

        var mouse = {
                start : {}
            },
            touch = document.ontouchmove !== undefined,
            viewport = {
                x: -90,
                y: 0,
                el: $('.cube-container')[0],
                timer: null,
                move: function(coords) {
                    if(coords) {
                        if(typeof coords.x === "number") this.x = coords.x;
                        if(typeof coords.y === "number") this.y = coords.y;
                    }

                    this.el.style[transformProp] = "rotateX("+this.x+"deg) rotateY("+this.y+"deg)";

                    window.clearTimeout(this.timer);
                    this.timer = null;
                    $('.cube-face.active').removeClass('active');

                    this.timer = window.setTimeout(function() {

                        var curX = viewport.x;
                        var curY = viewport.y;

                        if (curX == -90 && curY == 0) {
                            curFace = 0;
                        }

                        if (curX == 0 && curY == 0) {
                            curFace = 1;
                        }

                        if (curX == 0 && curY == -90) {
                            curFace = 2;
                        }

                        if (curX == 0 && curY == -180) {
                            curFace = 3;
                        }

                        if (curX == 0 && curY == -270) {
                            curFace = 4;
                        }

                        if (curX == 90 && curY == 0) {
                            curFace = 5;
                        }

                        $('.cube-face').eq(curFace).addClass('active');
                        $('.cube').css({'margin-bottom': $('.cube-face').eq(curFace).find('.cube-face-footer').outerHeight()});
                    }, 500);
                },
                reset: function() {
                    this.move({x: 0, y: 0});
                }
            };

        viewport.duration = function() {
            var d = touch ? 50 : 500;
            viewport.el.style[transitionDurationProp] = d + "ms";
            return d;
        }();

    }

});

$(window).on('load', function() {

    if ($('.cube').length > 0) {
        $('.cube-face').eq(0).addClass('active');
        $('.cube').css({'margin-bottom': $('.cube-face').eq(0).find('.cube-face-footer').outerHeight()});
    }

});

$(window).on('load resize', function() {
    if ($(window).width() > 1139) {
        $('.cube-menu ul').each(function() {
            var curList = $(this);
            if (curList.hasClass('slick-slider')) {
                curList.slick('unslick');
                curList.find('li:gt(0)').before(' ');
            }
        });
    } else {
        $('.cube-menu ul').each(function() {
            var curList = $(this);
            if (!curList.hasClass('slick-slider')) {
                curList.slick({
                    infinite: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    adaptiveHeight: true,
                    variableWidth: true,
                    dots: false
                });
            }
        });
    }

    face31_1_Redraw();
});

function face31_1_Redraw() {
    var face1Labels = [];
    var face1DataActually = [];
    var face1DataForecast = [];

    $('.face-31-1-ratio-container .face-1-chart-graph').html('');
    $('.face-31-1-ratio-container .face-1-chart-labels').html('');
    $('.face-31-1-ratio-container .face-1-chart-icons').html('');

    var itemWidth = 110;
    if ($(window).width() < 1140) {
        itemWidth = 80;
    }

    var itemMargin = 55;
    if ($(window).width() < 1140) {
        itemMargin = 40;
    }

    for (var i = 0; i < faceData31_1.length; i++) {
        var curData = faceData31_1[i];
        face1Labels.push(curData.year);

        if (curData.type == 'actually') {
            face1DataActually.push(Number(curData.ratio));
        } else {
            face1DataActually.push(null);
        }

        if (typeof (curData.ratio) != 'undefined') {
            face1DataForecast.push(Number(curData.ratio));
        } else {
            face1DataForecast.push(null);
        }
    }

    $('.face-31-1-ratio-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);

    var minPlace = 9999;
    var maxPlace = 0;

    for (var i = 0; i < face1DataForecast.length; i++) {
        if (face1DataForecast[i] != null) {
            if (face1DataForecast[i] < minPlace) {
                minPlace = face1DataForecast[i];
            }
            if (face1DataForecast[i] > maxPlace) {
                maxPlace = face1DataForecast[i];
            }
        }
    }
    if (minPlace == maxPlace) {
        minPlace = 0;
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
            var curX = (i * itemWidth) + itemMargin;
            var curY = ((face1DataForecast[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-31-1-ratio-container .face-1-chart-graph').height();
            if (face1DataForecast[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataForecast[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-31-1-ratio-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-31-1-ratio-container .face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '<em>&nbsp;чел.</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null) {
            $('.face-31-1-ratio-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-31-1-ratio-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData31_1.length; i++) {
        var curData = faceData31_1[i];

        if (curData.type == 'actually') {
            if (maxSumm < Number(curData.summ)) {
                maxSumm = Number(curData.summ);
            }
        }
    }

    for (var i = 0; i < faceData31_1.length; i++) {
        var curData = faceData31_1[i];

        if (curData.type == 'actually') {
            $('.face-31-1-ratio-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * itemWidth + itemMargin) + 'px">' +
                                                                        '<div class="face-1-chart-icon-summ" data-summ="' + curData.summ + '" style="height:' + (Number(curData.summ) / maxSumm * 100) + '%"><svg viewBox="0 0 71 144" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.3739 12.8C48.3739 19.8692 42.6432 25.6 35.5739 25.6C28.5047 25.6 22.7739 19.8692 22.7739 12.8C22.7739 5.73075 28.5047 0 35.5739 0C42.6432 0 48.3739 5.73075 48.3739 12.8ZM61.4935 40.64L70.4535 78.72C70.4535 78.8525 70.5084 79.04 70.5727 79.2596C70.6637 79.5702 70.7735 79.9451 70.7735 80.32C70.7735 83.84 67.8935 86.72 64.3735 86.72C61.4935 86.72 58.9335 84.48 58.2935 81.92L51.5735 54.08V144H38.7735V86.4H32.3735V144H19.5735V54.4L12.8535 82.24C12.2135 84.8 9.65353 87.04 6.77353 87.04C3.25353 87.04 0.373535 84.16 0.373535 80.64C0.373535 80.2651 0.483342 79.8902 0.574309 79.5796C0.638633 79.36 0.693536 79.1725 0.693536 79.04L9.65353 40.96C9.97353 39.68 10.6135 38.4 11.5735 37.44C15.4135 34.24 19.8935 31.68 25.0135 30.4C28.5335 29.44 32.0535 28.8 35.5735 28.8C39.0935 28.8 42.6135 29.44 46.1335 30.08C51.2535 31.68 55.7335 33.92 59.5735 37.12C60.5335 38.08 61.1735 39.36 61.4935 40.64Z" fill="#4F7B96"/></svg></div>' +
                                                                    '</div>');
        }
    }

    $('.face-31-1-ratio-container').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        },
        callbacks: {
            onScrollStart: function() {
                $('.face-39-ratio-window').remove();
            }
        }
    });

    $('.face-31-1-ratio-container .face-1-chart-icon-summ').on('mouseover', function(e) {
        $('.face-31-1-ratio-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-31-1-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Количество выпускников</div><div class="face-31-1-ratio-window-value">' + curItem.attr('data-summ') + ' чел.</div></div>');
    });

    $('.face-31-1-ratio-container .face-1-chart-icon-summ').on('mouseout', function(e) {
        $('.face-31-1-ratio-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-31-1-ratio-window').remove();
    });

}