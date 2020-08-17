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
    face23_1_Redraw();
    face23_2_Redraw();
    face2Redraw();
    face28_2_Redraw();
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

function face23_1_Redraw() {
    $('.face-23-1-list').html('');
    var listNames = [];
    for (var i = 0; i < faceData23_1[0].data.length; i++) {
        $('.face-23-1-list').append('<div class="face-23-1-list-item"><span style="background:' + face23_1_Colors[i] + '"></span>' + faceData23_1[0].data[i].name + '</div>');
    }
    $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});

    var curMax = 0;

    for (var i = 0; i < faceData23_1.length; i++) {
        if (typeof(faceData23_1[i].summ) !== 'undefined') {
            if (curMax < Number(faceData23_1[i].summ)) {
                curMax = Number(faceData23_1[i].summ);
            }
        }
        if (typeof(faceData23_1[i].forecast) !== 'undefined') {
            if (curMax < Number(faceData23_1[i].forecast)) {
                curMax = Number(faceData23_1[i].forecast);
            }
        }
    }

    var scaleStep = Math.floor(curMax / 4 / 1000) * 1000;
    var scaleCount = Math.ceil(curMax / scaleStep) + 1;
    var scaleMax = scaleCount * 1000;

    $('.face-23-1-scale').html('');
    for (var i = 0; i < scaleCount; i++) {
        $('.face-23-1-scale').append('<div class="face-23-1-scale-item" style="bottom:' + (i * (100 / scaleCount)) + '%"><span>' + String(i * scaleStep).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');
    }
    $('.face-23-1-scale').append('<div class="face-23-1-scale-item" style="bottom:100%"><span>' + String(scaleCount * scaleStep).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');

    $('.face-23-1-graph').html('');
    for (var i = 0; i < faceData23_1.length; i++) {
        if (typeof(faceData23_1[i].summ) !== 'undefined') {
            newHTML = '<div class="face-23-1-graph-item">' +
                            '<div class="face-23-1-graph-item-bar">' +
                                '<div class="face-23-1-graph-item-bar-container" data-id="' + i + '" style="height:' + (Number(faceData23_1[i].summ) / scaleMax * 100) + '%">';
            var subSumm = 0;
            for (var j = 0; j < faceData23_1[i].data.length; j++) {
                newHTML +=          '<div class="face-23-1-graph-item-bar-item" style="background:' + face23_1_Colors[j] + '; bottom:' + (subSumm / Number(faceData23_1[i].summ) * 100) + '%; height:' + (Number(faceData23_1[i].data[j].summ) / Number(faceData23_1[i].summ) * 100) + '%"></div>';
                subSumm += Number(faceData23_1[i].data[j].summ);
            }
            newHTML +=          '</div>' +
                            '</div>' +
                            '<div class="face-23-1-graph-item-year">' + faceData23_1[i].year + '</div>' +
                      '</div>';
            $('.face-23-1-graph').append(newHTML);
        } else {
            newHTML = '<div class="face-23-1-graph-item">' +
                            '<div class="face-23-1-graph-item-year">' + faceData23_1[i].year + '</div>' +
                      '</div>';
            $('.face-23-1-graph').append(newHTML);
        }
    }

    var itemWidth = 57;
    if ($(window).width() < 1140) {
        itemWidth = 33;
    }

    var itemMargin = 40;
    if ($(window).width() < 1140) {
        itemMargin = 17;
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

    for (var i = 0; i < faceData23_1.length; i++) {
        if (typeof(faceData23_1[i].forecast) != 'undefined') {
            var curX = i * (itemWidth + itemMargin) + itemMargin + itemWidth / 2;
            var curY = $('.face-23-1-graph-item-bar').eq(0).height() - ((faceData23_1[i].forecast / scaleMax) * $('.face-23-1-graph-item-bar').eq(0).height());
            if (typeof(faceData23_1[i - 1].forecast) != 'undefined') {
                var prevX = (i - 1) * (itemWidth + itemMargin) + itemMargin + itemWidth / 2;
                var prevY = $('.face-23-1-graph-item-bar').eq(0).height() - ((faceData23_1[i - 1].forecast / scaleMax) * $('.face-23-1-graph-item-bar').eq(0).height());
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-23-1-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-23-1-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + String(faceData23_1[i].forecast).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</strong></span></div>');
        }
    }

    $('.face-23-1-content').mCustomScrollbar('destroy');
    $('.face-23-1-content').mCustomScrollbar({
        axis: 'x',
        callbacks: {
            onScrollStart: function() {
                $('.face-23-1-window').remove();
            }
        }
    });

    $('.face-23-1-graph-item-bar-container').on('mouseover', function(e) {
        $('.face-23-1-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        var curID = Number(curItem.attr('data-id'));
        var newHTML = '';
        for (var i = 0; i < faceData23_1[curID].data.length; i++) {
            newHTML += '<div class="face-23-1-window-item">' + faceData23_1[curID].data[i].name + ' <span>' + String(faceData23_1[curID].data[i].summ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>';
        }
        $('body').append('<div class="face-23-1-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-23-1-window-title">Количество зарегистрированных распоряжений: <span>' + String(faceData23_1[curID].summ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div><div class="face-23-1-window-list-title">Из них:</div><div class="face-23-1-window-list">' + newHTML + '</div></div>');
    });

    $('.face-23-1-graph-item-bar-container').on('mouseout', function(e) {
        $('.face-23-1-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-23-1-window').remove();
    });

}

function face23_2_Redraw() {

    var curMaxSumm = 0;
    var curMaxSumm3 = 0;

    for (var i = 0; i < faceData23_2.length; i++) {
        var curData = faceData23_2[i];
        if (Number(curData.summ1) > curMaxSumm) {
            curMaxSumm = Number(curData.summ1);
        }
        if (Number(curData.summ2) > curMaxSumm) {
            curMaxSumm = Number(curData.summ2);
        }
        if (Number(curData.summ3) > curMaxSumm3) {
            curMaxSumm3 = Number(curData.summ3);
        }
    }

    var countSumm = Math.ceil(curMaxSumm / 200) + 2;
    var countSumm3 = Math.ceil(curMaxSumm3 / 2) + 2;
    var summMax = (countSumm - 1) * 200;
    var summ3Max = (countSumm3 - 1) * 2;

    var scaleLeftHTML = '';
    for (var i = 0; i < countSumm; i++) {
        scaleLeftHTML += '<div class="face-23-2-scale-left-item" style="bottom:' + (i / (countSumm - 1) * 100) + '%">' + (i * 200) + '</div>';
    }
    $('.face-23-2-scale-left').html(scaleLeftHTML);

    var scaleRightHTML = '';
    for (var i = 0; i < countSumm3; i++) {
        scaleRightHTML += '<div class="face-23-2-scale-right-item" style="bottom:' + (i / (countSumm3 - 1) * 100) + '%">' + (i * 2) + '</div>';
    }
    $('.face-23-2-scale-right-inner').html(scaleRightHTML);

    var graphHTML = '';
    for (var i = 0; i < faceData23_2.length; i++) {
        var curData = faceData23_2[i];

        graphHTML +=    '<div class="face-23-2-graph-item">';
        graphHTML +=        '<div class="face-23-2-graph-item-year">' + curData.year + '</div>';
        graphHTML +=    '</div>';
    }
    $('.face-23-2-graph-inner').html(graphHTML);

    $('.face-23-2-graph').mCustomScrollbar('destroy');
    $('.face-23-2-graph').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

    var itemWidth = 86;
    var itemHeight = 471;
    var itemHeight3 = 311;
    if ($(window).width() < 1140) {
        itemWidth = 52;
        itemHeight = 284;
        itemHeight3 = 222;
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

    for (var i = 0; i < faceData23_2.length; i++) {
        var curX = i * itemWidth + itemWidth / 2 + 40;
        var curY = itemHeight - ((faceData23_2[i].summ1 / summMax) * itemHeight);
        if (i > 0) {
            var prevX = (i - 1) * itemWidth + itemWidth / 2 + 40;
            var prevY = itemHeight - ((faceData23_2[i - 1].summ1 / summMax) * itemHeight);
            var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
            var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
            if (curY < prevY) {
                curAngle = -curAngle;
            }
            $('.face-23-2-graph-inner').append('<div class="face-1-chart-line face-1-chart-line-1" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
        }
        $('.face-23-2-graph-inner').append('<div class="face-1-chart-point face-1-chart-point-1" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + faceData23_2[i].summ1 + ' ед.</strong></span></div>');
    }

    for (var i = 0; i < faceData23_2.length; i++) {
        var curX = i * itemWidth + itemWidth / 2 + 40;
        var curY = itemHeight - ((faceData23_2[i].summ2 / summMax) * itemHeight);
        if (i > 0) {
            var prevX = (i - 1) * itemWidth + itemWidth / 2 + 40;
            var prevY = itemHeight - ((faceData23_2[i - 1].summ2 / summMax) * itemHeight);
            var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
            var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
            if (curY < prevY) {
                curAngle = -curAngle;
            }
            $('.face-23-2-graph-inner').append('<div class="face-1-chart-line face-1-chart-line-2" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
        }
        $('.face-23-2-graph-inner').append('<div class="face-1-chart-point face-1-chart-point-2" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + faceData23_2[i].summ2 + ' ед.</strong></span></div>');
    }

    for (var i = 0; i < faceData23_2.length; i++) {
        var curX = i * itemWidth + itemWidth / 2 + 40;
        var curY = itemHeight - ((faceData23_2[i].summ3 / summ3Max) * itemHeight3);
        if (i > 0) {
            var prevX = (i - 1) * itemWidth + itemWidth / 2 + 40;
            var prevY = itemHeight - ((faceData23_2[i - 1].summ3 / summ3Max) * itemHeight3);
            var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
            var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
            if (curY < prevY) {
                curAngle = -curAngle;
            }
            $('.face-23-2-graph-inner').append('<div class="face-1-chart-line face-1-chart-line-3" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
        }
        $('.face-23-2-graph-inner').append('<div class="face-1-chart-point face-1-chart-point-3" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + faceData23_2[i].summ3 + ' ед.</strong></span></div>');
    }

}

$(document).ready(function() {

    $('.face-2-type-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-2-type').length == 0) {
            $('.face-2-type').removeClass('open');
        }
    });

    $('.face-2-type ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-2-type ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-2-type-current').html($(this).html());
            face2Redraw();
        }
        $('.face-2-type').removeClass('open');
        e.preventDefault();
    });

    $('.face-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-2-year').length == 0) {
            $('.face-2-year').removeClass('open');
        }
    });

    $('.face-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-2-year-current').html($(this).html());
            $('.face-2-year-text').html($(this).html());
            face2Redraw();
        }
        $('.face-2-year').removeClass('open');
        e.preventDefault();
    });

    if ($(window).width() > 1139) {
        $('body').on('mouseenter', '.map-russia-district, .map-region-item', function(e) {
            $('.monitoring-map-region-hint').remove();
            $('body').append('<div class="monitoring-map-region-hint">' + $(this).attr('data-title') + '</div>');
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
        });

        $('body').on('mousemove', '.map-russia-district, .map-region-item', function(e) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
        });

        $('body').on('mouseleave', '.map-russia-district, .map-region-item', function(e) {
            $('.monitoring-map-region-hint').remove();
        });
    }

    $('body').on('click', '.map-russia-district', function(e) {
        $('.monitoring-map-region-hint').remove();
        if ($('.map-window').length == 0) {
            $('body').append('<div class="map-window map-window-29-2"><div class="map-window-inner">' +
                                    '<div class="map-window-title"></div>' +
                                    '<div class="map-window-info">' +
                                        '<div class="map-window-info-item">' +
                                            '<div class="map-window-info-item-title">Техническая<br /> вооруженность,<br /> тыс. руб./чел</div>' +
                                            '<div class="map-window-info-item-value map-window-info-item-value-1"></div>' +
                                        '</div>' +
                                        '<div class="map-window-info-item">' +
                                            '<div class="map-window-info-item-title">Стоимость машин и<br /> оборудования в возрасте<br /> до 5 лет, тыс. руб.</div>' +
                                            '<div class="map-window-info-item-value map-window-info-item-value-2"></div>' +
                                        '</div>' +
                                        '<div class="map-window-info-item">' +
                                            '<div class="map-window-info-item-title">Исследователи в<br /> эквиваленте полной<br /> занятости, чел.</div>' +
                                            '<div class="map-window-info-item-value map-window-info-item-value-3"></div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="map-window-info-chart-title">Динамика технической<br /> вооруженности, тыс. руб./чел</div>' +
                                    '<div class="map-window-info-chart"></div>' +
                                    '<div class="map-window-info-link"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                    '<div class="map-window-close"></div>' +
                                 '</div></div>');
        }
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.map-window').css({'left': curLeft, 'top': curTop});
        $('.map-window').removeClass('map-window-region');
        var districtID = $(this).attr('data-id');
        var districtTitle = '';
        for (var i = 0; i < russiaDistricts.length; i++) {
            if (russiaDistricts[i].id == districtID) {
                districtTitle = russiaDistricts[i].title;
            }
        }
        $('.map-window-title').html(districtTitle);
        $('.map-window-info-link a').attr('data-id', districtID);
        $('.map-window-info-chart').html('');

        var curType = $('.face-2-type li.active').attr('data-type');
        var curYear = $('.face-2-year-text').html();

        var curMax = 0;

        for (var i = 0; i < face2dataDistricts.length; i++) {
            if (face2dataDistricts[i].type == curType) {
                var curData = face2dataDistricts[i].data;
                for (var j = 0; j < curData.length; j++) {
                    if (curData[j].district == districtID) {
                        var curValue = parseInt(curData[j].value.replace(/ /g, ''));
                        if (typeof (curData[j].value100) != 'undefined') {
                            var curValue100 = parseFloat(curData[j].value100.replace(/ /g, '').replace(/,/g, '.'));
                        } else {
                            var curValue100 = 0;
                        }
                        if (face2dataDistricts[i].year == curYear) {
                            $('.map-window-info-item-value-1').html(String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
                            $('.map-window-info-item-value-2').html(String(curValue100).replace(/\./g, ','));
                            $('.map-window-info-item-value-3').html(String(curValue100).replace(/\./g, ','));
                        }
                        var predictClass = '';
                        if (typeof (face2dataDistricts[i].predict) != 'undefined' && face2dataDistricts[i].predict) {
                            predictClass = 'map-window-info-chart-item-predict';
                        }
                        if (curMax < curValue) {
                            curMax = curValue;
                        }
                        $('.map-window-info-chart').append('<div class="map-window-info-chart-item ' + predictClass + '">' +
                                                                '<div class="map-window-info-chart-item-value">' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                                                '<div class="map-window-info-chart-item-bar"></div>' +
                                                                '<div class="map-window-info-chart-item-year">' + face2dataDistricts[i].year + '</div>' +
                                                           '</div>');
                    }
                }
            }
        }
        $('.map-window-info-chart-item').each(function() {
            var curItem = $(this);
            curItem.find('.map-window-info-chart-item-bar').css({'height': parseInt(curItem.find('.map-window-info-chart-item-value').html().replace(/ /g, '')) / curMax * 108 + 'px'});
        });

        var newWidth = $('.map-window-info-chart-item').length * 56 + 30;
        if (newWidth < 350) {
            newWidth = 350;
        }
        $('.map-window').css({'width': newWidth, 'margin-left': -newWidth / 2});

        $('.map-window').show();
        $('html').addClass('map-window-opened');
    });

    $('body').on('click', '.map-window-close', function() {
        $('.map-window').hide();
        $('html').removeClass('map-window-opened');
    });

    $('body').on('click', '.map-region-item', function(e) {
        $('.monitoring-map-region-hint').remove();
        if ($('.map-window').length == 0) {
            $('body').append('<div class="map-window map-window-29-2"><div class="map-window-inner">' +
                                    '<div class="map-window-title"></div>' +
                                    '<div class="map-window-info">' +
                                        '<div class="map-window-info-item">' +
                                            '<div class="map-window-info-item-title">Техническая<br /> вооруженность,<br /> тыс. руб./чел</div>' +
                                            '<div class="map-window-info-item-value map-window-info-item-value-1"></div>' +
                                        '</div>' +
                                        '<div class="map-window-info-item">' +
                                            '<div class="map-window-info-item-title">Стоимость машин и<br /> оборудования в возрасте<br /> до 5 лет, тыс. руб.</div>' +
                                            '<div class="map-window-info-item-value map-window-info-item-value-2"></div>' +
                                        '</div>' +
                                        '<div class="map-window-info-item">' +
                                            '<div class="map-window-info-item-title">Исследователи в<br /> эквиваленте полной<br /> занятости, чел.</div>' +
                                            '<div class="map-window-info-item-value map-window-info-item-value-3"></div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="map-window-info-chart-title">Динамика технической<br /> вооруженности, тыс. руб./чел</div>' +
                                    '<div class="map-window-info-chart"></div>' +
                                    '<div class="map-window-info-link"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                    '<div class="map-window-close"></div>' +
                                 '</div></div>');
        }
        var curLeft = e.pageX;
        var curTop = e.pageY;
        if (curLeft === undefined) {
            curLeft = $(this).offset().left;
        }
        if (curTop === undefined) {
            curTop = $(this).offset().top;
        }
        $('.map-window').css({'left': curLeft, 'top': curTop});
        $('.map-window').addClass('map-window-region');
        var regionID = $(this).attr('data-id');
        var regionTitle = '';
        for (var i = 0; i < russiaRegions.length; i++) {
            if (russiaRegions[i].id == regionID) {
                regionTitle = russiaRegions[i].title;
            }
        }
        $('.map-window-title').html(regionTitle);
        $('.map-window-info-chart').html('');

        var curType = $('.face-2-type li.active').attr('data-type');
        var curYear = $('.face-2-year-text').html();

        var curMax = 0;

        for (var i = 0; i < face2dataRegions.length; i++) {
            if (face2dataRegions[i].id == regionID) {
                var curData = face2dataRegions[i].values;
                for (var j = 0; j < curData.length; j++) {
                    if (curData[j].type == curType) {
                        for (var k = 0; k < curData[j].data.length; k++) {
                            var curValues = curData[j].data[k];

                            var curValue = parseInt(curValues.value.replace(/ /g, ''));
                            if (typeof (curValues.value100) != 'undefined') {
                                var curValue100 = parseFloat(curValues.value100.replace(/ /g, '').replace(/,/g, '.'));
                            } else {
                                var curValue100 = 0;
                            }

                            if (curValues.year == curYear) {
                                $('.map-window-info-item-value-1').html(String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
                                $('.map-window-info-item-value-2').html(String(curValue100).replace(/\./g, ','));
                                $('.map-window-info-item-value-3').html(String(curValue100).replace(/\./g, ','));
                            }
                            var predictClass = '';
                            if (typeof (curValues.predict) != 'undefined' && curValues.predict) {
                                predictClass = 'map-window-info-chart-item-predict';
                            }
                            if (curMax < curValue) {
                                curMax = curValue;
                            }
                            $('.map-window-info-chart').append('<div class="map-window-info-chart-item ' + predictClass + '">' +
                                                                    '<div class="map-window-info-chart-item-value">' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                                                    '<div class="map-window-info-chart-item-bar"></div>' +
                                                                    '<div class="map-window-info-chart-item-year">' + curValues.year + '</div>' +
                                                               '</div>');
                        }
                    }
                }
            }
        }
        $('.map-window-info-chart-item').each(function() {
            var curItem = $(this);
            curItem.find('.map-window-info-chart-item-bar').css({'height': parseInt(curItem.find('.map-window-info-chart-item-value').html().replace(/ /g, '')) / curMax * 108 + 'px'});
        });

        var newWidth = $('.map-window-info-chart-item').length * 56 + 30;
        if (newWidth < 350) {
            newWidth = 350;
        }
        $('.map-window').css({'width': newWidth, 'margin-left': -newWidth / 2});

        $('.map-window').show();
        $('html').addClass('map-window-opened');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.map-window-inner').length == 0 && !$(e.target).hasClass('map-window-inner') && $(e.target).parents().filter('.map-russia-district').length == 0 && $(e.target).parents().filter('.face-2-table-name-region').length == 0 && !$(e.target).hasClass('map-russia-district') && !$(e.target).hasClass('face-2-table-name-region') && $(e.target).parents().filter('.map-region-item').length == 0 && !$(e.target).hasClass('map-region-item')) {
            $('.map-window').hide();
            $('html').removeClass('map-window-opened');
        }
    });

    $('body').on('click', '.map-window-info-link a', function(e) {
        var curID = $(this).attr('data-id');
        $('.face-2-back').addClass('visible').attr('data-id', curID);
        $('.face-2-title-russia').css({'display': 'none'});
        $('.face-2-title-regions').css({'display': 'inline'});
        $('.map-window').hide();
        $('.map-russia').hide();
        $('html').removeClass('map-window-opened');
        $('.map-region[data-id="' + curID + '"]').show();
        var curType = $('.face-2-type li.active').attr('data-type');
        var curSort = $('.map-russia-sort-type-list li.active').attr('data-sortType');
        var curYear = $('.face-2-year-text').html();
        var curData = [];
        for (var i = 0; i < face2dataRegions.length; i++) {
            var curRegionID = face2dataRegions[i].id;
            var curDiscrictID = -1;
            for (var j = 0; j < russiaRegions.length; j++) {
                if (curRegionID == russiaRegions[j].id && russiaRegions[j].district == curID) {
                    curDiscrictID = russiaRegions[j].district;
                }
            }
            if (curDiscrictID > -1) {
                for (var j = 0; j < face2dataRegions[i].values.length; j++) {
                    if (face2dataRegions[i].values[j].type == curType) {
                        for (var k = 0; k < face2dataRegions[i].values[j].data.length; k++) {
                            if (face2dataRegions[i].values[j].data[k].year == curYear) {
                                curData.push({
                                                'id'        : curRegionID,
                                                'value'     : face2dataRegions[i].values[j].data[k].value,
                                                'value100'  : face2dataRegions[i].values[j].data[k].value100
                                });
                            }
                        }
                    }
                }
            }
        }

        var activeValue = ' active';
        var activeValue100 = '';
        $('.face-2-table-head').eq(1).addClass('active');
        $('.face-2-table-head').eq(2).removeClass('active');

        if (curSort == 'value') {
            curData.sort(face2SortCount);
        } else {
            curData.sort(face2SortCount100);
            var activeValue = '';
            var activeValue100 = ' active';
            $('.face-2-table-head').eq(2).addClass('active');
            $('.face-2-table-head').eq(1).removeClass('active');
        }

        var newMap = '';
        $('.face-2-table-row').remove();
        for (var i = 0; i < curData.length; i++) {
            var regionID = curData[i].id;
            var regionTitle = '';
            for (var r = 0; r < russiaRegions.length; r++) {
                if (russiaRegions[r].id == regionID) {
                    regionTitle = russiaRegions[r].title;
                }
            }

            var curRatingsArray = [];
            for (var c = 0; c < mapColorsRegions.length; c++) {
                if (curID == mapColorsRegions[c].id) {
                    if (curType == 'WoS') {
                        if (curSort == 'value') {
                            curRatingsArray = mapColorsRegions[c].WoS.value;
                        } else {
                            curRatingsArray = mapColorsRegions[c].WoS.value100;
                        }
                    } else {
                        if (curSort == 'value') {
                            curRatingsArray = mapColorsRegions[c].Scopus.value;
                        } else {
                            curRatingsArray = mapColorsRegions[c].Scopus.value100;
                        }
                    }
                }
            }

            var curColorIndex = -1;
            var curValue = parseInt(curData[i].value.replace(/ /g, ''));
            if (curSort == 'value100') {
                curValue = parseFloat(curData[i].value100.replace(/ /g, '').replace(/,/g, '.'));
            }
            for (var c = 0; c < curRatingsArray.length; c++) {
                if (curValue >= curRatingsArray[c][0] && curValue < curRatingsArray[c][1]) {
                    curColorIndex = c;
                }
            }

            if (curType == 'WoS') {
                var curColor = mapColors[0][curColorIndex];
            } else {
                var curColor = mapColors[1][curColorIndex];
            }

            newMap += '<g class="map-region-item" data-id="' + regionID + '" data-title="' + regionTitle + '">';
            for (var j = 0; j < russiaRegions.length; j++) {
                var curRegion = russiaRegions[j];
                if (curRegion.id == regionID) {
                    newMap += '<g style="fill:' + curColor + '">' + curRegion.svg + '</g>';
                }
            }
            newMap += '</g>';
            var regionTitle = '';
            for (var j = 0; j < russiaRegions.length; j++) {
                if (russiaRegions[j].id == regionID) {
                    regionTitle = russiaRegions[j].title;
                }
            }
            $('.face-2-table').append('<div class="face-2-table-row">' +
                                        '<div class="face-2-table-name">' +
                                            '<a href="#" class="face-2-table-name-region" data-id="' + regionID + '">' +
                                                '<div class="face-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                regionTitle +
                                            '</a>' +
                                        '</div>' +
                                        '<div class="face-2-table-value' + activeValue + '">' + String(curData[i].value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                        '<div class="face-2-table-value' + activeValue100 + '">' + String(curData[i].value100).replace(/\./g, ',') + '</div>' +
                                      '</div>');
        }
        $('.map-region[data-id="' + curID + '"] svg').html(newMap);
        $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});

        var legendHTML = '';
        if (curType == 'WoS') {
            var legendColors = mapColors[0];
        } else {
            var legendColors = mapColors[1];
        }
        for (var ra = 0; ra < curRatingsArray.length; ra++) {
            var legendText = '';
            if (curRatingsArray[ra][0] == 0) {
                legendText = 'до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else if (curRatingsArray[ra][1] == Infinity) {
                legendText = 'более ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else {
                legendText = 'от ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            }
            legendHTML += '<div class="map-russia-legend-item"><div class="map-russia-legend-item-color" style="background:' + legendColors[ra] + '"></div>' + legendText + '</div>';
        }

        $('.map-russia-legend').html(legendHTML);

        e.preventDefault();
    });

    $('body').on('click', '.face-2-table-name-region', function(e) {
        var curID = $(this).attr('data-id');
        $('.map-region-item[data-id="' + curID + '"]').trigger('click');
        $('html, body').animate({'scrollTop': $('.map-region .map-region-item[data-id="' + curID + '"]').offset().top});
        e.preventDefault();
    });

    $('body').on('click', '.face-2-back a', function(e) {
        $('.face-2-table-head').eq(0).html('Федеральный<br />округ');
        $('.face-2-back').removeClass('visible').removeAttr('data-id');
        $('.face-2-title-russia').css({'display': 'inline'});
        $('.face-2-title-regions').css({'display': 'none'});
        $('.map-window').hide();
        $('.map-region').hide();
        $('.map-russia').show();
        $('html').removeClass('map-window-opened');
        face2Redraw();
        $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});
        e.preventDefault();
    });

    $('.map-russia-sort-type-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.map-russia-sort-type').length == 0) {
            $('.map-russia-sort-type').removeClass('open');
        }
    });

    $('.map-russia-sort-type-list ul li').click(function(e) {
        var curLi = $(this);
        if (!curLi.hasClass('active')) {
            $('.map-russia-sort-type-list ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.map-russia-sort-type-current').html(curLi.html());
            face2Redraw();
        }
        $('.map-russia-sort-type').removeClass('open');
    });

    $('body').on('click', '.face-2-table-head a', function(e) {
        var curIndex = $('.face-2-table-head a').index($(this));
        $('.map-russia-sort-type-list ul li').eq(curIndex).trigger('click');
        e.preventDefault();
    });

    $('body').on('click', '.face-2-table-name-link', function(e) {
        $('.face-2-table-head').eq(0).html('Субъект РФ');
        var curID = $(this).attr('data-id');
        if ($('.map-window').length == 0) {
            $('body').append('<div class="map-window map-window-29-2"><div class="map-window-inner">' +
                                    '<div class="map-window-title"></div>' +
                                    '<div class="map-window-info">' +
                                        '<div class="map-window-info-item">' +
                                            '<div class="map-window-info-item-title">Техническая<br /> вооруженность,<br /> тыс. руб./чел</div>' +
                                            '<div class="map-window-info-item-value map-window-info-item-value-1"></div>' +
                                        '</div>' +
                                        '<div class="map-window-info-item">' +
                                            '<div class="map-window-info-item-title">Стоимость машин и<br /> оборудования в возрасте<br /> до 5 лет, тыс. руб.</div>' +
                                            '<div class="map-window-info-item-value map-window-info-item-value-2"></div>' +
                                        '</div>' +
                                        '<div class="map-window-info-item">' +
                                            '<div class="map-window-info-item-title">Исследователи в<br /> эквиваленте полной<br /> занятости, чел.</div>' +
                                            '<div class="map-window-info-item-value map-window-info-item-value-3"></div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="map-window-info-chart-title">Динамика технической<br /> вооруженности, тыс. руб./чел</div>' +
                                    '<div class="map-window-info-chart"></div>' +
                                    '<div class="map-window-info-link"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                 '</div></div>');
        }
        $('.map-window-info-link a').attr('data-id', curID).trigger('click');
        e.preventDefault();
    });

    $('.map-russia').mCustomScrollbar({
        axis: 'x'
    });

    $('.face-2-table-wrap').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

});

