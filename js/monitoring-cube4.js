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

        $('.face-3-year-current').click(function(e) {
            $(this).parent().toggleClass('open');
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.face-3-year').length == 0) {
                $('.face-3-year').removeClass('open');
            }
        });

        $('.face-3-year ul li a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-3-year ul li.active').removeClass('active');
                curLi.addClass('active');
                $('.face-3-year-current').html($(this).html());
                face3SectorsRedraw();
            }
            $('.face-3-year').removeClass('open');
            e.preventDefault();
        });

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

    face1RatioRedraw();
    face1CandidatesRedraw();
    face3SectorsRedraw();
});

function face1RatioRedraw() {
    var face1Labels = [];
    var face1DataActually = [];
    var face1DataForecast = [];

    $('.face-39-ratio-container .face-1-chart-graph').html('');
    $('.face-39-ratio-container .face-1-chart-labels').html('');
    $('.face-39-ratio-container .face-1-chart-icons').html('');

    var itemWidth = 110;
    if ($(window).width() < 1140) {
        itemWidth = 80;
    }

    var itemMargin = 55;
    if ($(window).width() < 1140) {
        itemMargin = 40;
    }

    for (var i = 0; i < faceData39Ratio.length; i++) {
        var curData = faceData39Ratio[i];
        face1Labels.push(curData.year);

        if (curData.type == 'actually') {
            face1DataActually.push(Number(curData.ratio));
            face1DataForecast.push(null);
        } else {
            face1DataActually.push(null);
            face1DataForecast.push(Number(curData.ratio));
        }
    }

    $('.face-39-ratio-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);

    var minPlace = 9999;
    var maxPlace = 0;
    var curScroll = 0;

    for (var i = 0; i < face1DataActually.length; i++) {
        if (face1DataActually[i] != null) {
            if (face1DataActually[i] < minPlace) {
                minPlace = face1DataActually[i];
            }
            if (face1DataActually[i] > maxPlace) {
                maxPlace = face1DataActually[i];
            }
        }
    }

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

    function angle_point(a, b, c) {
        var x1 = a[0] - b[0];
        var x2 = c[0] - b[0];
        var y1 = a[1] - b[1];
        var y2 = c[1] - b[1];

        var d1 = Math.sqrt(x1 * x1 + y1 * y1);
        var d2 = Math.sqrt(x2 * x2 + y2 * y2);
        return Math.acos((x1 * x2 + y1 * y2) / (d1 * d2)) * 180 / Math.PI;
    }

    var curLastActually = -1;
    for (var i = 0; i < face1DataActually.length; i++) {
        if (face1DataActually[i] != null) {
            curLastActually++;
            var curX = (i * itemWidth) + itemMargin;
            curScroll = curX;
            var curY = ((face1DataActually[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-1-chart-graph').height();
            if (face1DataActually[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataActually[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-39-ratio-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-39-ratio-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataActually[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    var curLastForecast = -1;
    for (var i = 0; i < face1DataForecast.length; i++) {
        if (face1DataForecast[i] != null) {
            if (curLastForecast < 0) {
                curLastForecast = i;
            }
            var curX = (i * itemWidth) + itemMargin;
            var curY = ((face1DataForecast[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-1-chart-graph').height();
            if (face1DataForecast[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataForecast[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-39-ratio-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-39-ratio-container .face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    var curX = (curLastForecast * itemWidth) + itemMargin;
    var curY = ((face1DataForecast[curLastForecast] - maxPlace) / (minPlace - maxPlace)) * $('.face-1-chart-graph').height();
    var prevX = ((curLastActually) * itemWidth) + itemMargin;
    var prevY = ((face1DataActually[curLastActually] - maxPlace) / (minPlace - maxPlace)) * $('.face-1-chart-graph').height();
    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
    if (curY < prevY) {
        curAngle = -curAngle;
    }
    $('.face-39-ratio-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null) {
            $('.face-39-ratio-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-39-ratio-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData39Ratio.length; i++) {
        var curData = faceData39Ratio[i];

        if (curData.type == 'actually') {
            if (maxSumm < Number(curData.summ)) {
                maxSumm = Number(curData.summ);
            }
        }
    }

    for (var i = 0; i < faceData39Ratio.length; i++) {
        var curData = faceData39Ratio[i];

        if (curData.type == 'actually') {
            $('.face-39-ratio-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * itemWidth + itemMargin) + 'px">' +
                                                                        '<div class="face-1-chart-icon-summ" data-summ="' + curData.summ + '" style="height:' + (Number(curData.summ) / maxSumm * 100) + '%"><svg viewBox="0 0 71 144" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.3739 12.8C48.3739 19.8692 42.6432 25.6 35.5739 25.6C28.5047 25.6 22.7739 19.8692 22.7739 12.8C22.7739 5.73075 28.5047 0 35.5739 0C42.6432 0 48.3739 5.73075 48.3739 12.8ZM61.4935 40.64L70.4535 78.72C70.4535 78.8525 70.5084 79.04 70.5727 79.2596C70.6637 79.5702 70.7735 79.9451 70.7735 80.32C70.7735 83.84 67.8935 86.72 64.3735 86.72C61.4935 86.72 58.9335 84.48 58.2935 81.92L51.5735 54.08V144H38.7735V86.4H32.3735V144H19.5735V54.4L12.8535 82.24C12.2135 84.8 9.65353 87.04 6.77353 87.04C3.25353 87.04 0.373535 84.16 0.373535 80.64C0.373535 80.2651 0.483342 79.8902 0.574309 79.5796C0.638633 79.36 0.693536 79.1725 0.693536 79.04L9.65353 40.96C9.97353 39.68 10.6135 38.4 11.5735 37.44C15.4135 34.24 19.8935 31.68 25.0135 30.4C28.5335 29.44 32.0535 28.8 35.5735 28.8C39.0935 28.8 42.6135 29.44 46.1335 30.08C51.2535 31.68 55.7335 33.92 59.5735 37.12C60.5335 38.08 61.1735 39.36 61.4935 40.64Z" fill="#4F7B96"/></svg></div>' +
                                                                        '<div class="face-1-chart-icon-count" data-count="' + curData.count + '" style="height:' + ((Number(curData.count) * 1.5 / Number(curData.summ)) / (Number(curData.summ) / maxSumm) * 100) + '%"><svg viewBox="0 0 48 97" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M32.8478 9.18101C32.8478 13.9128 29.0119 17.7487 24.28 17.7487C19.5482 17.7487 15.7123 13.9128 15.7123 9.18101C15.7123 4.44918 19.5482 0.613281 24.28 0.613281C29.0119 0.613281 32.8478 4.44918 32.8478 9.18101ZM41.6297 27.8158L47.6271 53.3048C47.6271 53.3935 47.6638 53.519 47.7069 53.666C47.7678 53.8738 47.8413 54.1248 47.8413 54.3757C47.8413 56.7319 45.9135 58.6596 43.5574 58.6596C41.6297 58.6596 39.9161 57.1602 39.4877 55.4467L34.9897 36.8119V97.0002H26.4219V58.4454H22.1381V97.0002H13.5703V37.0261L9.07229 55.6609C8.6439 57.3744 6.93036 58.8738 5.00262 58.8738C2.64649 58.8738 0.71875 56.9461 0.71875 54.5899C0.71875 54.339 0.79225 54.088 0.853139 53.8801C0.896194 53.7332 0.932944 53.6077 0.932944 53.519L6.93035 28.03C7.14455 27.1732 7.57293 26.3164 8.21551 25.6738C10.7858 23.5319 13.7845 21.8184 17.2116 20.9616C19.5678 20.319 21.9239 19.8906 24.28 19.8906C26.6361 19.8906 28.9923 20.319 31.3484 20.7474C34.7755 21.8184 37.7742 23.3177 40.3445 25.4596C40.9871 26.1022 41.4155 26.959 41.6297 27.8158Z" fill="#91D9D0"/></svg></div>' +
                                                                    '</div>');
        }
    }

    $('.face-39-ratio-container').mCustomScrollbar({
        axis: 'x',
        setLeft: '-' + (curScroll - $('.face-39-ratio-container').width() / 2) + 'px',
        scrollButtons: {
            enable: true
        },
        callbacks: {
            onScrollStart: function() {
                $('.face-39-ratio-window').remove();
            }
        }
    });

    $('.face-39-ratio-container .face-1-chart-icon-summ').on('mouseover', function(e) {
        $('.face-39-ratio-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Иследователи</div><div class="face-39-ratio-window-value">' + curItem.attr('data-summ') + ' тыс. чел.</div></div>');
    });

    $('.face-39-ratio-container .face-1-chart-icon-summ').on('mouseout', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $('.face-39-ratio-container .face-1-chart-icon-count').on('mouseover', function(e) {
        $('.face-39-ratio-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Иследователи<br /> до 39 лет</div><div class="face-39-ratio-window-value">' + curItem.attr('data-count') + ' тыс. чел.</div></div>');
    });

    $('.face-39-ratio-container .face-1-chart-icon-count').on('mouseout', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-39-ratio-window').remove();
    });

}

function face1CandidatesRedraw() {
    var face1Labels = [];
    var face1DataActually = [];
    var face1DataForecast = [];

    $('.face-39-candidates-container .face-1-chart-graph').html('');
    $('.face-39-candidates-container .face-1-chart-labels').html('');
    $('.face-39-candidates-container .face-1-chart-icons').html('');

    var itemWidth = 110;
    if ($(window).width() < 1140) {
        itemWidth = 80;
    }

    var itemMargin = 55;
    if ($(window).width() < 1140) {
        itemMargin = 40;
    }

    for (var i = 0; i < faceData39Candidates.length; i++) {
        var curData = faceData39Candidates[i];
        face1Labels.push(curData.year);

        if (curData.type == 'actually') {
            face1DataActually.push(Number(curData.count));
            if (curData.forecast !== undefined) {
                face1DataForecast.push(Number(curData.forecast));
            } else {
                face1DataForecast.push(null);
            }
        } else {
            face1DataActually.push(null);
            face1DataForecast.push(Number(curData.forecast));
        }
    }

    $('.face-39-candidates-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);

    var minPlace = 9999;
    var maxPlace = 0;
    var curScroll = 0;

    for (var i = 0; i < face1DataActually.length; i++) {
        if (face1DataActually[i] != null) {
            if (face1DataActually[i] < minPlace) {
                minPlace = face1DataActually[i];
            }
            if (face1DataActually[i] > maxPlace) {
                maxPlace = face1DataActually[i];
            }
        }
    }

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

    function angle_point(a, b, c) {
        var x1 = a[0] - b[0];
        var x2 = c[0] - b[0];
        var y1 = a[1] - b[1];
        var y2 = c[1] - b[1];

        var d1 = Math.sqrt(x1 * x1 + y1 * y1);
        var d2 = Math.sqrt(x2 * x2 + y2 * y2);
        return Math.acos((x1 * x2 + y1 * y2) / (d1 * d2)) * 180 / Math.PI;
    }

    var curLastActually = -1;
    for (var i = 0; i < face1DataActually.length; i++) {
        if (face1DataActually[i] != null) {
            curLastActually++;
            var curX = (i * itemWidth) + itemMargin;
            curScroll = curX;
        }
    }

    var curLastForecast = -1;
    for (var i = 0; i < face1DataForecast.length; i++) {
        if (face1DataForecast[i] != null) {
            if (curLastForecast < 0) {
                curLastForecast = i;
            }
            var curX = (i * itemWidth) + itemMargin;
            var curY = ((face1DataForecast[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-1-chart-graph').height();
            if (face1DataForecast[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataForecast[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-39-candidates-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-39-candidates-container .face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '<em>тыс чел.</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null) {
            $('.face-39-candidates-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-39-candidates-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData39Candidates.length; i++) {
        var curData = faceData39Candidates[i];

        if (curData.type == 'actually') {
            if (maxSumm < Number(curData.summ)) {
                maxSumm = Number(curData.summ);
            }
        }
    }

    for (var i = 0; i < faceData39Candidates.length; i++) {
        var curData = faceData39Candidates[i];

        if (curData.type == 'actually') {
            $('.face-39-candidates-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * itemWidth + itemMargin) + 'px">' +
                                                                        '<div class="face-1-chart-icon-summ" data-summ="' + curData.summ + '" style="height:' + (Number(curData.summ) / maxSumm * 100) + '%"><svg viewBox="0 0 66 134" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.0225 11.8755C45.0225 18.4342 39.7056 23.7511 33.1469 23.7511C26.5883 23.7511 21.2714 18.4342 21.2714 11.8755C21.2714 5.31686 26.5883 0 33.1469 0C39.7056 0 45.0225 5.31686 45.0225 11.8755ZM57.1945 37.7045L65.5074 73.0343C65.5074 73.1572 65.5583 73.3312 65.618 73.5349C65.7024 73.8231 65.8043 74.1709 65.8043 74.5187C65.8043 77.7845 63.1323 80.4565 59.8665 80.4565C57.1945 80.4565 54.8194 78.3783 54.2256 76.0032L47.991 50.1738V133.6H36.1154V80.1596H30.1776V133.6H18.3021V50.4707L12.0674 76.3C11.4737 78.6752 9.09854 80.7534 6.42654 80.7534C3.16077 80.7534 0.48877 78.0814 0.48877 74.8156C0.48877 74.4678 0.590645 74.12 0.675043 73.8318C0.734721 73.6281 0.785659 73.4541 0.785659 73.3312L9.09854 38.0014C9.39543 36.8139 9.98921 35.6263 10.8799 34.7356C14.4425 31.7667 18.599 29.3916 23.3492 28.2041C26.615 27.3134 29.8808 26.7196 33.1465 26.7196C36.4123 26.7196 39.6781 27.3134 42.9439 27.9072C47.6941 29.3916 51.8505 31.4699 55.4132 34.4387C56.3038 35.3294 56.8976 36.517 57.1945 37.7045Z" fill="#91D9D0"/></svg></div>' +
                                                                        '<div class="face-1-chart-icon-count" data-count="' + curData.count + '" style="height:' + ((Number(curData.count) * 3.5 / Number(curData.summ)) / (Number(curData.summ) / maxSumm) * 100) + '%"><svg viewBox="0 0 53 106" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.4357 4.62752L20.4904 6.42762L22.3087 7.23676L26.8544 9.25505L31.4001 7.23676L33.2184 6.42762L34.1275 6.0276V10.9915H35.9458V5.21846L37.2732 4.62752L26.8544 0L16.4357 4.62752ZM35.2305 18.8078C35.2305 23.5036 31.4238 27.3102 26.7281 27.3102C22.0323 27.3102 18.2257 23.5036 18.2257 18.8078C18.2257 15.6373 19.9611 12.872 22.5339 11.4102L22.4602 11.3752V8.18901L26.6926 10.0072L30.925 8.18901V11.3752L30.8899 11.3919C33.4805 12.8489 35.2305 15.624 35.2305 18.8078ZM26.7273 34.2318L31.6884 29.9117C32.3957 30.0285 33.103 30.1571 33.8103 30.2857C37.2113 31.3485 40.1871 32.8364 42.7378 34.962C43.3755 35.5997 43.8006 36.4499 44.0132 37.3002L45.8431 45.0773L45.8563 45.0846L52.8814 74.962H43.8166C42.2263 84.8997 38.7342 105.007 37.4884 105.936C37.3814 106.015 37.2652 106.019 37.1412 105.957H28.9214H24.6702H16.5112C16.3994 106.013 16.2939 106.015 16.1959 105.957H16.1678V105.938L16.164 105.936C14.9182 105.007 11.4261 84.8997 9.8358 74.962H0.770996L3.4319 63.6453C3.45423 63.4945 3.49438 63.3487 3.53245 63.2177L3.62665 62.817L3.62679 62.8074L6.69081 49.7853L7.79609 45.0846L7.79697 45.0841L9.57847 37.5127C9.79103 36.6625 10.2161 35.8122 10.8538 35.1746C13.4045 33.049 16.3804 31.3485 19.7813 30.4983C20.4741 30.3093 21.1669 30.139 21.8596 29.993L26.7273 34.2318Z" fill="#4F7096"/></svg></div>' +
                                                                    '</div>');
        }
    }

    $('.face-39-candidates-container').mCustomScrollbar({
        axis: 'x',
        setLeft: '-' + (curScroll - $('.face-39-candidates-container').width() / 2) + 'px',
        scrollButtons: {
            enable: true
        },
        callbacks: {
            onScrollStart: function() {
                $('.face-39-candidates-window').remove();
            }
        }
    });

    $('.face-39-candidates-container .face-1-chart-icon-summ').on('mouseover', function(e) {
        $('.face-39-candidates-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-candidates-window face-39-candidates-window-summ" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-candidates-window-title">Исследователи<br /> до 39 лет</div><div class="face-39-candidates-window-value">' + curItem.attr('data-summ') + ' тыс. чел.</div></div>');
    });

    $('.face-39-candidates-container .face-1-chart-icon-summ').on('mouseout', function(e) {
        $('.face-39-candidates-window').remove();
    });

    $('.face-39-candidates-container .face-1-chart-icon-count').on('mouseover', function(e) {
        $('.face-39-candidates-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-candidates-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-candidates-window-title">Исследователи до 39 лет,<br /> имеющие степень кандидата наук</div><div class="face-39-candidates-window-value">' + curItem.attr('data-count') + ' тыс. чел.</div></div>');
    });

    $('.face-39-candidates-container .face-1-chart-icon-count').on('mouseout', function(e) {
        $('.face-39-candidates-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-39-candidates-window').remove();
    });

}

function face3SectorsRedraw() {
    var curYear = $('.face-3-year li.active').attr('data-year');
    $('.face3-list').parents().filter('.cube-face').find('.cube-face-title span').html(curYear);
    var curData = null;
    for (var i = 0; i < faceData39Sectors.length; i++) {
        if (faceData39Sectors[i].year == curYear) {
            curData = faceData39Sectors[i].data;
        }
    }

    if (curData !== null) {

        var sortData = curData.slice();
        sortData.sort(function(a, b) {
            if (Number(a.value) < Number(b.value))
                return -1;
            if (Number(a.value) < Number(b.value))
                return 1;
            return 0;
        });

        function getIndex(element, arrayData) {
            var result = 0;
            for (var z = 0; z < arrayData.length; z++) {
                if (arrayData[z].title == element.title && arrayData[z].value == element.value) {
                    result = z;
                }
            }
            return result;
        }

        var newHTML = '';

        for (var i = 0; i < curData.length; i++) {
            newHTML += '<div class="face3-list-item"><div class="face3-list-item-inner"><div class="face3-list-item-icon"><div class="face3-list-item-icon-inner" style="background-color:' + faceData39SectorsColors[getIndex(curData[i], sortData)] + '"></div></div><div class="face3-list-item-title">' + curData[i].title + ' <span>(' + curData[i].value + '%)</span></div></div></div>';
        }

        $('.face3-list-39-sectors').html(newHTML);

        var curMax = 0;
        for (var i = 0; i < curData.length; i++) {
            if (curMax < Number(curData[i].value)) {
                curMax = Number(curData[i].value);
            }
        }

        var newHTML = '';

        for (var i = 0; i < curData.length; i++) {
            newHTML += '<div class="face-39-sectors-item"><div class="face-39-sectors-item-icon"><svg style="height:' + (Number(curData[i].value / curMax * 100)) + '%" viewBox="0 0 137 278" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M93.0576 24.6543C93.0576 38.2705 82.0195 49.3086 68.4033 49.3086C54.7871 49.3086 43.749 38.2705 43.749 24.6543C43.749 11.0381 54.7871 0 68.4033 0C82.0195 0 93.0576 11.0381 93.0576 24.6543ZM118.327 78.2776L135.585 151.624C135.585 151.879 135.691 152.24 135.815 152.663C135.99 153.262 136.202 153.984 136.202 154.706C136.202 161.486 130.655 167.033 123.875 167.033C118.327 167.033 113.397 162.719 112.164 157.788L99.2204 104.165V277.361H74.5661V166.417H62.239V277.361H37.5847V104.781L24.6412 158.404C23.4085 163.335 18.4776 167.649 12.9304 167.649C6.15048 167.649 0.603271 162.102 0.603271 155.322C0.603271 154.6 0.814771 153.878 0.989984 153.28C1.11388 152.857 1.21963 152.496 1.21963 152.24L18.4776 78.894C19.094 76.4285 20.3267 73.9631 22.1758 72.114C29.572 65.9505 38.201 61.0196 48.0628 58.5542C54.8427 56.7051 61.6226 55.4724 68.4025 55.4724C75.1825 55.4724 81.9624 56.7051 88.7423 57.9378C98.604 61.0196 107.233 65.3341 114.629 71.4977C116.478 73.3468 117.711 75.8122 118.327 78.2776Z" fill="' + faceData39SectorsColors[getIndex(curData[i], sortData)] + '"/></svg><div class="face-39-sectors-window"><div class="face-39-sectors-window-title">' + curData[i].title + '</div><div class="face-39-sectors-window-value">' + curData[i].value + '%</div></div></div><div class="face-39-sectors-item-value">' + curData[i].value + '%</div></div>';
        }

        $('.face-39-sectors-content').html(newHTML);
    }
}