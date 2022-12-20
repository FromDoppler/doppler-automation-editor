(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalAddDomainCtrl', ModalAddDomainCtrl);

  ModalAddDomainCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'siteTrackingService',
    '$translate',
    'DATA_HUB_ERROR_CODES'
  ];

  function ModalAddDomainCtrl($scope, close, data, siteTrackingService, $translate, DATA_HUB_ERROR_CODES) {
    $scope.data = data;
    $scope.data.maxlength = $scope.data.maxlength || 50;
    $scope.data.required = $scope.data.required || false;
    $scope.data.patternErrorMessage = '';
    var domains = $scope.data.domains;
    var regexDomain = $scope.data.regex || '';

    $scope.data.regex = (function() {
      return {
        test: function(url) {
          if (!url.match(regexDomain)) {
            $scope.data.patternErrorMessage = $translate.instant('validation_messages.domain');
            $scope.validationForm.fieldValue.$setValidity('pattern', false);
            return false;
          }
          var cleanUrl = url.replace(/^(?:https?:\/\/)?/i, '').split('/')[0].toLowerCase();
          if (isDomainDuplicated(cleanUrl)) {
            $scope.data.patternErrorMessage = $translate.instant('site_tracking.validation_messages.domain_repeat');
            $scope.validationForm.fieldValue.$setValidity('pattern', false);
            return false;
          }
          siteTrackingService.canAddDomain(cleanUrl)
            .then(function(isDomainInUse) {
              if (!isDomainInUse) {
                $scope.data.patternErrorMessage = $translate.instant('site_tracking.validation_messages.domain_in_use');
                $scope.validationForm.fieldValue.$setValidity('pattern', false);
                return false;
              }
              $scope.validationForm.fieldValue.$setValidity('pattern', true);
              return true;
            });
          return true;
        }
      };
    })();

    function isDomainDuplicated(url) {
      return _.find(domains, function(item) {
        return item.Domain === url;
      });
    }

    $scope.close = function(isConfirmed) {
      if (!isConfirmed) {
        close();
      } else {
        $scope.saveAndClose();
      }
    };

    $scope.saveAndClose = function() {
      if ($scope.validationForm.$valid) {
        $scope.processingSave = true;
        siteTrackingService.addOrEditDomain($scope.data.fieldValue, $scope.data.domainId)
          .then(function(data) {
            if (data && !data.errorCode) {
              data.isConfirmed = true;
              data.domain = { Domain: $scope.data.fieldValue, IdDomain: $scope.data.domainId};
              close(data);
            } else if (data.errorCode === DATA_HUB_ERROR_CODES.DUPLICATE_DOMAIN) {
              $scope.data.patternErrorMessage = $translate.instant('site_tracking.validation_messages.domain_in_use');
              $scope.validationForm.fieldValue.$setValidity('pattern', false);
            } else {
              $scope.data.patternErrorMessage = $translate.instant('validation_messages.connection_error');
              $scope.validationForm.fieldValue.$setValidity('pattern', false);
            }
            $scope.processingSave = false;
          });
      }
    };
  }
})();
