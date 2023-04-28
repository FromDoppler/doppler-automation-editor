(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpOnFinishNgRepeat', dpOnFinishNgRepeat);

  dpOnFinishNgRepeat.$inject = ['$timeout'];

  function dpOnFinishNgRepeat($timeout) {
    var directive = {
      restrict: 'A',
      link: link,
    };

    return directive;

    function link(scope) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  }
})();
