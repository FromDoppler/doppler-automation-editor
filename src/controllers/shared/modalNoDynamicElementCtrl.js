(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalNoDynamicElementCtrl', ModalNoDynamicElementCtrl);

  ModalNoDynamicElementCtrl.$inject = [
    '$scope',
    '$rootScope',
    'close',
    'data',
    'AUTOMATION_TYPE',
  ];

  function ModalNoDynamicElementCtrl(
    $scope,
    $rootScope,
    close,
    data,
    AUTOMATION_TYPE
  ) {
    $scope.data = data;

    $scope.startCampaign = function () {
      $rootScope.startCampaign();
    };

    $scope.close = function (result) {
      close(result);
    };
  }
})();
