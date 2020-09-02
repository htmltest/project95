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

    face35_2_Redraw();
    face39_2_Redraw();
    face34_4_Redraw();

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

$(document).ready(function() {

    $('.face-39-2-year-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-39-2-year').length == 0) {
            $('.face-39-2-year').removeClass('open');
        }
    });

    $('.face-39-2-year ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-39-2-year ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-39-2-year-current').html($(this).html());
            $('.face-39-2-year-text').html($(this).html());
            face39_2_Redraw();
        }
        $('.face-39-2-year').removeClass('open');
        e.preventDefault();
    });

    $('body').on('mouseenter', '.map-russia-39-2-district', function(e) {
        $('.monitoring-map-region-hint').remove();
        if ($(window).width() > 1139) {
            $('body').append('<div class="monitoring-map-region-hint">' + $(this).attr('data-title') + '</div>');
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.map-russia-39-2-district', function(e) {
        var curLeft = e.pageX;
        var curTop = e.pageY;
        $('.monitoring-map-region-hint').css({'left': curLeft, 'top': curTop});
    });

    $('body').on('mouseleave', '.map-russia-39-2-district', function(e) {
        $('.monitoring-map-region-hint').remove();
    });

    $('body').on('click', '.face-39-2-table-head a', function(e) {
        if (!$(this).parent().hasClass('active')) {
            $('.face-39-2-table-head.active').removeClass('active');
            $(this).parent().addClass('active');
            face39_2_Redraw();
        }
        e.preventDefault();
    });

    $('body').on('click', '.map-russia-39-2-district, .face-39-2-table-name-link', function(e) {
        var districtID = $(this).attr('data-id');
        var curYear = $('.face-39-2-year-text').html();
        var curData = null;
        for (var i = 0; i < faceData39_2.length; i++) {
            if (faceData39_2[i].year == curYear) {
                for (var j = 0; j < faceData39_2[i].data.length; j++) {
                    if (faceData39_2[i].data[j].id == districtID) {
                        curData = faceData39_2[i].data[j];
                    }
                }
            }
        }
        if (curData !== null) {

            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var districtTitle = '';
            for (var r = 0; r < russiaDistricts.length; r++) {
                if (russiaDistricts[r].id == districtID) {
                    districtTitle = russiaDistricts[r].title;
                }
            }
            if (districtID == '0') {
                districtTitle = 'Российская Федерация';
            }

            var maxSumm = 0;
            if (parseFloat(curData.summ1) > maxSumm) {
                maxSumm = parseFloat(curData.summ1);
            }
            if (parseFloat(curData.summ2) > maxSumm) {
                maxSumm = parseFloat(curData.summ2);
            }
            if (parseFloat(curData.summ3) > maxSumm) {
                maxSumm = parseFloat(curData.summ3);
            }
            if (parseFloat(curData.summ4) > maxSumm) {
                maxSumm = parseFloat(curData.summ4);
            }
            if (parseFloat(curData.summ5) > maxSumm) {
                maxSumm = parseFloat(curData.summ5);
            }
            var countLines = Math.ceil(maxSumm / 10) + 1;
            maxSumm = countLines * 10;

            var windowHTML   =  '<div class="window-39-2">';
            windowHTML      +=      '<div class="window-39-2-title">' + districtTitle + ', ' + curYear + '</div>';
            windowHTML      +=      '<div class="window-39-2-scale">';
            windowHTML      +=          '<div class="window-39-2-scale-item"><span>0</span></div>';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=      '<div class="window-39-2-scale-item" style="left:' + ((i + 1) / countLines* 100) + '%"><span>' + ((i + 1) * 10) + '%</span></div>';
            }
            windowHTML      +=      '</div>';

            windowHTML      +=      '<div class="window-39-2-list">';

            windowHTML      +=          '<div class="window-39-2-item">';
            windowHTML      +=              '<div class="window-39-2-item-title">Программы ВО (бакалавриат, специалитет, магистратура)</div>';
            windowHTML      +=              '<div class="window-39-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-39-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-39-2-item-value" style="width:' + (parseFloat(curData.summ1) / maxSumm * 100) + '%"><span>' + curData.summ1 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=          '<div class="window-39-2-item">';
            windowHTML      +=              '<div class="window-39-2-item-title">Подготовка квалифицированных рабочих, служащих</div>';
            windowHTML      +=              '<div class="window-39-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-39-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-39-2-item-value" style="width:' + (parseFloat(curData.summ2) / maxSumm * 100) + '%"><span>' + curData.summ2 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=          '<div class="window-39-2-item">';
            windowHTML      +=              '<div class="window-39-2-item-title">Подготовка специалистов среднего звена</div>';
            windowHTML      +=              '<div class="window-39-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-39-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-39-2-item-value" style="width:' + (parseFloat(curData.summ3) / maxSumm * 100) + '%"><span>' + curData.summ3 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=          '<div class="window-39-2-item">';
            windowHTML      +=              '<div class="window-39-2-item-title">Профессиональное обучение</div>';
            windowHTML      +=              '<div class="window-39-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-39-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-39-2-item-value" style="width:' + (parseFloat(curData.summ4) / maxSumm * 100) + '%"><span>' + curData.summ4 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=          '<div class="window-39-2-item">';
            windowHTML      +=              '<div class="window-39-2-item-title">Дополнительные профессиональные программы</div>';
            windowHTML      +=              '<div class="window-39-2-item-values">';
            for (var i = 0; i < countLines; i++) {
                windowHTML      +=              '<div class="window-39-2-item-values-sep" style="left:' + ((i + 1) / countLines* 100) + '%"></div>';
            }
            windowHTML      +=                  '<div class="window-39-2-item-value" style="width:' + (parseFloat(curData.summ5) / maxSumm * 100) + '%"><span>' + curData.summ5 + '%</span></div>';
            windowHTML      +=              '</div>';
            windowHTML      +=          '</div>';

            windowHTML      +=      '</div>';
            windowHTML      +=  '</div>';

            $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        e.preventDefault();
    });

    $('.map-russia-39-2').mCustomScrollbar({
        axis: 'x'
    });

    $('.face-39-2-table-wrap').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });

});

