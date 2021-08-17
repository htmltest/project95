$(window).on('load', function() {
//Будет ждать загрузки только DOM-дерева
    $('#no-block').removeAttr("id");
});

$(document).ready(function() {
    $(document).on('click','.header-menu-col-title a', function(e){
        e.preventDefault();
    });

    $('.council').each(function() {
        var curBlock = $(this);
        var selectVariants = [];
        curBlock.find('table tbody tr').each(function() {
            var curTR = $(this);
            var curID = curTR.data('group');
            if (!searchVariant(selectVariants, curID)) {
                var curName = curTR.data('group-name');
                selectVariants.push([curID, curName]);
            }
        });
        var curSelectHTML = '<form action="#" method="post"><div class="form-select"><select name="filter" data-placeholder="группа в совете"><option value="*" selected="selected">все группы</option>';
        for (var i = 0; i < selectVariants.length; i++) {
            curSelectHTML += '<option value="' + selectVariants[i][0] + '">' + selectVariants[i][1] + '</option>';
        }
        curSelectHTML    += '</select></form>';
        curBlock.prepend(curSelectHTML);
    });

    function searchVariant(curArray, curValue) {
        var result = false;
        for (var i = 0; i < curArray.length; i++) {
            if (curArray[i][0] == curValue) {
                result = true;
            }
        }
        return result;
    }

    $('.council select').change(function() {
        var curBlock = $(this).parents().filter('.council');
        var curID = $('.council select option:selected').attr('value');
        if (curID == '*') {
            curBlock.find('table tbody tr').fadeIn();
        } else {
            curBlock.find('table tbody tr[data-group="' + curID + '"]').fadeIn();
            curBlock.find('table tbody tr[data-group!="' + curID + '"]').fadeOut();
        }
    });


    $.validator.addMethod('maskPhone',
        function(value, element) {
            if (value == '') {
                return true;
            }
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Не соответствует формату'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('.header-menu-link').click(function(e) {
        $('html').addClass('header-menu-open');
        e.preventDefault();
    });

    $('.header-menu-close-link').click(function(e) {
        $('html').removeClass('header-menu-open');
        e.preventDefault();
    });

    var dateFormat = 'MM yy';
    $('#task-steps-month-calendar-datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        minDate: new Date(2016, 1, 1),
        maxDate: new Date(2026, 12, 1),
        dateFormat: dateFormat,
        onClose: function(dateText, inst) {
            var curForm = $('#task-steps-month-calendar-datepicker').parent();
            var month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();
            var year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();
            var data = curForm.serialize() + '&month=' + month + '&year=' + year;
						$(this).datepicker('setDate', new Date(year, month, 1));
            console.log(data);
						$.ajax({
                type: 'POST',
                url: curForm.attr('action'),
                dataType: 'html',
                data: data,
                cache: false
            }).done(function(html) {
                //$('#stagesContainer').html(html);
                $('.task-steps-month-title, .task-steps-print-month').html($('#task-steps-month-calendar-datepicker').val());
                if ($('.task-steps-days-list').hasClass('slick-slider')) {
                    $('.task-steps-days-list').slick('unslick');
                }
                $('.task-steps-days-list').slick({
                    dots: false,
                    infinite: false,
                    variableWidth: true,
                    prevArrow: '<button type="button" class="slick-prev"></button>',
                    nextArrow: '<button type="button" class="slick-next"></button>'
                });
            });
        }
    });

    $("#tagSelector, #yearSelector").change(function(){
			$(this).parents("form").submit();
		});

    var slickAnimation = false;
		$('.main-calendar-list-inner').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 3,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        dots: false,
        responsive: [
            {
                breakpoint: 1139,
                settings: {
                   slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
		}).on('setPosition', function(event, slick) {
        if ($('.main-calendar-window').length > 0) {
            $('.main-calendar-window').remove();
        }
        $('.main-calendar-item-day.active').removeClass('active');
        $('.main-tabs-calendar-day.active').removeClass('active');
        if (!$('.main-calendar-list .slick-prev').hasClass('slick-disabled') && !$('.main-calendar-list .slick-next').hasClass('slick-disabled')) {
            slickAnimation = false;
            $('.main-calendar-list').removeClass('prevLoading nextLoading');
        }
        if ($('.main-calendar-list .slick-prev').hasClass('slick-disabled')) {
            if (!slickAnimation) {
                if (!$('.main-calendar-item:first').hasClass('last')) {
                    slickAnimation = true;
                    $('.main-calendar-list').addClass('prevLoading');
                    var loadURL = $('.main-calendar').data('prev-url');
                    var loadMonth = $('.main-calendar-item:first').data('month');
                    var loadYear = $('.main-calendar-item:first').data('year');
                    $.ajax({
                        type: 'POST',
                        url: loadURL,
                        dataType: 'html',
                        data: 'month=' + loadMonth + '&year=' + loadYear,
                        cache: false
                    }).done(function(html) {
                        var curLength = $('.main-calendar-item').length;
                        $('.main-calendar-list-inner').slick('slickAdd', html, true);
                        var curLength = $('.main-calendar-item').length - curLength;
                        $('.main-calendar-list-inner').slick('slickGoTo', curLength, true);
                    });
                }
            }
        }
        if ($('.main-calendar-list .slick-next').hasClass('slick-disabled')) {
            if (!slickAnimation) {
                if (!$('.main-calendar-item:last').hasClass('last')) {
                    slickAnimation = true;
                    $('.main-calendar-list').addClass('nextLoading');
                    var loadURL = $('.main-calendar').data('next-url');
                    var loadMonth = $('.main-calendar-item:last').data('month');
                    var loadYear = $('.main-calendar-item:last').data('year');
                    $.ajax({
                        type: 'POST',
                        url: loadURL,
                        dataType: 'html',
                        data: 'month=' + loadMonth + '&year=' + loadYear,
                        cache: false
                    }).done(function(html) {
                        $('.main-calendar-list-inner').slick('slickAdd', html);
                    });
                }
            }
        }
    });

    $('.task-steps-days-list').slick({
        dots: false,
        infinite: false,
        variableWidth: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>'
    });

    $('.task-menu a').click(function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            $('.task-menu li.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.task-menu li').index(curItem);
            $('.task-tab.active').removeClass('active');
            $('.task-tab').eq(curIndex).addClass('active');
            if ($('.task-menu ul').hasClass('slick-slider')) {
                $('.task-menu ul').slick('slickGoTo', curIndex);
            }
        }
        e.preventDefault();
    });

    $('.gallery-big').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        adaptiveHeight: true,
        dots: false
    }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $('.gallery-preview-item.active').removeClass('active');
        $('.gallery-preview-item').eq(nextSlide).addClass('active');
    });

    $('.gallery-preview-inner').slick({
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        adaptiveHeight: true,
        dots: false,
        responsive: [
            {
                breakpoint: 1139,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    });

    $('.gallery-preview-item:first').addClass('active');

    $('.gallery-preview-item a').click(function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            $('.gallery-preview-item.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.gallery-preview-item').index(curItem);
            $('.gallery-big').slick('slickGoTo', curIndex);
        }
        e.preventDefault();
    });

    $('.up-link a').click(function(e) {
        $.scrollTo(0, {duration : 500});
        e.preventDefault();
    });

    $('body').on('click', '.window-link', function(e) {
				var curLink = $(this);
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.challenges-item-header').click(function(e) {
        var curBlock = $(this).parents().filter('.challenges-item');
        curBlock.toggleClass('open');
        curBlock.find('.challenges-item-more').slideToggle(function() {
            $(window).trigger('resize');
        });
        e.preventDefault();
    });

    $('.programms').each(function() {
        var curBlock = $(this);

        var curFilter = curBlock.find('.programms-menu li.active a').data('filter');
        curBlock.find('.programms-list').isotope({
            itemSelector: '.programms-item',
            filter: curFilter
        });
        if (curFilter != '*' && curBlock.find('.programms-item' + curFilter).length == 0) {
            curBlock.find('.programms-list-empty').show();
        } else {
            curBlock.find('.programms-list-empty').hide();
        }
    });

    $('.programms-menu li a').click(function(e) {
        var curLi = $(this).parent();
        var curBlock = curLi.parents().filter('.programms');
        if (!curLi.hasClass('active')) {
            curBlock.find('.programms-menu li.active').removeClass('active');
            var curFilter = $(this).data('filter');
            curBlock.find('.programms-list').isotope({
                filter: curFilter
            });
            curLi.addClass('active');
            if (curFilter != '*' && curBlock.find('.programms-item' + curFilter).length == 0) {
                curBlock.find('.programms-list-empty').show();
            } else {
                curBlock.find('.programms-list-empty').hide();
            }
        }
        e.preventDefault();
    });

    $('.similars-link a').click(function(e) {
        var curBlock = $(this).parents().filter('.similars');
        curBlock.toggleClass('open');
        curBlock.find('.similars-list').slideToggle();
        e.preventDefault();
    });

    $('.nioktr-item-link').click(function(e) {
        var curBlock = $(this).parent();
        if (curBlock.hasClass('open')) {
            curBlock.removeClass('open');
            curBlock.find('.nioktr-item-content').slideUp();
        } else {
            if ($('.nioktr-item.open').length > 0) {
                $('.nioktr-item.open').find('.nioktr-item-content').slideUp(function() {
                    $('.nioktr-item.open').removeClass('open');
                    curBlock.addClass('open');
                    curBlock.find('.nioktr-item-content').slideDown();
                });
            } else {
                curBlock.addClass('open');
                curBlock.find('.nioktr-item-content').slideDown();
            }
        }
        e.preventDefault();
    });


    $('body').on('click', '.main-calendar-item-day-link', function(e) {
        var curDay = $(this).parent();
        if (curDay.hasClass('active')) {
            if ($('.main-calendar-window').length > 0) {
                $('.main-calendar-window').remove();
            }
            curDay.removeClass('active');
        } else {
            if ($('.main-calendar-window').length > 0) {
                $('.main-calendar-window').remove();
            }
            $('.main-calendar-item-day.active').removeClass('active');
            $('.main-tabs-calendar-day.active').removeClass('active');
            curDay.addClass('active');
            $('.wrapper').append('<div class="main-calendar-window">' + curDay.find('.main-calendar-item-day-content').html() + '</div>');
            var curWindow = $('.main-calendar-window');
            curWindow.css({'left': curDay.offset().left, 'top': curDay.offset().top - $('.wrapper').offset().top});
            if (curWindow.offset().left + curWindow.outerWidth() > $('.wrapper').width()) {
                curWindow.addClass('right');
            }
            curWindow.find('.main-calendar-window-list-inner').jScrollPane({
                autoReinitialise: true
            });
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.main-calendar-window').length == 0 && !$(e.target).hasClass('main-calendar-window') && !$(e.target).hasClass('main-calendar-item-day-link')) {
            if ($('.main-calendar-window').length > 0) {
                $('.main-calendar-window').remove();
            }
            $('.main-calendar-item-day.active').removeClass('active');
            $('.main-tabs-calendar-day.active').removeClass('active');
        }
    });

    $('.header-search-link').click(function(e) {
        $(this).parents().filter('.header-search').addClass('open');
        e.preventDefault();
    });

    $('.header-search-close').click(function(e) {
        $(this).parents().filter('.header-search').find('.header-search-input input').val('');
        $(this).parents().filter('.header-search').removeClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.header-search').length == 0) {
            $('.header-search').removeClass('open');
        }
    });

    $('.indicators-group-header').click(function(e) {
        var curBlock = $(this).parents().filter('.indicators-group');
        curBlock.toggleClass('open');
        curBlock.find('.indicators-group-inner').slideToggle();
        e.preventDefault();
    });

    $('.indicators-group-inner-parent').click(function() {
        $(this).parent().find('ul').slideToggle();
    });

    $('a.indicators-tree-group-item-header-inner').click(function(e) {
        var curBlock = $(this).parents().filter('.indicators-tree-group-item').eq(0);
        curBlock.toggleClass('open');
        curBlock.find('.indicators-tree-group-item-list').eq(0).slideToggle();
        if (curBlock.hasClass('open')) {
            $.scrollTo(curBlock.find('.indicators-tree-group-item-list').eq(0), {duration : 500});
        }
        e.preventDefault();
    });

    $('.indicators-select-value').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.indicators-select-field').length == 0) {
            $('.indicators-select-field').removeClass('open');
        }
    });

    $('.indicators-select-list a').click(function(e) {
        $('.indicators-select-field').removeClass('open');
        var curValue = $(this).attr('data-indicator-id');
        var curBlock = $('#indicators-item-' + curValue);
        if (curBlock.length > 0) {
            $('.indicators-tree-group-item.open').removeClass('open');
            $('.indicators-tree-group-item-list').hide();
            curBlock.addClass('open');
            curBlock.find('.indicators-tree-group-item-list').eq(0).show();
            curBlock.parents().filter('.indicators-tree-group-item').addClass('open');
            curBlock.parents().filter('.indicators-tree-group-item').each(function() {
                $(this).find('.indicators-tree-group-item-list').eq(0).show();
            });
            window.setTimeout(function() {
                $.scrollTo(curBlock, {duration : 500});
            }, 100);

        }
        e.preventDefault();
    });

    if (window.location.hash != '') {
        $('a[data-indicator-id="' + window.location.hash.replace('#', '') + '"]').click();
    }

    $('#indicator-select-other').change(function() {
        var curValue = $(this).find('option:selected').attr('value');
        window.location.href = curValue;
    });

    $('.main-subscribe-field .form-input input').focus(function() {
        $('.main-subscribe .form-checkbox').slideDown();
    });

    $('.main-tabs-subscribe-field .form-input input').focus(function() {
        $('.main-tabs-subscribe .form-checkbox').slideDown();
    });

    // $('.header-menu-col-title a').click(function(e) {
    //     $(this).parent().toggleClass('open');
    //     e.preventDefault();
    // });

		//обработчик формы подписки
		$("#subscribeForm").submit(function(e){
			//alert('sended');
			//e.preventDefault();
		});

    $('.footer-menu-title, .footer-contacts-title, .footer-info-title').click(function(e) {
        $(this).parent().toggleClass('open');
    });

    $('.main-regions-map-zoom').each(function() {
        $(this).data('zoom', 1);
        $(this).data('startWidth', $('.main-regions-map svg').attr('width'));
        $(this).data('startHeight', $('.main-regions-map svg').attr('height'));
    });

    $('.main-regions-map-zoom-inc').click(function() {
        var curZomm = $('.main-regions-map-zoom').data('zoom');
        curZomm++;
        if (curZomm == $('.main-regions-map-zoom').data('max')) {
            $('.main-regions-map-zoom-inc').addClass('disabled');
        }
        if (typeof ($('.main-regions-map-zoom').data('startWidth')) == 'undefined') {
            $('.main-regions-map-zoom').data('startWidth', $('.main-regions-map svg').attr('width'));
            $('.main-regions-map-zoom').data('startHeight', $('.main-regions-map svg').attr('height'));
        }
        $('.main-regions-map-zoom').data('zoom', curZomm);
        $('.main-regions-map-zoom-dec').removeClass('disabled');
        var curWidth = $('.main-regions-map-zoom').data('startWidth') * curZomm;
        var curHeight = $('.main-regions-map-zoom').data('startHeight') * curZomm;
        $('.main-regions-map svg').animate({'width': curWidth, 'height': curHeight, 'left': $('.main-regions-map-zoom').data('startWidth') / 2 - curWidth / 2, 'top': $('.main-regions-map-zoom').data('startHeight') / 2 - curHeight / 2});
    });

    $('.main-regions-map-zoom-dec').click(function() {
        var curZomm = $('.main-regions-map-zoom').data('zoom');
        curZomm--;
        if (curZomm == 1) {
            $('.main-regions-map-zoom-dec').addClass('disabled');
        }
        $('.main-regions-map-zoom').data('zoom', curZomm);
        $('.main-regions-map-zoom-inc').removeClass('disabled');
        var curWidth = $('.main-regions-map-zoom').data('startWidth') * curZomm;
        var curHeight = $('.main-regions-map-zoom').data('startHeight') * curZomm;
        $('.main-regions-map svg').animate({'width': curWidth, 'height': curHeight, 'left': $('.main-regions-map-zoom').data('startWidth') / 2 - curWidth / 2, 'top': $('.main-regions-map-zoom').data('startHeight') / 2 - curHeight / 2});
    });

    var mapDrag = false;
    var mapMove = false;
    var mapMoveTimer = null;
    var mapStartX = 0;
    var mapStartY = 0;

    var isTouchCapable = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;

    if (!isTouchCapable) {
        $('.main-regions-map').on('mousedown', function(e) {
            mapDrag = true;
            mapStartX = e.pageX;
            mapStartY = e.pageY;
        });

        $('.main-regions-map').on('mousemove', function(e) {
            if (mapDrag) {
                mapMove = true;
                var curLeft = Number($('.main-regions-map svg').css('left').replace(/px/, ''));
                var curTop = Number($('.main-regions-map svg').css('top').replace(/px/, ''));
                var curDiffX = e.pageX;
                var curDiffY = e.pageY;
                curDiffX = curDiffX - mapStartX;
                curDiffY = curDiffY - mapStartY;
                curLeft += curDiffX;
                curTop += curDiffY;
                mapStartX = e.pageX;
                mapStartY = e.pageY;
                $('.main-regions-map svg').css({'left': curLeft, 'top': curTop});
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
    } else {
        $('.main-regions-map').on('touchstart', function(e) {
            mapDrag = true;
            mapStartX = e.originalEvent.touches[0].pageX;
            mapStartY = e.originalEvent.touches[0].pageY;
        });

        $('.main-regions-map').on('touchmove', function(e) {
            if (mapDrag) {
                var curLeft = Number($('.main-regions-map svg').css('left').replace(/px/, ''));
                var curTop = Number($('.main-regions-map svg').css('top').replace(/px/, ''));
                var curDiffX = e.originalEvent.touches[0].pageX;
                var curDiffY = e.originalEvent.touches[0].pageY;
                curDiffX = curDiffX - mapStartX;
                curDiffY = curDiffY - mapStartY;
                curLeft += curDiffX;
                curTop += curDiffY;
                mapStartX = e.originalEvent.touches[0].pageX;
                mapStartY = e.originalEvent.touches[0].pageY;
                $('.main-regions-map svg').css({'left': curLeft, 'top': curTop});
            }
            e.preventDefault();
        });

        $(document).on('touchend', function(e) {
            mapDrag = false;
        });
    }

});

$(window).on('load', function() {
    if ($('.header-submenu-1').length > 0) {
        if ($('.header-submenu-1-inner').hasClass('slick-slider')) {
            $('.header-submenu-1-inner').slick('unslick');
        }
        var curWidth = 0;
        $('.header-submenu-1-item').each(function() {
            curWidth += $(this).width();
        });
        if (curWidth > $('.header-submenu-1-wrap').width()) {
            var curIndex = $('.header-submenu-1-item').index($('.header-submenu-1-item.active'));
            curIndex = curIndex -1;
            if (curIndex < 0) {
                curIndex = 0;
            }
            $('.header-submenu-1-inner').slick({

                centerPadding: "0px",
                edgeFriction:10,
                dots: false,
                rows: 0,
                infinite: false,
                variableWidth: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>',
                initialSlide: curIndex,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            variableWidth: false
                        }
                    }
                ]
            });
        }
    }
});

