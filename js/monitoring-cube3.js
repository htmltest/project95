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
            windowHTML      +=      '<div class="window-face1-title">Топ-8 стран по численности исследователей в эквиваленте полной занятости среди ведущих стран мира (по данным организации экономического сотрудничества и развития)</div>';
            windowHTML      +=      '<div class="window-face1-list">' + newHTML + '</div>';
            windowHTML      +=      '<div class="window-face1-btn">' + $('.cube-face-footer').html() + '</div>';
            windowHTML      +=  '</div>';

            $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();

            e.preventDefault();
        });

        $('.face-2-year-current').click(function(e) {
            $(this).parent().toggleClass('open');
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.face-2-year').length == 0) {
                $('.face-2-year').removeClass('open');
            }
        });

        $('.face-2-year ul li a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-2-year ul li.active').removeClass('active');
                curLi.addClass('active');
                $('.face-2-year-current').html($(this).html());
                $('.face-2-year-text').html($(this).html());
                face2Redraw();
            }
            $('.face-2-year').removeClass('open');
            e.preventDefault();
        });

        if ($(window).width() > 1139) {
            $('body').on('mouseenter', '.map-russia-district, .map-region-item', function(e) {
                $('.monitoring-map-region-hint').remove();
                $('body').append('<div class="monitoring-map-region-hint">' + $(this).attr('data-title') + '</div>');
                var curLeft = e.pageX;
                var curTop = e.pageY;
                $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
            });

            $('body').on('mousemove', '.map-russia-district, .map-region-item', function(e) {
                var curLeft = e.pageX;
                var curTop = e.pageY;
                $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
            });

            $('body').on('mouseleave', '.map-russia-district, .map-region-item', function(e) {
                $('.monitoring-map-region-hint').remove();
            });
        }

        $('body').on('click', '.map-russia-district', function(e) {
            $('.monitoring-map-region-hint').remove();
            if ($('.map-window').length == 0) {
                $('body').append('<div class="map-window"><div class="map-window-inner">' +
                                        '<div class="map-window-title"></div>' +
                                        '<div class="map-window-info">' +
                                            '<div class="map-window-info-item">' +
                                                '<div class="map-window-info-item-title">Число исследователей, чел.</div>' +
                                                '<div class="map-window-info-item-value"></div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="map-window-info-chart-title">Фактическое число исследователей, чел.</div>' +
                                        '<div class="map-window-info-chart"></div>' +
                                        '<div class="map-window-info-link"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                        '<div class="map-window-info-notice">' + $('.face-2-notice').html() + '</div>' +
                                        '<div class="map-window-close"></div>' +
                                     '</div></div>');
            }
            $('.map-window-info-notice').removeClass('visible');
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

            var curYear = $('.face-2-year-text').html();

            var curMax = 0;

            for (var i = 0; i < face2dataDistricts.length; i++) {
                var curData = face2dataDistricts[i].data;
                for (var j = 0; j < curData.length; j++) {
                    if (curData[j].district == districtID) {
                        if (curData[j].value !== undefined) {
                            var curValue = parseInt(curData[j].value.replace(/ /g, ''));
                            if (face2dataDistricts[i].year == curYear) {
                                $('.map-window-info-item-value').html(String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
                            }
                            if (curMax < curValue) {
                                curMax = curValue;
                            }
                            $('.map-window-info-chart').append('<div class="map-window-info-chart-item">' +
                                                                    '<div class="map-window-info-chart-item-value">' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                                                    '<div class="map-window-info-chart-item-bar"></div>' +
                                                                    '<div class="map-window-info-chart-item-year">' + face2dataDistricts[i].year + '</div>' +
                                                               '</div>');
                        } else {
                            $('.map-window-info-notice').addClass('visible');
                            var curValue = 0;
                            if (face2dataDistricts[i].year == curYear) {
                                $('.map-window-info-item-value').html('н/д<span>*</span>');
                            }
                            if (curMax < curValue) {
                                curMax = curValue;
                            }
                            $('.map-window-info-chart').append('<div class="map-window-info-chart-item">' +
                                                                    '<div class="map-window-info-chart-item-value">н/д<span>*</span></div>' +
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
            $('.monitoring-map-region-hint').remove();
            if ($('.map-window').length == 0) {
                $('body').append('<div class="map-window"><div class="map-window-inner">' +
                                        '<div class="map-window-title"></div>' +
                                        '<div class="map-window-info">' +
                                            '<div class="map-window-info-item">' +
                                                '<div class="map-window-info-item-title">Число исследователей, чел.</div>' +
                                                '<div class="map-window-info-item-value"></div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="map-window-info-chart-title">Фактическое число исследователей, чел.</div>' +
                                        '<div class="map-window-info-chart"></div>' +
                                        '<div class="map-window-info-link"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                        '<div class="map-window-info-notice">' + $('.face-2-notice').html() + '</div>' +
                                        '<div class="map-window-close"></div>' +
                                     '</div></div>');
            }
            $('.map-window-info-notice').removeClass('visible');
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

            var curYear = $('.face-2-year-text').html();

            var curMax = 0;

            for (var i = 0; i < face2dataRegions.length; i++) {
                if (face2dataRegions[i].id == regionID) {
                    var curData = face2dataRegions[i].values;
                    for (var j = 0; j < curData.length; j++) {
                        var curValues = curData[j];

                        var curValue = 0;
                        if (curValues.value !== undefined) {
                            curValue = parseInt(curValues.value.replace(/ /g, ''));
                        }

                        if (curValues.year == curYear) {
                            $('.map-window-info-item-value').html(String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
                        }
                        if (curMax < curValue) {
                            curMax = curValue;
                        }
                        if (curValues.value !== undefined) {
                            $('.map-window-info-chart').append('<div class="map-window-info-chart-item">' +
                                                                    '<div class="map-window-info-chart-item-value">' + String(curValue).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                                                    '<div class="map-window-info-chart-item-bar"></div>' +
                                                                    '<div class="map-window-info-chart-item-year">' + curValues.year + '</div>' +
                                                               '</div>');
                        } else {
                            $('.map-window-info-notice').addClass('visible');
                            $('.map-window-info-chart').append('<div class="map-window-info-chart-item">' +
                                                                    '<div class="map-window-info-chart-item-value">н/д<span>*</span></div>' +
                                                                    '<div class="map-window-info-chart-item-bar"></div>' +
                                                                    '<div class="map-window-info-chart-item-year">' + curValues.year + '</div>' +
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

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.map-window-inner').length == 0 && !$(e.target).hasClass('map-window-inner') && $(e.target).parents().filter('.map-russia-district').length == 0 && $(e.target).parents().filter('.face-2-table-name-region').length == 0 && !$(e.target).hasClass('map-russia-district') && !$(e.target).hasClass('face-2-table-name-region') && $(e.target).parents().filter('.map-region-item').length == 0 && !$(e.target).hasClass('map-region-item')) {
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
            var curSort = $('.map-russia-sort-type-list li.active').attr('data-sortType');
            var curYear = $('.face-2-year-text').html();
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
                        if (face2dataRegions[i].values[j].year == curYear) {
                            if (face2dataRegions[i].values[j].value !== undefined) {
                                curData.push({
                                                'id'        : curRegionID,
                                                'value'     : face2dataRegions[i].values[j].value
                                });
                            } else {
                                curData.push({
                                                'id'        : curRegionID
                                });
                            }
                        }
                    }
                }
            }

            curData.sort(face2Sort);

            var newMap = '';
            $('.face-2-notice').removeClass('visible');
            $('.face-2-table-row').remove();
            for (var i = 0; i < curData.length; i++) {
                var regionID = curData[i].id;
                var regionTitle = '';
                for (var r = 0; r < russiaRegions.length; r++) {
                    if (russiaRegions[r].id == regionID) {
                        regionTitle = russiaRegions[r].title;
                    }
                }

                var curRatingsArray = [];
                for (var c = 0; c < mapColorsRegions.length; c++) {
                    if (curID == mapColorsRegions[c].id) {
                        curRatingsArray = mapColorsRegions[c].value;
                    }
                }

                var curColorIndex = -1;
                var curValue = 0;
                if (curData[i].value !== undefined) {
                    curValue = parseInt(curData[i].value.replace(/ /g, ''));
                }
                for (var c = 0; c < curRatingsArray.length; c++) {
                    if (curValue >= curRatingsArray[c][0] && curValue < curRatingsArray[c][1]) {
                        curColorIndex = c;
                    }
                }

                var curColor = mapColors[0][curColorIndex];

                newMap += '<g class="map-region-item" data-id="' + regionID + '" data-title="' + regionTitle + '">';
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
                if (curData[i].value !== undefined) {
                    $('.face-2-table').append('<div class="face-2-table-row">' +
                                                '<div class="face-2-table-name">' +
                                                    '<a href="#" class="face-2-table-name-region" data-id="' + regionID + '">' +
                                                        '<div class="face-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                        regionTitle +
                                                    '</a>' +
                                                '</div>' +
                                                '<div class="face-2-table-value">' + String(curData[i].value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                              '</div>');
                } else {
                    $('.face-2-notice').addClass('visible');
                    $('.face-2-table').append('<div class="face-2-table-row">' +
                                                '<div class="face-2-table-name">' +
                                                    '<a href="#" class="face-2-table-name-region" data-id="' + regionID + '">' +
                                                        '<div class="face-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                        regionTitle +
                                                    '</a>' +
                                                '</div>' +
                                                '<div class="face-2-table-value">н/д<span>*</span></div>' +
                                              '</div>');
                }
            }
            $('.map-region[data-id="' + curID + '"] svg').html(newMap);
            $('.cube').css({'margin-bottom': $('.cube-face').eq(1).find('.cube-face-footer').outerHeight()});

            var legendHTML = '';
            var legendColors = mapColors[0];
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

            $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});
            $('.map-russia-legend').html(legendHTML);

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

        $('body').on('click', '.face-2-table-name-link', function(e) {
            $('.face-2-table-head').eq(0).html('Субъект РФ');
            var curID = $(this).attr('data-id');
            if ($('.map-window').length == 0) {
                $('body').append('<div class="map-window"><div class="map-window-inner">' +
                                        '<div class="map-window-title"></div>' +
                                        '<div class="map-window-info">' +
                                            '<div class="map-window-info-item">' +
                                                '<div class="map-window-info-item-title">Число исследователей, чел.</div>' +
                                                '<div class="map-window-info-item-value"></div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="map-window-info-chart-title">Фактическое число исследователей, чел.</div>' +
                                        '<div class="map-window-info-chart"></div>' +
                                        '<div class="map-window-info-notice">' + $('.face-2-notice').html() + '</div>' +
                                        '<div class="map-window-info-link"><a href="#" class="btn-med" data-id="">Перейти на карту ФО</a></div>' +
                                     '</div></div>');
            }
            $('.map-window-info-notice').removeClass('visible');
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

        $('.face-3-type-current').click(function(e) {
            $(this).parent().toggleClass('open');
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.face-3-type').length == 0) {
                $('.face-3-type').removeClass('open');
            }
        });

        $('.face-3-type ul li a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-3-type ul li.active').removeClass('active');
                curLi.addClass('active');
                $('.face-3-type-current').html($(this).html());
                face3Redraw();
            }
            $('.face-3-type').removeClass('open');
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

        $('.face-4-year-current').click(function(e) {
            $(this).parent().toggleClass('open');
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.face-4-year').length == 0) {
                $('.face-4-year').removeClass('open');
            }
        });

        $('.face-4-year ul li a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-4-year ul li.active').removeClass('active');
                curLi.addClass('active');
                $('.face-4-year-current').html($(this).html());
                face4Rebuild();
                face4Redraw();
            }
            $('.face-4-year').removeClass('open');
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

        $('.face-4-letter').data('parent', '');
        $('.face-4-letter').data('back', '');
        face4Rebuild();

        $('body').on('click', '.face-4-cube-3-detail a', function(e) {
            $('.face-4-letter').data('parent', $('.face-4-letter li.active').attr('data-letter'));
            $('.face-4-letter').data('back', $('.face-4-letter li.active').attr('data-letter'));
            face4Rebuild();
            face4Redraw();
            e.preventDefault();
        });

        $('body').on('click', '.face-4-cube-3-back a', function(e) {
            $('.face-4-letter').data('parent', '');
            face4Rebuild();
            face4Redraw();
            e.preventDefault();
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

        $('.face-3-group-year-current').click(function(e) {
            $(this).parent().toggleClass('open');
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.face-3-group-year').length == 0) {
                $('.face-3-group-year').removeClass('open');
            }
        });

        $('.face-3-group-year ul li a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-3-group-year ul li.active').removeClass('active');
                curLi.addClass('active');
                $('.face-3-group-year-current').html($(this).html());
                face3GroupRedraw();
            }
            $('.face-3-group-year').removeClass('open');
            e.preventDefault();
        });

    }

});

$(window).on('load', function() {

    if ($('.cube').length > 0) {

        face2Redraw();
        face4Redraw();

        $('.cube-face').eq(0).addClass('active');
        $('.cube').css({'margin-bottom': $('.cube-face').eq(0).find('.cube-face-footer').outerHeight()});

        face3GroupRedraw();
    }

});

$(window).on('resize', function() {

    if ($('.cube').length > 0) {
        face3GroupRedraw();
    }

});

function face2Redraw() {
    var curYear = $('.face-2-year-text').html();
    var curData = null;
    for (var i = 0; i < face2dataDistricts.length; i++) {
        if (face2dataDistricts[i].year == curYear) {
            curData = face2dataDistricts[i].data;
        }
    }
    if (curData !== null) {

        curData.sort(face2Sort);
        var newMap = '';
        $('.face-2-table-row').remove();

        var curRatingsArray = [];
        curRatingsArray = mapColorsDistricts;

        var legendHTML = '';
        var legendColors = mapColors[0];
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

        $('.face-2-notice').removeClass('visible');
        for (var i = 0; i < curData.length; i++) {
            var districtID = curData[i].district;
            var districtTitle = '';
            for (var r = 0; r < russiaDistricts.length; r++) {
                if (russiaDistricts[r].id == districtID) {
                    districtTitle = russiaDistricts[r].title;
                }
            }

            var curColorIndex = -1;
            var curValue = 0;
            if (curData[i].value !== undefined) {
                curValue = parseInt(curData[i].value.replace(/ /g, ''));
            }
            for (var c = 0; c < curRatingsArray.length; c++) {
                if (curValue >= curRatingsArray[c][0] && curValue < curRatingsArray[c][1]) {
                    curColorIndex = c;
                }
            }

            var curColor = mapColors[0][curColorIndex];

            newMap += '<g class="map-russia-district" data-id="' + districtID + '" data-title="' + districtTitle + '">';
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
            if (curData[i].value !== undefined) {
                $('.face-2-table').append('<div class="face-2-table-row">' +
                                            '<div class="face-2-table-name">' +
                                                '<a href="#" class="face-2-table-name-link" data-id="' + districtID + '">' +
                                                    '<div class="face-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                    '<div class="face-2-table-name-text">' + districtTitle + '</div>' +
                                                '</a>' +
                                            '</div>' +
                                            '<div class="face-2-table-value">' + String(curData[i].value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</div>' +
                                          '</div>');
            } else {
                $('.face-2-notice').addClass('visible');
                $('.face-2-table').append('<div class="face-2-table-row">' +
                                            '<div class="face-2-table-name">' +
                                                '<a href="#" class="face-2-table-name-link" data-id="' + districtID + '">' +
                                                    '<div class="face-2-table-name-color" style="background:' + curColor + '"></div>' +
                                                    '<div class="face-2-table-name-text">' + districtTitle + '</div>' +
                                                '</a>' +
                                            '</div>' +
                                            '<div class="face-2-table-value">н/д<span>*</span></div>' +
                                          '</div>');
            }
        }
        $('.cube').css({'margin-bottom': $('.cube-face.active').find('.cube-face-footer').outerHeight()});
        $('.map-russia svg').html(newMap);
    }

    if ($('.face-2-back').hasClass('visible')) {
        var curID = $('.face-2-back').attr('data-id');
        $('.map-window-info-link a').attr('data-id', curID).trigger('click');
    }
}

function face2Sort(a, b) {
    if (a.value === undefined) return 1;
    if (b.value === undefined) return -1;
    var value1 = parseInt(a.value.replace(/ /g, ''));
    var value2 = parseInt(b.value.replace(/ /g, ''));
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

function face4Rebuild() {
    var curYear = $('.face-4-year li.active').attr('data-year');

    if ($('.face-4-letter').data('parent') == '' || $('.face-4-letter').data('parent') === undefined) {
        var newHTML = '';

        for (var i = 0; i < face4data.length; i++) {
            if (face4data[i].year == curYear) {
                newHTML += '<li data-letter="' + face4data[i].letter + '"><a href="#">' + face4data[i].letter + '</a></li>';
            }
        }
        $('.face-4-letter ul').html(newHTML);
        $('.face-4-letter li[data-letter="' + $('.face-4-letter').data('back') + '"]').addClass('active');
        if ($('.face-4-letter li.active').length == 0) {
            $('.face-4-letter li').eq(0).addClass('active');
        }
        $('.face-4-letter-current').html($('.face-4-letter li.active a').html());
    } else {
        var parentData = null;
        var parentLetter = $('.face-4-letter').data('parent');

        for (var i = 0; i < face4data.length; i++) {
            if (face4data[i].year == curYear && face4data[i].letter == parentLetter) {
                parentData = face4data[i].subdata;
            }
        }

        if (parentData !== null) {
            var newHTML = '';
            for (var i = 0; i < parentData.length; i++) {
                newHTML += '<li data-letter="' + parentData[i].letter + '"><a href="#">' + parentData[i].letter + '</a></li>';
            }
            $('.face-4-letter ul').html(newHTML);
            $('.face-4-letter li').eq(0).addClass('active');
            $('.face-4-letter-current').html($('.face-4-letter li.active a').html());
        } else {
            $('.face-4-letter').data('parent', '');
            face4Rebuild();
        }
    }
}

function face4Redraw() {
    var curYear = $('.face-4-year li.active').attr('data-year');
    var curLetter = $('.face-4-letter li.active').attr('data-letter');
    $('.face-4-title').html(curLetter);

    var curData = null;
    var curElement = null;
    if ($('.face-4-letter').data('parent') == '' || $('.face-4-letter').data('parent') === undefined) {
        for (var i = 0; i < face4data.length; i++) {
            if (face4data[i].letter == curLetter && face4data[i].year == curYear) {
                curData = face4data[i].data;
                curElement = face4data[i];
            }
        }
    } else {
        var parentData = null;
        var parentLetter = $('.face-4-letter').data('parent');
        for (var i = 0; i < face4data.length; i++) {
            if (face4data[i].year == curYear && face4data[i].letter == parentLetter) {
                parentData = face4data[i].subdata;
            }
        }
        for (var j = 0; j < parentData.length; j++) {
            if (parentData[j].letter == curLetter) {
                curData = parentData[j].data;
                curElement = parentData[j];
            }
        }
    }
    $('.face-4-cube-3-hints').html('');
    if (curData !== null) {
        if (typeof curElement.subdata !== "undefined") {
            $('.face-4-cube-3-detail').addClass('visible');
        } else {
            $('.face-4-cube-3-detail').removeClass('visible');
        }
        if ($('.face-4-letter').data('parent') != '') {
            $('.face-4-cube-3-back').addClass('visible');
        } else {
            $('.face-4-cube-3-back').removeClass('visible');
        }
        var newHTML = '';
        var labels = [];
        var values = [];
        var colors = cubeColors3[0];

        var curSumm = 0;
        for (var i = 0; i < curData.length; i++) {
            curSumm += Number(curData[i].value);
        }

        for (var i = 0; i < curData.length; i++) {
            var curValue = (Number(curData[i].value) / curSumm * 100).toFixed(1);
            values.push(curValue);
        }

        var summValues = 0;
        var maxIndex = -1;
        var maxValue = 0;
        for (var i = 0; i < values.length; i++) {
            if (maxValue < values[i]) {
                maxValue = values[i];
                maxIndex = i;
            }
            summValues += Number(values[i]);
        }
        if (summValues > 100) {
            values[maxIndex] = (values[maxIndex] - (summValues - 100)).toFixed(1);
        } else if (summValues < 100) {
            values[maxIndex] = (Number(values[maxIndex]) + (100 - summValues)).toFixed(1);
        }

        var curFull = 0;
        for (var i = 0; i < curData.length; i++) {
            labels.push(curData[i].title + ', ' + String(curData[i].value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;') + '&nbsp;чел.');
            var curValue = values[i];
            newHTML += '<div class="face3-list-item"><div class="face3-list-item-inner"><div class="face3-list-item-icon"><div class="face3-list-item-icon-inner" style="background-color:' + colors[i] + '"></div></div><div class="face3-list-item-title">' + curData[i].title + ', ' + String(curData[i].value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' чел. (' + curValue + '%)</div></div></div>';
            if (curValue >= 2) {
                $('.face-4-cube-3-hints').append('<div class="face-3-hints-item" style="transform:rotate(' + ((curFull + curValue / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((curFull + curValue / 2) / 100 * 360) + 'deg)">' + curValue + '%</span></div>');
            }
            curFull += Number(curValue);
        }
        $('.face4-cube-3-summ span').html(String(curSumm).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;'));

        face4Config.data.labels = labels;
        face4Config.data.datasets[0].data = values;
        face4Config.data.datasets[0].backgroundColor = colors;

        myChartFace4.update();

        $('.face4-cube-3-list').html(newHTML);
    }
}

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

function face3GroupRedraw() {
    var curYear = $('.face-3-group-year li.active').attr('data-year');
    var curData = null;
    for (var i = 0; i < face3groupdata.length; i++) {
        if (face3groupdata[i].year == curYear) {
            curData = face3groupdata[i].data;
        }
    }
    $('.face-3-group-hints').html('');
    if (curData !== null) {
        var newHTML = '';
        var labels = [];
        var values = [];
        var colors = cubeColors3Group[0];

        var curFull = 0;
        var curGroup = 0;
        var linearHTML = '';
        var linearIndex = 0;
        var linearcolors = cubeColors3Group[1];
        var groupFull = 0.00;
        for (var i = 0; i < curData.length; i++) {
            if (curData[i].group == true) {
                curGroup += Number(curData[i].value);
            }
        }
        if (curGroup > 0) {
            $('.face-3-group-second').addClass('visible');
            $('.face-3-group-second-line-1').addClass('visible');
            $('.face-3-group-second-line-2').addClass('visible');
            $('.face-3-group-content').removeClass('without-second');
            for (var i = 0; i < curData.length; i++) {
                if (curData[i].group == true) {
                    var curHeight = (Number(curData[i].value) / curGroup).toFixed(2) * 100;
                    linearHTML += '<div class="face-3-group-second-item" style="bottom:' + groupFull + '%; height:' + curHeight + '%">' +
                                    '<div class="face-3-group-second-item-bg" style="background:' + linearcolors[linearIndex] + '"></div>' +
                                    '<div class="face-3-group-second-item-title">' + curData[i].value + '%</div>' +
                                    '<div class="face-3-group-second-item-hint">' + curData[i].title + '<span>' + curData[i].value + '%</span></div>' +
                                  '</div>';
                    groupFull += curHeight;
                    linearIndex++;
                }
            }
            $('.face-3-group-second').html(linearHTML);

            var newAngle = curGroup / 100 * Math.PI;
        } else {
            $('.face-3-group-content').addClass('without-second');
            $('.face-3-group-second').removeClass('visible');
            $('.face-3-group-second-line-1').removeClass('visible');
            $('.face-3-group-second-line-2').removeClass('visible');
        }

        for (var i = 0; i < curData.length; i++) {
            if (curData[i].group != true) {
                labels.push(curData[i].title);
                values.push(curData[i].value);
                newHTML += '<div class="face3-group-list-item"><div class="face3-group-list-item-inner"><div class="face3-group-list-item-icon"><div class="face3-group-list-item-icon-inner" style="background-color:' + colors[i] + '"></div></div><div class="face3-group-list-item-title">' + curData[i].title + ' <span>(' + curData[i].value + '%)</span></div></div></div>';
                if (Number(curData[i].value) >= 2) {
                    $('.face-3-group-hints').append('<div class="face-3-group-hints-item" style="transform:rotate(' + (90 + ((curFull + curData[i].value / 2) / 100 * 360)) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + (90 + ((curFull + curData[i].value / 2) / 100 * 360)) + 'deg)">' + curData[i].value + '%</span></div>');
                }
                curFull += Number(curData[i].value);
            }
        }

        if (curGroup > 0) {
            newHTML += '<hr />';
            linearIndex = 0;
            for (var i = 0; i < curData.length; i++) {
                if (curData[i].group == true) {
                    newHTML += '<div class="face3-group-list-item"><div class="face3-group-list-item-inner"><div class="face3-group-list-item-icon"><div class="face3-group-list-item-icon-inner" style="background-color:' + linearcolors[linearIndex] + '"></div></div><div class="face3-group-list-item-title">' + curData[i].title + ' <span>(' + curData[i].value + '%)</span></div></div></div>';
                    linearIndex++;
                }
            }

            values.push(curGroup);
            $('.face-3-group-hints').append('<div class="face-3-group-hints-item" style="transform:rotate(' + (90 + ((curFull + curGroup) / 100 * 360)) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + (90 + ((curFull + curGroup) / 100 * 360)) + 'deg)">' + curGroup.toFixed(1) + '%</span></div>');
            curFull += curGroup;

            face3GroupConfig.options.rotation = newAngle;
        }

        face3GroupConfig.data.labels = labels;
        face3GroupConfig.data.datasets[0].data = values;
        face3GroupConfig.data.datasets[0].backgroundColor = colors;

        myChartFace3Group.update();

        if (curGroup > 0) {
            var lineAngle = (curGroup / 100 * 360 / 2) * Math.PI / 180;
            var line1Start = [Math.ceil($('.face-3-group-content').width() * Math.cos(lineAngle)), Math.ceil(($('.face-3-group-content').height() / 2)) - Math.ceil(($('.face-3-group-content').height() / 2) * Math.sin(lineAngle))];
            var line2Start = [Math.ceil($('.face-3-group-content').width() * Math.cos(lineAngle)), Math.ceil(($('.face-3-group-content').height() / 2)) + Math.ceil(($('.face-3-group-content').height() / 2) * Math.sin(lineAngle))];
            var line1End = [Number($('.face-3-group-second').css('left').replace(/px/, '')), Number($('.face-3-group-second').css('top').replace(/px/, ''))];
            var line2End = [Number($('.face-3-group-second').css('left').replace(/px/, '')), Number($('.face-3-group-second').css('top').replace(/px/, '')) + $('.face-3-group-second').height()];

            function angle_point(a, b, c) {
                var x1 = a[0] - b[0];
                var x2 = c[0] - b[0];
                var y1 = a[1] - b[1];
                var y2 = c[1] - b[1];

                var d1 = Math.sqrt(x1 * x1 + y1 * y1);
                var d2 = Math.sqrt(x2 * x2 + y2 * y2);
                return Math.acos((x1 * x2 + y1 * y2) / (d1 * d2)) * 180 / Math.PI;
            }

            var line1Width = Math.sqrt(Math.pow((line1End[0] - line1Start[0]), 2) + Math.pow((line1End[1] - line1Start[1]), 2));
            var line1Angle = -angle_point([line1End[0], line1End[1]], [line1Start[0], line1Start[1]], [line1End[0], line1Start[1]]);
            $('.face-3-group-second-line-1').css({'left': line1Start[0], 'top': line1Start[1], 'width': line1Width, 'transform': 'rotate(' + line1Angle + 'deg)'});

            var line2Width = Math.sqrt(Math.pow((line2End[0] - line2Start[0]), 2) + Math.pow((line2End[1] - line2Start[1]), 2));
            var line2Angle = angle_point([line2End[0], line2End[1]], [line2Start[0], line2Start[1]], [line2End[0], line2Start[1]]);
            $('.face-3-group-second-line-2').css({'left': line2Start[0], 'top': line2Start[1], 'width': line2Width, 'transform': 'rotate(' + line2Angle + 'deg)'});
        }

        $('.face3-group-list').html(newHTML);
    }
}