function face39_2_Redraw() {
    var newMap = '';
    $('.face-39-2-table-row').remove();

    for (var i = 0; i < russiaDistricts.length; i++) {
        var districtID = russiaDistricts[i].id;
        var districtTitle = russiaDistricts[i].title;
        newMap += '<g class="map-russia-39-2-district" data-id="' + districtID + '" data-title="' + districtTitle + '">';
        for (var j = 0; j < russiaRegions.length; j++) {
            var curRegion = russiaRegions[j];
            if (curRegion.district == districtID) {
                newMap += '<g>' + curRegion.svg + '</g>';
            }
        }
        newMap += '</g>';
    }
    $('.map-russia-39-2 svg').html(newMap);

    var curYear = $('.face-39-2-year-text').html();
    var curData = null;
    for (var i = 0; i < faceData39_2.length; i++) {
        if (faceData39_2[i].year == curYear) {
            curData = faceData39_2[i].data;
        }
    }
    if (curData !== null) {
        var activeCol1 = '';
        var activeCol2 = '';
        var activeCol3 = '';
        var activeCol4 = '';
        var activeCol5 = '';
        var curIndexSort = $('.face-39-2-table-head').index($('.face-39-2-table-head.active')) - 1;
        switch (curIndexSort) {
            case 0:
                curData.sort(face39_2Sort_1);
                activeCol1 = ' active';
                break;
            case 1:
                curData.sort(face39_2Sort_2);
                activeCol2 = ' active';
                break;
            case 2:
                curData.sort(face39_2Sort_3);
                activeCol3 = ' active';
                break;
            case 3:
                curData.sort(face39_2Sort_4);
                activeCol4 = ' active';
                break;
            case 4:
                curData.sort(face39_2Sort_5);
                activeCol5 = ' active';
                break;
        }

        for (var i = 0; i < curData.length; i++) {
            var districtID = curData[i].id;
            var districtTitle = '';
            for (var r = 0; r < russiaDistricts.length; r++) {
                if (russiaDistricts[r].id == districtID) {
                    districtTitle = russiaDistricts[r].title.replace(' федеральный округ', '');
                }
            }
            var russiaClass = '';
            if (districtID == '0') {
                districtTitle = 'Россия';
                russiaClass = ' russia';
            }

            $('.face-39-2-table').append('<div class="face-39-2-table-row' + russiaClass + '">' +
                                            '<div class="face-39-2-table-name">' +
                                                '<a href="#" class="face-39-2-table-name-link" data-id="' + districtID + '">' + districtTitle + '</a>' +
                                            '</div>' +
                                            '<div class="face-39-2-table-value' + activeCol1 + '">' + curData[i].summ1 + '%</div>' +
                                            '<div class="face-39-2-table-value' + activeCol2 + '">' + curData[i].summ2 + '%</div>' +
                                            '<div class="face-39-2-table-value' + activeCol3 + '">' + curData[i].summ3 + '%</div>' +
                                            '<div class="face-39-2-table-value' + activeCol4 + '">' + curData[i].summ4 + '%</div>' +
                                            '<div class="face-39-2-table-value' + activeCol5 + '">' + curData[i].summ5 + '%</div>' +
                                          '</div>');
        }
        $('.face-39-2-table-fixed').css({'width': $('.face-39-2-table-wrap .face-39-2-table-name').eq(0).outerWidth()});
    }
}

