(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('createCustomDomainCtrl', createCustomDomainCtrl);

  createCustomDomainCtrl.$inject = [
    '$scope',
    '$translate',
    'close',
    'customDomainService',
  ];

  function createCustomDomainCtrl(
    $scope,
    $translate,
    close,
    customDomainService
  ) {
    $scope.customDomain = {
      domain: '',
      subdomain: '',
    };
    $scope.processing = false;
    $scope.showError = false;
    $scope.showWarning = false;
    $scope.errorMessage = '';
    $scope.warningMessage = '';

    $scope.create = function () {
      var completeDomain =
        $scope.customDomain.subdomain + '.' + $scope.customDomain.domain;

      if ($scope.createDomainForm.$invalid) {
        showErrorMessage(
          $translate.instant(
            'landing_pages_domains.create_domain.error.required'
          )
        );
        return;
      }
      if (!isValidDomain(completeDomain)) {
        showErrorMessage(
          $translate.instant(
            'landing_pages_domains.create_domain.error.invalid'
          )
        );
        return;
      }
      $scope.processing = true;
      $scope.hideWarningsAndErrors();
      customDomainService
        .create(completeDomain)
        .then(function (response) {
          $scope.processing = false;
          $scope.closeModal(response);
        })
        .catch(function (response) {
          var errorKey = response.data.error;
          if (errorKey === 'ExistentDomainKey') {
            showErrorMessage(
              $translate.instant(
                'landing_pages_domains.create_domain.error.duplicate'
              )
            );
          } else if (errorKey === 'CustomDomainAlreadyUsedByAnotherUser') {
            showErrorMessage(
              $translate.instant(
                'landing_pages_domains.create_domain.error.used_by_other'
              )
            );
          } else {
            showErrorMessage(
              $translate.instant(
                'landing_pages_domains.create_domain.error.default'
              )
            );
          }
          $scope.processing = false;
        });
    };

    function isValidDomain(completeDomain) {
      return (
        Regex.CUSTOMDOMAIN.test(completeDomain) && completeDomain.length <= 253
      ); //eslint-disable-line no-undef
    }

    function showErrorMessage(message) {
      $scope.showError = true;
      $scope.errorMessage = message;
    }

    $scope.hideWarningsAndErrors = function () {
      $scope.showError = false;
      $scope.showWarning = false;
      $scope.errorMessage = '';
      $scope.warningMessage = '';
    };

    $scope.closeModal = function (param) {
      if ($scope.processing) {
        return;
      }
      close(param);
    };
  }
})();
