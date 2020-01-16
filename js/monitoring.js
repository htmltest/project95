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
            face2Redraw();
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
                x: -70,
                y: 10,
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

        var face1Labels = [];
        var face1DataActually = [];
        var face1DataForecast = [];

        for (var i = 0; i < face1data.length; i++) {
            var curYear = face1data[i];
            face1Labels.push(curYear.year);

            var curRates = curYear.rates;
            var curPlaceMin = null;
            for (var j = 0; j < curRates.length; j++) {
                var curRate = curRates[j];
                if (curRate.type == 'forecast') {
                    face1DataForecast.push(curRate.place);
                } else {
                    var curPlace = 0;
                    var hasRussia = false;
                    if (curRate.data != null) {
                        for (var k = 0; k < curRate.data.length; k++) {
                            if (!hasRussia) {
                                curPlace++;
                            }
                            if (curRate.data[k].title == 'Россия') {
                                hasRussia = true;
                            }
                        }
                        if (curPlaceMin == null || curPlaceMin > curPlace) {
                            curPlaceMin = curPlace;
                        }
                    }
                }
            }
            if (curPlaceMin !== null) {
                face1DataActually.push({"year": curYear.year, "place": curPlaceMin});
            } else {
                face1DataActually.push(null);
            }
        }

        $('.face-1-chart').width(face1Labels.length * 79 - 37);

        var minPlace = 9999;
        var maxPlace = 0;
        var curScroll = 0;

        for (var i = 0; i < face1DataActually.length; i++) {
            if (face1DataActually[i] != null) {
                if (face1DataActually[i].place < minPlace) {
                    minPlace = face1DataActually[i].place;
                }
                if (face1DataActually[i].place > maxPlace) {
                    maxPlace = face1DataActually[i].place;
                }
            }
        }

        for (var i = 0; i < face1DataForecast.length; i++) {
            if (face1DataForecast[i] != null) {
                if (face1DataForecast[i] < minPlace) {
                    minPlace = face1DataForecast[i];
                }
                if (face1DataForecast[i] > maxPlace) {
                    maxPlace = face1DataForecast[i];
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

        for (var i = 0; i < face1DataActually.length; i++) {
            if (face1DataActually[i] != null) {
                var curX = (i * 79);
                curScroll = curX;
                var curY = ((face1DataActually[i].place - minPlace) / (maxPlace - minPlace)) * $('.face-1-chart-graph').height();
                if (face1DataActually[i - 1] != null) {
                    var prevX = ((i - 1) * 79);
                    var prevY = ((face1DataActually[i - 1].place - minPlace) / (maxPlace - minPlace)) * $('.face-1-chart-graph').height();
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    $('.face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
                }
                $('.face-1-chart-graph').append('<div class="face-1-chart-point active" data-year="' + face1DataActually[i].year + '" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong><em>' + face1DataActually[i].place + '</em></strong><em>место</em></span></div>');
            }
        }

        for (var i = 0; i < face1DataForecast.length; i++) {
            if (face1DataForecast[i] != null) {
                var curX = (i * 79);
                var curY = ((face1DataForecast[i] - minPlace) / (maxPlace - minPlace)) * $('.face-1-chart-graph').height();
                if (face1DataForecast[i - 1] != null) {
                    var prevX = ((i - 1) * 79);
                    var prevY = ((face1DataForecast[i - 1] - minPlace) / (maxPlace - minPlace)) * $('.face-1-chart-graph').height();
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    $('.face-1-chart-graph').append('<div class="face-1-chart-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
                }
                $('.face-1-chart-graph').append('<div class="face-1-chart-point" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + face1DataForecast[i] + '</strong>место</span></div>');
            }
        }

        for (var i = 0; i < face1Labels.length; i++) {
            if (face1DataActually[i] != null) {
                $('.face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * 79) + 'px"><a href="#" data-year="' + face1Labels[i] + '">' + face1Labels[i] + '</a></div>');
            } else {
                $('.face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * 79) + 'px"><span>' + face1Labels[i] + '</span></div>');
            }
        }

        $('.face-1-container').mCustomScrollbar({
            axis: 'x',
            setLeft: '-' + (curScroll - $('.face-1-container').width() / 2) + 'px',
            scrollButtons: {
                enable: true
            }
        });

        $('body').on('click', '.face-1-chart-year a, .face-1-chart-point.active', function(e) {
            var curLi = $(this);
            var curYear = $(this).attr('data-year');

            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var windowData = null;
            var windowType = '';

            for (var i = 0; i < face1data.length; i++) {
                var dataItem = face1data[i];
                if (dataItem.year == curYear) {

                    var curRates = dataItem.rates;
                    var curPlaceMin = null;
                    for (var j = 0; j < curRates.length; j++) {
                        var curRate = curRates[j];
                        if (curRate.type != 'forecast') {
                            var curPlace = 0;
                            var hasRussia = false;
                            if (curRate.data != null) {
                                for (var k = 0; k < curRate.data.length; k++) {
                                    if (!hasRussia) {
                                        curPlace++;
                                    }
                                    if (curRate.data[k].title == 'Россия') {
                                        hasRussia = true;
                                    }
                                }
                                if (curPlaceMin == null || curPlaceMin > curPlace) {
                                    curPlaceMin = curPlace;
                                    windowType = curRate.type;
                                    windowData = curRate.data;
                                }
                            }
                        }
                    }
                }
            }

            var newHTML = '';
            if (windowData != null) {
                var maxWidthLine = 240;
                if ($(window).width() < 1140) {
                    maxWidthLine = 107;
                }

                var maxValue = 0;
                for (var i = 0; i < windowData.length; i++) {
                    var curValue = Math.round(parseFloat(windowData[i].value.replace(/,/, '.')));
                    if (maxValue < curValue) {
                        maxValue = curValue;
                    }
                }

                var count = 0;
                var hasRussia = false;

                for (var i = 0; i < windowData.length; i++) {
                    var curItem = windowData[i];
                    var curValue = Math.round(parseFloat(curItem.value.replace(/,/, '.')));
                    var curWidth = curValue / maxValue * maxWidthLine + 1;
                    count++;
                    if (curItem.title == 'Россия') {
                        hasRussia = true;
                        if (count > 10) {
                            newHTML += '<div class="face-4-item-sep"></div>';
                        }
                    }
                    if (count < 11 || curItem.title == 'Россия') {
                        var flag = '';
                        for (var j = 0; j < cubeFlags.length; j++) {
                            if (cubeFlags[j].country == curItem.title) {
                                flag = cubeFlags[j].image;
                            }
                        }

                        if (count < 11 && curItem.title == 'Россия') {
                            newHTML += '<div class="face-4-item-rus"><div class="face-4-item-rus-inner">';
                        }

                        newHTML += '<div class="face-4-item">' +
                                        '<div class="face-4-item-flag"><img src="' + flag + '" alt="" /></div>' +
                                        '<div class="face-4-item-title">' + count + '. ' + curItem.title + '</div>' +
                                        '<div class="face-4-item-line"><div class="face-4-item-line-inner" style="width:' + curWidth + 'px"></div></div>' +
                                        '<div class="face-4-item-value">' + String(curItem.value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                   '</div>';

                       if (count < 11 && curItem.title == 'Россия') {
                            newHTML += '</div></div>';
                        }
                    }
                }

            }

            var windowHTML   =  '<div class="window-face1">';
            windowHTML      +=      '<div class="window-face1-title">Топ-10 стран по количеству статей за ' + curYear + ' год, ед.</div>';
            windowHTML      +=      '<div class="window-face1-subtitle">По данным ' + windowType + '</div>';
            windowHTML      +=      '<div class="window-face1-list">' + newHTML + '</div>';
            windowHTML      +=      '<div class="window-face1-btn">' + $('.cube-face-footer').html() + '</div>';
            windowHTML      +=  '</div>';

            $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();

            e.preventDefault();
        });

        $('body').on('click', '.face-2-type a', function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-2-type li.active').removeClass('active');
                curLi.addClass('active');
                face2Redraw();
            }
            e.preventDefault();
        });

        $('body').on('click', '.map-russia-district', function(e) {
            if ($('.map-window').length == 0) {
                $('body').append('<div class="map-window"><div class="map-window-inner">' +
                                        '<div class="map-window-title"></div>' +
                                        '<div class="map-window-info">' +
                                            '<div class="map-window-info-item">' +
                                                '<div class="map-window-info-item-title">Число<br /> статей</div>' +
                                                '<div class="map-window-info-item-value map-window-info-item-value-1"></div>' +
                                            '</div>' +
                                            '<div class="map-window-info-item">' +
                                                '<div class="map-window-info-item-title">Число статей на 100<br /> исследователей</div>' +
                                                '<div class="map-window-info-item-value map-window-info-item-value-2"></div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="map-window-info-chart-title">Фактическое и прогнозное<br /> число статей, ед.</div>' +
                                        '<div class="map-window-info-chart"></div>' +
                                        '<div class="map-window-info-link"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                        '<div class="map-window-close"></div>' +
                                     '</div></div>');
            }
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.map-window').css({'left': curLeft, 'top': curTop});
            $('.map-window').removeClass('map-window-region');
            var districtID = $(this).attr('data-id');
            var districtTitle = '';
            for (var i = 0; i < russiaDistricts.length; i++) {
                if (russiaDistricts[i].id == districtID) {
                    districtTitle = russiaDistricts[i].title;
                }
            }
            $('.map-window-title').html(districtTitle + ' федеральный округ');
            $('.map-window-info-link a').attr('data-id', districtID);
            $('.map-window-info-chart').html('');

            var curType = $('.face-2-type li.active').attr('data-type');
            var curYear = $('.face-2-year').html();

            var curMax = 0;

            for (var i = 0; i < face2dataDistricts.length; i++) {
                if (face2dataDistricts[i].type == curType) {
                    var curData = face2dataDistricts[i].data;
                    for (var j = 0; j < curData.length; j++) {
                        if (curData[j].district == districtID) {
                            var curValue = parseInt(curData[j].value.replace(/ /g, ''));
                            if (typeof (curData[j].value100) != 'undefined') {
                                var curValue100 = parseFloat(curData[j].value100.replace(/ /g, '').replace(/,/g, '.'));
                            } else {
                                var curValue100 = 0;
                            }
                            if (face2dataDistricts[i].year == curYear) {
                                $('.map-window-info-item-value-1').html(String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
                                $('.map-window-info-item-value-2').html(String(curValue100).replace(/\./g, ','));
                            }
                            var predictClass = '';
                            if (typeof (face2dataDistricts[i].predict) != 'undefined' && face2dataDistricts[i].predict) {
                                predictClass = 'map-window-info-chart-item-predict';
                            }
                            if (curMax < curValue) {
                                curMax = curValue;
                            }
                            $('.map-window-info-chart').append('<div class="map-window-info-chart-item ' + predictClass + '">' +
                                                                    '<div class="map-window-info-chart-item-value">' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                                                    '<div class="map-window-info-chart-item-bar"></div>' +
                                                                    '<div class="map-window-info-chart-item-year">' + face2dataDistricts[i].year + '</div>' +
                                                               '</div>');
                        }
                    }
                }
            }
            $('.map-window-info-chart-item').each(function() {
                var curItem = $(this);
                curItem.find('.map-window-info-chart-item-bar').css({'height': parseInt(curItem.find('.map-window-info-chart-item-value').html().replace(/ /g, '')) / curMax * 108 + 'px'});
            });

            var newWidth = $('.map-window-info-chart-item').length * 56 + 30;
            if (newWidth < 350) {
                newWidth = 350;
            }
            $('.map-window').css({'width': newWidth, 'margin-left': -newWidth / 2});

            $('.map-window').show();
            $('html').addClass('map-window-opened');
        });

        $('body').on('click', '.map-window-close', function() {
            $('.map-window').hide();
            $('html').removeClass('map-window-opened');
        });

        $('body').on('click', '.map-region-item', function(e) {
            if ($('.map-window').length == 0) {
                $('body').append('<div class="map-window"><div class="map-window-inner">' +
                                        '<div class="map-window-title"></div>' +
                                        '<div class="map-window-info">' +
                                            '<div class="map-window-info-item">' +
                                                '<div class="map-window-info-item-title">Число<br /> статей</div>' +
                                                '<div class="map-window-info-item-value map-window-info-item-value-1"></div>' +
                                            '</div>' +
                                            '<div class="map-window-info-item">' +
                                                '<div class="map-window-info-item-title">Число статей на 100<br /> исследователей</div>' +
                                                '<div class="map-window-info-item-value map-window-info-item-value-2"></div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="map-window-info-chart-title">Фактическое и прогнозное<br /> число статей, ед.</div>' +
                                        '<div class="map-window-info-chart"></div>' +
                                        '<div class="map-window-info-link"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                        '<div class="map-window-close"></div>' +
                                     '</div></div>');
            }
            var curLeft = e.pageX;
            var curTop = e.pageY;
            if (curLeft === undefined) {
                curLeft = $(this).offset().left;
            }
            if (curTop === undefined) {
                curTop = $(this).offset().top;
            }
            $('.map-window').css({'left': curLeft, 'top': curTop});
            $('.map-window').addClass('map-window-region');
            var regionID = $(this).attr('data-id');
            var regionTitle = '';
            for (var i = 0; i < russiaRegions.length; i++) {
                if (russiaRegions[i].id == regionID) {
                    regionTitle = russiaRegions[i].title;
                }
            }
            $('.map-window-title').html(regionTitle);
            $('.map-window-info-chart').html('');

            var curType = $('.face-2-type li.active').attr('data-type');
            var curYear = $('.face-2-year').html();

            var curMax = 0;

            for (var i = 0; i < face2dataRegions.length; i++) {
                if (face2dataRegions[i].id == regionID) {
                    var curData = face2dataRegions[i].values;
                    for (var j = 0; j < curData.length; j++) {
                        if (curData[j].type == curType) {
                            for (var k = 0; k < curData[j].data.length; k++) {
                                var curValues = curData[j].data[k];

                                var curValue = parseInt(curValues.value.replace(/ /g, ''));
                                if (typeof (curValues.value100) != 'undefined') {
                                    var curValue100 = parseFloat(curValues.value100.replace(/ /g, '').replace(/,/g, '.'));
                                } else {
                                    var curValue100 = 0;
                                }

                                if (curValues.year == curYear) {
                                    $('.map-window-info-item-value-1').html(String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
                                    $('.map-window-info-item-value-2').html(String(curValue100).replace(/\./g, ','));
                                }
                                var predictClass = '';
                                if (typeof (curValues.predict) != 'undefined' && curValues.predict) {
                                    predictClass = 'map-window-info-chart-item-predict';
                                }
                                if (curMax < curValue) {
                                    curMax = curValue;
                                }
                                $('.map-window-info-chart').append('<div class="map-window-info-chart-item ' + predictClass + '">' +
                                                                        '<div class="map-window-info-chart-item-value">' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                                                        '<div class="map-window-info-chart-item-bar"></div>' +
                                                                        '<div class="map-window-info-chart-item-year">' + curValues.year + '</div>' +
                                                                   '</div>');
                            }
                        }
                    }
                }
            }
            $('.map-window-info-chart-item').each(function() {
                var curItem = $(this);
                curItem.find('.map-window-info-chart-item-bar').css({'height': parseInt(curItem.find('.map-window-info-chart-item-value').html().replace(/ /g, '')) / curMax * 108 + 'px'});
            });

            var newWidth = $('.map-window-info-chart-item').length * 56 + 30;
            if (newWidth < 350) {
                newWidth = 350;
            }
            $('.map-window').css({'width': newWidth, 'margin-left': -newWidth / 2});

            $('.map-window').show();
            $('html').addClass('map-window-opened');
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.map-window').length == 0 && !$(e.target).hasClass('map-window') && $(e.target).parents().filter('.map-russia-district').length == 0 && $(e.target).parents().filter('.face-2-table-name-region').length == 0 && !$(e.target).hasClass('map-russia-district') && !$(e.target).hasClass('face-2-table-name-region') && $(e.target).parents().filter('.map-region-item').length == 0 && !$(e.target).hasClass('map-region-item')) {
                $('.map-window').hide();
                $('html').removeClass('map-window-opened');
            }
        });

        $('body').on('click', '.map-window-info-link a', function(e) {
            var curID = $(this).attr('data-id');
            $('.face-2-back').addClass('visible').attr('data-id', curID);
            $('.face-2-title-russia').css({'display': 'none'});
            $('.face-2-title-regions').css({'display': 'inline'});
            $('.map-window').hide();
            $('.map-russia').hide();
            $('html').removeClass('map-window-opened');
            $('.map-region[data-id="' + curID + '"]').show();
            var curType = $('.face-2-type li.active').attr('data-type');
            var curSort = $('.map-russia-sort-type-list li.active').attr('data-sortType');
            var curYear = $('.face-2-year').html();
            var curData = [];
            for (var i = 0; i < face2dataRegions.length; i++) {
                var curRegionID = face2dataRegions[i].id;
                var curDiscrictID = -1;
                for (var j = 0; j < russiaRegions.length; j++) {
                    if (curRegionID == russiaRegions[j].id && russiaRegions[j].district == curID) {
                        curDiscrictID = russiaRegions[j].district;
                    }
                }
                if (curDiscrictID > -1) {
                    for (var j = 0; j < face2dataRegions[i].values.length; j++) {
                        if (face2dataRegions[i].values[j].type == curType) {
                            for (var k = 0; k < face2dataRegions[i].values[j].data.length; k++) {
                                if (face2dataRegions[i].values[j].data[k].year == curYear) {
                                    curData.push({
                                                    'id'        : curRegionID,
                                                    'value'     : face2dataRegions[i].values[j].data[k].value,
                                                    'value100'  : face2dataRegions[i].values[j].data[k].value100
                                    });
                                }
                            }
                        }
                    }
                }
            }

            var activeValue = ' active';
            var activeValue100 = '';
            $('.face-2-table-head').eq(1).addClass('active');
            $('.face-2-table-head').eq(2).removeClass('active');

            if (curSort == 'value') {
                curData.sort(face2SortCount);
            } else {
                curData.sort(face2SortCount100);
                var activeValue = '';
                var activeValue100 = ' active';
                $('.face-2-table-head').eq(2).addClass('active');
                $('.face-2-table-head').eq(1).removeClass('active');
            }

            var newMap = '';
            $('.face-2-table-row').remove();
            for (var i = 0; i < curData.length; i++) {
                var regionID = curData[i].id;

                var curRatingsArray = [];
                for (var c = 0; c < mapColorsRegions.length; c++) {
                    if (curID == mapColorsRegions[c].id) {
                        if (curType == 'WoS') {
                            if (curSort == 'value') {
                                curRatingsArray = mapColorsRegions[c].WoS.value;
                            } else {
                                curRatingsArray = mapColorsRegions[c].WoS.value100;
                            }
                        } else {
                            if (curSort == 'value') {
                                curRatingsArray = mapColorsRegions[c].Scopus.value;
                            } else {
                                curRatingsArray = mapColorsRegions[c].Scopus.value100;
                            }
                        }
                    }
                }

                var curColorIndex = -1;
                var curValue = parseInt(curData[i].value.replace(/ /g, ''));
                if (curSort == 'value100') {
                    curValue = parseFloat(curData[i].value100.replace(/ /g, '').replace(/,/g, '.'));
                }
                for (var c = 0; c < curRatingsArray.length; c++) {
                    if (curValue >= curRatingsArray[c][0] && curValue < curRatingsArray[c][1]) {
                        curColorIndex = c;
                    }
                }

                if (curType == 'WoS') {
                    var curColor = mapColors[0][curColorIndex];
                } else {
                    var curColor = mapColors[1][curColorIndex];
                }

                newMap += '<g class="map-region-item" data-id="' + regionID + '">';
                for (var j = 0; j < russiaRegions.length; j++) {
                    var curRegion = russiaRegions[j];
                    if (curRegion.id == regionID) {
                        newMap += '<g style="fill:' + curColor + '">' + curRegion.svg + '</g>';
                    }
                }
                newMap += '</g>';
                var regionTitle = '';
                for (var j = 0; j < russiaRegions.length; j++) {
                    if (russiaRegions[j].id == regionID) {
                        regionTitle = russiaRegions[j].title;
                    }
                }
                $('.face-2-table').append('<div class="face-2-table-row">' +
                                            '<div class="face-2-table-name">' +
                                                '<a href="#" class="face-2-table-name-region" data-id="' + regionID + '">' +
                                                    '<div class="face-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                    regionTitle +
                                                '</a>' +
                                            '</div>' +
                                            '<div class="face-2-table-value' + activeValue + '">' + String(curData[i].value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                            '<div class="face-2-table-value' + activeValue100 + '">' + String(curData[i].value100).replace(/\./g, ',') + '</div>' +
                                          '</div>');
            }
            $('.map-region[data-id="' + curID + '"] svg').html(newMap);
            $('.cube').css({'margin-bottom': $('.cube-face').eq(1).find('.cube-face-footer').outerHeight()});
            e.preventDefault();
        });

        $('body').on('click', '.face-2-table-name-region', function(e) {
            var curID = $(this).attr('data-id');
            $('.map-region-item[data-id="' + curID + '"]').trigger('click');
            $('html, body').animate({'scrollTop': $('.map-region .map-region-item[data-id="' + curID + '"]').offset().top});
            e.preventDefault();
        });

        $('body').on('click', '.face-2-back a', function(e) {
            $('.face-2-table-head').eq(0).html('Федеральный<br />округ');
            $('.face-2-back').removeClass('visible').removeAttr('data-id');
            $('.face-2-title-russia').css({'display': 'inline'});
            $('.face-2-title-regions').css({'display': 'none'});
            $('.map-window').hide();
            $('.map-region').hide();
            $('.map-russia').show();
            $('html').removeClass('map-window-opened');
            face2Redraw();
            $('.cube').css({'margin-bottom': $('.cube-face').eq(1).find('.cube-face-footer').outerHeight()});
            e.preventDefault();
        });

        $('.map-russia-sort-type-current').click(function(e) {
            $(this).parent().toggleClass('open');
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.map-russia-sort-type').length == 0) {
                $('.map-russia-sort-type').removeClass('open');
            }
        });

        $('.map-russia-sort-type-list ul li').click(function(e) {
            var curLi = $(this);
            if (!curLi.hasClass('active')) {
                $('.map-russia-sort-type-list ul li.active').removeClass('active');
                curLi.addClass('active');
                $('.map-russia-sort-type-current').html(curLi.html());
                face2Redraw();
            }
            $('.map-russia-sort-type').removeClass('open');
        });

        $('body').on('click', '.face-2-table-head a', function(e) {
            var curIndex = $('.face-2-table-head a').index($(this));
            $('.map-russia-sort-type-list ul li').eq(curIndex).trigger('click');
            e.preventDefault();
        });

        $('body').on('click', '.face-2-table-name-link', function(e) {
            $('.face-2-table-head').eq(0).html('Субъект РФ');
            var curID = $(this).attr('data-id');
            if ($('.map-window').length == 0) {
                $('body').append('<div class="map-window">' +
                                        '<div class="map-window-title"></div>' +
                                        '<div class="map-window-info">' +
                                            '<div class="map-window-info-item">' +
                                                '<div class="map-window-info-item-title">Число<br /> статей</div>' +
                                                '<div class="map-window-info-item-value map-window-info-item-value-1"></div>' +
                                            '</div>' +
                                            '<div class="map-window-info-item">' +
                                                '<div class="map-window-info-item-title">Число статей на 100<br /> исследователей</div>' +
                                                '<div class="map-window-info-item-value map-window-info-item-value-2"></div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="map-window-info-chart-title">Фактическое и прогнозное<br /> число статей, тыс. ед.</div>' +
                                        '<div class="map-window-info-chart"></div>' +
                                        '<div class="map-window-info-link"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                     '</div>');
            }
            $('.map-window-info-link a').attr('data-id', curID).trigger('click');
            e.preventDefault();
        });

        $('.map-russia').mCustomScrollbar({
            axis: 'x'
        });

        $('.face-2-table-wrap').mCustomScrollbar({
            axis: 'x',
            scrollButtons: {
                enable: true
            }
        });

        $('body').on('click', '.face-3-type a', function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-3-type li.active').removeClass('active');
                curLi.addClass('active');
                face3Redraw();
            }
            e.preventDefault();
        });

        $('.face-3-year-current').click(function(e) {
            $(this).parent().toggleClass('open');
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.face-3-year').length == 0) {
                $('.face-3-year').removeClass('open');
            }
        });

        $('.face-3-year ul li a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-3-year ul li.active').removeClass('active');
                curLi.addClass('active');
                $('.face-3-year-current').html($(this).html());
                face3Redraw();
            }
            $('.face-3-year').removeClass('open');
            e.preventDefault();
        });

        $('body').on('click', '.face-4-type a', function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-4-type li.active').removeClass('active');
                curLi.addClass('active');
                face4Redraw();
            }
            e.preventDefault();
        });

        $('body').on('click', '.face-4-letter a', function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-4-letter li.active').removeClass('active');
                curLi.addClass('active');
                $('.face-4-letter-current').html($(this).html());
                $('.face-4-letter').removeClass('open');
                face4Redraw();
            }
            e.preventDefault();
        });

        $('.face-4-letter-current').click(function() {
            $('.face-4-letter').toggleClass('open');
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.face-4-letter').length == 0) {
                $('.face-4-letter').removeClass('open');
            }
        });

        $('.face-4-title-hint-icon').click(function(e) {
            if ($(window).width() < 1140) {
                $('html').addClass('window-open');

                if ($('.window').length > 0) {
                    $('.window').remove();
                }
                $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

                var windowHTML = '<div class="window-formula-info-mobile">' + $(this).parent().find('.face-4-title-hint-content').html() + '</div>';

                $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

                $('.window-container').removeClass('window-container-load');
                windowPosition();
            }
        });

        $('.face-5-list').each(function() {
            var maxWidthLine = 153;
            if ($(window).width() < 1140) {
                maxWidthLine = 107;
            }

            var maxValue = 0;
            for (var i = 0; i < face5data.length; i++) {
                var curValue = parseFloat(face5data[i].value.replace(/,/, '.'));
                if (maxValue < curValue) {
                    maxValue = curValue;
                }
            }

            var newHTML = '';

            for (var i = 0; i < face5data.length; i++) {
                var curItem = face5data[i];
                var curValue = parseFloat(curItem.value.replace(/,/, '.'));
                var curWidth = curValue / maxValue * maxWidthLine + 1;
                var hintSize = '';
                if (curItem.hint.length < 300) {
                    hintSize = 'mini';
                }
                newHTML += '<div class="face-5-item">' +
                                '<div class="face-5-item-title">' + curItem.title + '</div>' +
                                '<div class="face-5-item-info">' +
                                    '<div class="face-5-item-info-container">' +
                                        '<div class="face-5-item-info-icon"></div>' +
                                        '<div class="face-5-item-info-content ' + hintSize + '">' + curItem.hint + '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="face-5-item-line"><div class="face-5-item-line-inner" style="width:' + curWidth + 'px"></div></div>' +
                                '<div class="face-5-item-value">' + curItem.value + '</div>' +
                           '</div>';
            }

            $('.face-5-list').html(newHTML);
        });

        $('.face-5-content').mCustomScrollbar({
            axis: 'y',
            scrollButtons: {
                enable: true
            }
        });

        $('.face-5-item-info-icon').click(function(e) {
            if ($(window).width() < 1140) {
                $('html').addClass('window-open');

                if ($('.window').length > 0) {
                    $('.window').remove();
                }
                $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

                var windowHTML = '<div class="window-formula-info-mobile">' + $(this).parent().find('.face-5-item-info-content').html() + '</div>';

                $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

                $('.window-container').removeClass('window-container-load');
                windowPosition();
            }
        });

        $('.cube-formula-legend-item-info-icon').click(function(e) {
            if ($(window).width() < 1140) {
                $('html').addClass('window-open');

                if ($('.window').length > 0) {
                    $('.window').remove();
                }
                $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

                var windowHTML = '<div class="window-formula-info-mobile">' + $(this).parent().find('.cube-formula-legend-item-info-content').html() + '</div>';

                $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

                $('.window-container').removeClass('window-container-load');
                windowPosition();
            }
        });

        $('.map-russia-legend-icon').click(function() {
            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-map-legend"><div class="window-loading"></div></div>');

            var windowHTML = '<div class="window-map-legend-inner"><div class="window-map-legend-title">Легенда</div><div class="window-map-legend-list">' + $('.map-russia-legend').html() + '</div></div>';

            $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        });

    }

});

