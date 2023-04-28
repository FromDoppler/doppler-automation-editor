(function () {
  'use strict';

  angular.module('dopplerApp').directive('dpNitValidator', dpNitValidator);

  dpNitValidator.$inject = ['utils'];

  function dpNitValidator(utils) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link,
    };

    return directive;

    function link(scope, element, attr, ngModelCtrl) {
      ngModelCtrl.$validators.invalidNit = utils.validateNit;
    }
  }
})();
