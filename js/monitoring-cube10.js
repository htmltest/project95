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
    face48_1_Redraw();
    face48_3_Redraw();
    face46_2_Redraw();

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

$(document).ready(function() {

    $('.face-20-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-20-2-year').length == 0) {
            $('.face-20-2-year').removeClass('open');
        }
    });

    $('.face-20-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-20-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-20-2-year-current').html($(this).html());
            $('.face-20-2-year-text').html($(this).html());
            face20_2_Redraw();
        }
        $('.face-20-2-year').removeClass('open');
        e.preventDefault();
    });

    if ($(window).width() > 1139) {
        $('body').on('mouseenter', '.map-russia-district-20-2, .map-region-item-20-2', function(e) {
            $('.monitoring-map-region-hint').remove();
            $('body').append('<div class="monitoring-map-region-hint">' + $(this).attr('data-title') + '</div>');
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
        });

        $('body').on('mousemove', '.map-russia-district-20-2, .map-region-item-20-2', function(e) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
        });

        $('body').on('mouseleave', '.map-russia-district-20-2, .map-region-item-20-2', function(e) {
            $('.monitoring-map-region-hint').remove();
        });
    }

    $('body').on('click', '.map-russia-district-20-2', function(e) {
        $('.monitoring-map-region-hint').remove();
        if ($('.map-window-20-2').length == 0) {
            $('body').append('<div class="map-window-20-2"><div class="map-window-inner-20-2">' +
                                '<div class="map-window-title-20-2"></div>' +
                                '<div class="map-window-info-20-2">' +
                                    '<div class="map-window-info-item-20-2">' +
                                        '<div class="map-window-info-item-title-20-2">Доля инновационной<br /> продукции, %</div>' +
                                        '<div class="map-window-info-item-value-20-2 map-window-info-item-value-1-20-2"></div>' +
                                    '</div>' +
                                    '<div class="map-window-info-item-20-2 map-window-info-item-20-2-add">' +
                                        '<div class="map-window-info-item-title-20-2">Доля инновационной продукции<br /> (товаров, услуг), созданной<br /> с использованием результатов<br /> интеллектуальной деятельности,<br /> права на которые принадлежат<br /> российским правообладателям, %</div>' +
                                        '<div class="map-window-info-item-value-20-2 map-window-info-item-value-2-20-2"></div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="map-window-info-chart-title-20-2">Динамика доли инновационной продукции, %</div>' +
                                '<div class="map-window-info-chart-20-2"></div>' +
                                '<div class="map-window-info-link-20-2"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                '<div class="map-window-close-20-2"></div>' +
                             '</div></div>');
        }
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.map-window-20-2').css({'left': curLeft, 'top': curTop});
        $('.map-window-20-2').removeClass('map-window-region-20-2');
        var districtID = $(this).attr('data-id');
        var districtTitle = '';
        for (var i = 0; i < russiaDistricts.length; i++) {
            if (russiaDistricts[i].id == districtID) {
                districtTitle = russiaDistricts[i].title;
            }
        }
        $('.map-window-title-20-2').html(districtTitle + ' федеральный округ');
        $('.map-window-info-link-20-2 a').attr('data-id', districtID);
        $('.map-window-info-chart-20-2').html('');

        var curYear = $('.face-20-2-year-text').html();

        var curMax = 0;

        for (var i = 0; i < face_20_2_dataDistricts.length; i++) {
            var curData = face_20_2_dataDistricts[i].data;
            for (var j = 0; j < curData.length; j++) {
                if (curData[j].district == districtID) {
                    if (curMax < parseFloat(curData[j].ratio1)) {
                        curMax = parseFloat(curData[j].ratio1);
                    }
                    $('.map-window-info-chart-20-2').append('<div class="map-window-info-chart-item-20-2">' +
                                                            '<div class="map-window-info-chart-item-value-20-2">' + curData[j].ratio1 + '</div>' +
                                                            '<div class="map-window-info-chart-item-bar-20-2"></div>' +
                                                            '<div class="map-window-info-chart-item-year-20-2">' + face_20_2_dataDistricts[i].year + '</div>' +
                                                       '</div>');
                }
                if (curYear == face_20_2_dataDistricts[i].year) {
                    if (curData[j].district == districtID) {
                        var curValue = curData[j].ratio1;
                        $('.map-window-info-item-value-1-20-2').html(curValue);
                        if (typeof (curData[j].ratio2) != 'undefined') {
                            curValue = curData[j].ratio2;
                            $('.map-window-info-item-value-2-20-2').html(curValue);
                            $('.map-window-info-item-20-2-add').removeClass('invisible');
                        } else {
                            $('.map-window-info-item-20-2-add').addClass('invisible');
                        }
                    }
                }
            }
        }

        $('.map-window-info-chart-item-20-2').each(function() {
            var curItem = $(this);
            curItem.find('.map-window-info-chart-item-bar-20-2').css({'height': parseFloat(curItem.find('.map-window-info-chart-item-value-20-2').html()) / curMax * 108 + 'px'});
        });

        $('.map-window-20-2').show();
        $('html').addClass('map-window-opened');
    });

    $('body').on('click', '.map-window-close-20-2', function() {
        $('.map-window-20-2').hide();
        $('html').removeClass('map-window-opened');
    });

    $('body').on('click', '.map-region-item-20-2', function(e) {
        $('.monitoring-map-region-hint').remove();
        if ($('.map-window-20-2').length == 0) {
            $('body').append('<div class="map-window-20-2"><div class="map-window-inner-20-2">' +
                                '<div class="map-window-title-20-2"></div>' +
                                '<div class="map-window-info-20-2">' +
                                    '<div class="map-window-info-item-20-2">' +
                                        '<div class="map-window-info-item-title-20-2">Доля инновационной<br /> продукции, %</div>' +
                                        '<div class="map-window-info-item-value-20-2 map-window-info-item-value-1-20-2"></div>' +
                                    '</div>' +
                                    '<div class="map-window-info-item-20-2 map-window-info-item-20-2-add">' +
                                        '<div class="map-window-info-item-title-20-2">Доля инновационной продукции<br /> (товаров, услуг), созданной<br /> с использованием результатов<br /> интеллектуальной деятельности,<br /> права на которые принадлежат<br /> российским правообладателям, %</div>' +
                                        '<div class="map-window-info-item-value-20-2 map-window-info-item-value-2-20-2"></div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="map-window-info-chart-title-20-2">Динамика доли инновационной продукции, %</div>' +
                                '<div class="map-window-info-chart-20-2"></div>' +
                                '<div class="map-window-info-link-20-2"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                '<div class="map-window-close-20-2"></div>' +
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
        $('.map-window-20-2').css({'left': curLeft, 'top': curTop});
        $('.map-window-20-2').addClass('map-window-region-20-2');
        var regionID = $(this).attr('data-id');
        var regionTitle = '';
        for (var i = 0; i < russiaRegions.length; i++) {
            if (russiaRegions[i].id == regionID) {
                regionTitle = russiaRegions[i].title;
            }
        }
        $('.map-window-title-20-2').html(regionTitle);
        $('.map-window-info-chart-20-2').html('');

        var curYear = $('.face-20-2-year-text').html();

        var curMax = 0;

        for (var i = 0; i < face_20_2_dataRegions.length; i++) {
            if (face_20_2_dataRegions[i].id == regionID) {
                var curData = face_20_2_dataRegions[i].values[0].data;
                for (var j = 0; j < curData.length; j++) {
                    if (curMax < parseFloat(curData[j].ratio1)) {
                        curMax = parseFloat(curData[j].ratio1);
                    }
                    $('.map-window-info-chart-20-2').append('<div class="map-window-info-chart-item-20-2">' +
                                                            '<div class="map-window-info-chart-item-value-20-2">' + curData[j].ratio1 + '</div>' +
                                                            '<div class="map-window-info-chart-item-bar-20-2"></div>' +
                                                            '<div class="map-window-info-chart-item-year-20-2">' + curData[j].year + '</div>' +
                                                       '</div>');
                    if (curData[j].year == curYear) {
                        var curValue = curData[j].ratio1;
                        $('.map-window-info-item-value-1-20-2').html(curValue);
                        if (typeof (curData[j].ratio2) != 'undefined') {
                            curValue = curData[j].ratio2;
                            if (curData[j].ratio2 == '') {
                                curValue = 0;
                            }
                            if (curData[j].ratio2 !== null) {
                                $('.map-window-info-item-value-2-20-2').html(curValue);
                            } else {
                                $('.map-window-info-item-value-2-20-2').html('н/д');
                            }
                            $('.map-window-info-item-20-2-add').removeClass('invisible');
                        } else {
                            $('.map-window-info-item-20-2-add').addClass('invisible');
                        }
                    }
                }
            }
        }

        $('.map-window-info-chart-item-20-2').each(function() {
            var curItem = $(this);
            curItem.find('.map-window-info-chart-item-bar-20-2').css({'height': parseFloat(curItem.find('.map-window-info-chart-item-value-20-2').html()) / curMax * 108 + 'px'});
        });

        $('.map-window-20-2').show();
        $('html').addClass('map-window-opened');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.map-window-inner-20-2').length == 0 && !$(e.target).hasClass('map-window-inner-20-2') && $(e.target).parents().filter('.map-russia-district-20-2').length == 0 && $(e.target).parents().filter('.face-20-2-table-name-region').length == 0 && !$(e.target).hasClass('map-russia-district-20-2') && !$(e.target).hasClass('face-20-2-table-name-region') && $(e.target).parents().filter('.map-region-item-20-2').length == 0 && !$(e.target).hasClass('map-region-item-20-2')) {
            $('.map-window-20-2').hide();
            $('html').removeClass('map-window-opened');
        }
    });

    $('body').on('click', '.map-window-info-link-20-2 a', function(e) {
        var curID = $(this).attr('data-id');
        $('.face-20-2-back').addClass('visible').attr('data-id', curID);
        $('.face-20-2-title-russia').css({'display': 'none'});
        $('.face-20-2-title-regions').css({'display': 'inline'});
        $('.map-window-20-2').hide();
        $('.map-russia-20-2').hide();
        $('html').removeClass('map-window-opened');
        $('.map-region-20-2[data-id="' + curID + '"]').show();
        var curSort = $('.face-20-2-table-head.active').attr('data-sortType');
        var curYear = $('.face-20-2-year-text').html();
        var curData = [];
        for (var i = 0; i < face_20_2_dataRegions.length; i++) {
            var curRegionID = face_20_2_dataRegions[i].id;
            var curDiscrictID = -1;
            for (var j = 0; j < russiaRegions.length; j++) {
                if (curRegionID == russiaRegions[j].id && russiaRegions[j].district == curID) {
                    curDiscrictID = russiaRegions[j].district;
                }
            }
            if (curDiscrictID > -1) {
                for (var j = 0; j < face_20_2_dataRegions[i].values.length; j++) {
                    for (var k = 0; k < face_20_2_dataRegions[i].values[j].data.length; k++) {
                        if (face_20_2_dataRegions[i].values[j].data[k].year == curYear) {
                            var curRatio2 = face_20_2_dataRegions[i].values[j].data[k].ratio2;
                            if (curRatio2 === null) {
                                curRatio2 = '';
                            }
                            curData.push({
                                            'id'        : curRegionID,
                                            'ratio1'    : face_20_2_dataRegions[i].values[j].data[k].ratio1,
                                            'ratio2'    : curRatio2
                            });
                        }
                    }
                }
            }
        }

        var hasRatio2 = false;
        for (var i = 0; i < curData.length; i++) {
            if (typeof curData[i].ratio2 !== 'undefined' && curData[i].ratio2 !== null) {
                hasRatio2 = true;
            }
        }
        var classTableValue = '';
        if (!hasRatio2) {
            curSort = 'ratio1';
            $('.face-20-2-table-head').eq(2).addClass('invisible');
            classTableValue = ' invisible';
        } else {
            $('.face-20-2-table-head').eq(2).removeClass('invisible');
        }

        $('.face-20-2-table-head').eq(1).addClass('active');
        $('.face-20-2-table-head').eq(2).removeClass('active');

        if (curSort == 'ratio1') {
            curData.sort(face_20_2_Sort1);
        } else {
            curData.sort(face_20_2_Sort2);
            $('.face-20-2-table-head').eq(2).addClass('active');
            $('.face-20-2-table-head').eq(1).removeClass('active');
        }

        var curRatingsArray = [];
        for (var c = 0; c < mapColorsRegions_20_2.length; c++) {
            if (curID == mapColorsRegions_20_2[c].id) {
                for (var cy = 0; cy < mapColorsRegions_20_2[c].years.length; cy++) {
                    if (curYear == mapColorsRegions_20_2[c].years[cy].year) {
                        for (var ct = 0; ct < mapColorsRegions_20_2[c].years[cy].types.length; ct++) {
                            if (curSort == mapColorsRegions_20_2[c].years[cy].types[ct].type) {
                                curRatingsArray = mapColorsRegions_20_2[c].years[cy].types[ct].colors;
                            }
                        }
                    }
                }
            }
        }

        var legendHTML = '';
        for (var ra = 0; ra < curRatingsArray.length; ra++) {
            var legendText = '';
            if (curRatingsArray[ra][0] == 0) {
                legendText = 'до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else if (curRatingsArray[ra][1] == Infinity) {
                legendText = 'более ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else {
                legendText = 'от ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            }
            legendHTML += '<div class="map-russia-legend-item-20-2"><div class="map-russia-legend-item-color-20-2" style="background:' + mapColors_20_2[ra] + '"></div>' + legendText + '</div>';
        }

        $('.map-russia-legend-20-2').html(legendHTML);

        var newMap = '';
        $('.face-20-2-table-row').remove();
        for (var i = 0; i < curData.length; i++) {
            var regionID = curData[i].id;
            var regionTitle = '';
            for (var r = 0; r < russiaRegions.length; r++) {
                if (russiaRegions[r].id == regionID) {
                    regionTitle = russiaRegions[r].title;
                }
            }

            var curColorIndex = -1;
            var curValue = parseFloat(curData[i].ratio1);
            if (curSort == 'ratio2') {
                curValue = parseFloat(curData[i].ratio2);
                if (curData[i].ratio2 == '') {
                    curValue = 0;
                }
                if (curValue === null) {
                    curValue = 0;
                }
            }
            for (var c = 0; c < curRatingsArray.length; c++) {
                if (curValue >= curRatingsArray[c][0] && curValue < curRatingsArray[c][1]) {
                    curColorIndex = c;
                }
            }

            var curColor = mapColors_20_2[curColorIndex];

            newMap += '<g class="map-region-item-20-2" data-id="' + regionID + '" data-title="' + regionTitle + '">';
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
            $('.face-20-2-table').append('<div class="face-20-2-table-row">' +
                                        '<div class="face-20-2-table-name">' +
                                            '<a href="#" class="face-20-2-table-name-region" data-id="' + regionID + '">' +
                                                '<div class="face-20-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                regionTitle +
                                            '</a>' +
                                        '</div>' +
                                        '<div class="face-20-2-table-value">' + curData[i].ratio1 + '</div>' +
                                        '<div class="face-20-2-table-value' + classTableValue + '">' + curData[i].ratio2 + '</div>' +
                                      '</div>');
        }
        $('.map-region-20-2[data-id="' + curID + '"] svg').html(newMap);
        $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});

        e.preventDefault();
    });

    $('body').on('click', '.face-20-2-table-name-region', function(e) {
        var curID = $(this).attr('data-id');
        $('.map-region-item-20-2[data-id="' + curID + '"]').trigger('click');
        $('html, body').animate({'scrollTop': $('.map-region-20-2 .map-region-item-20-2[data-id="' + curID + '"]').offset().top});
        e.preventDefault();
    });

    $('body').on('click', '.face-20-2-back a', function(e) {
        $('.face-20-2-table-head').eq(0).html('Федеральный<br />округ');
        $('.face-20-2-back').removeClass('visible').removeAttr('data-id');
        $('.face-20-2-title-russia').css({'display': 'inline'});
        $('.face-20-2-title-regions').css({'display': 'none'});
        $('.map-window-20-2').hide();
        $('.map-region-20-2').hide();
        $('.map-russia-20-2').show();
        $('html').removeClass('map-window-opened');
        face20_2_Redraw();
        $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});
        e.preventDefault();
    });

    $('body').on('click', '.face-20-2-table-head a', function(e) {
        var curCol = $(this).parent();
        if (!curCol.hasClass('active')) {
            $('.face-20-2-table-head.active').removeClass('active');
            curCol.addClass('active');
        }
        face20_2_Redraw();
        e.preventDefault();
    });

    $('body').on('click', '.face-20-2-table-name-link', function(e) {
        $('.face-20-2-table-head').eq(0).html('Субъект РФ');
        var curID = $(this).attr('data-id');
        if ($('.map-window-20-2').length == 0) {
            $('body').append('<div class="map-window-20-2"><div class="map-window-inner-20-2">' +
                                '<div class="map-window-title-20-2"></div>' +
                                '<div class="map-window-info-20-2">' +
                                    '<div class="map-window-info-item-20-2">' +
                                        '<div class="map-window-info-item-title-20-2">Доля инновационной<br /> продукции, %</div>' +
                                        '<div class="map-window-info-item-value-20-2 map-window-info-item-value-1-20-2"></div>' +
                                    '</div>' +
                                    '<div class="map-window-info-item-20-2 map-window-info-item-20-2-add">' +
                                        '<div class="map-window-info-item-title-20-2">Доля инновационной продукции<br /> (товаров, услуг), созданной<br /> с использованием результатов<br /> интеллектуальной деятельности,<br /> права на которые принадлежат<br /> российским правообладателям, %</div>' +
                                        '<div class="map-window-info-item-value-20-2 map-window-info-item-value-2-20-2"></div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="map-window-info-chart-title-20-2">Динамика доли инновационной продукции, %</div>' +
                                '<div class="map-window-info-chart-20-2"></div>' +
                                '<div class="map-window-info-link-20-2"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                '<div class="map-window-close-20-2"></div>' +
                             '</div></div>');
        }
        $('.map-window-info-link-20-2 a').attr('data-id', curID).trigger('click');
        e.preventDefault();
    });

    $('.map-russia-20-2').mCustomScrollbar({
        axis: 'x'
    });

    $('.face-20-2-table-wrap').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

    $('.map-russia-legend-icon-20-2').click(function() {
        $('html').addClass('window-open');

        if ($('.window').length > 0) {
            $('.window').remove();
        }
        $('body').append('<div class="window window-map-legend-20-2"><div class="window-loading"></div></div>');

        var windowHTML = '<div class="window-map-legend-inner-20-2"><div class="window-map-legend-title-20-2">Легенда</div><div class="window-map-legend-list-20-2">' + $('.map-russia-legend-20-2').html() + '</div></div>';

        $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

        $('.window-container').removeClass('window-container-load');
        windowPosition();
    });

});

