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

    face47_2_Redraw();
    face47_3_Redraw();
    face47_1_Redraw();
    face41_2_Redraw();

});

$(document).ready(function() {

    $('.face-47-2-type-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-47-2-type').length == 0) {
            $('.face-47-2-type').removeClass('open');
        }
    });

    $('.face-47-2-type ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-47-2-type ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-47-2-type-current').html($(this).html());
            face47_2_Redraw();
        }
        $('.face-47-2-type').removeClass('open');
        e.preventDefault();
    });

    $('.face-47-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-47-2-year').length == 0) {
            $('.face-47-2-year').removeClass('open');
        }
    });

    $('.face-47-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-47-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-47-2-year-current').html($(this).html());
            $('.face-47-2-year-text').html($(this).html());
            face47_2_Redraw();
        }
        $('.face-47-2-year').removeClass('open');
        e.preventDefault();
    });

    $('body').on('click', '.face-47-2-item-info-icon', function(e) {
        if ($(window).width() < 1140) {
            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var windowHTML = '<div class="window-formula-info-mobile">' + $(this).parent().find('.face-47-2-item-info-content').html() + '</div>';

            $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }
        e.preventDefault();
    });

});

function face47_2_Redraw() {
    var curType = $('.face-47-2-type li.active').attr('data-type');
    var curYear = $('.face-47-2-year li.active').attr('data-year');

    $('.face-47-2-item').remove();

    var newHTML = '';

    for (var i = 0; i < face47_2_data.length; i++) {
        var curItem = face47_2_data[i];
        var curIcon = '';
        if (curItem.icon !== undefined && curItem.icon != '') {
            curIcon = '<div class="face-47-2-item-icon"><img src="' + curItem.icon + '" alt="" /></div>';
        }
        var curHint = '';
        var hintSize = '';
        if (curItem.hint !== undefined && curItem.hint != '') {
            curHint = '<div class="face-47-2-item-info">' +
                            '<div class="face-47-2-item-info-container">' +
                                '<a href="#" class="face-47-2-item-info-icon"></a>' +
                                '<div class="face-47-2-item-info-content ' + hintSize + '">' + curItem.hint + '</div>' +
                            '</div>' +
                        '</div>';
            if (curItem.hint.length < 300) {
                hintSize = 'mini';
            }
        }
        newHTML += '<div class="face-47-2-item">' +
                        '<div class="face-47-2-item-title">' + curIcon + curItem.title + curHint + '</div>';
        for (var j = 0; j < curItem.data.length; j++) {
            if (curYear == curItem.data[j].year) {
                for (var k = 0; k < curItem.data[j].values.length; k++) {
                    if (curType == curItem.data[j].values[k].type) {
                        newHTML += '<div class="face-47-2-item-value">' + curItem.data[j].values[k].q1 + '</div>';
                        newHTML += '<div class="face-47-2-item-value">' + curItem.data[j].values[k].q2 + '</div>';
                        newHTML += '<div class="face-47-2-item-value">' + curItem.data[j].values[k].q3 + '</div>';
                        newHTML += '<div class="face-47-2-item-value">' + curItem.data[j].values[k].q4 + '</div>';
                        newHTML += '<div class="face-47-2-item-value">' + curItem.data[j].values[k].na + '</div>';
                    }
                }
            }
        }
        newHTML += '</div>';
    }

    $('.face-47-2-list-inner').append(newHTML);

    $('.face-47-2-list').mCustomScrollbar('destroy');
    $('.face-47-2-list').mCustomScrollbar({
        axis: 'x'
    });
}

$(document).ready(function() {

    $('.face-47-3-type-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-47-3-type').length == 0) {
            $('.face-47-3-type').removeClass('open');
        }
    });

    $('.face-47-3-type ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-47-3-type ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-47-3-type-current').html($(this).html());
            $('.face-47-3-list-header-type').html($(this).html());
            face47_3_Redraw();
        }
        $('.face-47-3-type').removeClass('open');
        e.preventDefault();
    });

    $('.face-47-3-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-47-3-year').length == 0) {
            $('.face-47-3-year').removeClass('open');
        }
    });

    $('.face-47-3-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-47-3-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-47-3-year-current').html($(this).html());
            $('.face-47-3-year-text').html($(this).html());
            face47_3_Redraw();
        }
        $('.face-47-3-year').removeClass('open');
        e.preventDefault();
    });

    $('body').on('click', '.face-47-3-item-info-icon', function(e) {
        if ($(window).width() < 1140) {
            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var windowHTML = '<div class="window-formula-info-mobile">' + $(this).parent().find('.face-47-3-item-info-content').html() + '</div>';

            $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }
        e.preventDefault();
    });

});

