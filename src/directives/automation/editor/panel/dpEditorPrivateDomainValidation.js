(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPrivateDomainValidation', ['domainDataService', dpEditorPrivateDomainValidation]);

  function dpEditorPrivateDomainValidation(domainDataService) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link,
      scope: false
    };

    return directive;

    function link($scope, element, attr, ctrl) {

      $scope.confirmedDomain = '';

      $scope.validatePrivateDomain = function(fromEmail) {
        if (!$scope.$parent.selectedComponent) {
          return true;
        }

        $scope.confirmedDomain = $scope.$parent.selectedComponent.confirmedDomain;
        fromEmail = fromEmail || '';
        var domain = '';

        if (fromEmail.length > 0){
          domain = fromEmail.match('[^@@]+$') ;
          if (domain !== null && domain.length > 0) {
            domain = domain[0];
            if ($scope.$parent.includedInDmarcDomains(domain.split('.')[0])) {
              return true;
            }
            if (!(!!$scope.confirmedDomain && domain.toLowerCase() === $scope.confirmedDomain.toLowerCase()) ){
              domainDataService.isValidDomain(domain).then(function(response){
                if (response.data.success && response.data.valid) {
                  $scope.$parent.selectedComponent.confirmedDomain = domain;
                  //TODO: remove $setValidity forced validation when we find a way to make asyncValidators work
                  $scope.$parent.campaignForm.fromEmail.$setValidity('privatedomain', true);
                } else if (!$scope.$parent.ShowDmarcWarning) {
                  $scope.$parent.campaignForm.fromEmail.$setValidity('privatedomain', false);
                }
                return response.data.valid;
              });
            }
          }
        }
        return true;

      };

      ctrl.$validators.privatedomain = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        var isValid = $scope.validatePrivateDomain(value);
        return isValid;
      };
    }
  }
})();
