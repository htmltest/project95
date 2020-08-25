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

    face35_2_Redraw();

});

$(document).ready(function() {
    $('.face-35-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-35-2-year').length == 0) {
            $('.face-35-2-year').removeClass('open');
        }
    });

    $('.face-35-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-35-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-35-2-year-current').html($(this).html());
            face35_2_Redraw();
        }
        $('.face-35-2-year').removeClass('open');
        e.preventDefault();
    });

    $('.face-35-2-container').mCustomScrollbar({
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

    $('body').on('mouseenter', '.face-35-2-item-value-1', function(e) {
        $('.face-39-1-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();

        $('body').append('<div class="face-39-ratio-window face-35-2-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px">' +
                            '<div class="face-39-ratio-window-title">Внебюджетное финансирование</div>' +
                            '<div class="face-39-ratio-window-value" style="color:#3779a8">' + String(curItem.attr('data-value')).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' млн. руб</div>' +
                         '</div>');
    });

    $('body').on('mouseleave', '.face-35-2-item-value-1', function(e) {
        $('.face-39-ratio-window').remove();
    });

    $('body').on('mouseenter', '.face-35-2-item-value-2', function(e) {
        $('.face-39-1-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();

        $('body').append('<div class="face-39-ratio-window face-35-2-ratio-window" style="left:' + curX + 'px; top:' + curY + 'px">' +
                            '<div class="face-39-ratio-window-title">Бюджетное финансирование</div>' +
                            '<div class="face-39-ratio-window-value" style="color:#fe6600">' + String(curItem.attr('data-value')).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' млн. руб</div>' +
                         '</div>');
    });

    $('body').on('mouseleave', '.face-35-2-item-value-2', function(e) {
        $('.face-39-ratio-window').remove();
    });

});

function face35_2_Redraw() {
    var curYear = $('.face-35-2-year li.active').attr('data-year');

    var curData = null;
    for (var i = 0; i < faceData35_2.length; i++) {
        if (faceData35_2[i].year == curYear) {
            curData = faceData35_2[i].data;
        }
    }
    if (curData !== null) {

        var maxSumm = 0;

        for (var i = 0; i < curData.length; i++) {
            var curDataItem = curData[i];
            if (Number(curDataItem.summ1) + Number(curDataItem.summ2) > maxSumm) {
                maxSumm = Number(curDataItem.summ1) + Number(curDataItem.summ2);
            }
        }

        var countLines = 8;

        var scaleStep = (Math.floor(Math.floor(maxSumm / countLines) / 100) + 1) * 100;

        var htmlScale = '<div class="face-35-2-scale-item"><span>0</span></div>';
        for (var i = 0; i < countLines; i++) {
            htmlScale += '<div class="face-35-2-scale-item"><span>' + ((i + 1) * scaleStep) + '</span></div>';
        }
        $('.face-35-2-scale').html(htmlScale);

        maxSumm = countLines * scaleStep;

        var htmlList = '';
        for (var i = 0; i < curData.length; i++) {
            var curDataItem = curData[i];
            htmlList += '<div class="face-35-2-item">' +
                            '<div class="face-35-2-item-title">' + curDataItem.title + '</div>' +
                            '<div class="face-35-2-item-values">';
            for (var j = 0; j < countLines; j++) {
                htmlList +=     '<div class="face-35-2-item-values-sep"></div>';
            }
            htmlList +=         '<div class="face-35-2-item-value-1" data-value="' + curDataItem.summ1 + '" style="width:' + (Number(curDataItem.summ1) / maxSumm * 100) + '%"></div>';
            htmlList +=         '<div class="face-35-2-item-value-2" data-value="' + curDataItem.summ2 + '" style="left:' + (Number(curDataItem.summ1) / maxSumm * 100) + '%; width:' + (Number(curDataItem.summ2) / maxSumm * 100) + '%"></div>';
            htmlList +=     '</div>' +
                        '</div>';
        }
        $('.face-35-2-list').html(htmlList);

    }
}