function face47_3_Redraw() {
    var curType = $('.face-47-3-type li.active').attr('data-type');
    var curYear = $('.face-47-3-year li.active').attr('data-year');

    $('.face-47-3-item').remove();

    var newHTML = '';

    for (var i = 0; i < face47_3_data.length; i++) {
        var curItem = face47_3_data[i];
        var curIcon = '';
        if (curItem.icon !== undefined && curItem.icon != '') {
            curIcon = '<div class="face-47-3-item-icon"><img src="' + curItem.icon + '" alt="" /></div>';
        }
        var curHint = '';
        var hintSize = '';
        if (curItem.hint !== undefined && curItem.hint != '') {
            curHint = '<div class="face-47-3-item-info">' +
                            '<div class="face-47-3-item-info-container">' +
                                '<a href="#" class="face-47-3-item-info-icon"></a>' +
                                '<div class="face-47-3-item-info-content ' + hintSize + '">' + curItem.hint + '</div>' +
                            '</div>' +
                        '</div>';
            if (curItem.hint.length < 300) {
                hintSize = 'mini';
            }
        }
        newHTML += '<div class="face-47-3-item">' +
                        '<div class="face-47-3-item-title">' + curIcon + curItem.title + curHint + '</div>';
        for (var j = 0; j < curItem.data.length; j++) {
            if (curYear == curItem.data[j].year) {
                for (var k = 0; k < curItem.data[j].values.length; k++) {
                    if (curType == curItem.data[j].values[k].type) {
                        newHTML += '<div class="face-47-3-item-value">' + curItem.data[j].values[k].v1 + '</div>';
                        newHTML += '<div class="face-47-3-item-value">' + curItem.data[j].values[k].v2 + '</div>';
                    }
                }
            }
        }
        newHTML += '</div>';
    }

    $('.face-47-3-list-inner').append(newHTML);
}