function face39_2Sort_1(a, b) {
    var value1 = parseFloat(a.summ1);
    var value2 = parseFloat(b.summ1);
    if (a.id == '0') return -1;
    if (b.id == '0') return 1;
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face39_2Sort_2(a, b) {
    var value1 = parseFloat(a.summ2);
    var value2 = parseFloat(b.summ2);
    if (a.id == '0') return -1;
    if (b.id == '0') return 1;
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face39_2Sort_3(a, b) {
    var value1 = parseFloat(a.summ3);
    var value2 = parseFloat(b.summ3);
    if (a.id == '0') return -1;
    if (b.id == '0') return 1;
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face39_2Sort_4(a, b) {
    var value1 = parseFloat(a.summ4);
    var value2 = parseFloat(b.summ4);
    if (a.id == '0') return -1;
    if (b.id == '0') return 1;
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

function face39_2Sort_5(a, b) {
    var value1 = parseFloat(a.summ5);
    var value2 = parseFloat(b.summ5);
    if (a.id == '0') return -1;
    if (b.id == '0') return 1;
    if (value1 > value2) return -1;
    if (value1 == value2) return 0;
    if (value1 < value2) return 1;
}

$(document).ready(function() {
    $('.face-34-4-type-current').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.face-34-4-type').length == 0) {
            $('.face-34-4-type').removeClass('open');
        }
    });

    $('.face-34-4-type ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.face-34-4-type ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.face-34-4-type-current').html($(this).html());
            face34_4_Redraw();
        }
        $('.face-34-4-type').removeClass('open');
        e.preventDefault();
    });

});

