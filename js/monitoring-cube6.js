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

    face15_2_Redraw();
    face15_3_Redraw();
    face25_2_Redraw();

});

function face15_2_Redraw() {

    var curMaxSumm = 0;
    var curMaxBudget = 0;
    var curMinBudget = 9999;
    var curMaxGDP = 0;

    for (var i = 0; i < faceData15_2.length; i++) {
        var curData = faceData15_2[i];
        if (Number(curData.summ) > curMaxSumm) {
            curMaxSumm = Number(curData.summ);
        }
        if (Number(curData.budget) > curMaxBudget) {
            curMaxBudget = Number(curData.budget);
        }
        if (Number(curData.budget) < curMinBudget) {
            curMinBudget = Number(curData.budget);
        }
        if (Number(curData.gdp) > curMaxGDP) {
            curMaxGDP = Number(curData.gdp);
        }
    }

    var countSumm = Math.ceil(curMaxSumm / 50) + 2;
    var countBudget = Math.ceil(curMaxBudget / 0.5) + 2;
    var countMinBudget = Math.ceil(curMinBudget / 0.5) - 1;
    var summMax = (countSumm - 1) * 50;
    var summBudget = (countBudget - 1) * 0.5;

    var scaleLeftHTML = '';
    for (var i = 0; i < countSumm; i++) {
        scaleLeftHTML += '<div class="face-15-2-scale-left-item" style="bottom:' + (i / (countSumm - 1) * 100) + '%">' + (i * 50) + '</div>';
    }
    $('.face-15-2-scale-left').html(scaleLeftHTML);

    var scaleRightHTML = '';
    for (var i = 0; i < countBudget; i++) {
        if (i >= countMinBudget) {
            scaleRightHTML += '<div class="face-15-2-scale-right-item face-15-2-scale-right-item-budget" style="bottom:' + (i / (countBudget - 1) * 100) + '%">' + (i * 0.5) + '</div>';
        } else {
            scaleRightHTML += '<div class="face-15-2-scale-right-item" style="bottom:' + (i / (countBudget - 1) * 100) + '%">' + (i * 0.5) + '</div>';
        }
    }
    $('.face-15-2-scale-right-inner').html(scaleRightHTML);

    var graphHTML = '';
    for (var i = 0; i < faceData15_2.length; i++) {
        var curData = faceData15_2[i];

        graphHTML +=    '<div class="face-15-2-graph-item">';
        graphHTML +=        '<div class="face-15-2-graph-item-summ" style="bottom:' + (Number(curData.summ) / summMax * 100) + '%">' + Number(curData.summ).toFixed(1) + '</div>';
        graphHTML +=        '<div class="face-15-2-graph-item-year">' + curData.year + '</div>';
        graphHTML +=        '<div class="face-15-2-graph-item-budget" style="bottom:' + (Number(curData.budget) / summBudget * $('.face-15-2-scale-right-inner').height()) + 'px">' + String(Number(curData.budget).toFixed(2)).replace('.', ',') + '</div>';
        graphHTML +=        '<div class="face-15-2-graph-item-gdp" style="bottom:' + (Number(curData.gdp) / summBudget * $('.face-15-2-scale-right-inner').height()) + 'px">' + String(Number(curData.gdp).toFixed(2)).replace('.', ',') + '</div>';
        graphHTML +=    '</div>';
    }
    $('.face-15-2-graph-inner').html(graphHTML);

    $('.face-15-2-graph').mCustomScrollbar('destroy');
    $('.face-15-2-graph').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

    var itemWidth = 52;
    var itemHeight = 471;
    if ($(window).width() < 1140) {
        itemWidth = 34;
        itemHeight = 284;
    }
    $('.face-15-2-graph svg').attr('width', itemWidth * faceData15_2.length);
    $('.face-15-2-graph svg').attr('height', itemHeight);
    $('.face-15-2-graph svg').attr('viewBox', '0 0 ' + itemWidth * faceData15_2.length + ' ' + itemHeight);

    var svgContent = '<linearGradient id="face-15-2-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#3779a8" stop-opacity="1" /><stop offset="100%" stop-color="#3779a8" stop-opacity="0" /></linearGradient><path d="M ';
    for (var i = 0; i < faceData15_2.length; i++) {
        var curData = faceData15_2[i];

        if (i > 0) {
            svgContent += ' L';
        }
        svgContent += ' ' + ((i * itemWidth) + itemWidth / 2) + ' ' + (itemHeight - (Number(curData.summ) / summMax * itemHeight));
    }
    svgContent += ' L ' + (((faceData15_2.length - 1) * itemWidth) + itemWidth / 2) + ' ' + itemHeight;
    svgContent += ' L ' + (itemWidth / 2) + ' ' + itemHeight;
    svgContent += ' Z" fill="url(#face-15-2-gradient)"/>';
    $('.face-15-2-graph svg').html(svgContent);
}