function face47_1_Redraw() {
    var newHTML = '';

    var curMax = 0;
    for (var i = 0; i < face47_1_data.length; i++) {
        var curItem = face47_1_data[i];
        if (typeof curItem.wos !== 'undefined' && Number(curItem.wos) > curMax) {
            curMax = Number(curItem.wos);
        }
        if (typeof curItem.scopus !== 'undefined' && Number(curItem.scopus) > curMax) {
            curMax = Number(curItem.scopus);
        }
        if (typeof curItem.both !== 'undefined' && Number(curItem.both) > curMax) {
            curMax = Number(curItem.both);
        }
    }

    var maxWidth = 175;
    if ($(window).width() < 1140) {
        maxWidth = 95;
    }

    for (var i = 0; i < face47_1_data.length; i++) {
        var curItem = face47_1_data[i];
        newHTML += '<div class="face-47-1-item">' +
                        '<div class="face-47-1-item-container">' +
                            '<div class="face-47-1-item-content">';
        if (typeof curItem.scopus !== 'undefined') {
            var scopusWidth = Number(curItem.scopus) / curMax * maxWidth;
            newHTML +=          '<div class="face-47-1-item-scopus" style="width:' + scopusWidth + 'px; height:' + scopusWidth + 'px"><span>' + curItem.scopus + '</span></div>';
        } else {
            newHTML +=          '<div class="face-47-1-item-scopus-not" style="width:' + (0.75 * maxWidth) + 'px; height:' + (0.75 * maxWidth) + 'px"></div>';
        }
        var bothSize = Number(curItem.both) / Number(curItem.scopus) * maxWidth / 2;
        if (typeof curItem.wos !== 'undefined') {
            var wosWidth = Number(curItem.wos) / curMax * maxWidth;
            newHTML +=          '<div class="face-47-1-item-wos" style="width:' + wosWidth + 'px; height:' + wosWidth + 'px; margin-top:-' + bothSize + 'px"><span>' + curItem.wos + '</span></div>';
        } else {
            newHTML +=          '<div class="face-47-1-item-wos-not" style="width:' + (0.75 * maxWidth) + 'px; height:' + (0.75 * maxWidth) + 'px; margin-top:-' + 0.35 * maxWidth + 'px"></div>';
        }
        if (typeof curItem.scopus !== 'undefined' && typeof curItem.wos !== 'undefined') {
            newHTML +=          '<div class="face-47-1-item-svg" style="width:' + scopusWidth + 'px; height:' + scopusWidth + 'px"><svg width="' + scopusWidth + '" height="' + scopusWidth + '" viewBox="0 0 ' + scopusWidth + ' ' + scopusWidth + '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                    '<circle cx="' + scopusWidth / 2 + '" cy="' + (scopusWidth + wosWidth / 2 - bothSize) + '" r="' + wosWidth / 2 + '" fill="#8caabc"/>' +
                                '</svg></div>';
        } else {
            bothSize = 0.75 * maxWidth / 2;
            newHTML +=          '<div class="face-47-1-item-svg" style="width:' + (0.75 * maxWidth) + 'px; height:' + (0.75 * maxWidth) + 'px"><svg style="margin-top:4px;" width="' + (0.75 * maxWidth) + '" height="' + (0.75 * maxWidth) + '" viewBox="0 0 ' + (0.75 * maxWidth) + ' ' + (0.75 * maxWidth) + '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                    '<circle cx="' + (0.75 * maxWidth) / 2 + '" cy="' + ((0.75 * maxWidth) + (0.75 * maxWidth) / 2 - bothSize) + '" r="' + (0.75 * maxWidth) / 2 + '" fill="#8caabc"/>' +
                                '</svg></div>';
        }
        var bothText = '';
        if (typeof curItem.forecast !== 'undefined') {
            bothText += curItem.forecast + '/';
        }
        if (typeof curItem.both !== 'undefined') {
            bothText += '<span>' + curItem.both + '</span>';
        }
        var bothTop = 0.75 * maxWidth - 0.35 * maxWidth / 2;
        if (typeof curItem.scopus !== 'undefined') {
            bothTop = scopusWidth - bothSize / 2;
        }
        newHTML +=              '<div class="face-47-1-item-both" style="top:' + bothTop + 'px">' + bothText + '</div>';
        newHTML +=          '</div>' +
                        '</div>' +
                        '<div class="face-47-1-item-year"><span>' + curItem.year + '</span></div>' +
                    '</div>';
    }

    $('.face-47-1-content').html(newHTML);

    var firstY = 0;

    $('.face-47-1-item:eq(0) .face-47-1-item-content').each(function() {
        var curItem = $(this);
        var curScopus;
        var curWos;
        if (curItem.find('.face-47-1-item-scopus').length > 0) {
            curScopus = curItem.find('.face-47-1-item-scopus');
            curWos = curItem.find('.face-47-1-item-wos');
        } else {
            curScopus = curItem.find('.face-47-1-item-scopus-not');
            curWos = curItem.find('.face-47-1-item-wos-not');
        }
        var x1 = curScopus.outerWidth() / 2;
        var y1 = curScopus.outerHeight() / 2;
        var r1 = curScopus.outerWidth() / 2;
        var x2 = curWos.outerWidth() / 2 + (curItem.outerWidth() - curWos.outerWidth()) / 2;
        var y2 = curScopus.outerHeight() + curWos.outerHeight() / 2 + Number(curWos.css('margin-top').replace(/px/, ''));
        var r2 = curWos.outerWidth() / 2;

        var d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        var b = (Math.pow(r2, 2) - Math.pow(r1, 2) + Math.pow(d, 2)) / (2 * d);
        var a = d - b;
        var h = Math.sqrt(Math.pow(r2, 2) - Math.pow(b, 2));
        var x = x1 + (x2 - x1) / (d / a);
        var y = y1 + (y2 - y1) / (d / a);
        var y3 = y + (x - x2) * h / b;
        firstY = y3;
    });

    $('.face-47-1-item:gt(0) .face-47-1-item-content').each(function() {
        var curItem = $(this);
        var curScopus;
        var curWos;
        if (curItem.find('.face-47-1-item-scopus').length > 0) {
            curScopus = curItem.find('.face-47-1-item-scopus');
            curWos = curItem.find('.face-47-1-item-wos');
        } else {
            curScopus = curItem.find('.face-47-1-item-scopus-not');
            curWos = curItem.find('.face-47-1-item-wos-not');
        }
        var x1 = curScopus.outerWidth() / 2;
        var y1 = curScopus.outerHeight() / 2;
        var r1 = curScopus.outerWidth() / 2;
        var x2 = curWos.outerWidth() / 2 + (curItem.outerWidth() - curWos.outerWidth()) / 2;
        var y2 = curScopus.outerHeight() + curWos.outerHeight() / 2 + Number(curWos.css('margin-top').replace(/px/, ''));
        var r2 = curWos.outerWidth() / 2;

        var d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        var b = (Math.pow(r2, 2) - Math.pow(r1, 2) + Math.pow(d, 2)) / (2 * d);
        var a = d - b;
        var h = Math.sqrt(Math.pow(r2, 2) - Math.pow(b, 2));
        var x = x1 + (x2 - x1) / (d / a);
        var y = y1 + (y2 - y1) / (d / a);
        var y3 = y + (x - x2) * h / b;
        curItem.css({'margin-top': firstY - y3});
    });

    $('.face-47-1-container').mCustomScrollbar('destroy');
    $('.face-47-1-container').mCustomScrollbar({
        axis: 'x'
    });
}

