(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorParserFormatter', dpEditorParserFormatter);

  dpEditorParserFormatter.$inject = ['FORMAT_TYPE', 'utils'];

  function dpEditorParserFormatter(FORMAT_TYPE, utils) {
    var directive = {
      require: '?ngModel',
      restrict: 'A',
      scope: {
        format: '=dpEditorParserFormatter',
      },
      link: link,
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      if (!ngModel) {
        return;
      }
      var formatter = getFormatterMethodFor(scope.format);

      element.bind('blur', function () {
        element.val(formatter(ngModel.$viewValue));
      });
      ngModel.$formatters.unshift(formatter);
      ngModel.$parsers.unshift(formatter);

      function getFormatterMethodFor(formatType) {
        var formatterMethod;

        switch (formatType) {
          case FORMAT_TYPE.FLOAT:
            formatterMethod = function (value) {
              var formattedValue;
              var pattern = new RegExp(utils.REGEX_NUMBER);

              if (!value || !pattern.test(value)) {
                return value;
              }
              formattedValue = parseFloat(value.replace(/,/g, '.'));
              if (Number.isNaN(formattedValue)) {
                formattedValue = value;
              } else if (!Number.isInteger(formattedValue)) {
                formattedValue = formattedValue.toFixed(2);
              }

              return formattedValue.toString();
            };
            break;

          default:
            formatterMethod = function (value) {
              return value;
            };
        }

        return formatterMethod;
      }
    }
  }
})();
