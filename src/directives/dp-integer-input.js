(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpIntegerInput', dpIntegerInput);

  function dpIntegerInput() {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        if (text) {
          var transformedInput = text.replace(/[^0-9]/g, '');
          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        }
        return 0;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }
})();
