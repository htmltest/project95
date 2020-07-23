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