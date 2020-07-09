ratingsNew.push({
    'filters' : [
        {
            'name'      : 'type',
            'position'  : 'left',
            'values'    : [
                {
                    'value'     : 'WoS',
                    'label'     : 'Web of Science',
                    'active'    : true
                },

                {
                    'value'     : 'Scopus',
                    'label'     : 'Scopus'
                }
            ]
        },

        {
            'name'      : 'year',
            'position'  : 'left',
            'values'    : [
                {
                    'value'     : '2017',
                    'label'     : '2017'
                },

                {
                    'value'     : '2018',
                    'label'     : '2018',
                    'active'    : true
                }
            ]
        }
    ],

    'data' : [
        {
            'type'  : 'WoS',
            'year'  : '2017',
            'data'  : [
                {
                    'title' : 'Образовательные организации высшего образования',
                    'value' : '54'
                },
                {
                    'title' : 'Научные организации Минобрнауки России',
                    'value' : '34'
                },
                {
                    'title' : 'Другие научные организации',
                    'value' : '5'
                },
                {
                    'title' : 'Прочие организации',
                    'value' : '3'
                },
                {
                    'title' : 'Научные организации Минздрав России',
                    'value' : '2'
                },
                {
                    'title' : 'НИЦ "Курчатовский институт"',
                    'value' : '2'
                }
            ]
        },

        {
            'type'  : 'Scopus',
            'year'  : '2017',
            'data'  : [
                {
                    'title' : 'Образовательные организации высшего образования',
                    'value' : '53'
                },
                {
                    'title' : 'Научные организации Минобрнауки России',
                    'value' : '32'
                },
                {
                    'title' : 'Прочие организации',
                    'value' : '6'
                },
                {
                    'title' : 'Другие научные организации',
                    'value' : '5'
                },
                {
                    'title' : 'Научные организации Минздрав России',
                    'value' : '3'
                },
                {
                    'title' : 'НИЦ "Курчатовский институт"',
                    'value' : '1'
                }
            ]
        },

        {
            'type'  : 'WoS',
            'year'  : '2018',
            'data'  : [
                {
                    'title' : 'Образовательные организации высшего образования',
                    'value' : '53'
                },
                {
                    'title' : 'Научные организации Минобрнауки России',
                    'value' : '33'
                },
                {
                    'title' : 'Прочие организации',
                    'value' : '8'
                },
                {
                    'title' : 'Другие научные организации',
                    'value' : '4'
                },
                {
                    'title' : 'Научные организации Минздрав России',
                    'value' : '1'
                },
                {
                    'title' : 'НИЦ "Курчатовский институт"',
                    'value' : '1'
                }
            ]
        },

        {
            'type'  : 'Scopus',
            'year'  : '2018',
            'data'  : [
                {
                    'title' : 'Образовательные организации высшего образования',
                    'value' : '53'
                },
                {
                    'title' : 'Научные организации Минобрнауки России',
                    'value' : '31'
                },
                {
                    'title' : 'Прочие организации',
                    'value' : '7'
                },
                {
                    'title' : 'Другие научные организации',
                    'value' : '5'
                },
                {
                    'title' : 'Научные организации Минздрав России',
                    'value' : '3'
                },
                {
                    'title' : 'НИЦ "Курчатовский институт"',
                    'value' : '1'
                }
            ]
        }
    ],

    'update' : function(cubeFace, curData) {
        var cubeColors = [
            ['#4e7b95', '#5c8ea1', '#669caa', '#6fa9b2', '#79b8bb', '#83c5c4', '#90d7cf'],
            ['#307956', '#3f9069', '#4aa177', '#54b184', '#5fc192', '#6bd4a1', '#78e7b2']
        ];

        cubeFace.find('.ratings-new-pie-hints').html('');
        var newHTML = '';
        var labels = [];
        var values = [];
        var typeIndex = cubeFace.find('.rating-new-filter[data-name="type"]').find('li').index(cubeFace.find('.rating-new-filter[data-name="type"]').find('li.active'));
        var colors = cubeColors[typeIndex];

        var curFull = 0;
        for (var i = 0; i < curData.length; i++) {
            labels.push(curData[i].title);
            values.push(curData[i].value);
            newHTML += '<div class="ratings-new-pie-list-item"><div class="ratings-new-pie-list-item-inner"><div class="ratings-new-pie-list-item-icon"><div class="ratings-new-pie-list-item-icon-inner" style="background-color:' + colors[i] + '"></div></div><div class="ratings-new-pie-list-item-title">' + curData[i].title + ' <span>(' + curData[i].value + '%)</span></div></div></div>';
            if (Number(curData[i].value) >= 2) {
                cubeFace.find('.ratings-new-pie-hints').append('<div class="ratings-new-pie-hints-item" style="transform:rotate(' + ((curFull + curData[i].value / 2) / 100 * 360) + 'deg)"><span style="transform:translate(-50%, 0) rotate(-' + ((curFull + curData[i].value / 2) / 100 * 360) + 'deg)">' + curData[i].value + '%</span></div>');
            }
            curFull += Number(curData[i].value);
        }

        if (myChartFace === undefined) {
            Chart.defaults.global.tooltips.custom = function(tooltip) {
                var tooltipEl = cubeFace.find('.ratings-new-pie-tooltip')[0];

                if (tooltip.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }

                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltip.yAlign) {
                    tooltipEl.classList.add(tooltip.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }

                function getBody(bodyItem) {
                    return bodyItem.lines;
                }

                if (tooltip.body) {
                    var titleLines = tooltip.title || [];
                    var bodyLines = tooltip.body.map(getBody);

                    var innerHtml = '';

                    titleLines.forEach(function(title) {
                        innerHtml += title;
                    });

                    bodyLines.forEach(function(body, i) {
                        var newBody = body[0].replace(':', '<span>') + '%</span>';
                        innerHtml += newBody;
                    });

                    tooltipEl.innerHTML = innerHtml;
                }

                var positionY = this._chart.canvas.offsetTop;
                var positionX = this._chart.canvas.offsetLeft;

                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                tooltipEl.style.top = positionY + tooltip.caretY + 'px';
            };

            var pieConfig = {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        label: '#',
                        data: [],
                        backgroundColor: [],
                        borderWidth: 0
                    }]
                },
                options: {
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }
                    },
                    responsive: true,
                    legend: {
                        position: 'none',
                    },
                    tooltips: {
                        enabled: false
                    },
                    title: {
                        display: false
                    }
                }
            };

            var ctxFace = cubeFace.find('canvas')[0].getContext('2d');
            var myChartFace = new Chart(ctxFace, pieConfig);
        }

        pieConfig.data.labels = labels;
        pieConfig.data.datasets[0].data = values;
        pieConfig.data.datasets[0].backgroundColor = colors;

        myChartFace.update();

        cubeFace.find('.ratings-new-pie-list').html(newHTML);
    }
});