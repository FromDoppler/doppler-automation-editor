(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalConfigureDkimCtrl', ModalConfigureDkimCtrl);

  ModalConfigureDkimCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'dkimService',
    '$translate',
    '$timeout',
  ];

  function ModalConfigureDkimCtrl(
    $scope,
    close,
    data,
    dkimService,
    $translate,
    $timeout
  ) {
    $scope.data = data;
    $scope.dkimSelector = '';
    $scope.dkimPublicKey = '';
    $scope.spfField = '';
    $scope.domainValidating = false;
    $scope.row = $scope.data.model;
    $scope.domainRegex = $scope.data.domainRegex;
    setCopyButton(); //eslint-disable-line no-undef
    $scope.loadingTexts = true;

    $translate.onReady().then(function () {
      $timeout(function () {
        $scope.loadingTexts = false;
      });
    });

    dkimService
      .getDkimKeys($scope.data.model.DomainId)
      .then(function (response) {
        if (response.data.success) {
          $scope.dkimSelector = response.data.DkimSelector;
          $scope.dkimPublicKey = response.data.PublicKey;
          $scope.spfField = response.data.SpfField;
          $scope.DkimStatus = $scope.data.model.DkimStatus;
          $scope.SpfStatus = $scope.data.model.SpfStatus;
          $scope.dkimStatusDescription = $translate
            .instant(
              'control_panel.dkim.validation_states.description-' +
                $scope.DkimStatus,
              { protocol: 'DKIM' }
            )
            .replace(/<br\/>/g, '');
          $scope.spfStatusDescription = $translate
            .instant(
              'control_panel.dkim.validation_states.description-' +
                $scope.SpfStatus,
              { protocol: 'SPF' }
            )
            .replace(/<br\/>/g, '');
        }
      });

    $scope.close = function (result) {
      if (!$scope.domainValidating) {
        close(result);
      }
    };

    $scope.verify = function () {
      $scope.domainValidating = true;

      dkimService
        .verifyDomain($scope.data.model.DomainId)
        .then(function (response) {
          if (response.data.success) {
            $scope.DkimStatus = response.data.row.DkimStatus;
            $scope.SpfStatus = response.data.row.SpfStatus;
            $scope.row.DomainStatus = response.data.row.DomainStatus;
            $scope.row.DkimStatus = $scope.DkimStatus;
            $scope.row.SpfStatus = $scope.SpfStatus;
            $scope.row.LastValidationDate =
              response.data.row.LastValidationDate;
            $scope.row.verified = true;
          }
          $scope.domainValidating = false;
        });
    };
  }
})();