function face34_4_Redraw() {
    var curType = $('.face-34-4-type li.active').attr('data-type');

    var curData = null;
    for (var i = 0; i < faceData34_4.length; i++) {
        if (faceData34_4[i].title == curType) {
            curData = faceData34_4[i].data;
        }
    }
    
    var face1Labels = [];
    var face1DataActually = [];

    $('.face-34-4-container .face-1-chart-graph').html('');
    $('.face-34-4-container .face-1-chart-labels').html('');
    $('.face-34-4-container .face-1-chart-icons').html('');

    var itemWidth = 84;

    var itemMargin = 62;

    for (var i = 0; i < curData.length; i++) {
        var curDataItem = curData[i];
        face1Labels.push(curDataItem.year);
        face1DataActually.push(parseFloat(curDataItem.ratio));
    }

    $('.face-34-4-container .face-1-chart').width(face1Labels.length * (itemWidth + itemMargin));

    var minPlace = 9999;
    var maxPlace = 0;

    for (var i = 0; i < face1DataActually.length; i++) {
        if (face1DataActually[i] != null) {
            if (face1DataActually[i] < minPlace) {
                minPlace = face1DataActually[i];
            }
            if (face1DataActually[i] > maxPlace) {
                maxPlace = face1DataActually[i];
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

    var curLastActually = -1;
    for (var i = 0; i < face1DataActually.length; i++) {
        if (face1DataActually[i] != null) {
            curLastActually++;
            var curX = (i * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
            var curY = ((face1DataActually[i] - maxPlace) / (minPlace - maxPlace)) * $('.face-34-4-container .face-1-chart-graph').height();
            if (face1DataActually[i - 1] != null) {
                var prevX = ((i - 1) * (itemWidth + itemMargin)) + itemMargin / 2 - 8;
                var prevY = ((face1DataActually[i - 1] - maxPlace) / (minPlace - maxPlace)) * $('.face-34-4-container .face-1-chart-graph').height();
                var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                if (curY < prevY) {
                    curAngle = -curAngle;
                }
                $('.face-34-4-container .face-1-chart-graph').append('<div class="face-1-chart-line active" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg)"></div>');
            }
            $('.face-34-4-container .face-1-chart-graph').append('<div class="face-1-chart-point active" style="left:' + curX + 'px; top:' + curY + 'px"><span><strong>' + parseFloat(face1DataActually[i]).toFixed(1) + '<em>&nbsp;%</em></strong></span></div>');
        }
    }

    for (var i = 0; i < face1Labels.length; i++) {
        if (face1DataActually[i] != null) {
            $('.face-34-4-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * (itemWidth + itemMargin)) + 'px"><strong>' + face1Labels[i] + '</strong></div>');
        } else {
            $('.face-34-4-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * (itemWidth + itemMargin)) + 'px"><span>' + face1Labels[i] + '</span></div>');
        }
    }

    var maxSumm = 0;

    for (var i = 0; i < curData.length; i++) {
        var curDataItem = curData[i];

        if (maxSumm < parseFloat(curDataItem.summ1)) {
            maxSumm = parseFloat(curDataItem.summ1);
        }

        if (maxSumm < parseFloat(curDataItem.summ2)) {
            maxSumm = parseFloat(curDataItem.summ2);
        }
    }

    for (var i = 0; i < curData.length; i++) {
        var curDataItem = curData[i];

        $('.face-34-4-container .face-1-chart-icons').append('<div class="face-1-chart-icon" style="left:' + (i * (itemWidth + itemMargin)) + 'px">' +
                                                                    '<div class="face-1-chart-icon-count" style="height:' + (parseFloat(curDataItem.summ1) / maxSumm * 100) + '%"><div class="face-1-chart-icon-count-inner"><div class="face-1-chart-icon-value">' + parseFloat(curDataItem.summ1).toFixed(1) + '</div></div></div>' +
                                                                    '<div class="face-1-chart-icon-summ" style="height:' + (parseFloat(curDataItem.summ2) / maxSumm * 100) + '%"><div class="face-1-chart-icon-summ-inner"><div class="face-1-chart-icon-value">' + parseFloat(curDataItem.summ2).toFixed(1) + '</div></div></div>' +
                                                                '</div>');
    }

    $('.face-34-4-container .face-1-chart-icon-count').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-count-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-count-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-34-4-container .face-1-chart-icon-summ').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        curBar.find('.face-1-chart-icon-summ-inner').append('<svg width="37" height="12" viewBox="0 0 37 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.2374 2.17872C28.5573 0.733884 23.5061 0 18.3467 0H18.1121C13.2955 0 8.71331 0.688017 5.19551 1.94938C1.49732 3.27955 0.1804 4.77025 0 5.4124C0.03608 5.52706 0.0541188 5.66467 0.0721588 5.80227C0.414918 6.49029 1.804 7.91219 5.24964 9.12768C8.82155 10.389 13.4759 11.1 18.3467 11.1C23.5061 11.1 28.3769 10.3432 32.0751 8.94422C36.08 7.43058 36.982 5.84814 37 5.50413C36.9459 5.11426 36.0439 3.64649 32.2374 2.17872Z" /></svg>');
        var countBlocks = Math.floor(curHeight - 12) / 14;
        for (var i = 0; i < countBlocks; i++) {
            curBar.find('.face-1-chart-icon-summ-inner').append('<svg width="37" height="14" viewBox="0 0 37 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M33.1311 2.322C29.0623 3.94663 23.7585 4.79427 18.1458 4.79427C11.5341 4.79427 4.32302 3.49927 0 0.650268L0.0908198 7.45491C0.0908198 7.47846 0.0908198 7.47845 0.0908198 7.502C0.0908198 7.85518 0.87187 9.43273 4.72263 10.9632C8.35543 12.3995 13.2597 13.2 18.5091 13.2C23.7403 13.2 28.6446 12.3759 32.3319 10.8925C36.1826 9.33854 37 7.71391 37 7.38427V0.25C35.7649 1.09764 34.4752 1.804 33.1311 2.322Z" /></svg>');
        }
    });

    $('.face-34-4-container').mCustomScrollbar('destroy');
    $('.face-34-4-container').mCustomScrollbar({
        axis: 'x',
        scrollButtons: {
            enable: true
        }
    });
}