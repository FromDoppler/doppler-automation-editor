(function () {
  'use strict';

  angular.module('dopplerApp').directive('dpPartial', dpPartial);

  function dpPartial() {
    var directive = {
      restrict: 'AE',
      templateUrl: function (ele, attrs) {
        return attrs.dpPartial;
      },
    };

    return directive;
  }
})();