function face15_3_Redraw() {
    var face1Labels = [];

    $('.face-15-3-container .face-1-chart-labels').html('');
    $('.face-15-3-container .face-1-chart-icons').html('');

    var itemWidth = 84;
    if ($(window).width() < 1140) {
        itemWidth = 84;
    }

    var itemMargin = 62;
    if ($(window).width() < 1140) {
        itemMargin = 30;
    }

    for (var i = 0; i < faceData15_3.length; i++) {
        var curData = faceData15_3[i];
        face1Labels.push(curData.year);
    }

    $('.face-15-3-container .face-1-chart').width(face1Labels.length * (itemWidth + itemMargin) + itemMargin);

    for (var i = 0; i < face1Labels.length; i++) {
        $('.face-15-3-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * (itemWidth + itemMargin) + itemMargin) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
    }

    var maxSumm = 0;

    for (var i = 0; i < faceData15_3.length; i++) {
        var curData = faceData15_3[i];

        if (maxSumm < Number(curData.app)) {
            maxSumm = Number(curData.app);
        }
    }

    for (var i = 0; i < faceData15_3.length; i++) {
        var curData = faceData15_3[i];

        $('.face-15-3-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * (itemWidth + itemMargin) + itemMargin) + 'px">' +
                                                                    '<div class="face-1-chart-icon-base" style="height:' + (Number(curData.base) / maxSumm * 100) + '%"><div class="face-1-chart-icon-base-inner"><div class="face-1-chart-icon-value">' +  String(curData.base).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div></div></div>' +
                                                                    '<div class="face-1-chart-icon-app" style="height:' + (Number(curData.app) / maxSumm * 100) + '%"><div class="face-1-chart-icon-app-inner"><div class="face-1-chart-icon-value">' +  String(curData.app).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div></div></div>' +
                                                                '</div>');
    }

    $('.face-15-3-container .face-1-chart-icon-base').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-base-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-base-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-15-3-container .face-1-chart-icon-app').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-app-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-app-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-15-3-container').mCustomScrollbar('destroy');
    $('.face-15-3-container').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

}

$(document).ready(function() {

    $('.face-25-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-25-2-year').length == 0) {
            $('.face-25-2-year').removeClass('open');
        }
    });

    $('.face-25-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-25-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-25-2-year-current').html($(this).html());
            $('.face-25-2-year-text').html($(this).html());
            face25_2_Redraw();
        }
        $('.face-25-2-year').removeClass('open');
        e.preventDefault();
    });

});

function face25_2_Redraw() {
    var curYear = $('.face-25-2-year-text').html();

    var curData = null;
    for (var i = 0; i < faceData25_2.length; i++) {
        if (faceData25_2[i].year == curYear) {
            curData = faceData25_2[i].list;
        }
    }
    if (curData !== null) {
        var newHTML = '';
        for (var i = 0; i < curData.length; i++) {
            newHTML += '<div class="face-25-2-item"><span>' + ('0' + (i + 1)).substr(-2) + '</span>' + curData[i] + '</div>';
        }

        $('.face-25-2-list').mCustomScrollbar('destroy');
        $('.face-25-2-list').html(newHTML);
        $('.face-25-2-list').mCustomScrollbar({
            axis: 'y',
            scrollButtons: {
                enable: true
            }
        });
    }
}