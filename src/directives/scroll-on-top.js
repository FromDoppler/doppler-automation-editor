(function () {
  'use strict';

  angular.module('dopplerApp').directive('scrollOnTop', scrollOnTop);

  function scrollOnTop() {
    var directive = {
      restrict: 'A',
      link: link,
      scope: {
        scrollCallback: '&',
      },
    };

    return directive;

    function link(scope, element) {
      element.on('scroll', function () {
        scope.scrollCallback()(element[0].scrollTop === 0);
      });
    }
  }
})();