$(window).on('load resize', function() {
    $('.cube-formula-text').mCustomScrollbar('destroy');
    $('.cube-formula-text').mCustomScrollbar({
        axis: 'y'
    });
});

$(document).ready(function() {

    $('body').on('click', '.face-46-1-chart-year a, .face-46-1-chart-point.active', function(e) {
        var curLi = $(this);
        var curYear = $(this).attr('data-year');

        $('html').addClass('window-open');

        if ($('.window').length > 0) {
            $('.window').remove();
        }
        $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

        var windowData = null;

        for (var i = 0; i < face46_1data.length; i++) {
            var dataItem = face46_1data[i];
            if (dataItem.year == curYear) {
                if (dataItem.rates !== null) {
                    windowData = dataItem.rates;
                }
            }
        }

        var newHTML = '';
        var hasRussia = false;
        if (windowData != null) {

            for (var i = 0; i < windowData.length; i++) {
                var curItem = windowData[i];
                if (Number(curItem.place) < 11 || curItem.title == 'Россия') {
                    var flag = '';
                    for (var j = 0; j < cubeFlags.length; j++) {
                        if (cubeFlags[j].country == curItem.title) {
                            flag = cubeFlags[j].image;
                        }
                    }

                    if (curItem.title == 'Россия') {
                        if (Number(curItem.place) > 10) {
                            newHTML += '<div class="face-4-item-sep"></div>';
                        }
                        hasRussia = true;
                        newHTML += '<div class="face-4-item-rus"><div class="face-4-item-rus-inner">';
                    }

                    newHTML += '<div class="face-4-item">' +
                                    '<div class="face-4-item-flag"><img src="' + flag + '" alt="" /></div>' +
                                    '<div class="face-4-item-title">' + curItem.place + '. ' + curItem.title + '</div>' +
                               '</div>';

                    if (curItem.title == 'Россия') {
                        newHTML += '</div></div>';
                    }
                }
            }

        }

        var windowHTML   =  '<div class="window-face46-1">';
        windowHTML      +=      '<div class="window-face46-1-title">Место Российской Федерации в мире по присутствию университетов в топ-500 глобальных рейтингов университетов за ' + curYear + ' год</div>';
        windowHTML      +=      '<div class="window-face46-1-list">' + newHTML + '</div>';
        windowHTML      +=      '<div class="window-face1-btn">' + $('.cube-face.active .cube-face-footer').html() + '</div>';
        windowHTML      +=  '</div>';

        $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

        $('.window-container').removeClass('window-container-load');
        windowPosition();

        e.preventDefault();
    });

});

