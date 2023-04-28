(function () {
  'use strict';

  angular.module('dopplerApp').directive('checkbox', checkbox);

  function checkbox() {
    var directive = {
      scope: {
        someSelected: '=',
        internalNgChecked: '=ngChecked',
        internalNgDisabled: '=ngDisabled',
      },
      require: 'ngModel',
      restrict: 'E',
      templateUrl: 'angularjs/partials/shared/checkbox.html',
      link: link,
    };

    return directive;

    function link(scope, elem, attrs, modelCtrl) {
      var trueValue = true;
      var falseValue = false;
      // If defined set true value
      if (attrs.ngTrueValue !== undefined) {
        trueValue = attrs.ngTrueValue;
      }
      // If defined set false value
      if (attrs.ngFalseValue !== undefined) {
        falseValue = attrs.ngFalseValue;
      }

      // Check if name attribute is set and if so add it to the DOM element
      if (scope.name !== undefined) {
        elem.name = scope.name;
      }

      // Update element when model changes
      scope.$watch(
        function () {
          if (
            modelCtrl.$modelValue === trueValue ||
            modelCtrl.$modelValue === true
          ) {
            modelCtrl.$setViewValue(trueValue);
          } else {
            modelCtrl.$setViewValue(falseValue);
          }
          return modelCtrl.$modelValue;
        },
        function () {
          scope.checked = modelCtrl.$modelValue === trueValue;
        },
        true
      );

      //On click swap value and trigger onChange function
      elem.bind('click', function () {
        scope.$apply(function () {
          if (scope.internalNgChecked === undefined) {
            if (modelCtrl.$modelValue === falseValue) {
              modelCtrl.$setViewValue(trueValue);
            } else {
              modelCtrl.$setViewValue(falseValue);
            }
          } else {
            if (scope.internalNgChecked === falseValue) {
              modelCtrl.$setViewValue(falseValue);
            } else {
              modelCtrl.$setViewValue(trueValue);
            }
          }
        });
      });
    }
  }
})();
