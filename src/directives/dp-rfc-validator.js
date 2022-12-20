(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpRfcValidator', dpRfcValidator);

  dpRfcValidator.$inject = ['utils'];

  function dpRfcValidator(utils) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attr, ngModelCtrl) {
      ngModelCtrl.$validators.invalidRFC = utils.validateRfc;
    }
  }
})();