$(window).on('load resize scroll', function() {
    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    if ($(window).scrollTop() > windowHeight) {
        $('.up-link').addClass('visible');
    } else {
        $('.up-link').removeClass('visible');
    }

    if (typeof($('footer').offset()) !== 'undefined') {
        if ($(window).scrollTop() + windowHeight > $('footer').offset().top) {
            var curDiff = $(window).scrollTop() + windowHeight - $('footer').offset().top;
            $('.sidebar').css({'margin-bottom': curDiff});
            $('.up-link').removeClass('visible');
        } else {
            $('.sidebar').css({'margin-bottom': 0});
            if ($(window).scrollTop() > windowHeight) {
                $('.up-link').addClass('visible');
            }
        }
    }

});

$(window).on('load', function() {
    if ($('.header-submenu-2').length > 0) {
        if ($('.header-submenu-2-inner').hasClass('slick-slider')) {
            $('.header-submenu-2-inner').slick('unslick');
        }
        var curWidth = 0;
        $('.header-submenu-2-item').each(function() {
            curWidth += $(this).width();
        });
        if (curWidth > $('.header-submenu-2-wrap').width()) {
            var curIndex = $('.header-submenu-2-item').index($('.header-submenu-2-item.active'));
            if (curIndex < 0) {
                curIndex = 0;
            }
            $('.header-submenu-2-inner').slick({
                dots: false,
								infinite: false,
                variableWidth: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>',
                initialSlide: curIndex,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            variableWidth: false
                        }
                    }
                ]
            });
        }
    }
});

