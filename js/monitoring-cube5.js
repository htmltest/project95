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

        if (curData.type == 'actually') {
            face1DataActually.push(Number(curData.ratio));
            face1DataForecast.push(null);
        } else {
            face1DataActually.push(null);
            face1DataForecast.push(Number(curData.ratio));
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

    var curLastActually = -1;
    for (var i = 0; i < face1DataActually.length; i++) {
        if (face1DataActually[i] != null) {
            curLastActually++;
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

    var curLastForecast = -1;
    for (var i = 0; i < face1DataForecast.length; i++) {
        if (face1DataForecast[i] != null) {
            if (curLastForecast < 0) {
                curLastForecast = i;
            }
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
            $('.face-16-1-container .face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    var curX = (curLastForecast * itemWidth) + itemMargin;
    var curY = ((face1DataForecast[curLastForecast] - maxPlace) / (minPlace - maxPlace)) * $('.face-16-1-container .face-1-chart-graph').height();
    var prevX = ((curLastActually) * itemWidth) + itemMargin;
    var prevY = ((face1DataActually[curLastActually] - maxPlace) / (minPlace - maxPlace)) * $('.face-16-1-container .face-1-chart-graph').height();
    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
    if (curY < prevY) {
        curAngle = -curAngle;
    }
    $('.face-16-1-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');

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