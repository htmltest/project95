$(document).ready(function() {

    $('body').on('click', '.monitoring-menu a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.monitoring-menu li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = $('.monitoring-menu li').index(curLi);

            $('.monitoring-tab.active').removeClass('active');
            $('.monitoring-tab').eq(curIndex).addClass('active');
        }

        e.preventDefault();
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
                    viewport.move({x: 90, y: -180});
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
                x: -10,
                y: 20,
                el: $('.cube-container')[0],
                move: function(coords) {
                    if(coords) {
                        if(typeof coords.x === "number") this.x = coords.x;
                        if(typeof coords.y === "number") this.y = coords.y;
                    }

                    this.el.style[transformProp] = "rotateX("+this.x+"deg) rotateY("+this.y+"deg)";
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

        $(document).keydown(function(evt) {
            switch(evt.keyCode)
            {
                case 37:
                    viewport.move({y: viewport.y - 90});
                    break;

                case 38:
                    evt.preventDefault();
                    viewport.move({x: viewport.x + 90});
                    break;

                case 39:
                    viewport.move({y: viewport.y + 90});
                    break;

                case 40:
                    evt.preventDefault();
                    viewport.move({x: viewport.x - 90});
                    break;

                case 27:
                    viewport.reset();
                    break;

                default:
                    break;
            };
        }).bind('mousedown touchstart', function(evt) {
            delete mouse.last;
            if($(evt.target).is('a, iframe')) {
                return true;
            }

            evt.originalEvent.touches ? evt = evt.originalEvent.touches[0] : null;
            mouse.start.x = evt.pageX;
            mouse.start.y = evt.pageY;
            $(document).bind('mousemove touchmove', function(event) {
                if(!touch || !(event.originalEvent && event.originalEvent.touches.length > 1)) {
                    event.preventDefault();
                    event.originalEvent.touches ? event = event.originalEvent.touches[0] : null;
                    $('.cube').trigger('move-viewport', {x: event.pageX, y: event.pageY});
                }
            });

            $(document).bind('mouseup touchend', function () {
                $(document).unbind('mousemove touchmove');
                var curX = viewport.x;
                var diffX = Math.round(curX / 90);
                var newX = diffX * 90;

                var curY = viewport.y;
                var diffY = Math.round(curY / 90);
                var newY = diffY * 90;

                viewport.move({x: newX, y: newY});
            });
        });

        $('.cube').bind('move-viewport', function(evt, movedMouse) {

            var movementScaleFactor = touch ? 4 : 1;

            if (!mouse.last) {
                mouse.last = mouse.start;
            } else {
                if (forward(mouse.start.x, mouse.last.x) != forward(mouse.last.x, movedMouse.x)) {
                    mouse.start.x = mouse.last.x;
                }
                if (forward(mouse.start.y, mouse.last.y) != forward(mouse.last.y, movedMouse.y)) {
                    mouse.start.y = mouse.last.y;
                }
            }

            viewport.move({
                x: viewport.x + parseInt((mouse.start.y - movedMouse.y)/movementScaleFactor),
                y: viewport.y - parseInt((mouse.start.x - movedMouse.x)/movementScaleFactor)
            });

            mouse.last.x = movedMouse.x;
            mouse.last.y = movedMouse.y;

            function forward(v1, v2) {
                return v1 >= v2 ? true : false;
            }
        });

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
            face1DataActually.push(curPlaceMin);
        }

        var ctxFace1 = document.getElementById('canvas-face-1').getContext('2d');
        var myChartFace1 = new Chart(ctxFace1, {
            type: 'line',
            data: {
                labels: face1Labels,

                datasets: [{
                    label: 'место',
                    data: face1DataForecast,
                    fill: false,
                    borderDash: [2, 2],
                    lineTension: 0,
                    borderColor: [
                        '#fe6600'
                    ],
                    borderWidth: 2,
                    pointBackgroundColor: '#f2f2f2',
                    pointBorderColor: '#fe6600',
                    pointBorderWidth: 2,
                    pointRadius: 6
                },
                {
                    label: 'место',
                    data: ['12', '12', '12', '13', '13', '13', '12', '12', '9', '8', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                    fill: false,
                    lineTension: 0,
                    borderColor: [
                        '#fe6600'
                    ],
                    borderWidth: 2,
                    pointBackgroundColor: '#fe6600',
                    pointBorderColor: '#fe6600',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                  scales: {
                    xAxes: [{
                        gridLines: false
                    }],
                    yAxes: [{
                        display: false,
                        ticks: {
                            max: 15,
                            reverse: true
                        }
                    }]
                  },
                responsive: true,
                legend: {
                    position: 'none',
                },
                title: {
                    display: false
                },

            }
        });

        $('.face-1-container').mCustomScrollbar({
            axis: 'x',
            scrollButtons: {
                enable: true
            }
        });

        $('body').on('mouseenter', '.map-russia g', function(e) {
            var curLeft = e.pageX;
            var curTop = e.pageY - $(window).scrollTop();
            $('.map-window').css({'left': curLeft, 'top': curTop});
            $('.map-window-title').html($(this).attr('data-title'));
            $('.map-window').show();
        });

        $('body').on('mousemove', '.map-russia g', function(e) {
            var curLeft = e.pageX;
            var curTop = e.pageY - $(window).scrollTop();
            $('.map-window').css({'left': curLeft, 'top': curTop});
        });

        $('body').on('mouseleave', '.map-russia g', function(e) {
            $('.map-window').hide();
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

        $('body').on('click', '.face-3-year a', function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                $('.face-3-year li.active').removeClass('active');
                curLi.addClass('active');
                face3Redraw();
            }
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
                face4Redraw();
            }
            e.preventDefault();
        });

        $('.face-5-list').each(function() {
            var maxWidthLine = 153;

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

    }

});

$(window).on('load', function() {

    if ($('.cube').length > 0) {

        face3Redraw();
        face4Redraw();

    }

});

function face3Redraw() {
    var curType = $('.face-3-type li.active').attr('data-type');
    var curYear = $('.face-3-year li.active').attr('data-year');
    var curData = null;
    for (var i = 0; i < face3data.length; i++) {
        if (face3data[i].type == curType && face3data[i].year == curYear) {
            curData = face3data[i].data;
        }
    }
    if (curData !== null) {
        var labels = [];
        var values = [];
        var colors = cubeColors[$('.face-3-type li').index($('.face-3-type li.active'))];

        for (var i = 0; i < curData.length; i++) {
            labels.push(curData[i].title);
            values.push(curData[i].value);
        }

        face3Config.data.labels = labels;
        face3Config.data.datasets[0].data = values;
        face3Config.data.datasets[0].backgroundColor = colors;

        myChartFace3.update();
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

            var maxValue = 0;
            for (var i = 0; i < curData.length; i++) {
                var curValue = Math.round(parseFloat(curData[i].value.replace(/,/, '.')));
                if (maxValue < curValue) {
                    maxValue = curValue;
                }
            }

            var newHTML = '';
            var count = 0;
            var hasRussia = false;

            for (var i = 0; i < curData.length; i++) {
                var curItem = curData[i];
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

            $('.face-4-list').html(newHTML);
        });
    }
}