$(window).on('resize', function() {
    $('.form-select select').chosen('destroy');
    $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
    $('.form-select select').each(function() {
        var curSelect = $(this);
        if (curSelect.data('placeholder') != '') {
            curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
        }
    });
});

$(window).bind('load resize', function() {
    if ($('.task-menu').length > 0) {
        if ($(window).width() < 1140) {
            var curIndex = $('.task-menu ul li').index($('.task-menu ul li.active'));
            if (curIndex < 0) {
                curIndex = 0;
            }
            if (!$('.task-menu ul').hasClass('slick-slider')) {
                $('.task-menu ul').slick({
                    infinite: false,
                    arrows: false,
					initialSlide: curIndex,
                    dots: false,
                    variableWidth: true
                });
            }
        } else {
            if ($('.task-menu ul').hasClass('slick-slider')) {
                $('.task-menu ul').slick('unslick');
            }
        }
    }
});

$(window).on('load resize scroll', function() {
    $('.main-splash-item, .directions-item, .tasks-item, .challenges-item, .indicators-group').each(function() {
        var curBlock = $(this);
        if (!curBlock.hasClass('on-scroll-visible')) {
            if (curBlock.offset().top + curBlock.outerHeight() / 2 < $(window).scrollTop() + $(window).height()) {
                curBlock.addClass('on-scroll-visible');
            }
        }
    });
});

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('focus');
        }
    });

    curForm.find('.form-input input, .form-input textarea').focus(function() {
        $(this).parent().addClass('focus');
    });

    curForm.find('.form-input input, .form-input textarea').blur(function() {
        if ($(this).val() == '') {
            $(this).parent().removeClass('focus');
        }
    });

    curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});
    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        if (curSelect.data('placeholder') != '') {
            curSelect.parent().find('.chosen-single').prepend('<strong>' + curSelect.data('placeholder') + '</strong>');
        }
    });


    curForm.find('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent().parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });


		if (curForm.parent().hasClass('main-subscribe') || curForm.parent().hasClass('main-tabs-subscribe')) {
            curForm.validate({
                ignore: '',
                submitHandler: function(form, validatorcalc) {
                    $.ajax({
                        type: 'POST',
                        url: $(form).attr('action'),
                        data: $(form).serialize(),
                        dataType: 'json',
                        cache: false
                    }).done(function(res) {
                        /*
												if ($('.window').length > 0) {
                            windowClose();
                        }
                        windowOpen(html);
                        */
                        alert(res.m);
                        if(res.s == 1){
													//сбросим текстовое поле в случае успеха
													$(".main-subscribe input[type=text]").val('');
												}
                    });
                }
            });
      } else {
        curForm.validate({
            ignore: '',
            invalidHandler: function(form, validatorcalc) {
                validatorcalc.showErrors();
                checkErrors();
            }
        });
    }

}

function checkErrors() {
    $('.form-checkbox, .form-file').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('input.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });

    $('.form-select').each(function() {
        var curField = $(this).parent().parent();
        if (curField.find('select.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('select.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });
}

function windowOpen(linkWindow, dataWindow, callbackWindow) {
    $('html').addClass('window-open');

    if ($('.window').length == 0) {
        $('body').append('<div class="window"><div class="window-loading"></div></div>')
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window').length > 0) {
            $('.window').remove();
        }
        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + html + '<a href="#" class="window-close"></a></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').one('load', function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        if (typeof (callbackWindow) != 'undefined') {
            callbackWindow.call();
        }

        $('.window .gallery-big').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            adaptiveHeight: true,
            dots: false
        }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
            $('.window .gallery-preview-item.active').removeClass('active');
            $('.window .gallery-preview-item').eq(nextSlide).addClass('active');
        });

        $('.window .gallery-preview-inner').slick({
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 5,
            prevArrow: '<button type="button" class="slick-prev"></button>',
            nextArrow: '<button type="button" class="slick-next"></button>',
            adaptiveHeight: true,
            dots: false,
            responsive: [
                {
                    breakpoint: 1139,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                }
            ]
        });

        $('.window .gallery-preview-item:first').addClass('active');

        $('.window .gallery-preview-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                $('.window .gallery-preview-item.active').removeClass('active');
                curItem.addClass('active');
                var curIndex = $('.window .gallery-preview-item').index(curItem);
                $('.window .gallery-big').slick('slickGoTo', curIndex);
            }
            e.preventDefault();
        });

        $('.window form').each(function() {
            initForm($(this));
        });

        $(window).trigger('resize');
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});

        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window-container').height() > $('.window').height() - 60) {
            $('.window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
    }
}

$(window).on('load', function() {

    $(".header-menu-col-title").click(function () {
        $(this).parent().find(".header-menu-col-list").slideToggle({
            duration: 200,
            complete: function () {
                var button =  $(this).parent().find(".header-menu-col-title");
                if ($(this).is(':visible')) button.addClass('open');
                else button.removeClass('open');
            }
        });
    });

});

