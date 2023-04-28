(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('configureCustomDomainCtrl', configureCustomDomainCtrl);

  configureCustomDomainCtrl.$inject = [
    '$scope',
    'close',
    'customDomainService',
    'data',
  ];

  function configureCustomDomainCtrl($scope, close, customDomainService, data) {
    setCopyButton(); //eslint-disable-line no-undef
    $scope.customDomain = data.model;
    $scope.formDopplerPagesDomain = data.formDopplerPagesDomain;
    $scope.processing = false;

    $scope.verify = function () {
      $scope.processing = true;
      customDomainService
        .verify($scope.customDomain.IdCustomDomain)
        .then(function (response) {
          $scope.customDomain.IdDomainVerificationStatus =
            response.IdDomainVerificationStatus;
          $scope.customDomain.IdDomainStatus = response.IdDomainStatus;
          $scope.customDomain.VerifiedAt = response.VerifiedAt;
          $scope.processing = false;
          $scope.closeModal($scope.customDomain);
        })
        .catch(function () {
          $scope.processing = false;
          $scope.closeModal();
        });
    };

    $scope.closeModal = function (param) {
      if ($scope.processing) {
        return;
      }
      close(param);
    };
  }
})();