$(window).on('load', function() {

    if ($('.cube').length > 0) {

        face2Redraw();
        face3Redraw();
        face4Redraw();

    }

});

function face2Redraw() {
    var curType = $('.face-2-type li.active').attr('data-type');
    var curSort = $('.map-russia-sort-type-list li.active').attr('data-sortType');
    var curYear = $('.face-2-year').html();
    var curData = null;
    for (var i = 0; i < face2dataDistricts.length; i++) {
        if (face2dataDistricts[i].type == curType && face2dataDistricts[i].year == curYear) {
            curData = face2dataDistricts[i].data;
        }
    }
    if (curData !== null) {
        var activeValue = ' active';
        var activeValue100 = '';
        $('.face-2-table-head').eq(1).addClass('active');
        $('.face-2-table-head').eq(2).removeClass('active');

        if (curSort == 'value') {
            curData.sort(face2SortCount);
        } else {
            curData.sort(face2SortCount100);
            var activeValue = '';
            var activeValue100 = ' active';
            $('.face-2-table-head').eq(2).addClass('active');
            $('.face-2-table-head').eq(1).removeClass('active');
        }
        var newMap = '';
        $('.face-2-table-row').remove();

        var curRatingsArray = [];
        if (curType == 'WoS') {
            if (curSort == 'value') {
                curRatingsArray = mapColorsDistrictsValueWoS;
            } else {
                curRatingsArray = mapColorsDistrictsValue100WoS;
            }
        } else {
            if (curSort == 'value') {
                curRatingsArray = mapColorsDistrictsValueScopus;
            } else {
                curRatingsArray = mapColorsDistrictsValue100Scopus;
            }
        }

        var legendHTML = '';
        if (curType == 'WoS') {
            var legendColors = mapColors[0];
        } else {
            var legendColors = mapColors[1];
        }
        for (var ra = 0; ra < curRatingsArray.length; ra++) {
            var legendText = '';
            if (curRatingsArray[ra][0] == 0) {
                legendText = 'до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else if (curRatingsArray[ra][1] == Infinity) {
                legendText = 'более ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            } else {
                legendText = 'от ' + String(curRatingsArray[ra][0]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' до ' + String(curRatingsArray[ra][1]).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
            }
            legendHTML += '<div class="map-russia-legend-item"><div class="map-russia-legend-item-color" style="background:' + legendColors[ra] + '"></div>' + legendText + '</div>';
        }

        $('.map-russia-legend').html(legendHTML);

        for (var i = 0; i < curData.length; i++) {
            var districtID = curData[i].district;

            var curColorIndex = -1;
            var curValue = parseInt(curData[i].value.replace(/ /g, ''));
            if (curSort == 'value100') {
                curValue = parseFloat(curData[i].value100.replace(/ /g, '').replace(/,/g, '.'));
            }
            for (var c = 0; c < curRatingsArray.length; c++) {
                if (curValue >= curRatingsArray[c][0] && curValue < curRatingsArray[c][1]) {
                    curColorIndex = c;
                }
            }

            if (curType == 'WoS') {
                var curColor = mapColors[0][curColorIndex];
            } else {
                var curColor = mapColors[1][curColorIndex];
            }

            newMap += '<g class="map-russia-district" data-id="' + districtID + '">';
            for (var j = 0; j < russiaRegions.length; j++) {
                var curRegion = russiaRegions[j];
                if (curRegion.district == districtID) {
                    newMap += '<g style="fill:' + curColor + '">' + curRegion.svg + '</g>';
                }
            }
            newMap += '</g>';
            var districtTitle = '';
            for (var j = 0; j < russiaDistricts.length; j++) {
                if (russiaDistricts[j].id == districtID) {
                    districtTitle = russiaDistricts[j].title;
                }
            }
            $('.face-2-table').append('<div class="face-2-table-row">' +
                                        '<div class="face-2-table-name">' +
                                            '<a href="#" class="face-2-table-name-link" data-id="' + districtID + '">' +
                                                '<div class="face-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                '<div class="face-2-table-name-text">' + districtTitle + '</div>' +
                                            '</a>' +
                                        '</div>' +
                                        '<div class="face-2-table-value' + activeValue + '">' + String(curData[i].value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                        '<div class="face-2-table-value' + activeValue100 + '">' + String(curData[i].value100).replace(/\./g, ',') + '</div>' +
                                      '</div>');
        }
        $('.map-russia svg').html(newMap);
    }

    if ($('.face-2-back').hasClass('visible')) {
        var curID = $('.face-2-back').attr('data-id');
        $('.map-window-info-link a').attr('data-id', curID).trigger('click');
    }
}

function face2SortCount(a, b) {
    var value1 = parseInt(a.value.replace(/ /g, ''));
    var value2 = parseInt(b.value.replace(/ /g, ''));
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face2SortCount100(a, b) {
    var value1 = parseFloat(a.value100.replace(/ /g, '').replace(/,/g, '.'));
    var value2 = parseFloat(b.value100.replace(/ /g, '').replace(/,/g, '.'));
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face3Redraw() {
    var curType = $('.face-3-type li.active').attr('data-type');
    var curYear = $('.face-3-year li.active').attr('data-year');
    var curData = null;
    for (var i = 0; i < face3data.length; i++) {
        if (face3data[i].type == curType && face3data[i].year == curYear) {
            curData = face3data[i].data;
        }
    }
    $('.face-3-hints').html('');
    if (curData !== null) {
        var newHTML = '';
        var labels = [];
        var values = [];
        var colors = cubeColors[$('.face-3-type li').index($('.face-3-type li.active'))];

        var curFull = 0;
        for (var i = 0; i < curData.length; i++) {
            labels.push(curData[i].title);
            values.push(curData[i].value);
            newHTML += '<div class="face3-list-item"><div class="face3-list-item-inner"><div class="face3-list-item-icon"><div class="face3-list-item-icon-inner" style="background-color:' + colors[i] + '"></div></div><div class="face3-list-item-title">' + curData[i].title + ' <span>(' + curData[i].value + '%)</span></div></div></div>';
            if (Number(curData[i].value) >= 2) {
                $('.face-3-hints').append('<div class="face-3-hints-item" style="transform:rotate(' + ((curFull + curData[i].value / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((curFull + curData[i].value / 2) / 100 * 360) + 'deg)">' + curData[i].value + '%</span></div>');
            }
            curFull += Number(curData[i].value);
        }

        face3Config.data.labels = labels;
        face3Config.data.datasets[0].data = values;
        face3Config.data.datasets[0].backgroundColor = colors;

        myChartFace3.update();

        $('.face3-list').html(newHTML);
    }
}

function face4Redraw() {
    var curType = $('.face-4-type li.active').attr('data-type');
    var curLetter = $('.face-4-letter li.active').attr('data-letter');
    $('.face-4-title-icon').html('<img src="' + $('.face-4-letter li.active').attr('data-icon') + '" alt="" />');
    $('.face-4-title-text span').html(curLetter);
    $('.face-4-title-hint-content').html($('.face-4-letter li.active').attr('data-hint'));

    var curData = null;
    for (var i = 0; i < face4data.length; i++) {
        if (face4data[i].type == curType && face4data[i].letter == curLetter) {
            curData = face4data[i].data;
        }
    }
    if (curData !== null) {
        $('.face-4-list').each(function() {
            var maxWidthLine = 240;
            if ($(window).width() < 1140) {
                maxWidthLine = 87;
            }

            var maxValue = 0;
            for (var i = 0; i < curData.length; i++) {
                var curValue = Math.round(parseFloat(curData[i].value.replace(/,/, '.')));
                if (maxValue < curValue) {
                    maxValue = curValue;
                }
            }

            var newHTML = '<div class="face-4-list-inner">';
            var count = 0;
            var hasRussia = false;

            for (var i = 0; i < curData.length; i++) {
                if (!hasRussia || i < 10) {
                    var curItem = curData[i];
                    var curValue = Math.round(parseFloat(curItem.value.replace(/,/, '.')));
                    var curWidth = curValue / maxValue * maxWidthLine + 1;
                    count++;
                    if (curItem.title == 'Россия') {
                        hasRussia = true;
                        if (count > 10) {
                            newHTML += '</div>';
                            newHTML += '<div class="face-4-item-sep"></div>';
                        }
                    }

                    var flag = '';
                    for (var j = 0; j < cubeFlags.length; j++) {
                        if (cubeFlags[j].country == curItem.title) {
                            flag = cubeFlags[j].image;
                        }
                    }

                    if (count < 11 && curItem.title == 'Россия') {
                        newHTML += '<div class="face-4-item-rus"><div class="face-4-item-rus-inner">';
                    }

                    newHTML += '<div class="face-4-item">' +
                                    '<div class="face-4-item-flag"><img src="' + flag + '" alt="" /></div>' +
                                    '<div class="face-4-item-title">' + count + '. ' + curItem.title + '</div>' +
                                    '<div class="face-4-item-line"><div class="face-4-item-line-inner" style="width:' + curWidth + 'px"></div></div>' +
                                    '<div class="face-4-item-value">' + String(curItem.value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                               '</div>';

                    if (count < 11 && curItem.title == 'Россия') {
                        newHTML += '</div></div>';
                    }
                }

            }
            if (count < 10) {
                newHTML += '</div>';
            }

            $('.face-4-list').html(newHTML);

            if ($(window).width() > 1139) {
                if (count > 10) {
                    $('.face-4-list-inner').addClass('scroll').mCustomScrollbar({
                        axis: 'y'
                    });
                } else {
                    $('.face-4-list-inner').removeClass('scroll').mCustomScrollbar('destroy');
                }
            } else {
                $('.face-4-list-inner').removeClass('scroll').mCustomScrollbar('destroy');
            }
        });
    }
}

$(window).on('load resize', function() {
    face4Redraw();

    if ($(window).width() > 1139) {
        $('.monitoring-menu ul, .cube-menu ul').each(function() {
            var curList = $(this);
            if (curList.hasClass('slick-slider')) {
                curList.slick('unslick');
                curList.find('li:gt(0)').before(' ');
            }
        });

        $('.monitoring-map-inner svg').attr('width', $('.monitoring-map-inner svg').attr('data-desktopwidth'));
        $('.monitoring-map-inner svg').attr('height', $('.monitoring-map-inner svg').attr('data-desktopheight'));

        $('.face-4-container').mCustomScrollbar('destroy');
    } else {
        $('.monitoring-menu ul, .cube-menu ul').each(function() {
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

        $('.face-4-container').mCustomScrollbar({
            axis: 'y'
        });
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