$(document).ready(function() {

    $('.sidebar-link').click(function(e) {
        $('.sidebar').toggleClass('open');
        e.preventDefault();
    });

    $('.sidebar-close').click(function(e) {
        $('.sidebar').removeClass('open');
        e.preventDefault();
    });

    $('.sidebar').each(function() {
        $('.sidebar-tabs-menu').html('');
        $('.sidebar-tab').each(function() {
            var curTab = $(this);
            $('.sidebar-tabs-menu').append('<div class="sidebar-tabs-menu-item"><a href="#">' + curTab.attr('data-title') + '</a></div>');
            if (curTab.find('.sidebar-section-tab').length > 1) {
                curTab.find('.sidebar-section-menu').append('<div class="sidebar-section-menu-current">' + curTab.find('.sidebar-section-tab').eq(0).attr('data-title') + '</div><ul></ul>');
                curTab.find('.sidebar-section-tab').each(function() {
                    curTab.find('.sidebar-section-menu ul').append('<li><a href="#">' + $(this).attr('data-title') + '</a></li>');
                });
                curTab.find('.sidebar-section-menu li').eq(0).addClass('active');
            }
            curTab.find('.sidebar-section-tab').eq(0).addClass('active');
        });
        $('.sidebar-tab').eq(0).addClass('active');
        $('.sidebar-tabs-menu-item').eq(0).addClass('active');
    });

    $('.sidebar-tabs-menu-item a').click(function(e) {
        $('.sidebar').addClass('open');
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            $('.sidebar-tabs-menu-item.active').removeClass('active');
            curItem.addClass('active');
            $('.sidebar-content-title').html($(this).html());
            var curIndex = $('.sidebar-tabs-menu-item').index(curItem);
            $('.sidebar-tab.active').removeClass('active');
            $('.sidebar-tab').eq(curIndex).addClass('active');
            $('.sidebar-content').mCustomScrollbar('scrollTo', 'top');
        }
        e.preventDefault();
    });

    $('.sidebar-section-menu-current').click(function() {
        $(this).parent().toggleClass('open');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.sidebar-section-menu').length == 0) {
            $('.sidebar-section-menu.open').removeClass('open');
        }
    });

    $('.sidebar-section-menu ul li a').click(function(e) {
        var curLink = $(this);
        var curLi = curLink.parent();
        var curMenu = curLi.parents().filter('.sidebar-section-menu');
        curMenu.removeClass('open');
        if (!curLi.hasClass('active')) {
            curMenu.find('.sidebar-section-menu-current').html(curLink.html());
            curMenu.find('li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = curMenu.find('li').index(curLi);
            curMenu.parent().find('.sidebar-section-tab.active').removeClass('active');
            curMenu.parent().find('.sidebar-section-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.main-tabs').each(function() {
        var curTabs = $(this);
        if (curTabs.find('.main-tabs-content').length > 1) {
            curTabs.find('.main-tabs-menu').append('<div class="main-tabs-menu-current">' + curTabs.find('.main-tabs-content').eq(0).attr('data-title') + '</div><div class="main-tabs-menu-list"></div>');
            curTabs.find('.main-tabs-content').each(function() {
                curTabs.find('.main-tabs-menu-list').append('<div class="main-tabs-menu-item"><a href="#">' + $(this).attr('data-title') + '</a></div>');
            });
            curTabs.find('.main-tabs-menu-item').eq(0).addClass('active');
        }
        curTabs.find('.main-tabs-content').eq(0).addClass('active');
    });

    $('.main-tabs-menu-item a').click(function(e) {
        var curItem = $(this).parent();
        var curTabs = curItem.parents().filter('.main-tabs');
        if (!curItem.hasClass('active')) {
            curTabs.find('.main-tabs-menu-item.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = curTabs.find('.main-tabs-menu-item').index(curItem);
            curTabs.find('.main-tabs-content.active').removeClass('active');
            curTabs.find('.main-tabs-content').eq(curIndex).addClass('active');
            curTabs.find('.main-tabs-menu-current').html($(this).html());
            curTabs.find('.main-tabs-menu').removeClass('open');
        }
        e.preventDefault();
    });

    $('body').on('mouseenter', '.opendata-chart-map-inner g', function(e) {
        if ($(window).width() > 1119) {
            $('.window-region-chart-hint').remove();
            $('body').append('<div class="window-region-chart-hint">' +
                                 '<div class="window-region-chart-hint-container">' +
                                    '<div class="window-region-chart-hint-title">' + $(this).attr('data-title') + '</div>' +
                                 '</div>' +
                             '</div>');
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.opendata-chart-map-inner g', function(e) {
        if ($(window).width() > 1119) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mouseleave', '.opendata-chart-map-inner g', function(e) {
        if ($(window).width() > 1119) {
            $('.window-region-chart-hint').remove();
        }
    });

    $('body').on('click', '.opendata-chart-map-inner g', function(e) {
        var curURL = $(this).attr('data-url');
        windowOpen(curURL, null, function() {$(window).trigger('resize')});
    });

    var slickAnimation2 = false;
    $('.main-tabs-calendar').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 3,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        dots: false,
        responsive: [
            {
                breakpoint: 1139,
                settings: {
                   slidesToShow: 1,
                   slidesToScroll: 1
                }
            }
        ]
    }).on('setPosition', function(event, slick) {
        if ($('.main-calendar-window').length > 0) {
            $('.main-calendar-window').remove();
        }
        if (!$('.main-tabs-calendar .slick-prev').hasClass('slick-disabled') && !$('.main-tabs-calendar .slick-next').hasClass('slick-disabled')) {
            slickAnimation2 = false;
            $('.main-tabs-calendar').removeClass('prevLoading nextLoading');
        }
        if ($('.main-tabs-calendar .slick-prev').hasClass('slick-disabled')) {
            if (!slickAnimation2) {
                if (!$('.main-tabs-calendar-month:first').hasClass('last')) {
                    slickAnimation2 = true;
                    $('.main-tabs-calendar').addClass('prevLoading');
                    var loadURL = $('.main-tabs-calendar').data('prev-url');
                    var loadMonth = $('.main-tabs-calendar-month:first').data('month');
                    var loadYear = $('.main-tabs-calendar-month:first').data('year');
                    $.ajax({
                        type: 'POST',
                        url: loadURL,
                        dataType: 'html',
                        data: 'month=' + loadMonth + '&year=' + loadYear,
                        cache: false
                    }).done(function(html) {
                        var curLength = $('.main-tabs-calendar-month').length;
                        $('.main-tabs-calendar').slick('slickAdd', html, true);
                        var curLength = $('.main-tabs-calendar-month').length - curLength;
                        $('.main-tabs-calendar').slick('slickGoTo', curLength, true);
                    });
                }
            }
        }
        if ($('.main-tabs-calendar .slick-next').hasClass('slick-disabled')) {
            if (!slickAnimation2) {
                if (!$('.main-tabs-calendar-month:last').hasClass('last')) {
                    slickAnimation2 = true;
                    $('.main-tabs-calendar').addClass('nextLoading');
                    var loadURL = $('.main-tabs-calendar').data('next-url');
                    var loadMonth = $('.main-tabs-calendar-month:last').data('month');
                    var loadYear = $('.main-tabs-calendar-month:last').data('year');
                    $.ajax({
                        type: 'POST',
                        url: loadURL,
                        dataType: 'html',
                        data: 'month=' + loadMonth + '&year=' + loadYear,
                        cache: false
                    }).done(function(html) {
                        $('.main-tabs-calendar').slick('slickAdd', html);
                    });
                }
            }
        }
    });

});

$(window).on('load resize', function() {

    $('.sidebar-content').each(function() {
        $('.sidebar-content').mCustomScrollbar('destroy');
        $('.sidebar-content').mCustomScrollbar({
            axis: 'y'
        });
    });

    $('.main-tabs-analitycs').each(function() {
        var curList = $(this);

        curList.find('.main-tabs-analitycs-item-container').css({'min-height': '0px'});

        curList.find('.main-tabs-analitycs-item-container').each(function() {
            var curBlock = $(this);
            var curHeight = curBlock.outerHeight();
            var curTop = curBlock.offset().top;

            curList.find('.main-tabs-analitycs-item-container').each(function() {
                var otherBlock = $(this);
                if (otherBlock.offset().top == curTop) {
                    var newHeight = otherBlock.outerHeight();
                    if (newHeight > curHeight) {
                        curBlock.css({'min-height': newHeight + 'px'});
                    } else {
                        otherBlock.css({'min-height': curHeight + 'px'});
                    }
                }
            });
        });
    });

    $('.window-region-indicator-table').each(function() {
        var curTable = $(this);
        if ($(window).width() > 1139) {
            curTable.mCustomScrollbar({
                axis: 'x'
            });
        } else {
            curTable.mCustomScrollbar('destroy');
        }
    });

});

function createChartMap(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]');
    if (curBlock.length == 1) {
        makeChartMap(curBlock, data);
        curBlock.parent().find('.opendata-chart-menu-item a').unbind('click');
        curBlock.parent().find('.opendata-chart-menu-item a').click(function(e) {
            var curItem = $(this).parent();
            if (!curItem.hasClass('active')) {
                curItem.parent().find('.opendata-chart-menu-item.active').removeClass('active');
                curItem.addClass('active');
                makeChartMap(curBlock, data);
            }
            e.preventDefault();
        });
    }
}

function makeChartMap(curBlock, data) {
    var newHTML = '';

    newHTML +=  '<div class="opendata-chart-map-wrapper"><div class="opendata-chart-map-inner"><svg width="1110" height="631" viewBox="0 0 1107.77 630.12" fill="none" xmlns="http://www.w3.org/2000/svg"></svg></div></div>';

    if (curBlock.data('year') === undefined) {
        curBlock.data('year', data.data[0].year);
    }
    var curYear = curBlock.data('year');
    var curData = null;
    for (var i = 0; i < data.data.length; i++) {
        if ( data.data[i].year == curYear) {
            curData =  data.data[i].values;
        }
    }

    var curMax = 0;
    for (var i = 0; i < curData.length; i++) {
        if (curMax < Number(curData[i][1])) {
            curMax = Number(curData[i][1]);
        }
    }

    data.ranges = [];
    var map_rages = [0.000001, 0.01, 0.03, 0.20, 1.10];
    var mr_prev = 0;

    for (var i = 0; i < map_rages.length; i++) {
        var rangeStart = curMax * mr_prev;
        var rangeStop = curMax * map_rages[i];
        if (data.numberFixed == 0) {
            rangeStop = Math.ceil(rangeStop);
            rangeStart = Math.ceil(rangeStart);
        }
        data.ranges.push([rangeStart, rangeStop, data.colors[i]]);
        mr_prev = map_rages[i];
    }

    curBlock.html(newHTML);

    if (curData !== null) {
        var newMap = '';

        for (var j = 0; j < opendataRegions.length; j++) {
            var curRegion = opendataRegions[j];
            for (var i = 0; i < curData.length; i++) {
                if (curRegion.id == curData[i][0]) {
                    var curColorIndex = -1;
                    var curValue = Number(curData[i][1]);
                    var curURL = curData[i][2];
                    for (var c = 0; c < data.ranges.length; c++) {
                        if (curValue >= data.ranges[c][0] && curValue <= data.ranges[c][1]) {
                            curColorIndex = c;
                        }
                        if (curValue == 0) {
                            curColorIndex = 0;
                        }
                    }

                    var curColor = data.ranges[curColorIndex][2];

                    newMap += '<g style="fill:' + curColor + '" data-id="' + curRegion.id + '" data-title="' + curRegion.title + '" data-value="' + curValue + '" data-name="' + data.titleRanges + '" data-url="' + curURL + '">' + curRegion.svg + '</g>';
                }
            }
        }
        curBlock.find('.opendata-chart-map-inner svg').html(newMap);
    }
}

$(document).ready(function(e) {

    $('body').on('click', '.window-region-indicator-table thead th a', function(e) {
        var curLink = $(this);
        var sortDir = 'up'
        var curTable = curLink.parents().filter('table');
        if (!curLink.hasClass('active')) {
            curTable.find('th a.active').removeClass('active up down');
            curLink.addClass('active up');
        } else {
            if (curLink.hasClass('up')) {
                curLink.removeClass('up').addClass('down');
                sortDir = 'down';
            } else {
                curLink.removeClass('down').addClass('up');
            }
        }
        var curIndex = curTable.find('th').index(curLink.parent());

        function windowRegionSortTitleUp(a, b) {
            var value1 = $(a).find('td').eq(curIndex).html();
            var value2 = $(b).find('td').eq(curIndex).html();
            if (value1 < value2) return -1;
            if (value1 == value2) return 0;
            if (value1 > value2) return 1;
        }

        function windowRegionSortTitleDown(a, b) {
            var value1 = $(a).find('td').eq(curIndex).html();
            var value2 = $(b).find('td').eq(curIndex).html();
            if (value1 > value2) return -1;
            if (value1 == value2) return 0;
            if (value1 < value2) return 1;
        }

        function windowRegionSortValueUp(a, b) {
            var curA = $('<div>' + $(a).find('td').eq(curIndex).html() + '</div>');
            curA.find('.window-region-indicator-year-mobile').remove();
            var curB = $('<div>' + $(b).find('td').eq(curIndex).html() + '</div>');
            curB.find('.window-region-indicator-year-mobile').remove();
            var value1 = Number(curA.html().replace(/ /g, '').replace(',', '.'));
            var value2 = Number(curB.html().replace(/ /g, '').replace(',', '.'));
            if (isNaN(value1)) {
                value1 = 0;
            }
            if (isNaN(value2)) {
                value2 = 0;
            }
            if (value1 < value2) return -1;
            if (value1 == value2) return 0;
            if (value1 > value2) return 1;
        }

        function windowRegionSortValueDown(a, b) {
            var curA = $('<div>' + $(a).find('td').eq(curIndex).html() + '</div>');
            curA.find('.window-region-indicator-year-mobile').remove();
            var curB = $('<div>' + $(b).find('td').eq(curIndex).html() + '</div>');
            curB.find('.window-region-indicator-year-mobile').remove();
            var value1 = Number(curA.html().replace(/ /g, '').replace(',', '.'));
            var value2 = Number(curB.html().replace(/ /g, '').replace(',', '.'));
            if (isNaN(value1)) {
                value1 = 0;
            }
            if (isNaN(value2)) {
                value2 = 0;
            }
            if (value1 > value2) return -1;
            if (value1 == value2) return 0;
            if (value1 < value2) return 1;
        }

        curTable.find('tbody').each(function() {
            var curBody = $(this);
            var curRows = curBody.find('tr');
            if (curIndex == 0) {
                if (sortDir == 'up') {
                    curRows.sort(windowRegionSortTitleUp);
                } else {
                    curRows.sort(windowRegionSortTitleDown);
                }
            } else {
                if (sortDir == 'up') {
                    curRows.sort(windowRegionSortValueUp);
                } else {
                    curRows.sort(windowRegionSortValueDown);
                }
            }
            var newHTML = '';
            for (var i = 0; i < curRows.length; i++) {
                newHTML += '<tr>' + $(curRows[i]).html() + '</tr>';
            }
            curBody.html(newHTML);
        });

        e.preventDefault();
    });

    $('body').on('click', '.window-region-indicator-menu-item a', function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            var curIndicator = curItem.parents().filter('.window-region-indicator');
            curIndicator.find('.window-region-indicator-menu-item.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = curIndicator.find('.window-region-indicator-menu-item').index(curItem);
            curIndicator.find('.window-region-indicator-tab.active').removeClass('active');
            curIndicator.find('.window-region-indicator-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

});

function createChartWindowRegionBar(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]').find('.window-region-chart-container');
    if (curBlock.length == 1) {
        var newHTML = '';

        newHTML +=  '<div class="window-region-chart-content">' +
                        '<div class="window-region-chart-bars">' +
                            '<div class="window-region-chart-bars-container">' +
                            '</div>' +
                        '</div>' +
                        '<div class="window-region-chart-bars-legend">';
        for (var i = 0; i < data.legend.length; i++) {
            newHTML +=      '<div class="window-region-chart-bars-legend-item">' +
                                '<div class="window-region-chart-bars-legend-item-title">' + data.legend[i].title + '</div>' +
                                '<div class="window-region-chart-bars-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                            '</div>';
        }
        newHTML +=      '</div>' +
                    '</div>';
        curBlock.html(newHTML);
        curBlock.find('.window-region-chart-bars').mCustomScrollbar({
            axis: 'x',
            scrollButtons: {
                enable: true
            }
        });

        var curMax = 0;
        for (var i = 0; i < data.data.length; i++) {
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (curMax < Number(data.data[i].values[j])) {
                    curMax = Number(data.data[i].values[j]);
                }
            }
        }

        var curGraph = curBlock.find('.window-region-chart-bars-container');
        for (var i = 0; i < data.data.length; i++) {
            var itemHTML =  '<div class="window-region-chart-bars-item">' +
                                '<div class="window-region-chart-bars-item-year">' + data.data[i].year + '</div>';
            var curSumm = 0;
            for (var j = 0; j < data.data[i].values.length; j++) {
                curSumm += Number(data.data[i].values[j]);
            }
            for (var j = 0; j < data.data[i].values.length; j++) {
                itemHTML +=     '<div class="window-region-chart-bars-item-bar" style="background-color:' + data.legend[j].color + '; height:' + (Number(data.data[i].values[j]) / curMax * 100) + '%" data-title="' + data.legend[j].title + '" data-value="' + data.data[i].values[j] + '" data-name="' + data.title + '"><span>' + numberWithSpaces(data.data[i].values[j]) + '</span></div>';
            }
            itemHTML +=     '</div>';
            curGraph.append(itemHTML);
        }
    }
}

function numberWithSpaces(x) {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;');
    return parts.join('.');
}

function createChartWindowRegionDonut(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]').find('.window-region-chart-container');
    if (curBlock.length == 1) {
        var newHTML = '';

        var curData = data;
        if (curBlock.hasClass('sublevel')) {
            curData = data.data[Number(curBlock.attr('data-sublevel'))].sublevel;
        }

        newHTML +=  '<div class="window-region-chart-donut-content">' +
                        '<div class="window-region-chart-donut-chart">' +
                            '<div class="window-region-chart-donut-chart-inner">' +
                                '<svg fill="none" xmlns="http://www.w3.org/2000/svg"></svg>' +
                            '</div>' +
                        '</div>' +
                        '<div class="window-region-chart-donut-legend">' +
                            '<div class="window-region-chart-donut-legend-inner">' +
                                '<div class="window-region-chart-donut-legend-col">';
        for (var i = 0; i < curData.legend.length; i++) {
            if (i == Math.round(curData.legend.length / 2)) {
                newHTML +=      '</div>' +
                                '<div class="window-region-chart-donut-legend-col">';
            }
            newHTML +=              '<div class="window-region-chart-donut-legend-item" data-id="' + i + '">' +
                                        '<div class="window-region-chart-donut-legend-item-title">' + curData.legend[i].title + '</div>' +
                                        '<div class="window-region-chart-donut-legend-item-color" style="background-color:' + curData.legend[i].color + '"></div>' +
                                    '</div>';
        }
        newHTML +=              '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        curBlock.html(newHTML);

        var curSumm = 0;
        for (var i = 0; i < curData.data.length; i++) {
            curSumm += Number(curData.data[i].value);
        }

        var pieWidth = 235;
        var pieHeight = 235;

        var svgDonut = curBlock.find('.window-region-chart-donut-chart-inner svg');

        svgDonut.attr('width', pieWidth + 14);
        svgDonut.attr('height', pieHeight + 14);
        svgDonut.attr('viewBox', '0 0 ' + (pieWidth + 14) + ' ' + (pieHeight + 14));

        var summPercent = 0;
        var currentAngle = -0.5 * Math.PI;
        var newPath = '';
        for (var i = 0; i < curData.data.length; i++) {
            var curValue = Number(curData.data[i].value);
            var newPercent = Math.round(curValue / curSumm * 100);
            if (i == curData.data.length - 1) {
                newPercent = 100 - summPercent;
            }
            var sliceAngle = newPercent / 100 * 2 * Math.PI;

            var classPointer = '';
            if (typeof curData.data[i].sublevel !== 'undefined') {
                classPointer = ' path-pointer';
            }

            newPath += '<path class="path-shadow" stroke="' + curData.legend[i].color + '"  d="' + describeArc((pieWidth + 14) / 2, (pieHeight + 14) / 2, pieWidth / 2 + 3, summPercent / 100 * 360, (summPercent + newPercent) / 100 * 360) + '" data-id="' + i + '" />';
            newPath += '<path class="' + classPointer + '" stroke="' + curData.legend[i].color + '" stroke-width="40" d="' + describeArc((pieWidth + 14) / 2, (pieHeight + 14) / 2, pieWidth / 2 - 20, summPercent / 100 * 360, (summPercent + newPercent) / 100 * 360) + '" data-title="' + curData.legend[i].title + '" data-value="' + curData.data[i].value + '" data-name="' + data.title + '" data-id="' + i + '" />';

            curBlock.find('.window-region-chart-donut-chart-inner').append('<div class="window-region-chart-donut-chart-legend" style="transform:rotate(' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((summPercent + newPercent / 2) / 100 * 360) + 'deg)">' + curValue + '</span></div>');
            currentAngle += sliceAngle;
            if (i != curData.data.length - 1) {
                summPercent += newPercent;
            }
        }
        svgDonut.html(newPath);

        if (curBlock.hasClass('sublevel')) {
            curBlock.find('.window-region-chart-donut-chart-inner').append('<div class="window-region-chart-donut-chart-back-link"><a href="#" class="link-orange">' + data.backtitle + '</a></div>');
        }

        svgDonut.find('path.path-pointer').click(function(e) {
            curBlock.addClass('sublevel');
            curBlock.attr('data-sublevel', $(this).attr('data-id'));
            createChartWindowRegionDonut(blockID, data);
        });

        curBlock.find('.window-region-chart-donut-chart-back-link a').click(function(e) {
            curBlock.removeClass('sublevel');
            curBlock.removeAttr('data-sublevel');
            createChartWindowRegionDonut(blockID, data);
            e.preventDefault();
        });

    }
}

function radToDeg(rad) {
	return (rad * 180) / Math.PI;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    var d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

function createChartWindowRegionBarHorizont(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]').find('.window-region-chart-container');
    if (curBlock.length == 1) {
        var newHTML = '';

        curBlock.html('');

        newHTML +=  '<div class="window-region-chart-funds-main-content">' +
                        '<div class="window-region-chart-funds-main-graph">' +
                            '<div class="window-region-chart-funds-main-scale-x"></div>' +
                            '<div class="window-region-chart-funds-main-graph-container">' +
                            '</div>' +
                        '</div>' +
                        '<div class="window-region-chart-funds-main-legend">';
        for (var i = 0; i < data.legend.length; i++) {
            newHTML +=  '<div class="window-region-chart-funds-main-legend-item">' +
                            data.legend[i].title +
                            '<div class="window-region-chart-funds-main-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                        '</div>';
        }
        newHTML +=      '</div>' +
                    '</div>';
        curBlock.append(newHTML);

        var curMax = 0;
        for (var i = 0; i < data.data.length; i++) {
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (curMax < Number(data.data[i].values[j])) {
                    curMax = Number(data.data[i].values[j]);
                }
            }
        }

        var curScale = curBlock.find('.window-region-chart-funds-main-scale-x');
        var scaleTicks = Math.ceil(curMax / Number(data.scaleStep)) + 1;
        var scaleMax = scaleTicks * Number(data.scaleStep);

        curScale.append('<div class="window-region-chart-funds-main-scale-tick" style="left:0%"><span>0</span></div>');
        for (var i = 1; i <= scaleTicks; i++) {
            curScale.append('<div class="window-region-chart-funds-main-scale-tick" style="left:' + (i / scaleTicks * 100) + '%"><span>' + (i * data.scaleStep) + '</span></div>');
        }

        var curGraph = curBlock.find('.window-region-chart-funds-main-graph-container');

        for (var i = 0; i < data.data.length; i++) {
            var itemHTML = '';
            var itemBarHTML = '';
            for (var j = 0; j < data.data[i].values.length; j++) {
                itemBarHTML += '<div class="window-region-chart-funds-main-graph-item-bar-item" style="background-color:' + data.legend[j].color + '; width:' + (Number(data.data[i].values[j]) / scaleMax * 100) + '%" data-title="' + data.legend[j].title + '" data-value="' + data.data[i].values[j] + '" data-name="' + data.title + '"><span>' + data.data[i].values[j] + '</span></div>';
            }
            itemHTML += '<div class="window-region-chart-funds-main-graph-item">' +
                            '<div class="window-region-chart-funds-main-graph-item-title">' + data.data[i].title + '</div>' +
                            '<div class="window-region-chart-funds-main-graph-item-bars">' + itemBarHTML + '</div>' +
                        '</div>';
            curGraph.append(itemHTML);
        }
    }
}

