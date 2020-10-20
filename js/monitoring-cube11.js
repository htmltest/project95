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
            newHTML +=          '<svg width="' + scopusWidth + '" height="' + scopusWidth + '" viewBox="0 0 ' + scopusWidth + ' ' + scopusWidth + '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                    '<mask id="mask' + i + '" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="' + scopusWidth + '" height="' + scopusWidth + '">' +
                                        '<circle cx="' + scopusWidth / 2 + '" cy="' + scopusWidth / 2 + '" r="' + scopusWidth / 2 + '" fill="#91d9d0"/>' +
                                    '</mask>' +
                                    '<g mask="url(#mask' + i + ')">' +
                                        '<circle cx="' + scopusWidth / 2 + '" cy="' + (scopusWidth + wosWidth / 2 - bothSize) + '" r="' + wosWidth / 2 + '" fill="#8caabc"/>' +
                                    '</g>'
                                '</svg>';
        } else {
            bothSize = 0.75 * maxWidth / 2;
            newHTML +=          '<svg style="margin-top:4px;" width="' + (0.75 * maxWidth) + '" height="' + (0.75 * maxWidth) + '" viewBox="0 0 ' + (0.75 * maxWidth) + ' ' + (0.75 * maxWidth) + '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                    '<mask id="mask' + i + '" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="' + (0.75 * maxWidth) + '" height="' + (0.75 * maxWidth) + '">' +
                                        '<circle cx="' + (0.75 * maxWidth) / 2 + '" cy="' + (0.75 * maxWidth) / 2 + '" r="' + (0.75 * maxWidth) / 2 + '" fill="#91d9d0"/>' +
                                    '</mask>' +
                                    '<g mask="url(#mask' + i + ')">' +
                                        '<circle cx="' + (0.75 * maxWidth) / 2 + '" cy="' + ((0.75 * maxWidth) + (0.75 * maxWidth) / 2 - bothSize) + '" r="' + (0.75 * maxWidth) / 2 + '" fill="#8caabc"/>' +
                                    '</g>'
                                '</svg>';
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