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

    faceEGISURedraw();

});

function faceEGISURedraw() {
    $('.face-egisu-list').html('');
    var listNames = [];
    for (var i = 0; i < faceDataEGISU[0].data.length; i++) {
        $('.face-egisu-list').append('<div class="face-egisu-list-item"><span style="background:' + faceEGISUColors[i] + '"></span>' + faceDataEGISU[0].data[i].name + '</div>');
    }
    $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});

    var curMax = 0;

    for (var i = 0; i < faceDataEGISU.length; i++) {
        if (curMax < Number(faceDataEGISU[i].summ)) {
            curMax = Number(faceDataEGISU[i].summ);
        }
    }

    var scaleStep = Math.floor(curMax / 4 / 1000) * 1000;
    var scaleCount = Math.ceil(curMax / scaleStep);
    $('.face-egisu-scale').html('');
    for (var i = 0; i < scaleCount; i++) {
        $('.face-egisu-scale').append('<div class="face-egisu-scale-item" style="bottom:' + (i * (100 / scaleCount)) + '%"><span>' + String(i * scaleStep).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');
    }
    $('.face-egisu-scale').append('<div class="face-egisu-scale-item" style="bottom:100%"><span>' + String(scaleCount * scaleStep).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>');

    $('.face-egisu-graph').html('');
    for (var i = 0; i < faceDataEGISU.length; i++) {
        newHTML = '<div class="face-egisu-graph-item">' +
                        '<div class="face-egisu-graph-item-bar">' +
                            '<div class="face-egisu-graph-item-bar-container" data-id="' + i + '" style="height:' + (Number(faceDataEGISU[i].summ) / curMax * 100) + '%">';
        var subSumm = 0;
        for (var j = 0; j < faceDataEGISU[i].data.length; j++) {
            newHTML +=          '<div class="face-egisu-graph-item-bar-item" style="background:' + faceEGISUColors[j] + '; bottom:' + (subSumm / Number(faceDataEGISU[i].summ) * 100) + '%; height:' + (Number(faceDataEGISU[i].data[j].summ) / Number(faceDataEGISU[i].summ) * 100) + '%"></div>';
            subSumm += Number(faceDataEGISU[i].data[j].summ);
        }
        newHTML +=          '</div>' +
                        '</div>' +
                        '<div class="face-egisu-graph-item-year">' + faceDataEGISU[i].year + '</div>' +
                  '</div>';
        $('.face-egisu-graph').append(newHTML);
    }

    $('.face-egisu-content').mCustomScrollbar('destroy');
    $('.face-egisu-content').mCustomScrollbar({
        axis: 'x',
        callbacks: {
            onScrollStart: function() {
                $('.face-egisu-window').remove();
            }
        }
    });

    $('.face-egisu-graph-item-bar-container').on('mouseover', function(e) {
        $('.face-egisu-window').remove();
        var curItem = $(this);
        var curX = curItem.offset().left + curItem.width() / 2 - $(window).scrollLeft();
        var curY = curItem.offset().top + curItem.height() / 2 - $(window).scrollTop();
        var curID = Number(curItem.attr('data-id'));
        var newHTML = '';
        for (var i = 0; i < faceDataEGISU[curID].data.length; i++) {
            newHTML += '<div class="face-egisu-window-item">' + faceDataEGISU[curID].data[i].name + ' <span>' + String(faceDataEGISU[curID].data[i].summ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div>';
        }
        $('body').append('<div class="face-egisu-window" style="left:' + curX + 'px; top:' + curY + 'px"><div class="face-egisu-window-title">Всего выявлено РИД: <span>' + String(faceDataEGISU[curID].summ).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</span></div><div class="face-egisu-window-list-title">Из них:</div><div class="face-egisu-window-list">' + newHTML + '</div></div>');
    });

    $('.face-egisu-graph-item-bar-container').on('mouseout', function(e) {
        $('.face-egisu-window').remove();
    });

    $(window).on('scroll', function() {
        $('.face-egisu-window').remove();
    });

}