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

    face27_1_Redraw();
    face27_4_Redraw();
    face27_5_Redraw();
    face30_1_Redraw();
    face30_2_Redraw();
    face30_4_Redraw();

});

function face27_1_Redraw() {
    var face1Labels = [];
    var face1DataForecast = [];

    $('.face-27-1-container .face-1-chart-graph').html('');
    $('.face-27-1-container .face-1-chart-labels').html('');
    $('.face-27-1-container .face-1-chart-icons').html('');

    var itemWidth = 42;
    if ($(window).width() < 1140) {
        itemWidth = 32;
    }

    var itemMargin = 42;
    if ($(window).width() < 1140) {
        itemMargin = 32;
    }

    for (var i = 0; i < faceData27_1.length; i++) {
        var curData = faceData27_1[i];
        face1Labels.push(curData.year);

        face1DataForecast.push(Number(curData.summf));
    }

    $('.face-27-1-container .face-1-chart').width(face1Labels.length * (itemWidth + itemMargin) + (itemWidth + itemMargin));

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
            var curX = i * (itemWidth + itemMargin) + itemWidth / 2 + itemMargin;
            var curY = ((face1DataForecast[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-27-1-container .face-1-chart-graph').height();
            if (face1DataForecast[i - 1] != null) {
                var prevX = ((i - 1) * (itemWidth + itemMargin)) + itemWidth / 2 + itemMargin;
                var prevY = ((face1DataForecast[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-27-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-27-1-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-27-1-container .face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '</strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        $('.face-27-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * (itemWidth + itemMargin) + itemWidth / 2 + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData27_1.length; i++) {
        var curData = faceData27_1[i];

        if (curData.type == 'actually') {
            if (maxSumm < Number(curData.summ)) {
                maxSumm = Number(curData.summ);
            }
        }
    }

    for (var i = 0; i < faceData27_1.length; i++) {
        var curData = faceData27_1[i];

        if (curData.type == 'actually') {
            $('.face-27-1-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * (itemWidth + itemMargin) + itemWidth / 2 + itemMargin) + 'px">' +
                                                                    '<div class="face-1-chart-icon-summ" data-summ="' + curData.summ + '" style="height:' + (Number(curData.summ) / maxSumm * 100) + '%"><div class="face-1-chart-icon-summ-inner"></div></div>' +
                                                                 '</div>');
        }
    }

    $('.face-27-1-container .face-1-chart-icon-summ').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        var countBlocks = Math.floor(curHeight) / 38;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-summ-inner').append('<svg width="24" height="30" viewBox="0 0 25 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.1478 0.971243C15.9235 0.746694 15.6193 0.620397 15.3019 0.620117H4.38908C3.22502 0.620117 2.10864 1.08254 1.28553 1.90565C0.46242 2.72876 0 3.84514 0 5.00919V26.771C0 27.9351 0.46242 29.0515 1.28553 29.8746C2.10864 30.6977 3.22502 31.1601 4.38908 31.1601H19.7748C20.9388 31.1601 22.0552 30.6977 22.8783 29.8746C23.7014 29.0515 24.1639 27.9351 24.1639 26.771V9.48206C24.1636 9.1647 24.0373 8.86044 23.8127 8.63617L16.1478 0.971243ZM16.4989 4.71792L20.09 8.30898H16.4989V4.71792ZM19.7748 28.778H4.38908C3.85996 28.778 3.35252 28.5678 2.97837 28.1937C2.60423 27.8196 2.39404 27.3121 2.39404 26.783V5.00919C2.39404 4.48008 2.60423 3.97263 2.97837 3.59849C3.35252 3.22435 3.85996 3.01416 4.38908 3.01416H14.1049V8.68405C14.1049 9.21317 14.3151 9.72061 14.6892 10.0948C15.0634 10.4689 15.5708 10.6791 16.0999 10.6791H21.7698V26.771C21.7698 27.3001 21.5596 27.8076 21.1855 28.1817C20.8113 28.5559 20.3039 28.7661 19.7748 28.7661V28.778Z" fill="#FE6600"/><path d="M18.5098 13.0971H5.65381C5.33634 13.0971 5.03187 13.2232 4.80739 13.4477C4.5829 13.6722 4.45679 13.9766 4.45679 14.2941C4.45679 14.6116 4.5829 14.916 4.80739 15.1405C5.03187 15.365 5.33634 15.4911 5.65381 15.4911H18.5098C18.8273 15.4911 19.1318 15.365 19.3562 15.1405C19.5807 14.916 19.7068 14.6116 19.7068 14.2941C19.7068 13.9766 19.5807 13.6722 19.3562 13.4477C19.1318 13.2232 18.8273 13.0971 18.5098 13.0971Z" fill="#FE6600"/><path d="M18.5098 18.0049H5.65381C5.33634 18.0049 5.03187 18.131 4.80739 18.3555C4.5829 18.58 4.45679 18.8844 4.45679 19.2019C4.45679 19.5194 4.5829 19.8238 4.80739 20.0483C5.03187 20.2728 5.33634 20.3989 5.65381 20.3989H18.5098C18.8273 20.3989 19.1318 20.2728 19.3562 20.0483C19.5807 19.8238 19.7068 19.5194 19.7068 19.2019C19.7068 18.8844 19.5807 18.58 19.3562 18.3555C19.1318 18.131 18.8273 18.0049 18.5098 18.0049Z" fill="#FE6600"/><path d="M18.5098 22.9126H5.65381C5.33634 22.9126 5.03187 23.0387 4.80739 23.2632C4.5829 23.4877 4.45679 23.7922 4.45679 24.1097C4.45679 24.4271 4.5829 24.7316 4.80739 24.9561C5.03187 25.1806 5.33634 25.3067 5.65381 25.3067H18.5098C18.8273 25.3067 19.1318 25.1806 19.3562 24.9561C19.5807 24.7316 19.7068 24.4271 19.7068 24.1097C19.7068 23.7922 19.5807 23.4877 19.3562 23.2632C19.1318 23.0387 18.8273 22.9126 18.5098 22.9126Z" fill="#FE6600"/></svg>');
        }
    });

    $('.face-27-1-container').mCustomScrollbar('destroy');
    $('.face-27-1-container').mCustomScrollbar({
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

    $('.face-27-1-container .face-1-chart-icon-summ').on('mouseover', function(e) {
        $('.face-39-1-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-ratio-window face-27-1-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-value">' + curItem.attr('data-summ') + '</div></div>');
    });

    $('.face-27-1-container .face-1-chart-icon-summ').on('mouseout', function(e) {
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

function face27_4_Redraw() {

    var curMaxSumm = 0;

    for (var i = 0; i < faceData27_4.length; i++) {
        var curData = faceData27_4[i];
        if (Number(curData.summ1) > curMaxSumm) {
            curMaxSumm = Number(curData.summ1);
        }
        if (Number(curData.summ2) > curMaxSumm) {
            curMaxSumm = Number(curData.summ2);
        }
    }

    var countSumm = Math.ceil(curMaxSumm / 100) + 2;
    var summMax = (countSumm - 1) * 100;

    var scaleLeftHTML = '';
    for (var i = 0; i < countSumm; i++) {
        scaleLeftHTML += '<div class="face-27-4-scale-left-item" style="bottom:' + (i / (countSumm - 1) * 100) + '%">' + (i * 100) + '</div>';
    }
    $('.face-27-4-scale-left').html(scaleLeftHTML);

    var graphHTML = '';
    for (var i = 0; i < faceData27_4.length; i++) {
        var curData = faceData27_4[i];

        graphHTML +=    '<div class="face-27-4-graph-item">';
        graphHTML +=        '<div class="face-27-4-graph-item-year">' + curData.year + '</div>';
        graphHTML +=    '</div>';
    }
    $('.face-27-4-graph-inner').html(graphHTML);

    $('.face-27-4-graph').mCustomScrollbar('destroy');
    $('.face-27-4-graph').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

    var itemWidth = 86;
    var itemHeight = 471;
    if ($(window).width() < 1140) {
        itemWidth = 52;
        itemHeight = 284;
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

    for (var i = 0; i < faceData27_4.length; i++) {
        var curX = i * itemWidth + itemWidth / 2 + 40;
        var curY = itemHeight - ((faceData27_4[i].summ1 / summMax) * itemHeight);
        if (i > 0) {
            var prevX = (i - 1) * itemWidth + itemWidth / 2 + 40;
            var prevY = itemHeight - ((faceData27_4[i - 1].summ1 / summMax) * itemHeight);
            var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
            var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
            if (curY < prevY) {
                curAngle = -curAngle;
            }
            $('.face-27-4-graph-inner').append('<div class="face-1-chart-line face-1-chart-line-1" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
        }
        $('.face-27-4-graph-inner').append('<div class="face-1-chart-point face-1-chart-point-1" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + faceData27_4[i].summ1 + '</strong></span></div>');
    }

    for (var i = 0; i < faceData27_4.length; i++) {
        var curX = i * itemWidth + itemWidth / 2 + 40;
        var curY = itemHeight - ((faceData27_4[i].summ2 / summMax) * itemHeight);
        if (i > 0) {
            var prevX = (i - 1) * itemWidth + itemWidth / 2 + 40;
            var prevY = itemHeight - ((faceData27_4[i - 1].summ2 / summMax) * itemHeight);
            var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
            var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
            if (curY < prevY) {
                curAngle = -curAngle;
            }
            $('.face-27-4-graph-inner').append('<div class="face-1-chart-line face-1-chart-line-2" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
        }
        $('.face-27-4-graph-inner').append('<div class="face-1-chart-point face-1-chart-point-2" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + faceData27_4[i].summ2 + '</strong></span></div>');
    }

}

function face27_5_Redraw() {
    var face1Labels = [];
    var face1DataActually = [];

    $('.face-27-5-ratio-container .face-1-chart-labels').html('');
    $('.face-27-5-ratio-container .face-1-chart-icons').html('');

    var itemWidth = 122;
    if ($(window).width() < 1140) {
        itemWidth = 82;
    }

    for (var i = 0; i < faceData27_5.length; i++) {
        var curData = faceData27_5[i];
        face1Labels.push(curData.year);

        face1DataActually.push(Number(curData.summ));
    }

    $('.face-27-5-ratio-container .face-1-chart').width(face1Labels.length * itemWidth + itemWidth);

    for (var i = 0; i < face1Labels.length; i++) {
        $('.face-27-5-ratio-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemWidth /2) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData27_5.length; i++) {
        var curData = faceData27_5[i];

        if (curData.summ != null && maxSumm < Number(curData.summ)) {
            maxSumm = Number(curData.summ);
        }
    }

    for (var i = 0; i < faceData27_5.length; i++) {
        var curData = faceData27_5[i];

        if (curData.summ != null) {
            $('.face-27-5-ratio-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * itemWidth + itemWidth / 2) + 'px">' +
                                                                        '<div class="face-1-chart-icon-summ" data-summ="' + curData.summ + '" style="height:' + (Number(curData.summ) / maxSumm * 100) + '%"><svg width="71" height="142" viewBox="0 0 71 142" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.9081 6.19913L27.3399 8.61058L29.7757 9.69452L35.8652 12.3983L41.9548 9.69452L44.3906 8.61058L45.6085 8.07471V14.7245H48.0443V6.99077L49.8224 6.19913L35.8652 0L21.9081 6.19913ZM47.0857 25.1954C47.0857 31.4859 41.9862 36.5854 35.6957 36.5854C29.4052 36.5854 24.3057 31.4859 24.3057 25.1954C24.3057 20.948 26.6305 17.2437 30.077 15.2854L29.9782 15.2385V10.9701L35.648 13.4058L41.3178 10.9701V15.2385L41.2708 15.2608C44.7413 17.2125 47.0857 20.9302 47.0857 25.1954ZM35.695 45.8574L42.3409 40.0701C43.2881 40.2266 44.2354 40.3988 45.1826 40.5711L45.1827 40.5711L45.1828 40.5711L45.1833 40.5712C49.7393 41.9949 53.7258 43.9882 57.1428 46.8357C57.997 47.6899 58.5665 48.8289 58.8513 49.9679L61.3027 60.3866L61.3202 60.3962L70.7312 100.421H58.5877C56.4573 113.733 51.7792 140.67 50.1103 141.914C49.967 142.02 49.8112 142.026 49.6451 141.942H38.6341H32.9391H22.0089C21.8591 142.018 21.7176 142.021 21.5862 141.942H21.5491V141.918L21.5437 141.914C19.8748 140.67 15.1967 113.733 13.0663 100.421H0.922852L4.48817 85.2575C4.51791 85.0583 4.57075 84.8656 4.62111 84.6921L4.74866 84.1496L4.74882 84.1379L8.49 68.2379L10.3338 60.3962L10.3353 60.3954L12.7218 50.2527C13.0066 49.1137 13.5761 47.9747 14.4303 47.1204C17.8473 44.2729 21.8338 41.9949 26.3898 40.8559C27.3179 40.6028 28.246 40.3747 29.174 40.179L35.695 45.8574Z" fill="#4F7096"/></svg></div>' +
                                                                    '</div>');
        } else {
            $('.face-27-5-ratio-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * itemWidth + itemWidth / 2) + 'px">' +
                                                                        '<div class="face-1-chart-icon-summ-not">н/д</div>' +
                                                                    '</div>');
        }
    }

    $('.face-27-5-ratio-container').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        },
        callbacks: {
            onScrollStart: function() {
                $('.face-27-5-ratio-window').remove();
            }
        }
    });

    $('.face-27-5-ratio-container .face-1-chart-icon-summ').on('mouseover', function(e) {
        $('.face-27-5-ratio-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-27-5-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Количество стипендий</div><div class="face-27-5-ratio-window-value">' + curItem.attr('data-summ') + '</div></div>');
    });

    $('.face-27-5-ratio-container .face-1-chart-icon-summ').on('mouseout', function(e) {
        $('.face-27-5-ratio-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-27-5-ratio-window').remove();
    });

}

function face30_1_Redraw() {
    var face1Labels = [];
    var face1DataActually = [];
    var face1DataForecast = [];

    $('.face-30-1-container .face-1-chart-graph').html('');
    $('.face-30-1-container .face-1-chart-labels').html('');
    $('.face-30-1-container .face-1-chart-icons').html('');

    var itemWidth = 147;
    if ($(window).width() < 1140) {
        itemWidth = 105;
    }

    var curLastActually = -1;
    var curLastForecast = -1;

    for (var i = 0; i < faceData30_1.length; i++) {
        var curData = faceData30_1[i];
        face1Labels.push(curData.year);

        if (curData.type == 'actually') {
            if (curData.rate !== undefined) {
                face1DataActually.push(parseFloat(curData.rate));
                curLastActually = i;
            } else {
                face1DataActually.push(null);
            }
            if (curData.ratef !== undefined) {
                face1DataForecast.push(parseFloat(curData.ratef));
            } else {
                face1DataForecast.push(null);
            }
        } else {
            face1DataActually.push(null);
            face1DataForecast.push(parseFloat(curData.ratef));
            if (curLastForecast < 0) {
                curLastForecast = i;
            }
        }
    }

    $('.face-30-1-container .face-1-chart').width(face1Labels.length * itemWidth);

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
            var curX = i * itemWidth + itemWidth / 2;
            curScroll = curX;
            var curY = ((face1DataActually[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-30-1-container .face-1-chart-graph').height();
            if (face1DataActually[i - 1] != null) {
                var prevX = (i - 1) * itemWidth + itemWidth / 2;
                var prevY = ((face1DataActually[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-30-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-30-1-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-30-1-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + (face1DataActually[i]).toFixed(1) + '</strong></span></div>');
        }
    }

    var secondForecast = false;
    for (var i = 0; i < face1DataForecast.length; i++) {
        if (face1DataForecast[i] != null) {
            if (secondForecast) {
                var curX = i * itemWidth + itemWidth / 2;
                var curY = ((face1DataForecast[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-30-1-container .face-1-chart-graph').height();
                if (face1DataForecast[i - 1] != null && face1DataForecast[i - 2] != null) {
                    var prevX = (i - 1) * itemWidth + itemWidth / 2;
                    var prevY = ((face1DataForecast[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-30-1-container .face-1-chart-graph').height();
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    $('.face-30-1-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
                }
                $('.face-30-1-container .face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + (face1DataForecast[i]).toFixed(1) + '</strong></span></div>');
            } else {
                secondForecast = true;
            }
        }
    }

    var curX = curLastForecast * itemWidth + itemWidth / 2;
    var curY = ((face1DataForecast[curLastForecast] - maxPlace) / (minPlace - maxPlace)) * $('.face-30-1-container .face-1-chart-graph').height();
    var prevX = curLastActually * itemWidth + itemWidth / 2;
    var prevY = ((face1DataActually[curLastActually] - maxPlace) / (minPlace - maxPlace)) * $('.face-30-1-container .face-1-chart-graph').height();
    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
    if (curY < prevY) {
        curAngle = -curAngle;
    }
    $('.face-30-1-container .face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null || i == 0) {
            $('.face-30-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-30-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxPlants = 0;

    for (var i = 0; i < faceData30_1.length; i++) {
        var curData = faceData30_1[i];

        if (curData.type == 'actually') {
            if (maxPlants < Number(curData.plants)) {
                maxPlants = Number(curData.plants);
            }
        }
    }

    var maxAnimals = 0;

    for (var i = 0; i < faceData30_1.length; i++) {
        var curData = faceData30_1[i];

        if (curData.type == 'actually') {
            if (maxAnimals < Number(curData.animals)) {
                maxAnimals = Number(curData.animals);
            }
        }
    }

    for (var i = 0; i < faceData30_1.length; i++) {
        var curData = faceData30_1[i];

        if (curData.type == 'actually') {
            $('.face-30-1-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * itemWidth + itemWidth / 2) + 'px">' +
                                                                        '<div class="face-1-chart-icon-plants" data-plants="' + curData.plants + '" style="height:' + (Number(curData.plants) / maxPlants * 100) + '%"><div class="face-1-chart-icon-plants-inner"></div></div>' +
                                                                        '<div class="face-1-chart-icon-animals" data-animals="' + curData.animals + '" style="height:' + (Number(curData.animals) / 1.5 / maxAnimals * 100) + '%"><div class="face-1-chart-icon-animals-inner"></div></div>' +
                                                                    '</div>');
        }
    }

    $('.face-30-1-container .face-1-chart-icon-plants').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        var countBlocks = Math.floor(curHeight / 41);
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-plants-inner').append('<svg width="34" height="28" viewBox="0 0 34 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.53711 2.84508C1.62452 7.04094 2.02132 13.8752 2.25932 16.4039C11.1877 5.34012 24.5426 5.87666 24.5426 5.87666C24.5426 5.87666 5.61162 12.6697 0.0514598 26.2918C-0.387653 27.3671 2.11174 28.7656 2.68216 27.4943C4.38471 23.7059 6.75715 20.8647 6.75715 20.8647C10.2574 22.2272 16.3124 23.824 20.604 20.6649C26.3045 16.4683 25.7218 7.16542 33.8595 2.63584C35.7603 1.57827 17.9086 -2.84386 8.53711 2.84508Z" /></svg>');
        }
    });

    $('.face-30-1-container .face-1-chart-icon-animals').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        var countBlocks = Math.floor(curHeight / 35);
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-animals-inner').append('<svg width="38" height="23" viewBox="0 0 38 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.3872 13.3279L13.6724 14.7228L11.8856 16.9345V18.3001C11.8856 18.5558 11.6825 18.7628 11.4317 18.7628C11.1809 18.7628 10.9778 18.5554 10.9778 18.3001V16.9474H9.81118V18.3001C9.81118 18.5558 9.60767 18.7628 9.35729 18.7628C9.10691 18.7628 8.9034 18.5554 8.9034 18.3001V16.9474H7.55102L8.31356 23H6.8324L5.37911 16.9535L5.35209 16.0199L7.3872 13.3279ZM20.1425 14.8282L19.1132 22.9996H20.5943L22.1219 16.2971L21.3505 14.8273L20.1425 14.8282ZM38 14.5261L34.2891 14.5385L27.6982 1.62558C27.1873 0.626646 26.174 0 25.0686 0H2.375C1.06316 0.000430389 0 1.08458 0 2.42137V13.9209H1.18771V2.42137C1.18771 1.75427 1.72056 1.21068 2.37542 1.21068V6.69557L2.96907 10.8944L2.37542 14.5261L2.96907 22.9996H4.4536V15.7368L7.0262 12.3186L14.2508 13.9209L22.013 13.9192L23.5697 16.947L24.1963 22.9996H25.6808V13.9209L34.1417 22.9996H35.3788C35.9252 22.9996 36.3685 22.5481 36.3685 21.9907V16.1904L38 14.5261Z" /></svg>');
        }
    });

    $('.face-30-1-container').mCustomScrollbar('destroy');
    $('.face-30-1-container').mCustomScrollbar({
        axis: 'x',
        setLeft: '-' + (curScroll - $('.face-30-1-container').width() / 2) + 'px',
        scrollButtons: {
            enable: true
        },
        callbacks: {
            onScrollStart: function() {
                $('.face-39-ratio-window').remove();
            }
        }
    });

    $('.face-30-1-container .face-1-chart-icon-plants').on('mouseover', function(e) {
        $('.face-39-1-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-ratio-window face-30-1-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Растения</div><div class="face-39-ratio-window-value">' + String(curItem.attr('data-plants')).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div></div>');
    });

    $('.face-30-1-container .face-1-chart-icon-plants').on('mouseout', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $('.face-30-1-container .face-1-chart-icon-animals').on('mouseover', function(e) {
        $('.face-39-ratio-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        $('body').append('<div class="face-39-ratio-window face-30-1-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Животные</div><div class="face-39-ratio-window-value">' + String(curItem.attr('data-animals')).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div></div>');
    });

    $('.face-30-1-container .face-1-chart-icon-animals').on('mouseout', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-39-ratio-window').remove();
    });

}

$(document).ready(function() {
    $('.face-30-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-30-2-year').length == 0) {
            $('.face-30-2-year').removeClass('open');
        }
    });

    $('.face-30-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-30-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-30-2-year-current').html($(this).html());
            $('.face-30-2-year-text').html($(this).html());
            face30_2_Redraw();
        }
        $('.face-30-2-year').removeClass('open');
        e.preventDefault();
    });

    $('.face-30-2-container').mCustomScrollbar({
        axis: 'y'
    });

});

function face30_2_Redraw() {
    var curYear = $('.face-30-2-year-text').html();

    var curData = null;
    for (var i = 0; i < faceData30_2.length; i++) {
        if (faceData30_2[i].year == curYear) {
            curData = faceData30_2[i].data;
        }
    }
    if (curData !== null) {
        $('.face-30-2-list').each(function() {
            var maxWidthLine = 225;
            if ($(window).width() < 1140) {
                maxWidthLine = 97;
            }

            var maxValue = 0;
            for (var i = 0; i < curData.length; i++) {
                var curValue = Math.round(parseInt(curData[i].value));
                if (maxValue < curValue) {
                    maxValue = curValue;
                }
            }

            var newHTML = '<div class="face-30-2-list-inner">';

            for (var i = 0; i < curData.length; i++) {
                var curItem = curData[i];
                var curValue = Math.round(parseInt(curItem.value));
                var curWidth = curValue / maxValue * maxWidthLine + 1;

                newHTML += '<div class="face-30-2-item">' +
                                '<div class="face-30-2-item-title">' + curItem.title + '</div>' +
                                '<div class="face-30-2-item-line"><div class="face-30-2-item-line-inner" style="width:' + curWidth + 'px"></div></div>' +
                                '<div class="face-30-2-item-value">' + String(curItem.value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                           '</div>';

            }
            $('.face-30-2-list').html(newHTML);
        });
    }
}

$(document).ready(function() {
    $('.face-30-4-type-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-30-4-type').length == 0) {
            $('.face-30-4-type').removeClass('open');
        }
    });

    $('.face-30-4-type ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-30-4-type ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-30-4-type-current').html($(this).html());
            face30_4_Redraw();
        }
        $('.face-30-4-type').removeClass('open');
        e.preventDefault();
    });

});

function face30_4_Redraw() {
    var curType = $('.face-30-4-type ul li.active').attr('data-type');

    var curData = null;
    for (var i = 0; i < faceData30_4.length; i++) {
        if (faceData30_4[i].type == curType) {
            curData = faceData30_4[i].data;
        }
    }

    var curMaxSumm = 0;

    for (var i = 0; i < curData.length; i++) {
        var curDataItem = curData[i];
        if (Number(curDataItem.plants) > curMaxSumm) {
            curMaxSumm = Number(curDataItem.plants);
        }
        if (Number(curDataItem.animals) > curMaxSumm) {
            curMaxSumm = Number(curDataItem.animals);
        }
    }

    var countSumm = Math.ceil(curMaxSumm / 1000) + 2;
    var summMax = (countSumm - 1) * 1000;

    var scaleLeftHTML = '';
    for (var i = 0; i < countSumm; i++) {
        scaleLeftHTML += '<div class="face-30-4-scale-left-item" style="bottom:' + (i / (countSumm - 1) * 100) + '%">' + (i * 1000) + '</div>';
    }
    $('.face-30-4-scale-left').html(scaleLeftHTML);

    var graphHTML = '';
    for (var i = 0; i < curData.length; i++) {
        var curDataItem = curData[i];

        graphHTML +=    '<div class="face-30-4-graph-item">';
        graphHTML +=        '<div class="face-30-4-graph-item-year">' + curDataItem.year + '</div>';
        graphHTML +=    '</div>';
    }
    $('.face-30-4-graph-inner').html(graphHTML);

    $('.face-30-4-graph').mCustomScrollbar('destroy');
    $('.face-40-4-graph').mCustomScrollbar({
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

    var itemWidth = 86;
    var itemHeight = 471;
    if ($(window).width() < 1140) {
        itemWidth = 52;
        itemHeight = 284;
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

    for (var i = 0; i < curData.length; i++) {
        var curX = i * itemWidth + itemWidth / 2 + 40;
        var curY = itemHeight - ((curData[i].plants / summMax) * itemHeight);
        if (i > 0) {
            var prevX = (i - 1) * itemWidth + itemWidth / 2 + 40;
            var prevY = itemHeight - ((curData[i - 1].plants / summMax) * itemHeight);
            var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
            var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
            if (curY < prevY) {
                curAngle = -curAngle;
            }
            $('.face-30-4-graph-inner').append('<div class="face-1-chart-line face-1-chart-line-1" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
        }
        $('.face-30-4-graph-inner').append('<div class="face-1-chart-point face-1-chart-point-1" style="left:' + curX + 'px; top:' + curY + 'px" data-id="' + i + '" data-type="plants"></div>');
    }

    for (var i = 0; i < curData.length; i++) {
        var curX = i * itemWidth + itemWidth / 2 + 40;
        var curY = itemHeight - ((curData[i].animals / summMax) * itemHeight);
        if (i > 0) {
            var prevX = (i - 1) * itemWidth + itemWidth / 2 + 40;
            var prevY = itemHeight - ((curData[i - 1].animals / summMax) * itemHeight);
            var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
            var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
            if (curY < prevY) {
                curAngle = -curAngle;
            }
            $('.face-30-4-graph-inner').append('<div class="face-1-chart-line face-1-chart-line-2" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
        }
        $('.face-30-4-graph-inner').append('<div class="face-1-chart-point face-1-chart-point-2" style="left:' + curX + 'px; top:' + curY + 'px" data-id="' + i + '" data-type="animals"></div>');
    }

    $('.face-30-4-container .face-1-chart-point').on('mouseenter', function(e) {
        $('.face-39-1-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();

        var curID = Number(curItem.attr('data-id'));

        var curPointType = $('.face-30-4-type ul li.active').attr('data-type');

        var curPointData = null;
        for (var i = 0; i < faceData30_4.length; i++) {
            if (faceData30_4[i].type == curPointType) {
                curPointData = faceData30_4[i].data[curID];
            }
        }

        var curText =   '<div class="face-39-ratio-window-title">' + curPointData.year + '</div>';
        if (curItem.attr('data-type') == 'plants') {
            curText +=  '<div class="face-39-ratio-window-value">По растениям <span>' + String(curPointData.plants).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>';
        } else {
            curText +=  '<div class="face-39-ratio-window-value">По животным <span>' + String(curPointData.animals).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>';
        }

        $('body').append('<div class="face-39-ratio-window face-30-4-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px">' + curText + '</div>');
    });

    $('.face-30-4-container .face-1-chart-point').on('mouseleave', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-39-ratio-window').remove();
    });

}