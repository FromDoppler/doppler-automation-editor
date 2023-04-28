(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalYesOrNoVtexCtrl', ModalYesOrNoVtexCtrl);

  ModalYesOrNoVtexCtrl.$inject = ['$scope', 'close', 'data', 'vtexService'];

  function ModalYesOrNoVtexCtrl($scope, close, data, vtexService) {
    $scope.data = data;

    $scope.close = function (result) {
      close(result);
    };

    $scope.disconnect = function () {
      $scope.disconnecting = true;
      vtexService.disconnect().then(function (response) {
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
