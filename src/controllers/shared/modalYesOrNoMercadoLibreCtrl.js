(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('modalYesOrNoMercadoLibreCtrl', modalYesOrNoMercadoLibreCtrl);

  modalYesOrNoMercadoLibreCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'mercadoLibreService',
  ];

  function modalYesOrNoMercadoLibreCtrl(
    $scope,
    close,
    data,
    mercadoLibreService
  ) {
    $scope.data = data;

    $scope.close = function (result) {
      close(result);
    };

    $scope.disconnect = function () {
      $scope.disconnecting = true;
      mercadoLibreService.disconnect().then(function (response) {
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
