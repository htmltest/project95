$(document).ready(function() {

    $('body').on('click', '.monitoring-menu a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.monitoring-menu li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = $('.monitoring-menu li').index(curLi);

            $('.monitoring-tab.active').removeClass('active');
            $('.monitoring-tab').eq(curIndex).addClass('active');

            if (typeof (history.pushState) != 'undefined') {
                history.pushState(null, null, $(this).attr('href'));
            }
        }

        e.preventDefault();
    });

    $('.monitoring-menu').each(function() {
        if (window.location.hash != '') {
            $('.monitoring-menu a').each(function() {
                var curLink = $(this);
                var curHash = curLink.attr('href').split('#')[1];
                if (curHash != 'undefined') {
                    if (('#' + curHash) == window.location.hash) {
                        curLink.trigger('click');
                    }
                }
            });
        }
    });

    $('.monitoring-map-header-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.monitoring-map-header-year').length == 0) {
            $('.monitoring-map-header-year').removeClass('open');
        }
    });

    $('.monitoring-map-header-year-list ul li').click(function(e) {
        var curLi = $(this);
        if (!curLi.hasClass('active')) {
            $('.monitoring-map-header-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.monitoring-map-header-year-current span').html(curLi.find('span').html());
        }
        $('.monitoring-map-header-year').removeClass('open');
        drawMonitoringMap();
    });

    if ($('.monitoring-map').length > 0) {
        drawMonitoringMap();
    }

    $('.monitoring-map-header-zoom').each(function() {
        $(this).data('zoom', 1);
        $(this).data('startWidth', $('.monitoring-map-inner svg').attr('width'));
        $(this).data('startHeight', $('.monitoring-map-inner svg').attr('height'));
    });

    $('.monitoring-map-header-zoom-inc').click(function() {
        var curZomm = $('.monitoring-map-header-zoom').data('zoom');
        curZomm++;
        if (curZomm == $('.monitoring-map-header-zoom').data('max')) {
            $('.monitoring-map-header-zoom-inc').addClass('disabled');
        }
        $('.monitoring-map-header-zoom').data('zoom', curZomm);
        $('.monitoring-map-header-zoom-dec').removeClass('disabled');
        var curWidth = $('.monitoring-map-header-zoom').data('startWidth') * curZomm;
        var curHeight = $('.monitoring-map-header-zoom').data('startHeight') * curZomm;
        $('.monitoring-map-inner svg').animate({'width': curWidth, 'height': curHeight, 'left': $('.monitoring-map-header-zoom').data('startWidth') / 2 - curWidth / 2, 'top': $('.monitoring-map-header-zoom').data('startHeight') / 2 - curHeight / 2});
    });

    $('.monitoring-map-header-zoom-dec').click(function() {
        var curZomm = $('.monitoring-map-header-zoom').data('zoom');
        curZomm--;
        if (curZomm == 1) {
            $('.monitoring-map-header-zoom-dec').addClass('disabled');
        }
        $('.monitoring-map-header-zoom').data('zoom', curZomm);
        $('.monitoring-map-header-zoom-inc').removeClass('disabled');
        var curWidth = $('.monitoring-map-header-zoom').data('startWidth') * curZomm;
        var curHeight = $('.monitoring-map-header-zoom').data('startHeight') * curZomm;
        $('.monitoring-map-inner svg').animate({'width': curWidth, 'height': curHeight, 'left': $('.monitoring-map-header-zoom').data('startWidth') / 2 - curWidth / 2, 'top': $('.monitoring-map-header-zoom').data('startHeight') / 2 - curHeight / 2});
    });

    var mapDrag = false;
    var mapMove = false;
    var mapMoveTimer = null;
    var mapStartX = 0;
    var mapStartY = 0;

    $('.monitoring-map-inner').on('mousedown', function(e) {
        mapDrag = true;
        mapStartX = e.pageX;
        mapStartY = e.pageY;
    });

    $('.monitoring-map-inner').on('mousemove', function(e) {
        if (mapDrag) {
            mapMove = true;
            var curLeft = Number($('.monitoring-map-inner svg').css('left').replace(/px/, ''));
            var curTop = Number($('.monitoring-map-inner svg').css('top').replace(/px/, ''));
            var curDiffX = e.pageX;
            var curDiffY = e.pageY;
            curDiffX = curDiffX - mapStartX;
            curDiffY = curDiffY - mapStartY;
            curLeft += curDiffX;
            curTop += curDiffY;
            mapStartX = e.pageX;
            mapStartY = e.pageY;
            $('.monitoring-map-inner svg').css({'left': curLeft, 'top': curTop});
        }
    });

    $(document).on('mouseup', function(e) {
        mapDrag = false;
        if (mapMove) {
            window.clearTimeout(mapMoveTimer);
            mapMoveTimer = null;
            mapMoveTimer = window.setTimeout(function() {
                mapMove = false;
            }, 100);
        }
    });

    function drawMonitoringMap() {
        var curYear = $('.monitoring-map-header-year-current span').html();

        var newMap = '';
        for (var i = 0; i < russiaRegions.length; i++) {
            newMap += '<g class="monitoring-map-region" data-id="' + russiaRegions[i].id + '" data-title="' + russiaRegions[i].title + '">' + russiaRegions[i].svg + '</g>';
        }
        $('.monitoring-map-inner svg').html(newMap);
        $('.monitoring-map-list').html('');

        for (var i = 0; i < russiaDistricts.length; i++) {
            var disctrictID = russiaDistricts[i].id;
            var newHTML = '<table><thead><tr><th colspan="2">' + russiaDistricts[i].title + '</th></tr></thead><tbody>';
            for (var j = 0; j < face2dataDistricts.length; j++) {
                if (curYear == face2dataDistricts[j].year) {
                    var curType = face2dataDistricts[j].type;
                    var curData = face2dataDistricts[j].data;
                    for (var k = 0; k < curData.length; k++) {
                        if (curData[k].district == disctrictID) {
                            var curValue = parseInt(curData[k].value.replace(/ /g, ''));
                            var curValue100 = parseFloat(curData[k].value100.replace(/ /g, '').replace(/,/g, '.'));
                            newHTML += '<tr><td>Число научных статей ' + curType + ', ед.</td><td>' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</td></tr>';
                            newHTML += '<tr><td>Число научных статей на 100 исследователей ' + curType + ', ед.</td><td>' + String(curValue100).replace(/\./g, ',') + '</td></tr>';
                        }
                    }
                }
            }
            newHTML += '</tbody></table>';
            $('.monitoring-map-list').append(newHTML);
        }
    }

    $('body').on('mouseenter', '.monitoring-map-region', function(e) {
        $('.monitoring-map-region-hint').remove();
        $('body').append('<div class="monitoring-map-region-hint">' + $(this).attr('data-title') + '</div>');
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
    });

    $('body').on('mousemove', '.monitoring-map-region', function(e) {
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
    });

    $('body').on('mouseleave', '.monitoring-map-region', function(e) {
        $('.monitoring-map-region-hint').remove();
    });

    $('body').on('click', '.monitoring-map-region', function(e) {
        if (!mapMove) {
            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var windowData = null;

            var regionID = $(this).attr('data-id');
            for (var i = 0; i < face2dataRegions.length; i++) {
                if (face2dataRegions[i].id == regionID) {
                    windowData = face2dataRegions[i].values;
                }
            }

            var curYear = $('.monitoring-map-header-year-current span').html();

            var newHTML = '<div class="monitoring-map-list-window"><table><thead><tr><th colspan="2">' + $(this).attr('data-title') + '</th></tr></thead><tbody>';
            if (windowData != null) {

                for (var i = 0; i < windowData.length; i++) {
                    var curType = windowData[i].type;
                    var curData = windowData[i].data;
                    for (var j = 0; j < curData.length; j++) {
                        if (curYear == curData[j].year) {
                            var curValue = parseInt(curData[j].value.replace(/ /g, ''));
                            var curValue100 = parseFloat(curData[j].value100.replace(/ /g, '').replace(/,/g, '.'));
                            newHTML += '<tr><td>Число научных статей ' + curType + ', ед.</td><td>' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</td></tr>';
                            newHTML += '<tr><td>Число научных статей на 100 исследователей ' + curType + ', ед.</td><td>' + String(curValue100).replace(/\./g, ',') + '</td></tr>';
                        }
                    }
                }
                newHTML += '</tbody></table></div>';

            }

            $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + newHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }
    });

    $('.monitoring-by-types-wrap').mCustomScrollbar({
        axis: 'x'
    });

});

