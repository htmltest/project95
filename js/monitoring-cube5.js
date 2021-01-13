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

    faceEGISURedraw();
    face16_1_Redraw();
    face16_3_Redraw();
    face22_2_Redraw();
    face24_1_Redraw();
    face14_1_Redraw();

});

function faceEGISURedraw() {
    $('.face-egisu-list').html('');
    var listNames = [];
    for (var i = 0; i < faceDataEGISU[0].data.length; i++) {
        $('.face-egisu-list').append('<div class="face-egisu-list-item"><span style="background:' + faceEGISUColors[i] + '"></span>' + faceDataEGISU[0].data[i].name + '</div>');
    }
    $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});

    var curMax = 0;

    for (var i = 0; i < faceDataEGISU.length; i++) {
        if (curMax < Number(faceDataEGISU[i].summ)) {
            curMax = Number(faceDataEGISU[i].summ);
        }
    }

    var scaleStep = Math.floor(curMax / 4 / 1000) * 1000;
    var scaleCount = Math.ceil(curMax / scaleStep);
    $('.face-egisu-scale').html('');
    for (var i = 0; i < scaleCount; i++) {
        $('.face-egisu-scale').append('<div class="face-egisu-scale-item" style="bottom:' + (i * (100 / scaleCount)) + '%"><span>' + String(i * scaleStep).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');
    }
    $('.face-egisu-scale').append('<div class="face-egisu-scale-item" style="bottom:100%"><span>' + String(scaleCount * scaleStep).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');

    $('.face-egisu-graph').html('');
    for (var i = 0; i < faceDataEGISU.length; i++) {
        newHTML = '<div class="face-egisu-graph-item">' +
                        '<div class="face-egisu-graph-item-bar">' +
                            '<div class="face-egisu-graph-item-bar-container" data-id="' + i + '" style="height:' + (Number(faceDataEGISU[i].summ) / curMax * 100) + '%">';
        var subSumm = 0;
        for (var j = 0; j < faceDataEGISU[i].data.length; j++) {
            newHTML +=          '<div class="face-egisu-graph-item-bar-item" style="background:' + faceEGISUColors[j] + '; bottom:' + (subSumm / Number(faceDataEGISU[i].summ) * 100) + '%; height:' + (Number(faceDataEGISU[i].data[j].summ) / Number(faceDataEGISU[i].summ) * 100) + '%"></div>';
            subSumm += Number(faceDataEGISU[i].data[j].summ);
        }
        newHTML +=          '</div>' +
                        '</div>' +
                        '<div class="face-egisu-graph-item-year">' + faceDataEGISU[i].year + '</div>' +
                  '</div>';
        $('.face-egisu-graph').append(newHTML);
    }

    $('.face-egisu-content').mCustomScrollbar('destroy');
    $('.face-egisu-content').mCustomScrollbar({
        axis: 'x',
        callbacks: {
            onScrollStart: function() {
                $('.face-egisu-window').remove();
            }
        }
    });

    $('.face-egisu-graph-item-bar-container').on('mouseover', function(e) {
        $('.face-egisu-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        var curID = Number(curItem.attr('data-id'));
        var newHTML = '';
        for (var i = 0; i < faceDataEGISU[curID].data.length; i++) {
            newHTML += '<div class="face-egisu-window-item">' + faceDataEGISU[curID].data[i].name + ' <span>' + String(faceDataEGISU[curID].data[i].summ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>';
        }
        $('body').append('<div class="face-egisu-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-egisu-window-title">Всего выявлено РИД: <span>' + String(faceDataEGISU[curID].summ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div><div class="face-egisu-window-list-title">Из них:</div><div class="face-egisu-window-list">' + newHTML + '</div></div>');
    });

    $('.face-egisu-graph-item-bar-container').on('mouseout', function(e) {
        $('.face-egisu-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-egisu-window').remove();
    });

}

function face16_1_Redraw() {
    var face1Labels = [];
    var face1DataActually = [];
    var face1DataForecast = [];

    $('.face-16-1-container .face-1-chart-graph').html('');
    $('.face-16-1-container .face-1-chart-labels').html('');
    $('.face-16-1-container .face-1-chart-icons').html('');

    var itemWidth = 110;
    if ($(window).width() < 1140) {
        itemWidth = 80;
    }

    var itemMargin = 55;
    if ($(window).width() < 1140) {
        itemMargin = 40;
    }

    for (var i = 0; i < faceData16_1.length; i++) {
        var curData = faceData16_1[i];
        face1Labels.push(curData.year);

        if (typeof curData.ratio !== 'undefined') {
            face1DataActually.push(Number(curData.ratio));
        } else {
            face1DataActually.push(null);
        }

        if (typeof curData.ratiof !== 'undefined') {
            face1DataForecast.push(Number(curData.ratiof));
        } else {
            face1DataForecast.push(null);
        }
    }

    $('.face-16-1-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);

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

    for (var i = 0; i < face1DataActually.length; i++) {
        if (face1DataActually[i] != null) {
            var curX = (i * itemWidth) + itemMargin;
            curScroll = curX;
            var curY = ((face1DataActually[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-16-1-container .face-1-chart-graph').height();
            if (face1DataActually[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataActually[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-16-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-16-1-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-16-1-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataActually[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1DataForecast.length; i++) {
        if (face1DataForecast[i] != null) {
            var curX = (i * itemWidth) + itemMargin;
            var curY = ((face1DataForecast[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-16-1-container .face-1-chart-graph').height();
            if (face1DataForecast[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataForecast[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-16-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-16-1-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            var classBottom = '';
            if (face1DataActually[i] != null) {
                classBottom = 'bottom';
            }
            $('.face-16-1-container .face-1-chart-graph').append('<div class="face-1-chart-point ' + classBottom + '" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null) {
            $('.face-16-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-16-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData16_1.length; i++) {
        var curData = faceData16_1[i];

        if (curData.type == 'actually') {
            if (maxSumm < Number(curData.summ)) {
                maxSumm = Number(curData.summ);
            }
        }
    }

    for (var i = 0; i < faceData16_1.length; i++) {
        var curData = faceData16_1[i];

        if (curData.type == 'actually') {
            $('.face-16-1-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * itemWidth + itemMargin) + 'px">' +
                                                                        '<div class="face-1-chart-icon-summ" data-summ="' + curData.summ + '" style="height:' + (Number(curData.summ) / maxSumm * 100) + '%"><div class="face-1-chart-icon-summ-inner"></div></div>' +
                                                                        '<div class="face-1-chart-icon-count" data-count="' + curData.count + '" style="height:' + ((Number(curData.count) / Number(curData.summ)) / (Number(curData.summ) / maxSumm) * 100) + '%"><div class="face-1-chart-icon-count-inner"></div></div>' +
                                                                    '</div>');
        }
    }

    $('.face-16-1-container').mCustomScrollbar({
        axis: 'x',
        setLeft: '-' + (curScroll - $('.face-16-1-container').width() / 2) + 'px',
        scrollButtons: {
            enable: true
        },
        callbacks: {
            onScrollStart: function() {
                $('.face-39-ratio-window').remove();
            }
        }
    });

    $('.face-16-1-container .face-1-chart-icon-summ').on('mouseover', function(e) {
        $('.face-16-1-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Всего статей</div><div class="face-39-ratio-window-value">' + curItem.attr('data-summ') + ' тыс.</div></div>');
    });

    $('.face-16-1-container .face-1-chart-icon-summ').on('mouseout', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $('.face-16-1-container .face-1-chart-icon-count').on('mouseover', function(e) {
        $('.face-39-ratio-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Российские статьи</div><div class="face-39-ratio-window-value">' + curItem.attr('data-count') + ' тыс.</div></div>');
    });

    $('.face-16-1-container .face-1-chart-icon-count').on('mouseout', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-39-ratio-window').remove();
    });

}

$(document).ready(function() {

    $('body').on('click', '.face-16-3-item-info-icon', function(e) {
        if ($(window).width() < 1140) {
            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var windowHTML = '<div class="window-formula-info-mobile">' + $(this).parent().find('.face-16-3-item-info-content').html() + '</div>';

            $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }
        e.preventDefault();
    });

    $('.face-16-3-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-16-3-year').length == 0) {
            $('.face-16-3-year').removeClass('open');
        }
    });

    $('.face-16-3-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-16-3-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-16-3-year-current').html($(this).html());
            face16_3_Redraw();
        }
        $('.face-16-3-year').removeClass('open');
        e.preventDefault();
    });

});

function face16_3_Redraw() {
    var curYear = $('.face-16-3-year-current').html();
    
    var curData = null;
    for (var i = 0; i < face16_3_data.length; i++) {
        if (curYear == face16_3_data[i].year) {
            curData = face16_3_data[i].data;
            $('.face-16-3-header-value span').html(face16_3_data[i].summ);
        }
    }

    $('.face-16-3-list').each(function() {
        var maxWidthLine = 225;
        if ($(window).width() < 1140) {
            maxWidthLine = 89;
        }

        var maxValue = 0;
        for (var i = 0; i < curData.length; i++) {
            var curValue = parseFloat(curData[i].value.replace(/,/, '.'));
            if (maxValue < curValue) {
                maxValue = curValue;
            }
        }

        var newHTML = '';

        for (var i = 0; i < curData.length; i++) {
            var curItem = curData[i];
            var curValue = parseFloat(curItem.value.replace(/,/, '.'));
            var curWidth = curValue / maxValue * maxWidthLine + 1;
            var curIcon = '';
            if (curItem.icon !== undefined && curItem.icon != '') {
                curIcon = '<img src="' + curItem.icon + '" alt="" />';
            }
            var curHint = '';
            var hintSize = '';
            if (curItem.hint !== undefined && curItem.hint != '') {
                curHint = '<div class="face-16-3-item-info">' +
                                '<div class="face-16-3-item-info-container">' +
                                    '<a href="#" class="face-16-3-item-info-icon"></a>' +
                                    '<div class="face-16-3-item-info-content ' + hintSize + '">' + curItem.hint + '</div>' +
                                '</div>' +
                            '</div>';
                if (curItem.hint.length < 300) {
                    hintSize = 'mini';
                }
            }
            newHTML += '<div class="face-16-3-item">' +
                            '<div class="face-16-3-item-icon">' + curIcon + '</div>' +
                            '<div class="face-16-3-item-title">' + curItem.title + curHint + '</div>' +
                            '<div class="face-16-3-item-line"><div class="face-16-3-item-line-inner" style="width:' + curWidth + 'px"></div></div>' +
                            '<div class="face-16-3-item-value">' + curItem.value + '%</div>' +
                       '</div>';
        }

        $('.face-16-3-list').html(newHTML);
    });
}

function face22_2_Redraw() {
    var face1Labels = [];
    var face1DataActually = [];

    $('.face-22-2-container .face-1-chart-graph').html('');
    $('.face-22-2-container .face-1-chart-labels').html('');
    $('.face-22-2-container .face-1-chart-icons').html('');

    var itemWidth = 84;
    if ($(window).width() < 1140) {
        itemWidth = 84;
    }

    var itemMargin = 62;
    if ($(window).width() < 1140) {
        itemMargin = 62;
    }

    for (var i = 0; i < faceData22_2.length; i++) {
        var curData = faceData22_2[i];
        face1Labels.push(curData.year);
        face1DataActually.push(Number(curData.ratio));
    }

    if ($(window).width() < 1140) {
        $('.face-22-2-container .face-1-chart').width(face1Labels.length * (itemWidth + itemMargin));
    } else {
        $('.face-22-2-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);
    }

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
            var curX = (i * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
            curScroll = curX;
            var curY = ((face1DataActually[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-22-2-container .face-1-chart-graph').height();
            if (face1DataActually[i - 1] != null) {
                var prevX = ((i - 1) * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
                var prevY = ((face1DataActually[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-22-2-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-22-2-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-22-2-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataActually[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null) {
            $('.face-22-2-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * (itemWidth + itemMargin)) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-22-2-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * (itemWidth + itemMargin)) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData22_2.length; i++) {
        var curData = faceData22_2[i];

        if (maxSumm < Number(curData.summ)) {
            maxSumm = Number(curData.summ);
        }
    }

    for (var i = 0; i < faceData22_2.length; i++) {
        var curData = faceData22_2[i];

        $('.face-22-2-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * (itemWidth + itemMargin)) + 'px">' +
                                                                    '<div class="face-1-chart-icon-count" style="height:' + ((Number(curData.ratio) / 100) * (Number(curData.summ) / maxSumm) * 100) + '%"><div class="face-1-chart-icon-count-inner"><div class="face-1-chart-icon-value">' + curData.summ5 + '</div></div></div>' +
                                                                    '<div class="face-1-chart-icon-summ" style="height:' + (Number(curData.summ) / maxSumm * 100) + '%"><div class="face-1-chart-icon-summ-inner"><div class="face-1-chart-icon-value">' + curData.summ + '</div></div></div>' +
                                                                '</div>');
    }

    $('.face-22-2-container .face-1-chart-icon-count').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-count-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-count-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-22-2-container .face-1-chart-icon-summ').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-summ-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-summ-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-22-2-container').mCustomScrollbar('destroy');
    $('.face-22-2-container').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

}

function face24_1_Redraw() {
    var face1Labels = [];
    var face1DataActually = [];
    var face1DataForecast = [];

    $('.face-24-1-container .face-1-chart-graph').html('');
    $('.face-24-1-container .face-1-chart-labels').html('');
    $('.face-24-1-container .face-1-chart-icons').html('');

    var itemWidth = 110;
    if ($(window).width() < 1140) {
        itemWidth = 80;
    }

    var itemMargin = 55;
    if ($(window).width() < 1140) {
        itemMargin = 40;
    }

    for (var i = 0; i < faceData24_1.length; i++) {
        var curData = faceData24_1[i];
        face1Labels.push(curData.year);

        if (curData.type == 'actually') {
            if (curData.ratio !== undefined) {
                face1DataActually.push(Number(curData.ratio));
            } else {
                face1DataActually.push(null);
            }
            if (curData.ratiof !== undefined) {
                face1DataForecast.push(Number(curData.ratiof));
            } else {
                face1DataForecast.push(null);
            }
        } else {
            face1DataActually.push(null);
            face1DataForecast.push(Number(curData.ratiof));
        }
    }

    $('.face-24-1-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);

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
            var curY = ((face1DataActually[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-24-1-container .face-1-chart-graph').height();
            if (face1DataActually[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataActually[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-24-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-24-1-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-24-1-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataActually[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    var curLastForecast = -1;
    for (var i = 0; i < face1DataForecast.length; i++) {
        if (face1DataForecast[i] != null) {
            if (curLastForecast < 0) {
                curLastForecast = i;
            }
            var curX = (i * itemWidth) + itemMargin;
            var curY = ((face1DataForecast[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-24-1-container .face-1-chart-graph').height();
            if (face1DataForecast[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataForecast[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-24-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-24-1-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-24-1-container .face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null) {
            $('.face-24-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-24-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData24_1.length; i++) {
        var curData = faceData24_1[i];

        if (curData.type == 'actually') {
            if (maxSumm < Number(curData.summ)) {
                maxSumm = Number(curData.summ);
            }
        }
    }

    var maxCount = 0;

    for (var i = 0; i < faceData24_1.length; i++) {
        var curData = faceData24_1[i];

        if (curData.type == 'actually') {
            if (maxCount < Number(curData.count)) {
                maxCount = Number(curData.count);
            }
        }
    }

    for (var i = 0; i < faceData24_1.length; i++) {
        var curData = faceData24_1[i];

        if (curData.type == 'actually') {
            $('.face-24-1-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * itemWidth + itemMargin) + 'px">' +
                                                                        '<div class="face-1-chart-icon-summ" data-summ="' + curData.summ + '" style="height:' + (Number(curData.summ) / maxSumm * 100) + '%"><div class="face-1-chart-icon-summ-inner"></div></div>' +
                                                                        '<div class="face-1-chart-icon-count" data-count="' + curData.count + '" style="height:' + (Number(curData.count) / 2 / maxCount * 100) + '%"><div class="face-1-chart-icon-count-inner"></div></div>' +
                                                                    '</div>');
        }
    }

    $('.face-24-1-container .face-1-chart-icon-count').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-count-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-count-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-24-1-container .face-1-chart-icon-summ').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-summ-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-summ-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-24-1-container').mCustomScrollbar('destroy');
    $('.face-24-1-container').mCustomScrollbar({
        axis: 'x',
        setLeft: '-' + (curScroll - $('.face-24-1-container').width() / 2) + 'px',
        scrollButtons: {
            enable: true
        },
        callbacks: {
            onScrollStart: function() {
                $('.face-39-ratio-window').remove();
            }
        }
    });

    $('.face-24-1-container .face-1-chart-icon-summ').on('mouseover', function(e) {
        $('.face-39-1-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-ratio-window face-24-1-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">ВВП</div><div class="face-39-ratio-window-value">' + String(curItem.attr('data-summ')).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' млн руб.</div></div>');
    });

    $('.face-24-1-container .face-1-chart-icon-summ').on('mouseout', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $('.face-24-1-container .face-1-chart-icon-count').on('mouseover', function(e) {
        $('.face-39-ratio-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-ratio-window face-24-1-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">ВЗИР</div><div class="face-39-ratio-window-value">' + String(curItem.attr('data-count')).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' млн руб.</div></div>');
    });

    $('.face-24-1-container .face-1-chart-icon-count').on('mouseout', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-39-ratio-window').remove();
    });

}

function face14_1_Redraw() {
    var face1Labels = [];
    var face1DataActually = [];
    var face1DataForecast = [];

    $('.face-14-1-container .face-1-chart-graph').html('');
    $('.face-14-1-container .face-1-chart-labels').html('');

    var itemWidth = 110;
    if ($(window).width() < 1140) {
        itemWidth = 80;
    }

    var itemMargin = 55;
    if ($(window).width() < 1140) {
        itemMargin = 40;
    }

    for (var i = 0; i < faceData14_1.length; i++) {
        var curData = faceData14_1[i];
        face1Labels.push(curData.year);

        if (curData.type == 'actually') {
            if (curData.count !== undefined) {
                face1DataActually.push(Number(curData.count));
            } else {
                face1DataActually.push(null);
            }
            if (curData.countf !== undefined) {
                face1DataForecast.push(Number(curData.countf));
            } else {
                face1DataForecast.push(null);
            }
        } else {
            face1DataActually.push(null);
            face1DataForecast.push(Number(curData.countf));
        }
    }

    $('.face-14-1-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);

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
            var curY = ((face1DataActually[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-14-1-container .face-1-chart-graph').height();
            if (face1DataActually[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataActually[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-14-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-14-1-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-14-1-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataActually[i] + '<em>&nbsp;ед.</em></strong></span></div>');
        }
    }

    var curLastForecast = -1;
    for (var i = 0; i < face1DataForecast.length; i++) {
        if (face1DataForecast[i] != null) {
            if (curLastForecast < 0) {
                curLastForecast = i;
            }
            var curX = (i * itemWidth) + itemMargin;
            var curY = ((face1DataForecast[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-14-1-container .face-1-chart-graph').height();
            if (face1DataForecast[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataForecast[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-14-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-14-1-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-14-1-container .face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '<em>&nbsp;ед.</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null) {
            $('.face-14-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-14-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    $('.face-14-1-container').mCustomScrollbar('destroy');
    $('.face-14-1-container').mCustomScrollbar({
        axis: 'x',
        setLeft: '-' + (curScroll - $('.face-14-1-container').width() / 2) + 'px',
        scrollButtons: {
            enable: true
        }
    });

    face14_1_RedrawFooter();
}

$(document).ready(function() {
    $('.face-14-1-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-14-1-year').length == 0) {
            $('.face-14-1-year').removeClass('open');
        }
    });

    $('.face-14-1-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-14-1-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-14-1-year-current').html($(this).html());
            face14_1_RedrawFooter();
        }
        $('.face-14-1-year').removeClass('open');
        e.preventDefault();
    });
});

function face14_1_RedrawFooter() {
    var curYear = $('.face-14-1-year-current').html();
    var curData = null;
    for (var i = 0; i < faceData14_1.length; i++) {
        if (faceData14_1[i].year == curYear) {
            curData = faceData14_1[i].data;
        }
    }

    if (curData !== null) {
        var newHTML = '';

        for (var i = 0; i < curData.length; i++) {
            var curRow = curData[i];
            newHTML +=  '<div class="face-14-1-list-row">';
            newHTML +=      '<div class="face-14-1-list-icon"><img src="' + curRow.icon + '" alt="" /></div>';
            newHTML +=      '<div class="face-14-1-list-eng">' + curRow.eng + '</div>';
            newHTML +=      '<div class="face-14-1-list-rus">' + curRow.rus + '</div>';
            newHTML +=      '<div class="face-14-1-list-places">';
            for (var j = 0; j < curRow.list.length; j++) {
                newHTML +=      '<div class="face-14-1-list-country"><img src="' + curRow.list[j].flag + '" alt="" /><span>' + curRow.list[j].name + '</span></div>';
            }
            newHTML +=      '</div>';
            newHTML +=  '</div>';
        }

        $('.face-14-1-list').html(newHTML);

        $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});
    }
}