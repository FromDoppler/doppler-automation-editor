(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('parentHoverClass', parentHoverClass);


  function parentHoverClass() {

    var directive = {
      restrict: 'A',
      link: link,
      scope: {
        parentHoverClass: '@'
      }
    };

    return directive;

    function link(scope, element) {
      element.on('mouseenter', function() {
        element[0].parentNode.classList.add(scope.parentHoverClass);
      });
      element.on('mouseleave', function() {
        element[0].parentNode.classList.remove(scope.parentHoverClass);
      });
    }
  }

})();