function createChartWindowRegionBubble(blockID, data) {
    for (var i = 0; i < data.legend.length; i++) {
        data.legend[i].id = i;
    }
    var curBlock = $('[data-id="' + blockID + '"]').find('.window-region-chart-container');
    if (curBlock.length == 1) {
        var newHTML = '';

        newHTML +=  '<div class="window-region-chart-bubble-content">' +
                        '<div class="window-region-chart-bubble-legend">';
        for (var i = 0; i < data.legend.length; i++) {
            newHTML +=      '<div class="window-region-chart-bubble-legend-item">' +
                                '<div class="window-region-chart-bubble-legend-item-inner">' +
                                    '<div class="window-region-chart-bubble-legend-item-inner-text">' +
                                        '<div class="window-region-chart-bubble-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                                        data.legend[i].title +
                                    '</div>' +
                                '</div>' +
                            '</div>';
        }
        newHTML +=      '</div>' +
                        '<div class="window-region-chart-bubble-graph">' +
                            '<div class="window-region-chart-bubble-graph-container">' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        curBlock.html(newHTML);
        var curMax = 0;
        for (var i = 0; i < data.data.length; i++) {
            var curSumm = 0;
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (curMax < Number(data.data[i].values[j])) {
                    curMax = Number(data.data[i].values[j]);
                }
            }
        }

        var curGraph = curBlock.find('.window-region-chart-bubble-graph-container');
        var graphHTML = '';
        for (var i = 0; i < data.legend.length; i++) {
            graphHTML +=        '<div class="window-region-chart-bubble-graph-item-mobile-title"><span style="background-color:' + data.legend[i].color + '"></span>' + data.legend[i].title + '</div>';
            if ($(window).width() < 1120) {
                graphHTML +=        '<div class="window-region-chart-bubble-graph-item-mobile"><div class="window-region-chart-bubble-graph-item-mobile-inner">';
            }
            graphHTML +=        '<div class="window-region-chart-bubble-graph-item"><div class="window-region-chart-bubble-graph-item-inner" style="height:' + (curBlock.find('.window-region-chart-bubble-legend-item').eq(i).outerHeight()) + 'px"></div></div>';
            graphHTML +=        '<div class="window-region-chart-bubble-graph-years-mobile">';
            for (var j = 0; j < data.data.length; j++) {
                graphHTML +=        '<div class="window-region-chart-bubble-graph-year"><span>' + data.data[j].year + '</span></div>';
            }
            graphHTML +=        '</div>';
            if ($(window).width() < 1120) {
                graphHTML +=        '</div></div>';
            }
        }

        graphHTML +=            '<div class="window-region-chart-bubble-graph-years">';
        for (var i = 0; i < data.data.length; i++) {
            graphHTML +=            '<div class="window-region-chart-bubble-graph-year"><span>' + data.data[i].year + '</span></div>';
        }
        graphHTML +=            '</div>';
        curGraph.html(graphHTML);
        graphHTML =             '<div class="window-region-chart-bubble-graph-years-fixed">' +
                                    '<div class="window-region-chart-bubble-graph-years-fixed-inner">';
        for (var i = 0; i < data.data.length; i++) {
            graphHTML +=                '<div class="window-region-chart-bubble-graph-year"><span>' + data.data[i].year + '</span></div>';
        }
        graphHTML +=                '</div>' +
                                '</div>';
        curBlock.find('.window-region-chart-bubble-content').append(graphHTML);

        var itemWidth = 80;
        for (var i = 0; i < data.legend.length; i++) {
            var curID = data.legend[i].id;
            var mobileStart = -1;
            var mobileStop = -1;
            for (var j = 0; j < data.data.length; j++) {
                var curBubble = '';
                if (data.data[j].values[curID] !== null) {
                    if (mobileStart == -1) {
                        mobileStart = j;
                    }
                    mobileStop = j
                    var curBubbleSize = Number(data.data[j].values[curID]) / curMax * 100;

                    var curBubblePrev = '';
                    if (j > 0 && data.data[j - 1].values[curID] !== null) {
                        curBubblePrev = '<div class="window-region-chart-bubble-graph-item-bubble-prev" style="background-color:' + data.legend[i].color + '"></div>';
                    }

                    curBubble = curBubblePrev +
                                '<div class="window-region-chart-bubble-graph-item-bubble-bg" style="background-color:' + data.legend[i].color + '; width:' + curBubbleSize + '%; height:' + curBubbleSize + '%"></div>' +
                                '<div class="window-region-chart-bubble-graph-item-bubble-value">' + numberWithSpaces(data.data[j].values[curID]) + '</div>';
                }
                curBlock.find('.window-region-chart-bubble-graph-item').eq(i).find('.window-region-chart-bubble-graph-item-inner').append('<div class="window-region-chart-bubble-graph-item-bubble" data-title="' + data.legend[i].title + '" data-value="' + data.data[j].values[curID] + '" data-name="' + data.title + '">' + curBubble + '</div>');
            }
            if ($(window).width() < 1120) {
                curBlock.find('.window-region-chart-bubble-graph-item-mobile').each(function() {
                    var curYears = $(this);
                    $(this).mCustomScrollbar({
                        axis: 'x',
                        scrollButtons: {
                            enable: true
                        }
                    });
                });
            }
        }

        curBlock.find('.window-region-chart-bubble-graph').css({'max-width': 'calc(100% - ' + (curBlock.find('.window-region-chart-bubble-legend').width() + 20) + 'px)'});

        if ($(window).width() > 1119) {
            curBlock.find('.window-region-chart-bubble-graph').each(function() {
                var curScrollBlock = $(this);
                $(this).mCustomScrollbar({
                    axis: 'x',
                    callbacks: {
                        onInit: function() {
                            curScrollBlock.addClass('shadowRight');
                        },

                        whileScrolling: function() {
                            if (this.mcs.leftPct == 100) {
                                curScrollBlock.removeClass('shadowRight');
                            } else {
                                curScrollBlock.addClass('shadowRight');
                            }

                            if (this.mcs.leftPct == 0) {
                                curScrollBlock.removeClass('shadowLeft');
                            } else {
                                curScrollBlock.addClass('shadowLeft');

                            }
                            curBlock.find('.window-region-chart-bubble-graph-years-fixed').css({'width': curBlock.find('.window-region-chart-bubble-graph').width(), 'left': curBlock.find('.window-region-chart-bubble-graph').offset().left});
                            curBlock.find('.window-region-chart-bubble-graph-years-fixed-inner').css({'left': curBlock.find('.mCSB_container').css('left')});
                        }
                    }
                });
            });
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

function createChartWindowRegionLines(blockID, data) {
    var curBlock = $('[data-id="' + blockID + '"]').find('.window-region-chart-container');
    if (curBlock.length == 1) {
        var newHTML = '';

        newHTML +=  '<div class="window-region-lines-content">' +
                        '<div class="window-region-lines-graph">' +
                            '<div class="window-region-lines-graph-container">' +
                                '<div class="window-region-lines-graph-scale">' +
                                    '<div class="window-region-lines-graph-scale-y-title">' + data.scaleYTitle + '</div>' +
                                '</div>' +
                                '<div class="window-region-lines-graph-scale-x-title">' + data.scaleXTitle + '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="window-region-lines-legend">';
        for (var i = 0; i < data.legend.length; i++) {
            newHTML +=      '<div class="window-region-lines-legend-item">' +
                                '<div class="window-region-lines-legend-item-title">' + data.legend[i].title + '</div>' +
                                '<div class="window-region-lines-legend-item-color" style="background-color:' + data.legend[i].color + '"></div>' +
                            '</div>';
        }
        newHTML +=      '</div>' +
                    '</div>';
        curBlock.html(newHTML);
        var curMax = 0;
        for (var i = 0; i < data.data.length; i++) {
            var curSumm = 0;
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (curMax < Number(data.data[i].values[j])) {
                    curMax = Number(data.data[i].values[j]);
                }
            }
        }

        var curScale = curBlock.find('.window-region-lines-graph-scale');
        var scaleTicks = Math.ceil(curMax / Number(data.scaleStep));
        var scaleMax = scaleTicks * Number(data.scaleStep);

        curScale.append('<div class="window-region-lines-graph-scale-sizer">' + scaleMax + '</div>');

        curScale.append('<div class="window-region-lines-graph-scale-tick bottom" style="bottom:0%"></div>');
        curScale.append('<div class="window-region-lines-graph-scale-title bottom" style="bottom:0%">0</div>');
        for (var i = 1; i <= scaleTicks; i++) {
            var tickClass = '';
            if (i * (Number(data.scaleStep)) % Number(data.scaleStep) == 0) {
                tickClass = 'step';
                curScale.append('<div class="window-region-lines-graph-scale-title" style="bottom:' + (i / scaleTicks * 100) + '%">' + (i * Number(data.scaleStep)) + '</div>');
            }
            curScale.append('<div class="window-region-lines-graph-scale-tick ' + tickClass + '" style="bottom:' + (i / scaleTicks * 100) + '%"></div>');
        }

        var curGraph = curBlock.find('.window-region-lines-graph-container');

        var itemWidth = 40;

        for (var i = 0; i < data.legend.length; i++) {
            var lineDots = [];
            for (var j = 0; j < data.data.length; j++) {
                if (data.data[j].values[i] !== null) {
                    lineDots.push({'year': j, 'value': Number(data.data[j].values[i])});
                }
            }

            for (var j = 0; j < lineDots.length; j++) {
                var curX = lineDots[j].year * itemWidth + curScale.outerWidth() + itemWidth / 2;
                var curY = curScale.height() - (curScale.height() * (lineDots[j].value / scaleMax)) + 10;
                if (j > 0) {
                    var prevX = lineDots[j - 1].year * itemWidth + curScale.outerWidth() + itemWidth / 2;
                    var prevY = curScale.height() - curScale.height() * (lineDots[j - 1].value / scaleMax) + 10;
                    var curWidth = Math.sqrt(Math.pow((curX - prevX), 2) + Math.pow((curY - prevY), 2));
                    var curAngle = angle_point([curX, curY], [prevX, prevY], [curX, prevY]);
                    if (curY < prevY) {
                        curAngle = -curAngle;
                    }
                    curGraph.append('<div class="window-region-lines-graph-item-point-line" style="left:' + prevX + 'px; top:' + prevY + 'px; width:' + curWidth + 'px; transform:rotate(' + curAngle + 'deg); border-top-color:' + data.legend[i].color + '" data-id="' + i + '"></div>');
                }
            }
        }

        for (var i = 0; i < data.data.length; i++) {
            var itemHTML =  '<div class="window-region-lines-graph-item line">' +
                                '<div class="window-region-lines-graph-item-year">' + data.data[i].year + '</div>';
            for (var j = 0; j < data.data[i].values.length; j++) {
                if (data.data[i].values[j] !== null) {
                    itemHTML += '<div class="window-region-lines-graph-item-point" style="bottom:' + (Number(data.data[i].values[j]) / scaleMax * 100) + '%; background:' + data.legend[j].color + '" data-id="' + j + '"></div>';
                }
            }
            itemHTML +=     '</div>';
            curGraph.append(itemHTML);
        }

        curBlock.find('.window-region-lines-graph').each(function() {
            $(this).mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        });

        $('body').on('mouseenter', '.window-region-lines-graph-item-point', function(e) {
            if ($(window).width() > 1139) {
                var curItemBar = $(this);
                var curID = curItemBar.attr('data-id');
                var curYear = curItemBar.parents().filter('.window-region-lines-graph-item').find('.window-region-lines-graph-item-year').text();
                curBlock.find('.window-region-lines-graph-item-point').addClass('hidden');
                curBlock.find('.window-region-lines-graph-item-point-line').addClass('hidden');
                curBlock.find('.window-region-lines-graph-item-point[data-id="' + curID + '"]').removeClass('hidden');
                curBlock.find('.window-region-lines-graph-item-point-line[data-id="' + curID + '"]').removeClass('hidden');
                $('.window-region-chart-hint').remove();
                var windowHTML = '<div class="window-region-chart-hint">' +
                                    '<div class="window-region-chart-hint-container">' +
                                        '<div class="window-region-chart-hint-title">' + data.title + '</div>' +
                                        '<div class="window-region-chart-hint-values">';
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].year == curYear) {
                        for (var j = 0; j < data.legend.length; j++) {
                            windowHTML +=   '<div class="window-region-chart-hint-value">' +
                                                '<div class="window-region-chart-hint-value-legend">' +
                                                    '<div class="window-region-chart-hint-value-legend-inner" style="background:' + data.legend[j].color + '"></div>' +
                                                '</div>'+
                                                '<div class="window-region-chart-hint-value-title">' + data.legend[j].title + ':</div>' +
                                                '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(data.data[i].values[j]) + '</div>' +
                                            '</div>';
                        }
                    }
                }
                windowHTML +=           '</div>' +
                                    '</div>' +
                                '</div>';
                $('body').append(windowHTML);
                var curLeft = curItemBar.offset().left + curItemBar.width() / 2;
                var curTop = curItemBar.offset().top + curItemBar.height() / 2;
                $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
            }
        });

        $('body').on('mouseleave', '.window-region-lines-graph-item-point', function(e) {
            if ($(window).width() > 1139) {
                curBlock.find('.window-region-lines-graph-item-point').removeClass('hidden');
                curBlock.find('.window-region-lines-graph-item-point-line').removeClass('hidden');
                $('.window-region-chart-hint').remove();
            }
        });

        $('body').on('click', '.window-region-lines-graph-item-point', function(e) {
            if ($(window).width() < 1140) {
                var curItemBar = $(this);
                var curID = curItemBar.attr('data-id');
                var curYear = curItemBar.parents().filter('.window-region-lines-graph-item').find('.window-region-lines-graph-item-year').text();
                var windowHTML = '<div class="window-region-chart-hint-mobile">' +
                                    '<div class="window-region-chart-hint-container">' +
                                        '<div class="window-region-chart-hint-title">' + data.title + '</div>' +
                                        '<div class="window-region-chart-hint-values">';
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].year == curYear) {
                        for (var j = 0; j < data.legend.length; j++) {
                            windowHTML +=   '<div class="window-region-chart-hint-value">' +
                                                '<div class="window-region-chart-hint-value-legend">' +
                                                    '<div class="window-region-chart-hint-value-legend-inner" style="background:' + data.legend[j].color + '"></div>' +
                                                '</div>'+
                                                '<div class="window-region-chart-hint-value-title">' + data.legend[j].title + ':</div>' +
                                                '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(data.data[i].values[j]) + '</div>' +
                                            '</div>';
                        }
                    }
                }
                windowHTML +=           '</div>' +
                                    '</div>' +
                                    '<a href="#" class="window-region-chart-hint-mobile-close"></a>' +
                                '</div>';
                $('body').append(windowHTML);
            }
        });

    }
}

