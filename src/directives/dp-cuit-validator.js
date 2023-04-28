(function () {
  'use strict';

  angular.module('dopplerApp').directive('dpCuitValidator', dpCuitValidator);

  dpCuitValidator.$inject = ['utils'];

  function dpCuitValidator(utils) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link,
    };

    return directive;

    function link(scope, element, attr, ngModelCtrl) {
      ngModelCtrl.$validators.invalidCuit = utils.validateCuit;
    }
  }
})();
