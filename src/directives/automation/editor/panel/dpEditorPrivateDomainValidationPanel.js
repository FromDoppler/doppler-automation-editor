(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPrivateDomainValidationPanel', ['domainDataService', '$translate', '$timeout', dpEditorPrivateDomainValidationPanel]);

  function dpEditorPrivateDomainValidationPanel(domainDataService, $translate, $timeout) {
    var directive = {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-private-domain-panel.html',
      link: link,
      scope: {
        fullemail: '='
      }
    };

    return directive;

    function link($scope) {
      var rawDomain = $scope.fullemail.match('[^@@]+$');
      $scope.validatedDomain = rawDomain !== null && rawDomain.length > 0 ? rawDomain[0] : '';
      $scope.validatedDomain = $scope.validatedDomain.length > 10 ? $scope.validatedDomain.substring(0, 10) + '...' : $scope.validatedDomain;
      $scope.emailSent = false;
      $scope.codeValidated = false;
      $scope.processing = false;
      $scope.showConfirmation = false;

      $scope.getCodeByEmail = function() {
        $scope.processing = true;
        domainDataService.sendEmail($scope.email + '@' + $scope.fullemail.match('[^@@]+$')[0]).then(function(response){
          if (response.data.success){
            $scope.emailSent = true;
            $scope.showConfirmation = true;
            $scope.processing = false;
            $timeout(function() {
              $scope.showConfirmation = false;
            }, 3000);
          } else if (!response.data.success && response.data.maxAttemptsReached) {
            $scope.processing = false;
            $scope.emailNotSent = true;
            $timeout(function() {
              $scope.emailNotSent = false;
            }, 4000);
          }

          return response.data.success;
        });
      };

      $scope.validateCode = function() {
        $scope.processing = true;
        domainDataService.isValidCode($scope.code, $scope.email + '@' + $scope.fullemail.match('[^@@]+$')[0]).then(function(response) {
          $scope.codeValidated = true;
          $scope.success = response.data.valid ? true : false;
          $scope.processing = false;
          if ($scope.success) {
            $timeout(function() {
              $scope.removeMessage();
            }, 3000);
          } else if (response.data.maxDomainsCountReached){
            $scope.maxDomainsReached = true;
          }
        });
      };

      $scope.removeMessage = function(){
        $scope.codeValidated = false;
        $scope.$parent.removePrivateDomainMessage($scope.fullemail.match('[^@@]+$')[0]);
      };


      $scope.$watch('fullemail', function() {
        if ($scope.fullemail.length) {
          $scope.validatedDomain = $scope.fullemail.match('[^@@]+$')[0];
          $scope.validatedDomain = $scope.validatedDomain.length > 10 ? $scope.validatedDomain.substring(0, 10) + '...' : $scope.validatedDomain;
        }

      });

    }
  }
})();
