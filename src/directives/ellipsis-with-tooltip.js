(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('ellipsisWithTooltip', ellipsisWithTooltip);

  ellipsisWithTooltip.$inject = ['$timeout'];

  function ellipsisWithTooltip($timeout) {

    var directive = {
      restrict: 'E',
      link: link,
      scope: {
        text: '=',
        url: '@',
        cssClass: '@',
        multiLine: '@'
      },
      templateUrl: 'angularjs/partials/shared/ellipsis-with-tooltip.html'
    };

    return directive;

    function link(scope, element) {
      scope.cssClass = scope.cssClass || '';

      function activateEllipsis(){
        $timeout(function() {
          var textElement = angular.element(element[0].querySelector('.text'))[0];
          var tooltipElement = angular.element(element[0].querySelector('.titip-top'))[0];
          if (isEllipsisActive(textElement)) {
            tooltipElement.classList.remove('tooltip-hide');
            if (scope.multiLine) {
              var text = textElement.innerText.substring(0, 30);
              textElement.innerText = text + '...';
            }
          }
        });
      }

      activateEllipsis();

      if (scope.multiLine){
        scope.$watch('text', function(){
          activateEllipsis();
        });
      }

      function isEllipsisActive(e) {
        return scope.multiLine ? (e.offsetHeight < e.scrollHeight) : (e.offsetWidth < e.scrollWidth);
      }

    }
  }

})();
