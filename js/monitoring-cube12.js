$(document).ready(function() {

    if ($('.cube').length > 0) {

        $('body').on('click', '.cube-menu a', function(e) {
            var curLi = $(this).parent();
            $('.cube-menu li.active').removeClass('active');
            curLi.addClass('active');

            var curHash = $(this).attr('data-id');
            if (curHash != 'undefined') {
                window.location.hash = '#' + curHash;
            }

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

    face34_1_Redraw();

});

$(window).on('load', function() {
    $('.cube-menu').each(function() {
        if (window.location.hash != '') {
            $('.cube-menu a').each(function() {
                var curLink = $(this);
                var curHash = curLink.attr('data-id');
                if (curHash != 'undefined') {
                    if (('#' + curHash) == window.location.hash) {
                        curLink.trigger('click');
                    }
                }
            });
        }
    });
});

function face34_1_Redraw() {
    var face1Labels = [];
    var face1DataActually = [];
    var face1DataForecast = [];

    $('.face-34-1-container .face-1-chart-graph').html('');
    $('.face-34-1-container .face-1-chart-labels').html('');
    $('.face-34-1-container .face-1-chart-icons').html('');

    var itemWidth = 66;
    if ($(window).width() < 1140) {
        itemWidth = 59;
    }

    var itemMargin = 20;
    if ($(window).width() < 1140) {
        itemMargin = 33;
    }

    for (var i = 0; i < faceData34_1.length; i++) {
        var curData = faceData34_1[i];
        face1Labels.push(curData.year);

        if (typeof curData.value !== 'undefined') {
            face1DataActually.push(Number(curData.value));
        } else {
            face1DataActually.push(null);
        }

        if (typeof curData.valuef !== 'undefined') {
            face1DataForecast.push(Number(curData.valuef));
        } else {
            face1DataForecast.push(null);
        }
    }

    $('.face-34-1-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);

    var minPlace = 0;
    var maxPlace = 100;
    var curScroll = 0;

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
            var curY = ((face1DataActually[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-34-1-container .face-1-chart-graph').height();
            if (face1DataActually[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataActually[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-34-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-34-1-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-34-1-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataActually[i] + '<em>%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1DataForecast.length; i++) {
        if (face1DataForecast[i] != null) {
            var curX = (i * itemWidth) + itemMargin;
            var curY = ((face1DataForecast[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-34-1-container .face-1-chart-graph').height();
            if (face1DataForecast[i - 1] != null) {
                var prevX = ((i - 1) * itemWidth) + itemMargin;
                var prevY = ((face1DataForecast[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-34-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-34-1-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            var classBottom = '';
            classBottom = 'bottom';
            $('.face-34-1-container .face-1-chart-graph').append('<div class="face-1-chart-point ' + classBottom + '" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '<em>%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null) {
            $('.face-34-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-34-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxSumm = 100;

    for (var i = 0; i < faceData34_1.length; i++) {
        var curData = faceData34_1[i];

        var forecastClass = '';
        if (curData.type == 'forecast') {
            forecastClass = 'face-1-chart-icon-forecast';
        }
        $('.face-34-1-container .face-1-chart-icons').append('<div class="face-1-chart-icon ' + forecastClass + '" style="left:' + (i * itemWidth + itemMargin) + 'px">' +
                                                                    '<div class="face-1-chart-icon-summ" style="height:' + (Number(curData.ratio2) / maxSumm * 100) + '%; bottom:' + (Number(curData.ratio1) / maxSumm * 100) + '%"><div class="face-1-chart-icon-summ-inner"><span>' + curData.ratio2 + '%</span></div></div>' +
                                                                    '<div class="face-1-chart-icon-count" style="height:' + (Number(curData.ratio1) / maxSumm * 100) + '%"><div class="face-1-chart-icon-count-inner"><span>' + curData.ratio1 + '%</span></div></div>' +
                                                                '</div>');
    }

    $('.face-34-1-container').mCustomScrollbar({
        axis: 'x',
        setLeft: '-' + (curScroll - $('.face-34-1-container').width() / 2) + 'px',
        scrollButtons: {
            enable: true
        }
    });

}

$(window).on('load resize', function() {

    face49_3_Redraw();

});

$(document).ready(function() {

    $('.face-49-3-type-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-49-3-type').length == 0) {
            $('.face-49-3-type').removeClass('open');
        }
    });

    $('.face-49-3-type ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-49-3-type ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-49-3-type-current').html($(this).html());
            face49_3_Redraw();
        }
        $('.face-49-3-type').removeClass('open');
        e.preventDefault();
    });

});


function face49_3_Redraw() {
    var curType = $('.face-49-3-type li.active').attr('data-type');

    var curData = null;

    for (var i = 0; i < faceData49_3.length; i++) {
        if (faceData49_3[i].type == curType) {
            curData = faceData49_3[i].years;
        }
    }

    var curMax = 0;

    for (var k = 0; k < faceData49_3.length; k++) {
        var tmpData = faceData49_3[k].years;
        for (var i = 0; i < tmpData.length; i++) {
            for (var j = 0; j < tmpData[i].data.length; j++) {
                var curCount = Number(String(tmpData[i].data[j].summ).replace(',', '').replace(' ', ''));
                if (curMax < curCount) {
                    curMax = curCount;
                }
            }
        }
    }

    var scaleStep = Math.floor(curMax / 4 / 100000) * 100000;
    var scaleCount = Math.ceil(curMax / scaleStep);
    var scaleMax = scaleCount * 100000;

    $('.face-49-3-scale').html('');
    for (var i = 0; i < scaleCount; i++) {
        $('.face-49-3-scale').append('<div class="face-49-3-scale-item" style="bottom:' + (i * (100 / scaleCount)) + '%"><span>' + String(i * scaleStep).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');
    }
    $('.face-49-3-scale').append('<div class="face-49-3-scale-item" style="bottom:100%"><span>' + String(scaleCount * scaleStep).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');

    $('.face-49-3-graph').html('');
    for (var i = 0; i < curData.length; i++) {
        var curFullTime = Number(String(curData[i].data[0].summ).replace(',', '').replace(' ', ''));
        var curAll = Number(String(curData[i].data[1].summ).replace(',', '').replace(' ', ''));
        var curCount = Number(String(curData[i].data[2].summ).replace(',', '').replace(' ', ''));

        newHTML = '<div class="face-49-3-graph-item">' +
                        '<div class="face-49-3-graph-item-bar">' +
                            '<div class="face-49-3-graph-item-bar-container" style="height:' + (curCount / scaleMax * 100) + '%">';
        newHTML +=              '<div class="face-49-3-graph-item-bar-item" data-year="' + curData[i].year + '" data-info="summ" style="background:#91d9d0; bottom:0%; height:' + (curFullTime / curCount * 100) + '%"></div>';
        newHTML +=              '<div class="face-49-3-graph-item-bar-item" data-year="' + curData[i].year + '" data-info="summ" style="background:#79b8bb; bottom:' + (curFullTime / curCount * 100) + '%; height:' + ((curAll - curFullTime) / curCount * 100) + '%"></div>';
        newHTML +=              '<div class="face-49-3-graph-item-bar-item" data-year="' + curData[i].year + '" data-info="count" style="background:#4f7b96; bottom:0%; height:100%"></div>';
        newHTML +=          '</div>' +
                        '</div>' +
                        '<div class="face-49-3-graph-item-year">' + curData[i].year + '</div>' +
                  '</div>';
        $('.face-49-3-graph').append(newHTML);
    }

    $('.face-49-3-content').mCustomScrollbar('destroy');
    $('.face-49-3-content').mCustomScrollbar({
        axis: 'x',
        callbacks: {
            onScrollStart: function() {
                $('.face-49-3-window').remove();
            }
        }
    });

    $('.face-49-3-graph-item-bar-item').on('mouseover', function(e) {
        $('.face-49-3-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        var curYear = Number(curItem.attr('data-year'));
        var curInfo = curItem.attr('data-info');
        var curType = $('.face-49-3-type li.active').attr('data-type');
        for (var i = 0; i < faceData49_3.length; i++) {
            if (faceData49_3[i].type == curType) {
                var tmpData = faceData49_3[i].years;
                for (var j = 0; j < tmpData.length; j++) {
                    if (tmpData[j].year == curYear) {
                        if (curInfo == 'summ') {
                            $('body').append('<div class="face-49-3-window" style="left:' + curX + 'px; top:' + curY + 'px">' +
                                                '<div class="face-49-3-window-title">' + tmpData[j].data[1].name + ': <span>' + String(tmpData[j].data[1].summ).replace(',', '').replace(' ', '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' чел.</span></div>' +
                                                '<div class="face-49-3-window-list-title">Включая:</div>' +
                                                '<div class="face-49-3-window-list">' +
                                                    '<div class="face-49-3-window-item">' + tmpData[j].data[0].name + ' <span>' + String(tmpData[j].data[0].summ).replace(',', '').replace(' ', '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' чел.</span></div>' +
                                                '</div>' +
                                             '</div>');
                        } else {
                            $('body').append('<div class="face-49-3-window" style="left:' + curX + 'px; top:' + curY + 'px">' +
                                                '<div class="face-49-3-window-title">' + tmpData[j].data[2].name + ': <span>' + String(tmpData[j].data[2].summ).replace(',', '').replace(' ', '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' чел.</span></div>' +
                                             '</div>');
                        }
                    }
                }
            }
        }
    });

    $('.face-49-3-graph-item-bar-item').on('mouseout', function(e) {
        $('.face-49-3-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-49-3-window').remove();
    });
}