$(window).on('load resize', function() {
    var face46_1Labels = [];
    var face46_1DataActually = [];
    var face46_1DataForecast = [];

    for (var i = 0; i < face46_1data.length; i++) {
        var curYear = face46_1data[i];
        face46_1Labels.push(curYear.year);

        if (curYear.rates !== null) {
            var curRates = curYear.rates;
            var curPlace = 0;
            for (var k = 0; k < curRates.length; k++) {
                if (curRates[k].title == 'Россия') {
                    curPlace = Number(curRates[k].place);
                }
            }
            face46_1DataActually.push({"year": curYear.year, "place": curPlace});
            if (curYear.forecast !== null) {
                face46_1DataForecast.push(Number(curYear.forecast));
            } else {
                face46_1DataForecast.push(null);
            }
        } else {
            face46_1DataActually.push(null);
            if (curYear.forecast !== null) {
                face46_1DataForecast.push(Number(curYear.forecast));
            }
        }
    }
    $('.face-46-1-chart').width(face46_1Labels.length * 79 - 37);

    var minPlace = 9999;
    var maxPlace = 0;
    var curScroll = 0;

    for (var i = 0; i < face46_1DataActually.length; i++) {
        if (face46_1DataActually[i] != null) {
            if (face46_1DataActually[i].place < minPlace) {
                minPlace = face46_1DataActually[i].place;
            }
            if (face46_1DataActually[i].place > maxPlace) {
                maxPlace = face46_1DataActually[i].place;
            }
        }
    }

    for (var i = 0; i < face46_1DataForecast.length; i++) {
        if (face46_1DataForecast[i] != null) {
            if (face46_1DataForecast[i] < minPlace) {
                minPlace = face46_1DataForecast[i];
            }
            if (face46_1DataForecast[i] > maxPlace) {
                maxPlace = face46_1DataForecast[i];
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

    $('.face-46-1-chart-graph').html('');
    for (var i = 0; i < face46_1DataActually.length; i++) {
        if (face46_1DataActually[i] != null) {
            var curX = (i * 79);
            curScroll = curX;
            var curY = ((face46_1DataActually[i].place - minPlace) / (maxPlace - minPlace)) * $('.face-46-1-chart-graph').height();
            if (face46_1DataActually[i - 1] != null) {
                var prevX = ((i - 1) * 79);
                var prevY = ((face46_1DataActually[i - 1].place - minPlace) / (maxPlace - minPlace)) * $('.face-46-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-46-1-chart-graph').append('<div class="face-46-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-46-1-chart-graph').append('<div class="face-46-1-chart-point active" data-year="' + face46_1DataActually[i].year + '" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong><em>' + face46_1DataActually[i].place + '</em></strong><em>место</em></span></div>');
        }
    }

    for (var i = 0; i < face46_1DataForecast.length; i++) {
        if (face46_1DataForecast[i] != null) {
            var curX = (i * 79);
            var curY = ((face46_1DataForecast[i] - minPlace) / (maxPlace - minPlace)) * $('.face-46-1-chart-graph').height();
            if (face46_1DataForecast[i - 1] != null) {
                var prevX = ((i - 1) * 79);
                var prevY = ((face46_1DataForecast[i - 1] - minPlace) / (maxPlace - minPlace)) * $('.face-46-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-46-1-chart-graph').append('<div class="face-46-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-46-1-chart-graph').append('<div class="face-46-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face46_1DataForecast[i] + '</strong>место</span></div>');
        }
    }

    $('.face-46-1-chart-labels').html('');
    for (var i = 0; i < face46_1Labels.length; i++) {
        if (face46_1DataActually[i] != null) {
            $('.face-46-1-chart-labels').append('<div class="face-46-1-chart-year" style="left:' + (i * 79) + 'px"><a href="#" data-year="' + face46_1Labels[i] + '">' + face46_1Labels[i] + '</a></div>');
        } else {
            $('.face-46-1-chart-labels').append('<div class="face-46-1-chart-year" style="left:' + (i * 79) + 'px"><span>' + face46_1Labels[i] + '</span></div>');
        }
    }

    $('.face-46-1-container').mCustomScrollbar('destroy');
    $('.face-46-1-container').mCustomScrollbar({
        axis: 'x',
        setLeft: '-' + (curScroll - $('.face-46-1-container').width() / 2) + 'px',
        scrollButtons: {
            enable: true
        }
    });

});

$(document).ready(function() {

    $('.face-41-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-41-2-year').length == 0) {
            $('.face-41-2-year').removeClass('open');
        }
    });

    $('.face-41-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-41-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-41-2-year-current').html($(this).html());
            $('.face-41-2-year-text').html($(this).html());
            face41_2_Redraw();
        }
        $('.face-41-2-year').removeClass('open');
        e.preventDefault();
    });

    $('body').on('mouseenter', '.map-russia-41-2-district', function(e) {
        $('.monitoring-map-region-hint').remove();
        if ($(window).width() > 1139) {
            $('body').append('<div class="monitoring-map-region-hint">' + $(this).attr('data-title') + '</div>');
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.map-russia-41-2-district', function(e) {
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
    });

    $('body').on('mouseleave', '.map-russia-41-2-district', function(e) {
        $('.monitoring-map-region-hint').remove();
    });

    $('body').on('mouseenter', '.map-russia-41-2-region', function(e) {
        $('.monitoring-map-region-hint').remove();
        if ($(window).width() > 1139) {
            $('body').append('<div class="monitoring-map-region-hint">' + $(this).attr('data-title') + '</div>');
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.map-russia-41-2-region', function(e) {
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
    });

    $('body').on('mouseleave', '.map-russia-41-2-region', function(e) {
        $('.monitoring-map-region-hint').remove();
    });

    $('body').on('click', '.face-41-2-table-head a', function(e) {
        if (!$(this).parent().hasClass('active')) {
            $('.face-41-2-table-head.active').removeClass('active');
            $(this).parent().addClass('active');
            face41_2_Redraw();
        }
        e.preventDefault();
    });

    $('body').on('click', '.map-russia-41-2-district, .face-41-2-table-name-link-district', function(e) {
        var districtID = $(this).attr('data-id');
        var curYear = $('.face-41-2-year-text').html();
        var curData = null;
        for (var i = 0; i < faceData41_2.length; i++) {
            if (faceData41_2[i].year == curYear) {
                for (var j = 0; j < faceData41_2[i].data.length; j++) {
                    if (faceData41_2[i].data[j].id == districtID) {
                        curData = faceData41_2[i].data[j];
                    }
                }
            }
        }
        if (curData !== null) {

            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var districtTitle = '';
            for (var r = 0; r < russiaDistricts.length; r++) {
                if (russiaDistricts[r].id == districtID) {
                    districtTitle = russiaDistricts[r].title;
                }
            }

            var maxSumm = 0;
            if (parseFloat(curData.summ1) > maxSumm) {
                maxSumm = parseFloat(curData.summ1);
            }
            if (parseFloat(curData.summ2) > maxSumm) {
                maxSumm = parseFloat(curData.summ2);
            }
            if (parseFloat(curData.summ3) > maxSumm) {
                maxSumm = parseFloat(curData.summ3);
            }
            var countLines = Math.ceil(maxSumm / 10) + 1;
            maxSumm = countLines * 10;

            var windowHTML   =  '<div class="window-41-2">';
            windowHTML      +=      '<div class="window-41-2-title">' + districtTitle + ', ' + curYear + '</div>';
            windowHTML      +=      '<div class="window-41-2-scale">';
            windowHTML      +=          '<div class="window-41-2-scale-item"><span>0</span></div>';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=      '<div class="window-41-2-scale-item" style="left:' + ((i + 1) / countLines* 100) + '%"><span>' + ((i + 1) * 10) + '%</span></div>';
            }
            windowHTML      +=      '</div>';

            windowHTML      +=      '<div class="window-41-2-list">';

            windowHTML      +=          '<div class="window-41-2-item">';
            windowHTML      +=              '<div class="window-41-2-item-title">Всего</div>';
            windowHTML      +=              '<div class="window-41-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-41-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-41-2-item-value" style="width:' + (parseFloat(curData.summ1) / maxSumm * 100) + '%"><span>' + curData.summ1 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=          '<div class="window-41-2-item">';
            windowHTML      +=              '<div class="window-41-2-item-title">Учебно-лабораторные здания</div>';
            windowHTML      +=              '<div class="window-41-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-41-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-41-2-item-value" style="width:' + (parseFloat(curData.summ2) / maxSumm * 100) + '%"><span>' + curData.summ2 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=          '<div class="window-41-2-item">';
            windowHTML      +=              '<div class="window-41-2-item-title">Общежития</div>';
            windowHTML      +=              '<div class="window-41-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-41-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-41-2-item-value" style="width:' + (parseFloat(curData.summ3) / maxSumm * 100) + '%"><span>' + curData.summ3 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=      '</div>';

            windowHTML      +=      '<div class="window-41-2-window-link"><a href="#" class="btn-med" data-id="' + districtID + '">Перейти на карту ФО</a></div>';

            windowHTML      +=  '</div>';

            $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        e.preventDefault();
    });

    $('body').on('click', '.map-russia-41-2-region, .face-41-2-table-name-link-region', function(e) {
        var districtID = $(this).attr('data-id');
        var curYear = $('.face-41-2-year-text').html();
        var curData = null;
        for (var i = 0; i < faceData41_2_Regions.length; i++) {
            if (faceData41_2_Regions[i].year == curYear) {
                for (var j = 0; j < faceData41_2_Regions[i].data.length; j++) {
                    if (faceData41_2_Regions[i].data[j].id == districtID) {
                        curData = faceData41_2_Regions[i].data[j];
                    }
                }
            }
        }
        if (curData !== null) {

            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var districtTitle = '';
            for (var r = 0; r < russiaRegions.length; r++) {
                if (russiaRegions[r].id == districtID) {
                    districtTitle = russiaRegions[r].title;
                }
            }

            var maxSumm = 0;
            if (parseFloat(curData.summ1) > maxSumm) {
                maxSumm = parseFloat(curData.summ1);
            }
            if (parseFloat(curData.summ2) > maxSumm) {
                maxSumm = parseFloat(curData.summ2);
            }
            if (parseFloat(curData.summ3) > maxSumm) {
                maxSumm = parseFloat(curData.summ3);
            }
            var countLines = Math.ceil(maxSumm / 10) + 1;
            maxSumm = countLines * 10;

            var windowHTML   =  '<div class="window-41-2">';
            windowHTML      +=      '<div class="window-41-2-title">' + districtTitle + ', ' + curYear + '</div>';
            windowHTML      +=      '<div class="window-41-2-scale">';
            windowHTML      +=          '<div class="window-41-2-scale-item"><span>0</span></div>';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=      '<div class="window-41-2-scale-item" style="left:' + ((i + 1) / countLines* 100) + '%"><span>' + ((i + 1) * 10) + '%</span></div>';
            }
            windowHTML      +=      '</div>';

            windowHTML      +=      '<div class="window-41-2-list">';

            windowHTML      +=          '<div class="window-41-2-item">';
            windowHTML      +=              '<div class="window-41-2-item-title">Всего</div>';
            windowHTML      +=              '<div class="window-41-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-41-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-41-2-item-value" style="width:' + (parseFloat(curData.summ1) / maxSumm * 100) + '%"><span>' + curData.summ1 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=          '<div class="window-41-2-item">';
            windowHTML      +=              '<div class="window-41-2-item-title">Учебно-лабораторные здания</div>';
            windowHTML      +=              '<div class="window-41-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-41-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-41-2-item-value" style="width:' + (parseFloat(curData.summ2) / maxSumm * 100) + '%"><span>' + curData.summ2 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=          '<div class="window-41-2-item">';
            windowHTML      +=              '<div class="window-41-2-item-title">Общежития</div>';
            windowHTML      +=              '<div class="window-41-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-41-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-41-2-item-value" style="width:' + (parseFloat(curData.summ3) / maxSumm * 100) + '%"><span>' + curData.summ3 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=      '</div>';

            windowHTML      +=  '</div>';

            $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        e.preventDefault();
    });

    $('body').on('click', '.window-41-2-window-link a', function(e) {
        var curID = $(this).attr('data-id');
        $('.face-41-2-back').addClass('visible').attr('data-id', curID);
        $('.face-41-2-title-russia').css({'display': 'none'});
        $('.face-41-2-title-regions').css({'display': 'inline'});

        $('.map-russia-41-2').hide();
        $('.map-region-41-2[data-id="' + curID + '"]').show();

        windowClose();

        face41_2_Redraw();

        e.preventDefault();
    });

    $('body').on('click', '.face-41-2-back a', function(e) {
        $('.face-41-2-back').removeClass('visible').removeAttr('data-id');
        $('.face-41-2-title-russia').css({'display': 'inline'});
        $('.face-41-2-title-regions').css({'display': 'none'});
        $('.map-region-41-2').hide();
        $('.map-russia-41-2').show();

        face41_2_Redraw();

        e.preventDefault();
    });

    $('.map-russia-41-2').each(function() {
        var newMap = '';
        for (var i = 0; i < russiaDistricts.length; i++) {
            var districtID = russiaDistricts[i].id;
            var districtTitle = russiaDistricts[i].title;
            newMap += '<g class="map-russia-41-2-district" data-id="' + districtID + '" data-title="' + districtTitle + '">';
            for (var j = 0; j < russiaRegions.length; j++) {
                var curRegion = russiaRegions[j];
                if (curRegion.district == districtID) {
                    newMap += '<g>' + curRegion.svg + '</g>';
                }
            }
            newMap += '</g>';
        }
        $('.map-russia-41-2 svg').html(newMap);
    });

    $('.map-region-41-2').each(function() {
        var curDistrict = $(this);
        var districtID = curDistrict.attr('data-id');
        var newMap = '';
        for (var i = 0; i < russiaRegions.length; i++) {
            if (russiaRegions[i].district == districtID) {
                newMap += '<g class="map-russia-41-2-region" data-id="' + russiaRegions[i].id + '" data-title="' + russiaRegions[i].title + '">' + russiaRegions[i].svg + '</g>';
            }
        }
        curDistrict.find('svg').html(newMap);
    });

});

function face41_2_Redraw() {
    var newMap = '';
    $('.face-41-2-table-row').remove();

    var curYear = $('.face-41-2-year-text').html();
    var curData = null;
    for (var i = 0; i < faceData41_2.length; i++) {
        if (faceData41_2[i].year == curYear) {
            curData = faceData41_2[i].data;
        }
    }

    if ($('.face-41-2-back').hasClass('visible')) {
        for (var i = 0; i < faceData41_2_Regions.length; i++) {
            if (faceData41_2_Regions[i].year == curYear) {
                curData = faceData41_2_Regions[i].data;
            }
        }
    }

    if (curData !== null) {
        var activeCol1 = '';
        var activeCol2 = '';
        var activeCol3 = '';
        var curIndexSort = $('.face-41-2-table-head').index($('.face-41-2-table-head.active')) - 1;
        switch (curIndexSort) {
            case 0:
                curData.sort(face41_2Sort_1);
                activeCol1 = ' active';
                break;
            case 1:
                curData.sort(face41_2Sort_2);
                activeCol2 = ' active';
                break;
            case 2:
                curData.sort(face41_2Sort_3);
                activeCol3 = ' active';
                break;
        }

        if (!$('.face-41-2-back').hasClass('visible')) {
            for (var i = 0; i < curData.length; i++) {
                var districtID = curData[i].id;
                var districtTitle = '';
                for (var r = 0; r < russiaDistricts.length; r++) {
                    if (russiaDistricts[r].id == districtID) {
                        districtTitle = russiaDistricts[r].title.replace(' федеральный округ', '');
                    }
                }
                var russiaClass = '';

                $('.face-41-2-table').append('<div class="face-41-2-table-row' + russiaClass + '">' +
                                                '<div class="face-41-2-table-name">' +
                                                    '<a href="#" class="face-41-2-table-name-link face-41-2-table-name-link-district" data-id="' + districtID + '">' + districtTitle + '</a>' +
                                                '</div>' +
                                                '<div class="face-41-2-table-value' + activeCol1 + '">' + curData[i].summ1 + '%</div>' +
                                                '<div class="face-41-2-table-value' + activeCol2 + '">' + curData[i].summ2 + '%</div>' +
                                                '<div class="face-41-2-table-value' + activeCol3 + '">' + curData[i].summ3 + '%</div>' +
                                              '</div>');
            }
        } else {
            for (var i = 0; i < curData.length; i++) {
                var regionID = curData[i].id;
                var districtID = $('.face-41-2-back').attr('data-id');
                for (var r = 0; r < russiaRegions.length; r++) {
                    if (regionID == russiaRegions[r].id && districtID == russiaRegions[r].district) {
                        var regionTitle = russiaRegions[r].title;
                        $('.face-41-2-table').append('<div class="face-41-2-table-row">' +
                                                        '<div class="face-41-2-table-name">' +
                                                            '<a href="#" class="face-41-2-table-name-link face-41-2-table-name-link-region" data-id="' + regionID + '">' + regionTitle + '</a>' +
                                                        '</div>' +
                                                        '<div class="face-41-2-table-value' + activeCol1 + '">' + curData[i].summ1 + '%</div>' +
                                                        '<div class="face-41-2-table-value' + activeCol2 + '">' + curData[i].summ2 + '%</div>' +
                                                        '<div class="face-41-2-table-value' + activeCol3 + '">' + curData[i].summ3 + '%</div>' +
                                                      '</div>');
                    }
                }
            }
        }
        $('.face-41-2-table-fixed').css({'width': $('.face-41-2-table-wrap .face-41-2-table-name').eq(0).outerWidth()});
    }
    $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});

    $('.map-russia-41-2').mCustomScrollbar({
        axis: 'x'
    });

    $('.face-41-2-table-wrap').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

}

function face41_2Sort_1(a, b) {
    var value1 = parseFloat(a.summ1);
    var value2 = parseFloat(b.summ1);
    if (a.id == '0') return -1;
    if (b.id == '0') return 1;
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face41_2Sort_2(a, b) {
    var value1 = parseFloat(a.summ2);
    var value2 = parseFloat(b.summ2);
    if (a.id == '0') return -1;
    if (b.id == '0') return 1;
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face41_2Sort_3(a, b) {
    var value1 = parseFloat(a.summ3);
    var value2 = parseFloat(b.summ3);
    if (a.id == '0') return -1;
    if (b.id == '0') return 1;
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}