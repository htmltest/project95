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
    face26_3_Redraw();
    face18_1_Redraw();
    face18_2_Redraw();

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

$(document).ready(function() {

    $('.face-26-3-type-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-26-3-type').length == 0) {
            $('.face-26-3-type').removeClass('open');
        }
    });

    $('.face-26-3-type ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-26-3-type ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-26-3-type-current').html($(this).html());
            face26_3_Redraw();
        }
        $('.face-26-3-type').removeClass('open');
        e.preventDefault();
    });

});

function face26_3_Redraw() {
    $('.face-26-3-list').html('');
    var listNames = [];
    for (var i = 0; i < faceData26_2[0].data.length; i++) {
        $('.face-26-3-list').append('<div class="face-26-3-list-item"><span style="background:' + faceData26_2Colors[i] + '"></span>' + faceData26_2[0].data[i].name + '</div>');
    }
    $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});

    var curType = $('.face-26-3-type li.active').attr('data-type');

    var curMax = 0;

    for (var i = 0; i < faceData26_2.length; i++) {
        if (faceData26_2[i].type == curType) {
            var curSumm = 0;
            for (var j = 0; j < faceData26_2[i].data.length; j++) {
                curSumm += Number(faceData26_2[i].data[j].summ);
            }
            if (curMax < curSumm) {
                curMax = curSumm;
            }
        }
    }

    var scaleCount = Math.ceil(curMax / 1000);
    $('.face-26-3-scale').html('');
    for (var i = 0; i < scaleCount; i++) {
        $('.face-26-3-scale').append('<div class="face-26-3-scale-item" style="bottom:' + (i * (100 / scaleCount)) + '%"><span>' + String(i * 1000).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');
    }
    $('.face-26-3-scale').append('<div class="face-26-3-scale-item" style="bottom:100%"><span>' + String(scaleCount * 1000).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');

    $('.face-26-3-graph').html('');
    for (var i = 0; i < faceData26_2.length; i++) {
        if (faceData26_2[i].type == curType) {
            var curSumm = 0;
            for (var j = 0; j < faceData26_2[i].data.length; j++) {
                curSumm += Number(faceData26_2[i].data[j].summ);
            }
            newHTML = '<div class="face-26-3-graph-item">' +
                            '<div class="face-26-3-graph-item-bar">' +
                                '<div class="face-26-3-graph-item-bar-container" data-id="' + i + '" style="height:' + (curSumm / curMax * 100) + '%">';
            for (var j = 0; j < faceData26_2[i].data.length; j++) {
                newHTML +=          '<div class="face-26-3-graph-item-bar-item" style="background:' + faceData26_2Colors[j] + '; height:' + (Number(faceData26_2[i].data[j].summ) / curSumm * 100) + '%"></div>';
            }
            newHTML +=          '</div>' +
                            '</div>' +
                            '<div class="face-26-3-graph-item-year">' + faceData26_2[i].year + '</div>' +
                      '</div>';
            $('.face-26-3-graph').append(newHTML);
        }
    }

    $('.face-26-3-content').mCustomScrollbar('destroy');
    $('.face-26-3-content').mCustomScrollbar({
        axis: 'x',
        callbacks: {
            onScrollStart: function() {
                $('.face-26-3-window').remove();
            }
        }
    });

    $('.face-26-3-graph-item-bar-container').on('mouseover', function(e) {
        $('.face-26-3-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        var curID = Number(curItem.attr('data-id'));
        var newHTML = '';
        for (var i = 0; i < faceData26_2[curID].data.length; i++) {
            newHTML += '<div class="face-26-3-window-item">' + faceData26_2[curID].data[i].name + ' <span>' + String(faceData26_2[curID].data[i].summ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>';
        }
        var typeTitle = 'Экспорт';
        if (curType == 'import') {
            typeTitle = 'Импорт';
        }
        $('body').append('<div class="face-26-3-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-26-3-window-title">' + typeTitle + '</div><div class="face-26-3-window-list">' + newHTML + '</div></div>');
    });

    $('.face-26-3-graph-item-bar-container').on('mouseout', function(e) {
        $('.face-26-3-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-26-3-window').remove();
    });

}

function face18_1_Redraw() {
    var curMax = 100;
    var newHTML = '';
    for (var i = 0; i < faceData18_1.length; i++) {
        var classBoth = '';
        if (faceData18_1[i].actually !== undefined && faceData18_1[i].forecast !== undefined) {
            classBoth = ' both';
        }
        newHTML +=  '<div class="face-18-1-graph-item' + classBoth + '">';
        if (faceData18_1[i].actually !== undefined) {
            var classToBottom = '';
            newHTML +=  '<div class="face-18-1-graph-item-actually" style="height:' + (Number(faceData18_1[i].actually) / curMax * 100) + '%"><div class="face-18-1-graph-item-actually-value">' + faceData18_1[i].actually + '%</div></div>';
        }
        if (faceData18_1[i].forecast !== undefined) {
            var classToBottom = '';
            newHTML +=  '<div class="face-18-1-graph-item-forecast" style="height:' + (Number(faceData18_1[i].forecast) / curMax * 100) + '%"><div class="face-18-1-graph-item-forecast-value">' + faceData18_1[i].forecast + '%</div></div>';
        }
        newHTML +=      '<div class="face-18-1-graph-item-year">' + faceData18_1[i].year + '</div>';
        newHTML +=  '</div>';
    }
    $('.face-18-1-graph').mCustomScrollbar('destroy');
    $('.face-18-1-graph-inner').html(newHTML);
    $('.face-18-1-graph').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });
}

$(document).ready(function() {

    $('.face-18-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-18-2-year').length == 0) {
            $('.face-18-2-year').removeClass('open');
        }
    });

    $('.face-18-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-18-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-18-2-year-current').html($(this).html());
            $('.face-18-2-year-text').html($(this).html());
            face18_2_Redraw();
        }
        $('.face-18-2-year').removeClass('open');
        e.preventDefault();
    });

});

function face18_2_Redraw() {
    var curYear = $('.face-18-2-year-text').html();

    var curData = null;
    for (var i = 0; i < faceData18_2.length; i++) {
        if (faceData18_2[i].year == curYear) {
            curData = faceData18_2[i].list;
        }
    }
    if (curData !== null) {
        curData.sort(function(a, b) {
            if (Number(a.value) < Number(b.value)) {
                return 1;
            }
            if (Number(a.value) > Number(b.value)) {
                return -1;
            }
            return 0;
        });
        var newHTML = '';
        for (var i = 0; i < curData.length; i++) {
            newHTML +=  '<div class="face-18-2-item">' +
                            '<div class="face-18-2-item-title">' + curData[i].title + '</div>' +
                            '<div class="face-18-2-item-value">' + String(curData[i].value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                        '</div>';
        }

        $('.face-18-2-list').mCustomScrollbar('destroy');
        $('.face-18-2-list-content').html(newHTML);
        $('.face-18-2-list').mCustomScrollbar({
            axis: 'y',
            scrollButtons: {
                enable: true
            }
        });
    }
}