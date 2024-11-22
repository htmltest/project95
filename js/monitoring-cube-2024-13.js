$(window).on('load', function() {

    if ($('.cube').length > 0) {
        $('.cube-face').eq(0).addClass('active');
        $('.cube').css({'margin-bottom': $('.cube-face').eq(0).find('.cube-face-footer').outerHeight()});
    }

    faceVZIRRedraw();

});

function faceVZIRRedraw() {
    $('.face-vzir-container .face-1-chart-graph').html('');
    $('.face-vzir-container .face-1-chart-labels').html('');

    var itemWidth = 80;
    if ($(window).width() < 1140) {
        itemWidth = 67;
    }

    var maxSumm = 0;

    for (var i = 0; i < face1data.length; i++) {
        var curData = face1data[i];
        var curValue = Number(curData.value.replace(',', '.'));
        if (curValue > maxSumm) {
            maxSumm = curValue;
        }
    }
    var curScroll = 0;
    for (var i = 0; i < face1data.length; i++) {
        var curData = face1data[i];
        var curValue = Number(curData.value.replace(',', '.'));
        if (curData.type !== 'forecast') {
            $('.face-vzir-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth) + 'px"><strong>' + curData.year + '</strong></div>');
            curScroll += itemWidth;
        } else {
            $('.face-vzir-container .face-1-chart-labels').append('<div class="face-1-chart-year" style="left:' + (i * itemWidth) + 'px"><span>' + curData.year + '</span></div>');
        }

        if (curData.type !== 'forecast') {
            $('.face-vzir-container .face-1-chart-graph').append('<div class="face-1-chart-bar" style="left:' + (i * itemWidth) + 'px; height:' + curValue / maxSumm * 100 + '%"><div class="face-1-chart-bar-inner"><span><strong>' + curData.value + '<em>млрд руб.</em></strong></span></div></div>');
        } else {
            $('.face-vzir-container .face-1-chart-graph').append('<div class="face-1-chart-bar face-1-chart-bar-forecast" style="left:' + (i * itemWidth) + 'px; height:' + curValue / maxSumm * 100 + '%"><div class="face-1-chart-bar-inner"><span><strong>' + curData.value + '<em>млрд руб.</em></strong></span></div></div>');
        }
    }

    $('.face-vzir-container .face-1-chart-bar').each(function() {
        var curBar = $(this);
        var curHeight = curBar.height();
        if (curBar.hasClass('face-1-chart-bar-forecast')) {
            curBar.find('.face-1-chart-bar-inner').append('<svg width="60" height="18" viewBox="0 0 60 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M51.9115 4.46391L51.9172 4.4661C54.9282 5.62717 56.7322 6.76638 57.7743 7.64819C58.2953 8.08904 58.6179 8.45877 58.8066 8.72676C58.8674 8.8131 58.9109 8.88385 58.9416 8.93889C58.9147 8.98753 58.8774 9.04967 58.8258 9.1256C58.6406 9.39833 58.3145 9.78402 57.7784 10.2462C56.7066 11.17 54.8269 12.3718 51.6601 13.5687L51.6598 13.5688C45.8059 15.7833 38.0341 17 29.7513 17C21.938 17 14.5076 15.858 8.8459 13.8587L8.84559 13.8586C3.6344 12.0203 1.60585 9.9581 1.08351 9.0922C1.07325 9.01984 1.06109 8.94116 1.04612 8.85964C1.22024 8.54344 1.676 7.94609 2.67879 7.18331C3.90015 6.25427 5.83743 5.15468 8.76308 4.10233C14.3324 2.10543 21.643 1 29.371 1H29.7513C38.044 1 46.0997 2.18216 51.9115 4.46391Z" stroke="#79B8BB" stroke-width="2"/></svg>');
        } else {
            curBar.find('.face-1-chart-bar-inner').append('<svg width="60" height="18" viewBox="0 0 60 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M52.2769 3.53306C46.3091 1.19008 38.118 0 29.7513 0H29.371C21.5602 0 14.1297 1.1157 8.42515 3.16116C2.42808 5.31818 0.29254 7.73554 0 8.77686C0.058508 8.96281 0.0877603 9.18595 0.117014 9.40909C0.672841 10.5248 2.9254 12.8306 8.51292 14.8017C14.3052 16.8471 21.8528 18 29.7513 18C38.118 18 46.0166 16.7727 52.0136 14.5041C58.508 12.0496 59.9707 9.48347 60 8.92562C59.9122 8.29339 58.4495 5.91322 52.2769 3.53306Z" fill="#4F7B96"/></svg>');
        }
        var countBlocks = Math.floor(curHeight - 16) / 19;
        for (var i = 0; i < countBlocks; i++) {
            if (curBar.hasClass('face-1-chart-bar-forecast')) {
                curBar.find('.face-1-chart-bar-inner').append('<svg width="60" height="21" viewBox="0 0 60 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M58.9707 9.90056V10.1338C58.9537 10.22 58.9288 10.3291 58.8947 10.4741L58.8914 10.4878C58.8324 10.7386 58.7472 11.1007 58.7372 11.4887C58.7357 11.493 58.7339 11.4977 58.7319 11.503C58.7094 11.5617 58.6629 11.6618 58.5773 11.7995C58.4067 12.074 58.1014 12.4655 57.5915 12.9373C56.5726 13.8801 54.7651 15.117 51.6842 16.3593C45.8243 18.6972 37.9854 20 29.575 20C21.6239 20 14.9813 18.8243 10.0541 17.2073C7.58968 16.3985 5.56978 15.4844 4.03545 14.5628C2.63449 13.7213 1.69483 12.9073 1.17034 12.2085L1.11716 9.19118L1.11709 9.1868L1.02424 2.17238C2.7417 3.18391 4.51527 4.01161 6.34465 4.65378C12.7778 7.02128 21.0149 8.34807 29.5457 8.34807C38.545 8.34807 47.1722 6.94405 53.8512 4.33695C55.6126 3.67254 57.3238 2.8478 58.9707 1.84544V9.90056ZM58.7461 11.4605C58.7461 11.4606 58.7458 11.4621 58.7448 11.4654C58.7456 11.4622 58.746 11.4605 58.7461 11.4605Z" stroke="#79B8BB" stroke-width="2"/></svg>');
            } else {
                curBar.find('.face-1-chart-bar-inner').append('<svg width="60" height="21" viewBox="0 0 60 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M59.9707 9.90056V0C57.9189 1.43094 55.7499 2.55248 53.4929 3.40331C46.9565 5.9558 38.4563 7.34807 29.5457 7.34807C21.1041 7.34807 12.9849 6.03315 6.68295 3.71271C4.36736 2.90056 2.13972 1.779 0 0.348064L0.117243 9.20442L0.17586 12.5304C2.57938 16.2431 13.4831 21 29.575 21C38.0752 21 46.0479 19.6851 52.0567 17.2873C58.3879 14.7348 59.7362 12.105 59.7362 11.5635C59.7362 10.9834 60 10.4033 60 9.90056H59.9707Z" fill="#4F7B96"/></svg>');
            }
        }
    });

    $('.face-vzir-container .face-1-chart').width(face1data.length * itemWidth);

    $('.face-vzir-container').mCustomScrollbar({
        axis: 'x',
        setLeft: '-' + (curScroll - $('.face-vzir-container').width() / 2) + 'px',
        scrollButtons: {
            enable: true
        }
    });

}