(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorZoom', dpEditorZoom);

  dpEditorZoom.$inject = ['$compile', '$document', 'automation', 'ZOOM_ACTION'];

  function dpEditorZoom($compile, $document, automation, ZOOM_ACTION) {
    var directive = {
      restrict: 'A',
      scope: {
        scalable: '@',
      },
      link: link,
    };

    return directive;

    function link(scope, element) {
      scope.ZOOM_ACTION = ZOOM_ACTION;
      // scaling settings
      scope.canvasScale = 1;
      scope.maxScale = 1;
      scope.minScale = 0.5;
      var stepperScale = 0.1;
      var scalableContainer = angular.element(
        element[0].getElementsByClassName(scope.scalable)
      );
      // scaling control
      var zoomControl = angular.element(
        '<div class="zoom-control">' +
          '<div ng-click="scale(ZOOM_ACTION.IN)" class="icon-zoom-in" ng-class="{disabled: canvasScale === maxScale}"></div>' +
          '<div ng-click="scale(ZOOM_ACTION.RESET)" class="icon-zoom-fit-to-scale" ng-class="{disabled: canvasScale === maxScale}"></div>' +
          '<div ng-click="scale(ZOOM_ACTION.OUT)" class="icon-zoom-out" ng-class="{disabled: canvasScale === minScale}"></div>' +
          '</div>'
      );
      // dragging settings
      var lastClientX;
      var lastClientY;

      // compile and append the scaling control
      $compile(zoomControl)(scope);
      element.append(zoomControl);
      // bind mouse events
      element.bind('mousedown', handleMousedown);

      // scaling method
      scope.scale = function (zoomAction) {
        switch (zoomAction) {
          case ZOOM_ACTION.IN:
            if (scope.canvasScale === scope.maxScale) {
              return;
            }
            scope.canvasScale = parseFloat(
              Math.min(
                scope.canvasScale + stepperScale,
                scope.maxScale
              ).toFixed(1)
            );
            break;

          case ZOOM_ACTION.RESET:
            if (scope.canvasScale === scope.maxScale) {
              return;
            }
            scope.canvasScale = 1;
            break;

          case ZOOM_ACTION.OUT:
            if (scope.canvasScale === scope.minScale) {
              return;
            }
            scope.canvasScale = parseFloat(
              Math.max(
                scope.canvasScale - stepperScale,
                scope.minScale
              ).toFixed(1)
            );
            break;

          default:
            scope.canvasScale = 1;
        }

        scalableContainer.css('transform', 'scale(' + scope.canvasScale + ')');
        scalableContainer.css('transform-origin', 'center top 0px');
        // the zoomed-down class is added when the scale is smaller than 1 to solve rendering issues in Firefox
        if (scope.canvasScale >= 1) {
          scalableContainer.removeClass('zoomed-down');
        } else if (scope.canvasScale < 1) {
          scalableContainer.addClass('zoomed-down');
        }
        automation.centerCanvas();
      };

      // dragging methods
      function handleMousedown(event) {
        // add grabbable class to show the grab cursor
        element.addClass('grabbable');
        // bind mouse listeners
        element.bind('mousemove', handleMousemove);
        $document.bind('mouseup', handleMouseup);

        lastClientX = event.clientX;
        lastClientY = event.clientY;

        event.preventDefault();
      }

      function handleMousemove(event) {
        element[0].scrollLeft -= -lastClientX + (lastClientX = event.clientX);
        element[0].scrollTop -= -lastClientY + (lastClientY = event.clientY);
      }

      function handleMouseup() {
        // remove grabbable class to show the default cursor
        element.removeClass('grabbable');
        // unbind mouse listeners
        element.unbind('mousemove', handleMousemove);
        $document.unbind('mouseup', handleMouseup);
      }

      // destroy mouse listeners
      scope.$on('$destroy', function () {
        element.unbind('mousedown', handleMousedown);
        element.unbind('mousemove', handleMousemove);
        $document.unbind('mouseup', handleMouseup);
      });
    }
  }
})();
