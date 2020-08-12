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