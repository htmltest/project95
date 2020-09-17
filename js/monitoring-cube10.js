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

    $('.cube-with-big-titles').each(function() {
        var maxHeight = 0;
        $('.cube-face-title').each(function() {
            if ($(this).height() > maxHeight) {
                maxHeight = $(this).height();
            }
        });
        var curDiff = 70;
        if ($(window).width() < 1140) {
            curDiff = 20;
        }
        $('.cube-with-big-titles').css({'margin-top': maxHeight + curDiff});
    });

    face20_1_Redraw();
    face40_2_Redraw();

});

function face20_1_Redraw() {
    var face1Labels = [];
    var face1DataRatioAll = [];
    var face1DataRatio = [];

    $('.face-20-1-container .face-1-chart-graph').html('');
    $('.face-20-1-container .face-1-chart-labels').html('');
    $('.face-20-1-container .face-1-chart-icons').html('');

    var itemWidth = 84;
    if ($(window).width() < 1140) {
        itemWidth = 84;
    }

    var itemMargin = 62;
    if ($(window).width() < 1140) {
        itemMargin = 62;
    }

    for (var i = 0; i < faceData20_1.length; i++) {
        var curData = faceData20_1[i];
        face1Labels.push(curData.year);
        face1DataRatioAll.push(Number(curData.ratioall));
        if (curData.ratio != null) {
            face1DataRatio.push(Number(curData.ratio));
        } else {
            face1DataRatio.push(null);
        }
    }

    if ($(window).width() < 1140) {
        $('.face-20-1-container .face-1-chart').width(face1Labels.length * (itemWidth + itemMargin));
    } else {
        $('.face-20-1-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);
    }

    var minPlace = 9999;
    var maxPlace = 0;
    var curScroll = 0;

    for (var i = 0; i < face1DataRatioAll.length; i++) {
        if (face1DataRatioAll[i] != null) {
            if (face1DataRatioAll[i] < minPlace) {
                minPlace = face1DataRatioAll[i];
            }
            if (face1DataRatioAll[i] > maxPlace) {
                maxPlace = face1DataRatioAll[i];
            }
        }
    }

    for (var i = 0; i < face1DataRatio.length; i++) {
        if (face1DataRatio[i] != null) {
            if (face1DataRatio[i] < minPlace) {
                minPlace = face1DataRatio[i];
            }
            if (face1DataRatio[i] > maxPlace) {
                maxPlace = face1DataRatio[i];
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
    for (var i = 0; i < face1DataRatioAll.length; i++) {
        if (face1DataRatioAll[i] != null) {
            curLastActually++;
            var curX = (i * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
            curScroll = curX;
            var curY = ((face1DataRatioAll[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-20-1-container .face-1-chart-graph').height();
            if (face1DataRatioAll[i - 1] != null) {
                var prevX = ((i - 1) * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
                var prevY = ((face1DataRatioAll[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-20-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-20-1-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-20-1-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataRatioAll[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    var curLastActually = -1;
    for (var i = 0; i < face1DataRatio.length; i++) {
        if (face1DataRatio[i] != null) {
            curLastActually++;
            var curX = (i * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
            curScroll = curX;
            var curY = ((face1DataRatio[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-20-1-container .face-1-chart-graph').height();
            if (face1DataRatio[i - 1] != null) {
                var prevX = ((i - 1) * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
                var prevY = ((face1DataRatio[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-20-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-20-1-container .face-1-chart-graph').append('<div class="face-1-chart-line face-1-chart-line-2 active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-20-1-container .face-1-chart-graph').append('<div class="face-1-chart-point face-1-chart-point-2 active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataRatio[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataRatioAll[i] != null) {
            $('.face-20-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * (itemWidth + itemMargin)) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-20-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * (itemWidth + itemMargin)) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData20_1.length; i++) {
        var curData = faceData20_1[i];

        if (maxSumm < Number(curData.summ)) {
            maxSumm = Number(curData.summ);
        }

        if (maxSumm < Number(curData.summall)) {
            maxSumm = Number(curData.summall);
        }
    }

    for (var i = 0; i < faceData20_1.length; i++) {
        var curData = faceData20_1[i];

        var classOnlyOne = '';
        if (curData.summ == null) {
            classOnlyOne = 'face-1-chart-icon-onlyone';
        }
        var newHTML = '<div class="face-1-chart-icon ' + classOnlyOne + '" style="left:' + (i * (itemWidth + itemMargin)) + 'px">';
        newHTML += '<div class="face-1-chart-icon-count" style="height:' + (Number(curData.summall) / maxSumm * 100) + '%"><div class="face-1-chart-icon-count-inner"><div class="face-1-chart-icon-value">' + curData.summall + '</div></div></div>';
        if (curData.summ != null) {
            newHTML += '<div class="face-1-chart-icon-summ" style="height:' + (Number(curData.summ) / maxSumm * 100) + '%"><div class="face-1-chart-icon-summ-inner"><div class="face-1-chart-icon-value">' + curData.summ + '</div></div></div>';
        }
        newHTML += '</div>';

        $('.face-20-1-container .face-1-chart-icons').append(newHTML);
    }

    $('.face-20-1-container .face-1-chart-icon-count').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-count-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-count-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-20-1-container .face-1-chart-icon-summ').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-summ-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-summ-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-20-1-container').mCustomScrollbar('destroy');
    $('.face-20-1-container').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

}

$(document).ready(function() {
    $('.face-40-2-type-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-40-2-type').length == 0) {
            $('.face-40-2-type').removeClass('open');
        }
    });

    $('.face-40-2-type ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-40-2-type ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-40-2-type-current').html($(this).html());
            face40_2_Redraw();
        }
        $('.face-40-2-type').removeClass('open');
        e.preventDefault();
    });

});

function face40_2_Redraw() {
    var curType = $('.face-40-2-type li.active').attr('data-type');
    var faceData = null;
    for (var i = 0; i < faceData40_2.length; i++) {
        if (faceData40_2[i].type == curType) {
            faceData = faceData40_2[i].data;
        }
    }

    if (faceData !== null) {

        var face1Labels = [];
        var face1DataActually = [];

        $('.face-40-2-container .face-1-chart-graph').html('');
        $('.face-40-2-container .face-1-chart-labels').html('');
        $('.face-40-2-container .face-1-chart-icons').html('');

        var itemWidth = 110;
        if ($(window).width() < 1140) {
            itemWidth = 80;
        }

        var itemMargin = 55;
        if ($(window).width() < 1140) {
            itemMargin = 40;
        }

        for (var i = 0; i < faceData.length; i++) {
            var curData = faceData[i];
            face1Labels.push(curData.year);
            face1DataActually.push(Number(curData.ratio));
        }

        $('.face-40-2-container .face-1-chart').width(face1Labels.length * itemWidth + itemMargin);

        var minPlace = 9999;
        var maxPlace = 0;

        for (var i = 0; i < face1DataActually.length; i++) {
            if (face1DataActually[i] < minPlace) {
                minPlace = face1DataActually[i];
            }
            if (face1DataActually[i] > maxPlace) {
                maxPlace = face1DataActually[i];
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
                var curY = ((face1DataActually[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-40-2-container .face-1-chart-graph').height();
                if (face1DataActually[i - 1] != null) {
                    var prevX = ((i - 1) * itemWidth) + itemMargin;
                    var prevY = ((face1DataActually[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-40-2-container .face-1-chart-graph').height();
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    $('.face-40-2-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
                }
                $('.face-40-2-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataActually[i] + '<em>&nbsp;%</em></strong></span></div>');
            }
        }

        for (var i = 0; i < face1Labels.length; i++) {
            $('.face-40-2-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        }

        var maxSumm = 0;

        for (var i = 0; i < faceData.length; i++) {
            var curData = faceData[i];

            if (maxSumm < Number(curData.all)) {
                maxSumm = Number(curData.all);
            }
        }

        for (var i = 0; i < faceData.length; i++) {
            var curData = faceData[i];

            $('.face-40-2-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * itemWidth + itemMargin) + 'px">' +
                                                                        '<div class="face-1-chart-icon-summ" data-summ="' + curData.all + '" style="height:' + (Number(curData.all) / maxSumm * 100) + '%"><div class="face-1-chart-icon-summ-inner"></div></div>' +
                                                                        '<div class="face-1-chart-icon-count" data-count="' + curData.summ + '" style="height:' + ((Number(curData.summ) / Number(curData.all)) / (Number(curData.all) / maxSumm) * 100) + '%"><div class="face-1-chart-icon-count-inner"></div></div>' +
                                                                    '</div>');
        }

        $('.face-40-2-container').mCustomScrollbar('destroy');
        $('.face-40-2-container').mCustomScrollbar({
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

        $('.face-40-2-container .face-1-chart-icon-summ').on('mouseover', function(e) {
            $('.face-39-ratio-window').remove();
            var curItem = $(this);
            var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
            var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
            $('body').append('<div class="face-39-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Всего программ</div><div class="face-39-ratio-window-value">' + curItem.attr('data-summ').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div></div>');
        });

        $('.face-40-2-container .face-1-chart-icon-summ').on('mouseout', function(e) {
            $('.face-39-ratio-window').remove();
        });

        $('.face-40-2-container .face-1-chart-icon-count').on('mouseover', function(e) {
            $('.face-39-ratio-window').remove();
            var curItem = $(this);
            var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
            var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
            $('body').append('<div class="face-39-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-39-ratio-window-title">Прошли профессионально-общественную аккредитацию</div><div class="face-39-ratio-window-value">' + curItem.attr('data-count').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div></div>');
        });

        $('.face-40-2-container .face-1-chart-icon-count').on('mouseout', function(e) {
            $('.face-39-ratio-window').remove();
        });

        $(window).on('scroll', function() {
            $('.face-39-ratio-window').remove();
        });
    }

}