$(document).ready(function() {

    $('.main-regions-map-filter-link').click(function(e) {
        $('html').toggleClass('main-regions-map-filter-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.main-regions-map-filter').length == 0) {
            $('html').removeClass('main-regions-map-filter-open');
        }
    });

    $('.main-regions-map-filter-window-close').click(function(e) {
        $('html').removeClass('main-regions-map-filter-open');
        e.preventDefault();
    });

    $('.main-regions-map-filter').each(function() {
        var newHTML = '';

        for (var i = 0; i < opendataDistricts.length; i++) {
            newHTML +=  '<div class="main-regions-map-filter-group">';
            newHTML +=      '<div class="main-regions-map-filter-group-header">' + opendataDistricts[i].title + '</div>';
            newHTML +=      '<div class="main-regions-map-filter-group-container">';
            newHTML +=          '<div class="main-regions-map-filter-group-container-col">';
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
                        newHTML +=  '<div class="main-regions-map-filter-group-container-col">';
                    }
                    newHTML +=      '<div class="main-regions-map-filter-group-item" data-id="' + opendataRegions[j].id + '">' + opendataRegions[j].title + '</div>';
                    current++;
                }
            }
            newHTML +=          '</div>';
            newHTML +=      '</div>';
            newHTML +=  '</div>';
        }

        $('.main-regions-map-filter-list').html(newHTML);
    });

    $('body').on('click', '.main-regions-map-filter-group-header', function() {
        $(this).parent().toggleClass('open');
    });

    $('body').on('click', '.main-regions-map-filter-group-item', function() {
        $('.opendata-chart-map-inner g[data-id="' + $(this).attr('data-id') + '"]').click();
    });

    $('.main-regions-map-filter-search input').attr('autocomplete', 'off');
    $('.main-regions-map-filter-search input').on('keyup', function() {
        var curValue = $(this).val().toLowerCase();
        $('.main-regions-map-filter-group-item').each(function() {
            var curItem = $(this);
            if (curItem.html().toLowerCase().indexOf(curValue) == -1) {
                curItem.addClass('hidden');
            } else {
                curItem.removeClass('hidden');
            }
        });
        $('.main-regions-map-filter-group').each(function() {
            var curGroup = $(this);
            if (curGroup.find('.main-regions-map-filter-group-item').length == curGroup.find('.main-regions-map-filter-group-item.hidden').length) {
                curGroup.addClass('hidden');
            } else {
                curGroup.removeClass('hidden');
            }
        });
    });

    $('.challenges-item-more .main-tabs-menu-current').click(function(e) {
        var curMenu = $(this).parent();
        if (curMenu.hasClass('open')) {
            curMenu.removeClass('open');
        } else {
            $('.challenges-item-more .main-tabs-menu.open').removeClass('open');
            curMenu.addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.main-tabs-menu').length == 0) {
            $('.challenges-item-more .main-tabs-menu.open').removeClass('open');
        }
    });

    $('body').on('mouseenter', '.window-region-chart-bars-item-bar', function(e) {
        if ($(window).width() > 1139) {
            var curItemBar = $(this);
            $('.window-region-chart-bars-item-bar').addClass('hidden');
            curItemBar.removeClass('hidden');
            $('.window-region-chart-hint').remove();
            var windowHTML = '<div class="window-region-chart-hint">' +
                                 '<div class="window-region-chart-hint-container">' +
                                    '<div class="window-region-chart-hint-title">' + curItemBar.attr('data-name') + '</div>' +
                                    '<div class="window-region-chart-hint-values">';
            windowHTML +=               '<div class="window-region-chart-hint-value">' +
                                            '<div class="window-region-chart-hint-value-legend">' +
                                                '<div class="window-region-chart-hint-value-legend-inner" style="background:' + curItemBar.css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="window-region-chart-hint-value-title">' + curItemBar.attr('data-title') + ':</div>' +
                                            '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(curItemBar.attr('data-value')) + '</div>' +
                                        '</div>';

            windowHTML +=           '</div>' +
                                '</div>' +
                             '</div>';
            $('body').append(windowHTML);
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.window-region-chart-bars-item-bar', function(e) {
        if ($(window).width() > 1139) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mouseleave', '.window-region-chart-bars-item-bar', function(e) {
        if ($(window).width() > 1139) {
            $('.window-region-chart-hint').remove();
            $('.window-region-chart-bars-item-bar').removeClass('hidden');
        }
    });

    $('body').on('click', '.window-region-chart-bars-item-bar', function(e) {
        if ($(window).width() < 1140) {
            var curItemBar = $(this);
            var windowHTML = '<div class="window-region-chart-hint-mobile">' +
                                 '<div class="window-region-chart-hint-container">' +
                                    '<div class="window-region-chart-hint-title">' + curItemBar.attr('data-name') + '</div>' +
                                    '<div class="window-region-chart-hint-values">';
            windowHTML +=               '<div class="window-region-chart-hint-value">' +
                                            '<div class="window-region-chart-hint-value-legend">' +
                                                '<div class="window-region-chart-hint-value-legend-inner" style="background:' + curItemBar.css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="window-region-chart-hint-value-title">' + curItemBar.attr('data-title') + ':</div>' +
                                            '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(curItemBar.attr('data-value')) + '</div>' +
                                        '</div>';

            windowHTML +=           '</div>' +
                                '</div>' +
                                '<a href="#" class="window-region-chart-hint-mobile-close"></a>' +
                             '</div>';
            $('body').append(windowHTML);
        }
    });

    $('body').on('click', '.window-region-chart-hint-mobile-close', function(e) {
        $('.window-region-chart-hint-mobile').remove();
        e.preventDefault();
    });

    $('body').on('mouseenter', '.window-region-chart-funds-main-graph-item-bar-item', function(e) {
        if ($(window).width() > 1139) {
            var curItemBar = $(this);
            $('.window-region-chart-funds-main-graph-item-bar-item').addClass('hidden');
            curItemBar.removeClass('hidden');
            $('.window-region-chart-hint').remove();
            var windowHTML = '<div class="window-region-chart-hint">' +
                                 '<div class="window-region-chart-hint-container">' +
                                    '<div class="window-region-chart-hint-title">' + curItemBar.attr('data-name') + '</div>' +
                                    '<div class="window-region-chart-hint-values">';
            windowHTML +=               '<div class="window-region-chart-hint-value">' +
                                            '<div class="window-region-chart-hint-value-legend">' +
                                                '<div class="window-region-chart-hint-value-legend-inner" style="background:' + curItemBar.css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="window-region-chart-hint-value-title">' + curItemBar.attr('data-title') + ':</div>' +
                                            '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(curItemBar.attr('data-value')) + '</div>' +
                                        '</div>';

            windowHTML +=           '</div>' +
                                '</div>' +
                             '</div>';
            $('body').append(windowHTML);
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.window-region-chart-funds-main-graph-item-bar-item', function(e) {
        if ($(window).width() > 1139) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mouseleave', '.window-region-chart-funds-main-graph-item-bar-item', function(e) {
        if ($(window).width() > 1139) {
            $('.window-region-chart-hint').remove();
            $('.window-region-chart-funds-main-graph-item-bar-item').removeClass('hidden');
        }
    });

    $('body').on('click', '.window-region-chart-funds-main-graph-item-bar-item', function(e) {
        if ($(window).width() < 1140) {
            var curItemBar = $(this);
            var windowHTML = '<div class="window-region-chart-hint-mobile">' +
                                 '<div class="window-region-chart-hint-container">' +
                                    '<div class="window-region-chart-hint-title">' + curItemBar.attr('data-name') + '</div>' +
                                    '<div class="window-region-chart-hint-values">';
            windowHTML +=               '<div class="window-region-chart-hint-value">' +
                                            '<div class="window-region-chart-hint-value-legend">' +
                                                '<div class="window-region-chart-hint-value-legend-inner" style="background:' + curItemBar.css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="window-region-chart-hint-value-title">' + curItemBar.attr('data-title') + ':</div>' +
                                            '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(curItemBar.attr('data-value')) + '</div>' +
                                        '</div>';

            windowHTML +=           '</div>' +
                                '</div>' +
                                '<a href="#" class="window-region-chart-hint-mobile-close"></a>' +
                             '</div>';
            $('body').append(windowHTML);
        }
    });

    $('body').on('mouseenter', '.window-region-chart-bubble-graph-item-bubble-bg', function(e) {
        if ($(window).width() > 1139) {
            var curItemBar = $(this).parent();
            $('.window-region-chart-bubble-graph-item-bubble').addClass('hidden');
            curItemBar.removeClass('hidden');
            $('.window-region-chart-hint').remove();
            var windowHTML = '<div class="window-region-chart-hint">' +
                                 '<div class="window-region-chart-hint-container">' +
                                    '<div class="window-region-chart-hint-title">' + curItemBar.attr('data-name') + '</div>' +
                                    '<div class="window-region-chart-hint-values">';
            windowHTML +=               '<div class="window-region-chart-hint-value">' +
                                            '<div class="window-region-chart-hint-value-legend">' +
                                                '<div class="window-region-chart-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="window-region-chart-hint-value-title">' + curItemBar.attr('data-title') + ':</div>' +
                                            '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(curItemBar.attr('data-value')) + '</div>' +
                                        '</div>';

            windowHTML +=           '</div>' +
                                '</div>' +
                             '</div>';
            $('body').append(windowHTML);
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.window-region-chart-bubble-graph-item-bubble-bg', function(e) {
        if ($(window).width() > 1139) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mouseleave', '.window-region-chart-bubble-graph-item-bubble-bg', function(e) {
        if ($(window).width() > 1139) {
            $('.window-region-chart-hint').remove();
            $('.window-region-chart-bubble-graph-item-bubble').removeClass('hidden');
        }
    });

    $('body').on('click', '.window-region-chart-bubble-graph-item-bubble-bg', function(e) {
        if ($(window).width() < 1140) {
            var curItemBar = $(this).parent();
            var windowHTML = '<div class="window-region-chart-hint-mobile">' +
                                 '<div class="window-region-chart-hint-container">' +
                                    '<div class="window-region-chart-hint-title">' + curItemBar.attr('data-name') + '</div>' +
                                    '<div class="window-region-chart-hint-values">';
            windowHTML +=               '<div class="window-region-chart-hint-value">' +
                                            '<div class="window-region-chart-hint-value-legend">' +
                                                '<div class="window-region-chart-hint-value-legend-inner" style="background:' + $(this).css('background-color') + '"></div>' +
                                            '</div>'+
                                            '<div class="window-region-chart-hint-value-title">' + curItemBar.attr('data-title') + ':</div>' +
                                            '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(curItemBar.attr('data-value')) + '</div>' +
                                        '</div>';

            windowHTML +=           '</div>' +
                                '</div>' +
                                '<a href="#" class="window-region-chart-hint-mobile-close"></a>' +
                             '</div>';
            $('body').append(windowHTML);
        }
    });

    $('body').on('mouseenter', '.window-region-chart-donut-chart-inner svg path', function(e) {
        if ($(window).width() > 1139) {
            var curItemBar = $(this);
            var curChart = curItemBar.parents().filter('.window-region-chart-donut-content');
            curChart.find('.window-region-chart-donut-chart-inner svg path').addClass('hidden');
            curItemBar.removeClass('hidden');
            var curID = curItemBar.attr('data-id');
            curChart.find('.window-region-chart-donut-chart-inner path.path-shadow').removeClass('visible');
            curChart.find('.window-region-chart-donut-chart-inner path.path-shadow[data-id="' + curID + '"]').addClass('visible');
            $('.window-region-chart-hint').remove();
            var windowHTML = '<div class="window-region-chart-hint">' +
                                 '<div class="window-region-chart-hint-container">' +
                                    '<div class="window-region-chart-hint-title">' + curItemBar.attr('data-name') + '</div>' +
                                    '<div class="window-region-chart-hint-values">';
            windowHTML +=               '<div class="window-region-chart-hint-value">' +
                                            '<div class="window-region-chart-hint-value-legend">' +
                                                '<div class="window-region-chart-hint-value-legend-inner" style="background:' + curItemBar.attr('stroke') + '"></div>' +
                                            '</div>'+
                                            '<div class="window-region-chart-hint-value-title">' + curItemBar.attr('data-title') + ':</div>' +
                                            '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(curItemBar.attr('data-value')) + '</div>' +
                                        '</div>';

            windowHTML +=           '</div>' +
                                '</div>' +
                             '</div>';
            $('body').append(windowHTML);
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mousemove', '.window-region-chart-donut-chart-inner svg path', function(e) {
        if ($(window).width() > 1139) {
            var curLeft = e.pageX;
            var curTop = e.pageY;
            $('.window-region-chart-hint').css({'left': curLeft, 'top': curTop});
        }
    });

    $('body').on('mouseleave', '.window-region-chart-donut-chart-inner svg path', function(e) {
        if ($(window).width() > 1139) {
            $('.window-region-chart-hint').remove();
            $('.window-region-chart-donut-chart-inner svg path').removeClass('hidden');
            $('.window-region-chart-donut-chart-inner path.path-shadow').removeClass('visible');
        }
    });

    $('body').on('click', '.window-region-chart-donut-chart-inner svg path', function(e) {
        if ($(window).width() < 1140) {
            var curItemBar = $(this);
            var curChart = curItemBar.parents().filter('.window-region-chart-donut-content');
            var curID = curItemBar.attr('data-id');
            var windowHTML = '<div class="window-region-chart-hint-mobile">' +
                                 '<div class="window-region-chart-hint-container">' +
                                    '<div class="window-region-chart-hint-title">' + curItemBar.attr('data-name') + '</div>' +
                                    '<div class="window-region-chart-hint-values">';
            windowHTML +=               '<div class="window-region-chart-hint-value">' +
                                            '<div class="window-region-chart-hint-value-legend">' +
                                                '<div class="window-region-chart-hint-value-legend-inner" style="background:' + curItemBar.attr('stroke') + '"></div>' +
                                            '</div>'+
                                            '<div class="window-region-chart-hint-value-title">' + curItemBar.attr('data-title') + ':</div>' +
                                            '<div class="window-region-chart-hint-value-text">' + numberWithSpaces(curItemBar.attr('data-value')) + '</div>' +
                                        '</div>';

            windowHTML +=           '</div>' +
                                '</div>' +
                                '<a href="#" class="window-region-chart-hint-mobile-close"></a>' +
                             '</div>';
            $('body').append(windowHTML);
        }
    });

    $('body').on('mouseenter', '.window-region-chart-donut-legend-item', function(e) {
        if ($(window).width() > 1139) {
            var curItemBar = $(this);
            var curChart = curItemBar.parents().filter('.window-region-chart-donut-content');
            var curID = curItemBar.attr('data-id');
            curChart.find('.window-region-chart-donut-chart-inner svg path').addClass('hidden');
            curChart.find('.window-region-chart-donut-chart-inner svg path[data-id="' + curID + '"]').removeClass('hidden');
            curChart.find('.window-region-chart-donut-chart-inner path.path-shadow').removeClass('visible');
            curChart.find('.window-region-chart-donut-chart-inner path.path-shadow[data-id="' + curID + '"]').addClass('visible');
        }
    });

    $('body').on('mouseleave', '.window-region-chart-donut-legend-item', function(e) {
        if ($(window).width() > 1139) {
            $('.window-region-chart-donut-chart-inner svg path').removeClass('hidden');
            $('.window-region-chart-donut-chart-inner path.path-shadow').removeClass('visible');
        }
    });

});