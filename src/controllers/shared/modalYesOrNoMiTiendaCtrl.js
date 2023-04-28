(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('modalYesOrNoMiTiendaCtrl', modalYesOrNoMiTiendaCtrl);

  modalYesOrNoMiTiendaCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'miTiendaService',
  ];

  function modalYesOrNoMiTiendaCtrl($scope, close, data, miTiendaService) {
    $scope.data = data;

    $scope.close = function (result) {
      close(result);
    };

    $scope.disconnect = function () {
      $scope.disconnecting = true;
      miTiendaService.disconnect().then(function (response) {
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