$(window).on('load resize', function() {
    face20_2_Redraw();
});

function face20_2_Redraw() {
    var curSort = $('.face-20-2-table-head.active').attr('data-sortType');
    var curYear = $('.face-20-2-year-text').html();
    var curData = null;
    for (var i = 0; i < face_20_2_dataDistricts.length; i++) {
        if (face_20_2_dataDistricts[i].year == curYear) {
            curData = face_20_2_dataDistricts[i].data;
        }
    }

    var hasRatio2 = false;
    for (var i = 0; i < curData.length; i++) {
        if (typeof curData[i].ratio2 !== 'undefined' && curData[i].ratio2 !== null) {
            hasRatio2 = true;
        }
    }
    var classTableValue = '';
    if (!hasRatio2) {
        curSort = 'ratio1';
        $('.face-20-2-table-head').eq(2).addClass('invisible');
        classTableValue = ' invisible';
    } else {
        $('.face-20-2-table-head').eq(2).removeClass('invisible');
    }

    if (curData !== null) {
        $('.face-20-2-table-head').eq(1).addClass('active');
        $('.face-20-2-table-head').eq(2).removeClass('active');

        if (curSort == 'ratio1') {
            curData.sort(face_20_2_Sort1);
        } else {
            curData.sort(face_20_2_Sort2);
            $('.face-20-2-table-head').eq(2).addClass('active');
            $('.face-20-2-table-head').eq(1).removeClass('active');
        }
        var newMap = '';
        $('.face-20-2-table-row').remove();

        var curRatingsArray = mapColorsDistricts_20_2;

        var legendHTML = '';
        for (var ra = 0; ra < curRatingsArray.length; ra++) {
            var legendText = '';
            if (curRatingsArray[ra][0] == 0) {
                legendText = 'до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else if (curRatingsArray[ra][1] == Infinity) {
                legendText = 'более ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else {
                legendText = 'от ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            }
            legendHTML += '<div class="map-russia-legend-item-20-2"><div class="map-russia-legend-item-color-20-2" style="background:' + mapColors_20_2[ra] + '"></div>' + legendText + '</div>';
        }

        $('.map-russia-legend-20-2').html(legendHTML);

        for (var i = 0; i < curData.length; i++) {
            var districtID = curData[i].district;
            var districtTitle = '';
            for (var r = 0; r < russiaDistricts.length; r++) {
                if (russiaDistricts[r].id == districtID) {
                    districtTitle = russiaDistricts[r].title;
                }
            }

            var curColorIndex = -1;
            var curValue = parseFloat(curData[i].ratio1.replace(/ /g, ''));
            if (curSort == 'ratio2') {
                curValue = parseFloat(curData[i].ratio2.replace(/ /g, '').replace(/,/g, '.'));
            }
            for (var c = 0; c < curRatingsArray.length; c++) {
                if (curValue >= curRatingsArray[c][0] && curValue < curRatingsArray[c][1]) {
                    curColorIndex = c;
                }
            }

            var curColor = mapColors_20_2[curColorIndex];

            newMap += '<g class="map-russia-district-20-2" data-id="' + districtID + '" data-title="' + districtTitle + '">';
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
            $('.face-20-2-table').append('<div class="face-20-2-table-row">' +
                                        '<div class="face-20-2-table-name">' +
                                            '<a href="#" class="face-20-2-table-name-link" data-id="' + districtID + '">' +
                                                '<div class="face-20-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                '<div class="face-20-2-table-name-text">' + districtTitle + '</div>' +
                                            '</a>' +
                                        '</div>' +
                                        '<div class="face-20-2-table-value">' + String(curData[i].ratio1).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                        '<div class="face-20-2-table-value' + classTableValue + '">' + String(curData[i].ratio2).replace(/\./g, ',') + '</div>' +
                                      '</div>');
        }
        $('.map-russia-20-2 svg').html(newMap);
    }

    if ($('.face-20-2-back').hasClass('visible')) {
        var curID = $('.face-20-2-back').attr('data-id');
        $('.map-window-info-link-20-2 a').attr('data-id', curID).trigger('click');
    }
}

function face_20_2_Sort1(a, b) {
    var value1 = parseFloat(a.ratio1);
    var value2 = parseFloat(b.ratio1);
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face_20_2_Sort2(a, b) {
    var value1 = parseFloat(a.ratio2);
    var value2 = parseFloat(b.ratio2);
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face48_1_Redraw() {
    var face1Labels = [];
    var face1DataRatio3 = [];
    var face1DataRatio4 = [];

    $('.face-48-1-container .face-1-chart-graph').html('');
    $('.face-48-1-container .face-1-chart-labels').html('');

    var itemWidth = 42;
    if ($(window).width() < 1140) {
        itemWidth = 32;
    }

    var itemMargin = 40;
    if ($(window).width() < 1140) {
        itemMargin = 20;
    }

    for (var i = 0; i < faceData48_1.length; i++) {
        var curData = faceData48_1[i];
        face1Labels.push(curData.year);
        if (curData.ratio3 !== null) {
            face1DataRatio3.push(Number(curData.ratio3));
        } else {
            face1DataRatio3.push(null);
        }
        if (curData.ratio4 !== null) {
            face1DataRatio4.push(Number(curData.ratio4));
        } else {
            face1DataRatio4.push(null);
        }
    }

    $('.face-48-1-container .face-1-chart').width(face1Labels.length * (itemWidth + itemMargin));

    var minPlace = 9999;
    var maxPlace = 0;
    var curScroll = 0;

    for (var i = 0; i < face1DataRatio3.length; i++) {
        if (face1DataRatio3[i] != null) {
            if (face1DataRatio3[i] < minPlace) {
                minPlace = face1DataRatio3[i];
            }
            if (face1DataRatio3[i] > maxPlace) {
                maxPlace = face1DataRatio3[i];
            }
        }
    }

    for (var i = 0; i < face1DataRatio4.length; i++) {
        if (face1DataRatio4[i] != null) {
            if (face1DataRatio4[i] < minPlace) {
                minPlace = face1DataRatio4[i];
            }
            if (face1DataRatio4[i] > maxPlace) {
                maxPlace = face1DataRatio4[i];
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

    for (var i = 0; i < face1DataRatio3.length; i++) {
        if (face1DataRatio3[i] != null) {
            var curX = (i * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
            curScroll = curX;
            var curY = ((face1DataRatio3[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-48-1-container .face-1-chart-graph').height();
            if (face1DataRatio3[i - 1] != null) {
                var prevX = ((i - 1) * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
                var prevY = ((face1DataRatio3[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-48-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-48-1-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-48-1-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataRatio3[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1DataRatio4.length; i++) {
        if (face1DataRatio4[i] != null) {
            var curX = (i * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
            curScroll = curX;
            var curY = ((face1DataRatio4[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-48-1-container .face-1-chart-graph').height();
            if (face1DataRatio4[i - 1] != null) {
                var prevX = ((i - 1) * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
                var prevY = ((face1DataRatio4[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-48-1-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-48-1-container .face-1-chart-graph').append('<div class="face-1-chart-line face-1-chart-line-2 active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-48-1-container .face-1-chart-graph').append('<div class="face-1-chart-point face-1-chart-point-2 active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataRatio4[i] + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        $('.face-48-1-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * (itemWidth + itemMargin)) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
    }

    $('.face-48-1-container').mCustomScrollbar('destroy');
    $('.face-48-1-container').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

}

$(document).ready(function() {
    $('.face-48-3-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-48-3-year').length == 0) {
            $('.face-48-3-year').removeClass('open');
        }
    });

    $('.face-48-3-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-48-3-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-48-3-year-current').html($(this).html());
            face48_3_Redraw();
        }
        $('.face-48-3-year').removeClass('open');
        e.preventDefault();
    });

    $('.face-48-3-container').mCustomScrollbar({
        axis: 'y',
        scrollButtons: {
            enable: true
        },
        callbacks: {
            onScrollStart: function() {
                $('.face-39-ratio-window').remove();
            }
        }
    });

    $(window).on('scroll', function() {
        $('.face-39-ratio-window').remove();
    });

    $('body').on('mouseenter', '.face-48-3-item-values', function(e) {
        $('.face-39-1-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();

        $('body').append('<div class="face-39-ratio-window face-48-3-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px">' +
                            '<div class="face-39-ratio-window-title">Доля организаций осуществляющих технологические инновации</div>' +
                            '<div class="face-39-ratio-window-value" style="color:#3779a8">' + curItem.find('.face-48-3-item-value-1').attr('data-value') + '%</div><br />' +
                            '<div class="face-39-ratio-window-title">Уровень инновационной активности организаций</div>' +
                            '<div class="face-39-ratio-window-value" style="color:#fe6600">' + curItem.find('.face-48-3-item-value-2').attr('data-value') + '%</div>' +
                         '</div>');
    });

    $('body').on('mouseleave', '.face-48-3-item-values', function(e) {
        $('.face-39-ratio-window').remove();
    });

});

function face48_3_Redraw() {
    var curYear = $('.face-48-3-year li.active').attr('data-year');

    var curData = null;
    for (var i = 0; i < faceData48_3.length; i++) {
        if (faceData48_3[i].year == curYear) {
            curData = faceData48_3[i].data;
        }
    }
    if (curData !== null) {

        var maxSumm = 0;

        for (var i = 0; i < curData.length; i++) {
            var curDataItem = curData[i];
            if (Number(curDataItem.summ1) > maxSumm) {
                maxSumm = Number(curDataItem.summ1);
            }
            if (Number(curDataItem.summ2) > maxSumm) {
                maxSumm = Number(curDataItem.summ2);
            }
        }

        var countLines = 8;

        var scaleStep = (Math.floor(Math.floor(maxSumm / countLines)) + 1);

        var htmlScale = '<div class="face-48-3-scale-item"><span>0</span></div>';
        for (var i = 0; i < countLines; i++) {
            htmlScale += '<div class="face-48-3-scale-item"><span>' + ((i + 1) * scaleStep) + '</span></div>';
        }
        $('.face-48-3-scale').html(htmlScale);

        maxSumm = countLines * scaleStep;

        var htmlList = '';
        for (var i = 0; i < curData.length; i++) {
            var curDataItem = curData[i];
            htmlList += '<div class="face-48-3-item">' +
                            '<div class="face-48-3-item-title">' + curDataItem.title + '</div>' +
                            '<div class="face-48-3-item-values">';
            for (var j = 0; j < countLines; j++) {
                htmlList +=     '<div class="face-48-3-item-values-sep"></div>';
            }
            htmlList +=         '<div class="face-48-3-item-value-1" data-value="' + curDataItem.summ1 + '" style="width:' + (Number(curDataItem.summ1) / maxSumm * 100) + '%"></div>';
            htmlList +=         '<div class="face-48-3-item-value-2" data-value="' + curDataItem.summ2 + '" style="width:' + (Number(curDataItem.summ2) / maxSumm * 100) + '%"></div>';
            htmlList +=     '</div>' +
                        '</div>';
        }
        $('.face-48-3-list').html(htmlList);

    }
}

$(document).ready(function() {

    $('.face-46-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-46-2-year').length == 0) {
            $('.face-46-2-year').removeClass('open');
        }
    });

    $('.face-46-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-46-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-46-2-year-current').html($(this).html());
            $('.face-46-2-year-text').html($(this).html());
            face46_2_Redraw();
        }
        $('.face-46-2-year').removeClass('open');
        e.preventDefault();
    });

});

function face46_2_Redraw() {
    var curYear = $('.face-46-2-year li.active').attr('data-year');

    var curData = null;
    for (var i = 0; i < face46_2_data.length; i++) {
        if (face46_2_data[i].year == curYear) {
            curData = face46_2_data[i].data;
        }
    }
    var maxWidthLine = 204;
    if ($(window).width() < 1140) {
        maxWidthLine = 80;
    }

    var maxValue = 0;
    for (var i = 0; i < curData.length; i++) {
        var curValue = Math.round(parseFloat(curData[i].value.replace(/,/, '.')));
        if (maxValue < curValue) {
            maxValue = curValue;
        }
    }

    var newHTML = '';

    for (var i = 0; i < curData.length; i++) {
        var curItem = curData[i];
        var curValue = Math.round(parseFloat(curItem.value.replace(/,/, '.')));
        var curWidth = curValue / maxValue * maxWidthLine + 1;

        var flag = '';
        for (var j = 0; j < cubeFlags.length; j++) {
            if (cubeFlags[j].country == curItem.title) {
                flag = cubeFlags[j].image;
            }
        }

        if (curItem.title == 'Россия') {
            if (Number(curItem.place) > 10) {
                newHTML += '<div class="face-46-2-item-sep"></div>';
            }
            newHTML += '<div class="face-46-2-item-rus"><div class="face-46-2-item-rus-inner">';
        }

        if (Number(curItem.place) < 11 || curItem.title == 'Россия') {
            newHTML += '<div class="face-46-2-item">' +
                            '<div class="face-46-2-item-flag"><img src="' + flag + '" alt="" /></div>' +
                            '<div class="face-46-2-item-title">' + curItem.place + '. ' + curItem.title + '</div>' +
                            '<div class="face-46-2-item-line"><div class="face-46-2-item-line-inner" style="width:' + curWidth + 'px"></div></div>' +
                            '<div class="face-46-2-item-value">' + curItem.value + '</div>' +
                       '</div>';
        }

        if (curItem.title == 'Россия') {
            newHTML += '</div></div>';
        }
    }

    $('.face-46-2-list').html(newHTML);

    $('.face-46-2-container').mCustomScrollbar('destroy');
    $('.face-46-2-container').mCustomScrollbar({
        axis: 'y'
    });
}