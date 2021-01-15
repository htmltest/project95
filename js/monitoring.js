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

        var nullNotice = false;
        for (var i = 0; i < russiaDistricts.length; i++) {
            var disctrictID = russiaDistricts[i].id;
            var newHTML = '<table><thead><tr><th colspan="2">' + russiaDistricts[i].title + '</th></tr></thead><tbody>';
            for (var j = 0; j < russiaDataDistricts.length; j++) {
                if (curYear == russiaDataDistricts[j].year) {
                    var curType = russiaDataDistricts[j].type;
                    var curData = russiaDataDistricts[j].data;
                    for (var k = 0; k < curData.length; k++) {
                        if (curData[k].district == disctrictID) {
                            var curDistrictData = curData[k].data;
                            for (var m = 0; m < curDistrictData.length; m++) {
                                var curValueType = russiaDataTypes[m];
                                switch(curValueType.type) {
                                    case 'integer':
                                        if (curDistrictData[m] !== null) {
                                            var curValue = parseInt(curDistrictData[m].replace(/ /g, ''));
                                            newHTML += '<tr><td>' + curValueType.title + '</td><td>' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</td></tr>';
                                        } else {
                                            nullNotice = true;
                                            newHTML += '<tr><td>' + curValueType.title + '</td><td>' + russiaDataNull.value + '<span>*</span></td></tr>';
                                        }
                                        break;
                                    case 'float':
                                        if (curDistrictData[m] !== null) {
                                            var curValue = parseFloat(curDistrictData[m].replace(/ /g, '').replace(/,/g, '.'));
                                            newHTML += '<tr><td>' + curValueType.title + '</td><td>' + String(curValue).replace(/\./g, ',') + '</td></tr>';
                                        } else {
                                            nullNotice = true;
                                            newHTML += '<tr><td>' + curValueType.title + '</td><td>' + russiaDataNull.value + '<span>*</span></td></tr>';
                                        }
                                        break;
                                    default:
                                        if (curDistrictData[m] !== null) {
                                            newHTML += '<tr><td>' + curValueType.title + '</td><td>' + curDistrictData[m] + '</td></tr>';
                                        } else {
                                            nullNotice = true;
                                            newHTML += '<tr><td>' + curValueType.title + '</td><td>' + russiaDataNull.value + '<span>*</span></td></tr>';
                                        }
                                }
                            }
                        }
                    }
                }
            }
            newHTML += '</tbody></table>';
            $('.monitoring-map-list').append(newHTML);
        }

        if (nullNotice) {
            $('.monitoring-map-list').append('<div class="monitoring-map-list-notice"><span>*</span>' + russiaDataNull.notice + '</div>');
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
            for (var i = 0; i < russiaDataRegions.length; i++) {
                if (russiaDataRegions[i].id == regionID) {
                    windowData = russiaDataRegions[i].values;
                }
            }

            var curYear = $('.monitoring-map-header-year-current span').html();

            var newHTML = '<div class="monitoring-map-list-window"><table><thead><tr><th colspan="2">' + $(this).attr('data-title') + '</th></tr></thead><tbody>';
            if (windowData != null) {

                var nullNotice = false;
                for (var i = 0; i < windowData.length; i++) {
                    if (curYear == windowData[i].year) {
                        var curRegionData = windowData[i].data;
                        for (var m = 0; m < curRegionData.length; m++) {
                            var curValueType = russiaDataTypes[m];
                            switch(curValueType.type) {
                                case 'integer':
                                    if (curRegionData[m] !== null) {
                                        var curValue = parseInt(curRegionData[m].replace(/ /g, ''));
                                        newHTML += '<tr><td>' + curValueType.title + '</td><td>' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</td></tr>';
                                    } else {
                                        nullNotice = true;
                                        newHTML += '<tr><td>' + curValueType.title + '</td><td>' + russiaDataNull.value + '<span>*</span></td></tr>';
                                    }
                                    break;
                                case 'float':
                                    if (curRegionData[m] !== null) {
                                        var curValue = parseFloat(curRegionData[m].replace(/ /g, '').replace(/,/g, '.'));
                                        newHTML += '<tr><td>' + curValueType.title + '</td><td>' + String(curValue).replace(/\./g, ',') + '</td></tr>';
                                    } else {
                                        nullNotice = true;
                                        newHTML += '<tr><td>' + curValueType.title + '</td><td>' + russiaDataNull.value + '<span>*</span></td></tr>';
                                    }
                                    break;
                                default:
                                    if (curRegionData[m] !== null) {
                                        newHTML += '<tr><td>' + curValueType.title + '</td><td>' + curRegionData[m] + '</td></tr>';
                                    } else {
                                        nullNotice = true;
                                        newHTML += '<tr><td>' + curValueType.title + '</td><td>' + russiaDataNull.value + '<span>*</span></td></tr>';
                                    }
                            }
                        }
                    }
                }
                newHTML += '</tbody></table>';

                if (nullNotice) {
                    newHTML += '<div class="monitoring-map-list-notice"><span>*</span>' + russiaDataNull.notice + '</div>';
                }

                newHTML += '</div>';

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

$(document).ready(function() {

    $('.monitoring-regions-filter-link').click(function(e) {
        $('html').toggleClass('monitoring-regions-filter-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.monitoring-regions-filter').length == 0) {
            $('html').removeClass('monitoring-regions-filter-open');
        }
    });

    $('.monitoring-regions-filter').each(function() {
        var newHTML = '';

        for (var i = 0; i < opendataDistricts.length; i++) {
            newHTML +=  '<div class="monitoring-regions-filter-group">';
            newHTML +=      '<div class="monitoring-regions-filter-group-header">' + opendataDistricts[i].title + '</div>';
            newHTML +=      '<div class="monitoring-regions-filter-group-container">';
            newHTML +=          '<div class="monitoring-regions-filter-group-container-col">';
            var count = 0;
            for (var j = 0; j < opendataRegions.length; j++) {
                if (opendataRegions[j].district == opendataDistricts[i].id) {
                    count++;
                }
            }
            var current = 0;
            for (var j = 0; j < opendataRegions.length; j++) {
                if (opendataRegions[j].district == opendataDistricts[i].id) {
                    if (current >= Math.round(count / 2)) {
                        newHTML +=  '</div>';
                        newHTML +=  '<div class="monitoring-regions-filter-group-container-col">';
                    }
                    newHTML +=      '<div class="monitoring-regions-filter-group-item" data-id="' + opendataRegions[j].id + '">' + opendataRegions[j].title + '</div>';
                    current++;
                }
            }
            newHTML +=          '</div>';
            newHTML +=      '</div>';
            newHTML +=  '</div>';
        }

        $('.monitoring-regions-filter-list').html(newHTML);
    });

    $('body').on('click', '.monitoring-regions-filter-group-header', function() {
        $(this).parent().toggleClass('open');
    });

    $('body').on('click', '.monitoring-regions-filter-group-item', function() {
        var curItem = $(this);
        if (!curItem.hasClass('active')) {
            $('.monitoring-regions-filter-group-item.active').removeClass('active');
            curItem.addClass('active');
            $('.monitoring-regions-filter-current-value span').html(curItem.html());
            $('.monitoring-regions-filter-current').addClass('visible');
            $('.monitoring-regions-data').addClass('loading');
            $.ajax({
                type: 'POST',
                url: $('.monitoring-regions-filter').attr('data-url'),
                dataType: 'html',
                data: 'id=' + curItem.attr('data-id'),
                cache: false
            }).done(function(html) {
                $('.monitoring-regions-data').html(html);

                for (var i = 0; i < $('.monitoring-regions-data-headers-year').length; i++) {
                    $('.monitoring-regions-data-scroll-inner').append('<div class="monitoring-regions-data-scroll-item">&nbsp;</div>');
                }
                $('.monitoring-regions-data-scroll').mCustomScrollbar({
                    axis: 'x',
                    callbacks: {
                        onInit: function() {
                            $('.monitoring-regions-data-headers-years-inner, .monitoring-regions-data-row-item-values-inner').css({'left': 0});
                        },
                        whileScrolling: function() {
                            $('.monitoring-regions-data-headers-years-inner, .monitoring-regions-data-row-item-values-inner').css({'left': this.mcs.left});
                        }
                    }
                });

                $(window).trigger('resize');

                $('.monitoring-regions-data').removeClass('loading');
            });
        } else {
            curItem.removeClass('active');
            $('.monitoring-regions-filter-current').removeClass('visible');
            $('.monitoring-regions-data').html('');
            $('.monitoring-regions-data').removeClass('loading');
        }
        $('html').removeClass('monitoring-regions-filter-open');
    });

    $('.monitoring-regions-filter-search input').attr('autocomplete', 'off');
    $('.monitoring-regions-filter-search input').on('keyup', function() {
        var curValue = $(this).val().toLowerCase();
        $('.monitoring-regions-filter-group-item').each(function() {
            var curItem = $(this);
            if (curItem.html().toLowerCase().indexOf(curValue) == -1) {
                curItem.addClass('hidden');
            } else {
                curItem.removeClass('hidden');
            }
        });
        $('.monitoring-regions-filter-group').each(function() {
            var curGroup = $(this);
            if (curGroup.find('.monitoring-regions-filter-group-item').length == curGroup.find('.monitoring-regions-filter-group-item.hidden').length) {
                curGroup.addClass('hidden');
            } else {
                curGroup.removeClass('hidden');
            }
        });
    });

    $('.monitoring-regions-filter-current-value a').click(function(e) {
        $('.monitoring-regions-filter-group-item.active').trigger('click');
        e.preventDefault();
    });

    $('.monitoring-regions-filter-map-link').click(function(e) {
        $('html').addClass('window-open');

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        var newHTML =   '<div class="monitoring-regions-window">' +
                            '<div class="window-region-title">Выбор региона<span>Показатели НТР</span></div>' +
                            '<div class="monitoring-regions-window-container">' +
                                '<div class="monitoring-regions-window-map">' +
                                    '<div class="monitoring-regions-window-map-container">' +
                                        '<div class="monitoring-regions-window-map-wrapper"> ' +
                                            '<div class="monitoring-regions-window-map-inner">' +
                                                '<svg width="777" height="442" viewBox="0 0 1107.77 630.12" fill="none" xmlns="http://www.w3.org/2000/svg">';

        for (var i = 0; i < opendataRegions.length; i++) {
            var curRegion = opendataRegions[i];
            newHTML +=                              '<g data-id="' + curRegion.id + '" data-title="' + curRegion.title + '">' + curRegion.svg + '</g>';
        }

        newHTML +=                              '</svg>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="monitoring-regions-window-map-zoom" data-max="4">' +
                                        '<div class="monitoring-regions-window-map-zoom-inc">+</div>' +
                                        '<div class="monitoring-regions-window-map-zoom-dec disabled">-</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

        $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + newHTML + '<a href="#" class="window-close"></a></div></div>')

        $('.window-container').removeClass('window-container-load');
        windowPosition();

        $('.monitoring-regions-window-map-zoom').each(function() {
            $(this).data('zoom', 1);
            $(this).data('startWidth', $('.monitoring-regions-window-map-inner svg').attr('width'));
            $(this).data('startHeight', $('.monitoring-regions-window-map-inner svg').attr('height'));
        });

        e.preventDefault();
    });

    var mapClick = 0;
    $('body').on('click', '.monitoring-regions-window-map-inner g', function(e) {
        if (performance.now() - mapClick < 500) {
            $('.monitoring-regions-filter-group-item[data-id="' + $(this).attr('data-id') + '"]').trigger('click');
            $('.monitoring-map-region-hint').remove();
            windowClose();
        }
        e.preventDefault();
    });

    $('body').on('click', '.monitoring-regions-data-group-header', function() {
        $(this).parent().toggleClass('open');
    });

    $('body').on('click', '.monitoring-regions-window-map-zoom-inc', function() {
        var curZomm = $('.monitoring-regions-window-map-zoom').data('zoom');
        curZomm++;
        if (curZomm == $('.monitoring-regions-window-map-zoom').data('max')) {
            $('.monitoring-regions-window-map-zoom-inc').addClass('disabled');
        }
        $('.monitoring-regions-window-map-zoom').data('zoom', curZomm);
        $('.monitoring-regions-window-map-zoom-dec').removeClass('disabled');
        var curWidth = $('.monitoring-regions-window-map-zoom').data('startWidth') * curZomm;
        var curHeight = $('.monitoring-regions-window-map-zoom').data('startHeight') * curZomm;
        $('.monitoring-regions-window-map-inner svg').animate({'width': curWidth, 'height': curHeight, 'left': $('.monitoring-regions-window-map-zoom').data('startWidth') / 2 - curWidth / 2, 'top': $('.monitoring-regions-window-map-zoom').data('startHeight') / 2 - curHeight / 2});
    });

    $('body').on('click', '.monitoring-regions-window-map-zoom-dec', function() {
        var curZomm = $('.monitoring-regions-window-map-zoom').data('zoom');
        curZomm--;
        if (curZomm == 1) {
            $('.monitoring-regions-window-map-zoom-dec').addClass('disabled');
        }
        $('.monitoring-regions-window-map-zoom').data('zoom', curZomm);
        $('.monitoring-regions-window-map-zoom-inc').removeClass('disabled');
        var curWidth = $('.monitoring-regions-window-map-zoom').data('startWidth') * curZomm;
        var curHeight = $('.monitoring-regions-window-map-zoom').data('startHeight') * curZomm;
        $('.monitoring-regions-window-map-inner svg').animate({'width': curWidth, 'height': curHeight, 'left': $('.monitoring-regions-window-map-zoom').data('startWidth') / 2 - curWidth / 2, 'top': $('.monitoring-regions-window-map-zoom').data('startHeight') / 2 - curHeight / 2});
    });

    var mapDrag = false;
    var mapMove = false;
    var mapMoveTimer = null;
    var mapStartX = 0;
    var mapStartY = 0;

    $('body').on('mousedown', '.monitoring-regions-window-map-inner', function(e) {
        mapDrag = true;
        mapStartX = e.pageX;
        mapStartY = e.pageY;
    });

    $('body').on('mousemove', '.monitoring-regions-window-map-inner', function(e) {
        if (mapDrag) {
            mapMove = true;
            var curLeft = Number($('.monitoring-regions-window-map-inner svg').css('left').replace(/px/, ''));
            var curTop = Number($('.monitoring-regions-window-map-inner svg').css('top').replace(/px/, ''));
            var curDiffX = e.pageX;
            var curDiffY = e.pageY;
            curDiffX = curDiffX - mapStartX;
            curDiffY = curDiffY - mapStartY;
            curLeft += curDiffX;
            curTop += curDiffY;
            mapStartX = e.pageX;
            mapStartY = e.pageY;
            $('.monitoring-regions-window-map-inner svg').css({'left': curLeft, 'top': curTop});
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

    $('body').on('mouseenter', '.monitoring-regions-window-map-inner g', function(e) {
        mapClick = performance.now();
        $('.monitoring-map-region-hint').remove();
        $('body').append('<div class="monitoring-map-region-hint">' + $(this).attr('data-title') + '</div>');
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.monitoring-regions-window-map-region-hint').css({'left': curLeft, 'top': curTop});
    });

    $('body').on('mousemove', '.monitoring-regions-window-map-inner g', function(e) {
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
    });

    $('body').on('mouseleave', '.monitoring-regions-window-map-inner g', function(e) {
        $('.monitoring-map-region-hint').remove();
    });

});

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    $('.monitoring-regions-data-scroll .mCSB_scrollTools').each(function() {
        var curTools = $(this);
        var curBlock = curTools.parent();
        if (windowScroll + windowHeight > $('.monitoring-regions-data').offset().top && windowScroll + windowHeight < curBlock.offset().top) {
            curTools.css({'position': 'fixed', 'z-index': 2, 'left': curBlock.offset().left, 'bottom': 20, 'right': 'auto', 'width': curBlock.width()});
        } else {
            curTools.css({'position': 'absolute', 'left': 0, 'bottom': 0, 'right': 0, 'width': 'auto'});
        }
    });

    $('.monitoring-regions-data-headers-wrapper').each(function() {
        if (windowScroll >= $(this).offset().top) {
            $('.monitoring-regions-data-headers-wrapper').addClass('fixed');
        } else {
            $('.monitoring-regions-data-headers-wrapper').removeClass('fixed');
        }
    });

});