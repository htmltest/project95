$(document).ready(function() {

    $('body').on('click', '.rating-new-filter-current', function(e) {
        var curFilter = $(this).parent();
        if (curFilter.hasClass('open')) {
            curFilter.removeClass('open');
        } else {
            $('.rating-new-filter.open').removeClass('open');
            curFilter.addClass('open');
            curFilter.find('ul').attr('style', '');
            var curMax = Number(curFilter.find('ul').css('max-width').replace(/px/, ''));
            curFilter.find('ul').css({'max-width': 'none'});
            if (curFilter.find('ul').outerWidth() > curMax) {
                curFilter.find('ul').css({'width': curMax, 'white-space': 'normal'});
            }
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.rating-new-filter').length == 0) {
            $('.rating-new-filter.open').removeClass('open');
        }
    });

    $('body').on('click', '.rating-new-filter ul li a', function(e) {
        var curLi = $(this).parent();
        var curFilter = curLi.parent().parent();
        if (!curLi.hasClass('active')) {
            curFilter.find('li.active').removeClass('active');
            curLi.addClass('active');
            curFilter.find('.rating-new-filter-current').html($(this).html());

            var curFace = curFilter.parents().filter('.cube-face');
            var curFaceIndex = $('.cube-face').index(curFace);
            if (typeof (ratingsNew[curFaceIndex].update) === 'function') {
                ratingsNew[curFaceIndex].update(curFace, ratingsNewSearchData(curFaceIndex));
            }
            var curFilterName = curFilter.attr('data-name');
            if (curFace.find('.face-title-' + curFilterName).length == 1) {
                curFace.find('.face-title-' + curFilterName).html(curLi.attr('data-value'));
            }
        }
        curFilter.removeClass('open');
        e.preventDefault();
    });

    for (var indexRating = 0; indexRating < ratingsNew.length; indexRating++) {
        var curRating = ratingsNew[indexRating];
        var curFace = $('.cube-face').eq(indexRating);

        if (typeof (curRating.filters) !== 'undefined') {
            for (var indexFilter = 0; indexFilter < curRating.filters.length; indexFilter++) {
                var curFilter = curRating.filters[indexFilter];

                var noFilter = '';
                if (typeof (curFilter.nofilter) !== 'undefined' && curFilter.nofilter) {
                    noFilter = ' data-nofilter="true"';
                }
                var filterHTML = '<div class="rating-new-filter" data-name="' + curFilter.name + '"' + noFilter + '>';
                for (var indexValue = 0; indexValue < curFilter.values.length; indexValue++) {
                    if (curFilter.values[indexValue].active == true) {
                        filterHTML += '<div class="rating-new-filter-current">' + curFilter.values[indexValue].label + '</div>';
                    }
                }
                filterHTML += '<ul>';
                for (var indexValue = 0; indexValue < curFilter.values.length; indexValue++) {
                    var activeClass = '';
                    if (curFilter.values[indexValue].active == true) {
                        activeClass = 'active';

                    }
                    filterHTML += '<li class="' + activeClass + '" data-value="' + curFilter.values[indexValue].value + '"><a href="#">' + curFilter.values[indexValue].label + '</a></li>';
                }
                filterHTML += '</ul>';
                filterHTML += '</div>';

                switch (curFilter.position) {
                    case 'left' :
                        if (curFace.find('.rating-new-header').length == 0) {
                            curFace.prepend('<div class="rating-new-header"><div class="rating-new-header-left"></div><div class="rating-new-header-right"></div></div>');
                        }
                        curFace.find('.rating-new-header-left').append(filterHTML);

                        break;

                    case 'right' :
                        if (curFace.find('.rating-new-header').length == 0) {
                            curFace.prepend('<div class="rating-new-header"><div class="rating-new-header-left"></div><div class="rating-new-header-right"></div></div>');
                        }
                        curFace.find('.rating-new-header-right').append(filterHTML);

                        break;

                    case 'bottom' :
                        if (curFace.find('.rating-new-bottom').length == 0) {
                            curFace.append('<div class="rating-new-bottom"></div>');
                        }
                        curFace.find('.rating-new-bottom').append(filterHTML);

                        break;

                    default:
                }
            }
        }
    }

    $('.ratings-new-priority-title-hint-icon').click(function(e) {
        if ($(window).width() < 1140) {
            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var windowHTML = '<div class="ratings-new-window-info-mobile">' + $(this).parent().find('.ratings-new-priority-title-hint-content').html() + '</div>';

            $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }
    });

    $('body').on('click', '.ratings-new-bars-item-info-icon', function(e) {
        if ($(window).width() < 1140) {
            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var windowHTML = '<div class="ratings-new-window-info-mobile">' + $(this).parent().find('.ratings-new-bars-item-info-content').html() + '</div>';

            $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }
    });

    $('body').on('click', '.cube-formula-legend-item-info-icon', function(e) {
        if ($(window).width() < 1140) {
            $('html').addClass('window-open');

            if ($('.window').length > 0) {
                $('.window').remove();
            }
            $('body').append('<div class="window window-monitoring"><div class="window-loading"></div></div>');

            var windowHTML = '<div class="ratings-new-window-info-mobile">' + $(this).parent().find('.cube-formula-legend-item-info-content').html() + '</div>';

            $('.window').html('<div class="window-container window-container-load"><div class="window-content">' + windowHTML + '<a href="#" class="window-close"></a></div></div>')

            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }
    });

});

$(window).on('load resize', function() {
    for (var indexRating = 0; indexRating < ratingsNew.length; indexRating++) {
        if (typeof (ratingsNew[indexRating].update) === 'function') {
            ratingsNew[indexRating].update($('.cube-face').eq(indexRating), ratingsNewSearchData(indexRating));
        }
    }
});

function ratingsNewSearchData(indexFace) {
    var faceData = null;

    var curFace = $('.cube-face').eq(indexFace);
    var curFilter = [];

    curFace.find('.rating-new-filter').each(function() {
        if ($(this).attr('data-nofilter') != 'true') {
            curFilter.push({
                            'name'  : $(this).attr('data-name'),
                            'value' : $(this).find('li.active').attr('data-value')
            });
        }
    });
    if (typeof (ratingsNew[indexFace].data) !== 'undefined') {
        for (var indexData = 0; indexData < ratingsNew[indexFace].data.length; indexData++) {
            var curData = ratingsNew[indexFace].data[indexData];
            var curStatus = true;
            for (var indexFilter = 0; indexFilter < curFilter.length; indexFilter++) {
                if (curData[curFilter[indexFilter].name] != curFilter[indexFilter].value) {
                    curStatus = false;
                }
            }
            if (curStatus) {
                faceData = curData.data;
            }
        }
        if (faceData == null) {
            faceData = ratingsNew[indexFace].data;
        }
    }

    return faceData;
}