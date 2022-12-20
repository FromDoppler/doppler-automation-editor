(function() {
  'use strict';
  //requires dp-cursor-tooltip directive
  angular
    .module('dopplerApp')
    .directive('dpgraph', dpgraph);

  function dpgraph() {

    var directive = {
      restrict: 'E',
      scope: {
        type: '=',
        c3config: '='
      },
      templateUrl: 'angularjs/partials/shared/graph.html',
      replace: true,
      link: link
    };

    return directive;

    function link(scope) {
      if (scope.type === 'c3' && scope.c3config && scope.c3config.data) {
        if (scope.c3config.data.type !== undefined && scope.c3config.data.type === 'donut') {
          scope.graphclass = 'donut-graphic';
        } else {
          scope.graphclass = 'doppler-line-chart';
        }


        scope.$watchCollection('c3config', function() {
          scope.chart = c3.generate(scope.c3config); //eslint-disable-line no-undef
          if (scope.c3config.data.type !== undefined && scope.c3config.data.type !== 'donut' && scope.c3config.legend.show === false) {
            scope.generateCustomLegend();
          }
        });


        scope.generateCustomLegend = function() {
          var id = scope.c3config.bindto;

          //add new legends
          var ids = [];
          angular.forEach(scope.c3config.data.names, function(value, key) {
            ids.push(key);
          });

          d3.select('.' + id.substr(1)).insert('div', '.chart').attr('class', ' legend').selectAll('span') //eslint-disable-line no-undef
            .data(ids)
            .enter().append('span')
            .attr('data-id', function(id) {
              return id;
            })
            .html(function(id) {
              return scope.c3config.data.names[id];
            })
            .each(function(id) {
              d3.select(this).style('background-color', scope.chart.color(id)); //eslint-disable-line no-undef
              d3.select(this).attr('class', 'legend-container'); //eslint-disable-line no-undef
            })
            .on('mouseover', function(id) {
              scope.chart.focus(id);
            })
            .on('mouseout', function() {
              scope.chart.revert();
            })
            .on('click', function(id) {
              scope.chart.toggle(id);
            });
          $(id + ' .legend-container').each(function(index, item) { //eslint-disable-line no-undef
            if ($(item).text().length > 28) { //eslint-disable-line no-undef
              $(item).html('<span class=\'titip-top titip-fade\' data-title=\'' + $(item).text() + '\'><span class=\'legend-icon\' style=\'' + $(item).attr('style') + '\'> </span> <span class=\'legend-text\'>' + $(item).text() + '</span></span>'); //eslint-disable-line no-undef
            } else {
              $(item).html('<span class=\'legend-icon\' style=\'' + $(item).attr('style') + '\'> </span> <span class=\'legend-text\'>' + $(item).text() + '</span>'); //eslint-disable-line no-undef
            }
            $(item).attr('style', ''); //eslint-disable-line no-undef
          });
        };
      } else if (scope.type === 'funnel') {
        scope.graphclass = 'funnel--container';
        scope.$watchCollection('c3config', function() {
          scope.totalFunnel = (scope.c3config[0].value === 0 ? 1 : scope.c3config[0].value);
          angular.forEach(scope.c3config, function(item) {
            item.percent = (item.value / scope.totalFunnel * 100) + '%';
          });

        });

      }
    }

  }

})();
