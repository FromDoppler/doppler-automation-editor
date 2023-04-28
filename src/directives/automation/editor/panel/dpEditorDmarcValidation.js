(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorDmarcValidation', [
      'settingsService',
      '$rootScope',
      dpEditorDmarcValidation,
    ]);

  function dpEditorDmarcValidation(settingsService, $rootScope) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link,
      scope: false,
    };

    return directive;

    function link($scope, element, attr, ctrl) {
      var settings = settingsService.getLoadedData();
      $scope.dmarcDomains = settings.dmarcDomains;
      $scope.dmarcSubscribersExceeded = settings.dmarcSubscribersExceeded;
      $scope.DMARCAcceptedDomain = '';

      $scope.validateDMARCEmail = function (value) {
        if (!$scope.$parent.selectedComponent) {
          return;
        }

        $scope.DMARCAcceptedDomain =
          $scope.$parent.selectedComponent.DMARCAcceptedDomain;
        var fromEmail = value || '';
        var domain = '';
        if (fromEmail.length > 0) {
          domain = fromEmail.match('[^@@]+$');
        }
        var badEmail = false;
        var maxSubscribers = false;
        if (domain !== null && domain.length > 0) {
          domain = domain[0];
          $scope.DMARCValidationDomain = domain.toLowerCase();
          if ($scope.dmarcDomains !== undefined) {
            for (var i = 0; i < $scope.dmarcDomains.length && !badEmail; i++) {
              if (
                domain.split('.')[0].toLowerCase() ===
                $scope.dmarcDomains[i].toLowerCase().trim()
              ) {
                if ($scope.dmarcSubscribersExceeded) {
                  maxSubscribers = true;
                } else {
                  $scope.$parent.MarkDMARCDomainWarningDisplayed();
                  badEmail = true;
                }
              }
            }
          }
        }
        $scope.DMARCEmailActive = badEmail;
        $rootScope.ShowDmarcWarning = badEmail;
        $rootScope.DMARCEmailSubscribers = maxSubscribers;
        var isValid = !maxSubscribers;
        return isValid;
      };

      ctrl.$validators.dmarc = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        var valid = $scope.validateDMARCEmail(value);
        return valid;
      };
    }
  }
})();