function face2Redraw() {
    var curType = $('.face-2-type li.active').attr('data-type');
    var curSort = $('.map-russia-sort-type-list li.active').attr('data-sortType');
    var curYear = $('.face-2-year-text').html();
    var curData = null;
    for (var i = 0; i < face2dataDistricts.length; i++) {
        if (face2dataDistricts[i].type == curType && face2dataDistricts[i].year == curYear) {
            curData = face2dataDistricts[i].data;
        }
    }
    if (curData !== null) {
        var activeValue = ' active';
        var activeValue100 = '';
        $('.face-2-table-head').eq(1).addClass('active');
        $('.face-2-table-head').eq(2).removeClass('active');

        if (curSort == 'value') {
            curData.sort(face2SortCount);
        } else {
            curData.sort(face2SortCount100);
            var activeValue = '';
            var activeValue100 = ' active';
            $('.face-2-table-head').eq(2).addClass('active');
            $('.face-2-table-head').eq(1).removeClass('active');
        }
        var newMap = '';
        $('.face-2-table-row').remove();

        var curRatingsArray = [];
        if (curType == 'WoS') {
            if (curSort == 'value') {
                curRatingsArray = mapColorsDistrictsValueWoS;
            } else {
                curRatingsArray = mapColorsDistrictsValue100WoS;
            }
        } else {
            if (curSort == 'value') {
                curRatingsArray = mapColorsDistrictsValueScopus;
            } else {
                curRatingsArray = mapColorsDistrictsValue100Scopus;
            }
        }

        var legendHTML = '';
        if (curType == 'WoS') {
            var legendColors = mapColors[0];
        } else {
            var legendColors = mapColors[1];
        }
        for (var ra = 0; ra < curRatingsArray.length; ra++) {
            var legendText = '';
            if (curRatingsArray[ra][0] == 0) {
                legendText = 'до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else if (curRatingsArray[ra][1] == Infinity) {
                legendText = 'более ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else {
                legendText = 'от ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            }
            legendHTML += '<div class="map-russia-legend-item"><div class="map-russia-legend-item-color" style="background:' + legendColors[ra] + '"></div>' + legendText + '</div>';
        }

        $('.map-russia-legend').html(legendHTML);

        for (var i = 0; i < curData.length; i++) {
            var districtID = curData[i].district;
            var districtTitle = '';
            for (var r = 0; r < russiaDistricts.length; r++) {
                if (russiaDistricts[r].id == districtID) {
                    districtTitle = russiaDistricts[r].title;
                }
            }

            var curColorIndex = -1;
            var curValue = parseInt(curData[i].value.replace(/ /g, ''));
            if (curSort == 'value100') {
                curValue = parseFloat(curData[i].value100.replace(/ /g, '').replace(/,/g, '.'));
            }
            for (var c = 0; c < curRatingsArray.length; c++) {
                if (curValue >= curRatingsArray[c][0] && curValue < curRatingsArray[c][1]) {
                    curColorIndex = c;
                }
            }

            if (curType == 'WoS') {
                var curColor = mapColors[0][curColorIndex];
            } else {
                var curColor = mapColors[1][curColorIndex];
            }

            newMap += '<g class="map-russia-district" data-id="' + districtID + '" data-title="' + districtTitle + '">';
            for (var j = 0; j < russiaRegions.length; j++) {
                var curRegion = russiaRegions[j];
                if (curRegion.district == districtID) {
                    newMap += '<g style="fill:' + curColor + '">' + curRegion.svg + '</g>';
                }
            }
            newMap += '</g>';
            var districtTitle = '';
            for (var j = 0; j < russiaDistricts.length; j++) {
                if (russiaDistricts[j].id == districtID) {
                    districtTitle = russiaDistricts[j].title;
                }
            }
            $('.face-2-table').append('<div class="face-2-table-row">' +
                                        '<div class="face-2-table-name">' +
                                            '<a href="#" class="face-2-table-name-link" data-id="' + districtID + '">' +
                                                '<div class="face-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                '<div class="face-2-table-name-text">' + districtTitle + '</div>' +
                                            '</a>' +
                                        '</div>' +
                                        '<div class="face-2-table-value' + activeValue + '">' + String(curData[i].value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                        '<div class="face-2-table-value' + activeValue100 + '">' + String(curData[i].value100).replace(/\./g, ',') + '</div>' +
                                      '</div>');
        }
        $('.map-russia svg').html(newMap);
    }

    if ($('.face-2-back').hasClass('visible')) {
        var curID = $('.face-2-back').attr('data-id');
        $('.map-window-info-link a').attr('data-id', curID).trigger('click');
    }
}

function face2SortCount(a, b) {
    var value1 = parseInt(a.value.replace(/ /g, ''));
    var value2 = parseInt(b.value.replace(/ /g, ''));
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face2SortCount100(a, b) {
    var value1 = parseFloat(a.value100.replace(/ /g, '').replace(/,/g, '.'));
    var value2 = parseFloat(b.value100.replace(/ /g, '').replace(/,/g, '.'));
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

$(document).ready(function() {

    if ($(window).width() > 1139) {
        $('body').on('mouseenter', '.map-russia-district-28-2, .map-region-item-28-2', function(e) {
            $('.monitoring-map-region-hint').remove();
            $('body').append('<div class="monitoring-map-region-hint">' + $(this).attr('data-title') + '</div>');
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
        });

        $('body').on('mousemove', '.map-russia-district-28-2, .map-region-item-28-2', function(e) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
        });

        $('body').on('mouseleave', '.map-russia-district-28-2, .map-region-item-28-2', function(e) {
            $('.monitoring-map-region-hint').remove();
        });
    }

    $('body').on('click', '.map-russia-district-28-2', function() {
        $('.face-28-2-window').remove();
        if (!$(this).hasClass('disabled')) {
            var curID = $(this).attr('data-id');
            $('.face-28-2-back').addClass('visible').attr('data-id', curID);
            $('.map-russia-28-2').hide();
            $('.map-region-28-2[data-id="' + curID + '"]').show();
            var curData = [];
            for (var i = 0; i < face_28_2_dataRegions.length; i++) {
                var curRegionID = face_28_2_dataRegions[i].id;
                var curDiscrictID = -1;
                for (var j = 0; j < russiaRegions.length; j++) {
                    if (curRegionID == russiaRegions[j].id && russiaRegions[j].district == curID) {
                        curDiscrictID = russiaRegions[j].district;
                    }
                }
                if (curDiscrictID > -1) {
                    var curValue = parseInt(face_28_2_dataRegions[i].value.replace(/ /g, ''));
                        curData.push({
                            'id'        : curRegionID,
                            'value'     : curValue
                        });
                }
            }

            var legendColors = map_28_2_Colors;
            var newMap = '';
            for (var i = 0; i < curData.length; i++) {
                var regionID = curData[i].id;
                var regionTitle = '';
                for (var r = 0; r < russiaRegions.length; r++) {
                    if (russiaRegions[r].id == regionID) {
                        regionTitle = russiaRegions[r].title;
                    }
                }

                var curColorIndex = parseInt(curData[i].value);
                if (curColorIndex > legendColors.length - 1) {
                    curColorIndex = legendColors.length - 1;
                }

                var curColor = legendColors[curColorIndex];

                if (curColorIndex > 0) {
                    newMap += '<g class="map-region-item-28-2" data-id="' + regionID + '" data-title="' + regionTitle + '">';
                } else {
                    newMap += '<g class="map-region-item-28-2 disabled" data-id="' + regionID + '" data-title="' + regionTitle + '">';
                }
                for (var j = 0; j < russiaRegions.length; j++) {
                    var curRegion = russiaRegions[j];
                    if (curRegion.id == regionID) {
                        newMap += '<g style="fill:' + curColor + '">' + curRegion.svg + '</g>';
                    }
                }
                newMap += '</g>';
            }
            $('.map-region-28-2[data-id="' + curID + '"] svg').html(newMap);

            $('.map-russia-28-2-point, .map-region-28-2-points').remove();
            $('.map-region-28-2[data-id="' + curID + '"] .map-region-item-28-2:not(.disabled)').each(function() {
                var pointsHTML = '<div class="map-region-28-2-points">';
                var curRegion = $(this);
                var curCenter = [];
                for (var r = 0; r < russiaRegions.length; r++) {
                    if (russiaRegions[r].id == curRegion.attr('data-id')) {
                        curCenter = russiaRegions[r].center;
                    }
                }
                var curDiff = curRegion.parents().filter('.map-region-28-2 svg').width() / 1108;

                for (var i = 0; i < face_28_2_dataRegions.length; i++) {
                    if (curRegion.attr('data-id') == face_28_2_dataRegions[i].id) {
                        var curValue = parseInt(face_28_2_dataRegions[i].value.replace(/ /g, ''));
                        for (var j = 0; j < curValue; j++) {
                            pointsHTML += '<div class="map-region-28-2-point" data-region="' + curRegion.attr('data-id') + '" data-id="' + j + '" style="left:' + (curCenter[0] * curDiff) + 'px; top:' + (curCenter[1] * curDiff) + 'px"><div class="map-region-28-2-point-value"></div></div>';
                        }
                    }
                }
                pointsHTML += '</div>';
                $('.map-region-28-2[data-id="' + curID + '"] .map-region-28-2-inner').append(pointsHTML);
            });
        }
    });

    $('body').on('click', '.map-region-28-2-point-value', function() {
        $('.face-28-2-window').remove();
        var curPoint = $(this).parent();
        var curRegion = curPoint.attr('data-region');
        var curID = Number(curPoint.attr('data-id'));
        var curData = null;
        for (var i = 0; i < face_28_2_dataRegions.length; i++) {
            if (curRegion == face_28_2_dataRegions[i].id) {
                curData = face_28_2_dataRegions[i].data[curID];
            }
        }
        var regionTitle = '';
        for (var i = 0; i < russiaRegions.length; i++) {
            if (curRegion == russiaRegions[i].id) {
                regionTitle = russiaRegions[i].title;
            }
        }
        if (curData !== null) {
            $('body').append(   '<div class="face-28-2-window" style="left:' + $(this).offset().left + 'px; top:' + $(this).offset().top + 'px">' +
                                    '<div class="face-28-2-window-bg"></div>' +
                                    '<div class="face-28-2-window-inner">' +
                                        '<div class="face-28-2-window-row">' +
                                            '<div class="face-28-2-window-row-title">Регион:</div>' +
                                            '<div class="face-28-2-window-row-value">' + regionTitle + '</div>' +
                                        '</div>' +
                                        '<div class="face-28-2-window-row">' +
                                            '<div class="face-28-2-window-row-title">Название:</div>' +
                                            '<div class="face-28-2-window-row-value">' + curData.title + '</div>' +
                                        '</div>' +
                                        '<div class="face-28-2-window-row">' +
                                            '<div class="face-28-2-window-row-title">Краткое описание:</div>' +
                                            '<div class="face-28-2-window-row-value">' + curData.text + '</div>' +
                                        '</div>' +
                                        '<a href="#" class="face-28-2-window-close"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8.94727" width="1.48861" height="12.6532" transform="rotate(45 8.94727 0)" /><rect x="10" y="8.94714" width="1.48861" height="12.6532" transform="rotate(135 10 8.94714)" /></svg></a>' +
                                    '</div>' +
                                '</div>');
            if ($(window).width() < 1140) {
                $('.face-28-2-window-inner').mCustomScrollbar({
                    axis: 'y'
                });
            }
        }
    });

    $('body').on('click', '.face-28-2-window-close', function(e) {
        $('.face-28-2-window').remove();
        e.preventDefault();
    });

    $('body').on('click', '.face-28-2-window-bg', function(e) {
        $('.face-28-2-window').remove();
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-28-2-window').length == 0 && $(e.target).parents().filter('.map-region-28-2-point').length == 0) {
            $('.face-28-2-window').remove();
        }
    });

    $('body').on('click', '.face-28-2-back a', function(e) {
        $('.face-28-2-back').removeClass('visible').removeAttr('data-id');
        $('.map-region-28-2').hide();
        $('.map-russia-28-2').show();
        $('.face-28-2-window').remove();
        face28_2_Redraw();
        e.preventDefault();
    });

    $('.map-russia-28-2').mCustomScrollbar({
        axis: 'x'
    });

    $('.map-russia-legend-icon-28-2').click(function() {
        $('html').addClass('window-open');

        if ($('.window').length > 0) {
            $('.window').remove();
        }
        $('body').append('<div class="window window-map-legend"><div class="window-loading"></div></div>');

        var windowHTML = '<div class="window-map-legend-inner"><div class="window-map-legend-title">Легенда</div><div class="window-map-legend-list">' + $('.map-russia-legend-28-2').html() + '</div></div>';

        $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

        $('.window-container').removeClass('window-container-load');
        windowPosition();
    });

});

function face28_2_Redraw() {
    var curData = face_28_2_dataDistricts;
    if (curData !== null) {
        var newMap = '';

        var legendHTML = '';
        var legendColors = map_28_2_Colors;
        for (var ra = 0; ra < legendColors.length; ra++) {
            var legendText = ra;
            legendHTML += '<div class="map-russia-legend-28-2-item"><div class="map-russia-legend-28-2-item-color" style="background:' + legendColors[ra] + '"></div>' + legendText + '</div>';
        }

        $('.map-russia-legend-28-2').html(legendHTML);
        $('.face-28-2-window').remove();

        for (var i = 0; i < curData.length; i++) {
            var districtID = curData[i].id;
            var districtTitle = '';
            for (var r = 0; r < russiaDistricts.length; r++) {
                if (russiaDistricts[r].id == districtID) {
                    districtTitle = russiaDistricts[r].title;
                }
            }

            var curColorIndex = parseInt(curData[i].value.replace(/ /g, ''));
            if (curColorIndex > legendColors.length - 1) {
                curColorIndex = legendColors.length - 1;
            }

            var curColor = legendColors[curColorIndex];

            if (curColorIndex > 0) {
                newMap += '<g class="map-russia-district-28-2" data-id="' + districtID + '" data-title="' + districtTitle + '" data-value="' + curData[i].value.replace(/ /g, '') + '">';
            } else {
                newMap += '<g class="map-russia-district-28-2 disabled" data-id="' + districtID + '" data-title="' + districtTitle + '">';
            }
            for (var j = 0; j < russiaRegions.length; j++) {
                var curRegion = russiaRegions[j];
                if (curRegion.district == districtID) {
                    newMap += '<g style="fill:' + curColor + '">' + curRegion.svg + '</g>';
                }
            }
            newMap += '</g>';

        }
        $('.map-russia-28-2 svg').html(newMap);
        $('.map-russia-28-2-point, .map-region-28-2-points').remove();
        $('.map-russia-district-28-2:not(.disabled)').each(function() {
            var curDistrict = $(this);
            var curCenter = [];
            for (var r = 0; r < russiaDistricts.length; r++) {
                if (russiaDistricts[r].id == curDistrict.attr('data-id')) {
                    curCenter = russiaDistricts[r].center;
                }
            }
            var curDiff = $('.map-russia-28-2 svg').width() / 1108;
            $('.map-russia-28-2-inner').append('<div class="map-russia-28-2-point" style="left:' + (curCenter[0] * curDiff) + 'px; top:' + (curCenter[1] * curDiff) + 'px"><div class="map-russia-28-2-point-value">' + curDistrict.attr('data-value') + '</div></div>');
        });
    }

    if ($('.face-28-2-back').hasClass('visible')) {
        var curID = $('.face-28-2-back').attr('data-id');
        $('.map-russia-district-28-2[data-id="' + curID + '"]').trigger('click');
    }
}