(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalYesOrNoTiendanubeCtrl', ModalYesOrNoTiendanubeCtrl);

  ModalYesOrNoTiendanubeCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'tiendanubeService',
  ];

  function ModalYesOrNoTiendanubeCtrl($scope, close, data, tiendanubeService) {
    $scope.data = data;

    $scope.close = function (result) {
      close(result);
    };

    $scope.disconnect = function () {
      $scope.disconnecting = true;
      tiendanubeService.disconnect().then(function (response) {
        if (response.success) {
          $scope.disconnecting = false;
          close(true);
        } else {
          $scope.errorMsg = response.errorMsg;
          $scope.disconnecting = false;
        }
      });
    };
  }
})();