$(window).on('load resize', function() {
    if ($(window).width() > 1139) {
        $('.monitoring-menu ul').each(function() {
            var curList = $(this);
            if (curList.hasClass('slick-slider')) {
                curList.slick('unslick');
                curList.find('li:gt(0)').before(' ');
            }
        });

        $('.monitoring-map-inner svg').attr('width', $('.monitoring-map-inner svg').attr('data-desktopwidth'));
        $('.monitoring-map-inner svg').attr('height', $('.monitoring-map-inner svg').attr('data-desktopheight'));
    } else {
        $('.monitoring-menu ul').each(function() {
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

        $('.monitoring-map-inner svg').attr('width', $('.monitoring-map-inner svg').attr('data-mobilewidth'));
        $('.monitoring-map-inner svg').attr('height', $('.monitoring-map-inner svg').attr('data-mobileheight'));
    }

    $('.monitoring-map-header-zoom').each(function() {
        $(this).data('zoom', 1);
        $(this).data('startWidth', $('.monitoring-map-inner svg').attr('width'));
        $(this).data('startHeight', $('.monitoring-map-inner svg').attr('height'));
    });
    var curZomm = $('.monitoring-map-header-zoom').data('zoom');
    var curWidth = $('.monitoring-map-header-zoom').data('startWidth') * curZomm;
    var curHeight = $('.monitoring-map-header-zoom').data('startHeight') * curZomm;
    $('.monitoring-map-inner svg').animate({'width': curWidth, 'height': curHeight, 'left': $('.monitoring-map-header-zoom').data('startWidth') / 2 - curWidth / 2, 'top': $('.monitoring-map-header-zoom').data('startHeight') / 2 - curHeight / 2});
    $('.monitoring-map-header-zoom-inc').removeClass('disabled');
    $('.monitoring-map-header-zoom-dec').addClass('disabled');
});