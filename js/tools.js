$(document).ready(function() {

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
        minDate: new Date(2018, 2, 1),
        maxDate: new Date(2020, 8, 1),
        dateFormat: dateFormat,
        onClose: function(dateText, inst) {
            var month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();
            var year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();
            $(this).datepicker('setDate', new Date(year, month, 1));
            var curForm = $('#task-steps-month-calendar-datepicker').parent();
            $.ajax({
                type: 'POST',
                url: curForm.attr('action'),
                dataType: 'html',
                data: 'month=' + month + '&year=' + year,
                cache: false
            }).done(function(html) {
                $('.task-steps-month-title').html($('#task-steps-month-calendar-datepicker').val());
                if ($('.task-steps-days-list').hasClass('slick-slider')) {
                    $('.task-steps-days-list').slick('unslick');
                }
                $('.task-steps-days-inner').html(html);
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

    $('.main-calendar-list-inner').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        dots: false
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
        dots: false
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

});

$(window).on('load resize scroll', function() {
    if ($(window).scrollTop() > $(window).height()) {
        $('.up-link').addClass('visible');
    } else {
        $('.up-link').removeClass('visible');
    }
    var curDiff = $(window).scrollTop() + $(window).height() - $('footer').offset().top - 60;
    if (curDiff > 0) {
        $('.up-link').css({'margin-bottom': curDiff});
    } else {
        $('.up-link').css({'margin-bottom': 0});
    }
});

$(window).on('load resize', function() {
    if ($('.header-submenu-2').length > 0) {
        if ($('.header-submenu-2-inner').hasClass('slick-slider')) {
            $('.header-submenu-2-inner').slick('unslick');
        }
        var curWidth = 0;
        $('.header-submenu-2-item').each(function() {
            curWidth += $(this).width();
        });
        if (curWidth > $('.header-submenu-2-wrap').width()) {
            $('.header-submenu-2-inner').slick({
                dots: false,
                infinite: false,
                variableWidth: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>'
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

    curForm.validate({
        ignore: '',
        invalidHandler: function(form, validatorcalc) {
            validatorcalc.showErrors();
            checkErrors();
        }
    });
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