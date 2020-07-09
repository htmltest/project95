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
        $('.cube-menu li.active a').trigger('click');
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
});