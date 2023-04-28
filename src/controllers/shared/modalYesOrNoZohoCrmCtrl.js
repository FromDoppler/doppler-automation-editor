(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalYesOrNoZohoCrmCtrl', ModalYesOrNoZohoCrmCtrl);

  ModalYesOrNoZohoCrmCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'zohoCrmService',
  ];

  function ModalYesOrNoZohoCrmCtrl($scope, close, data, zohoCrmService) {
    $scope.data = data;

    $scope.close = function (result) {
      close(result);
    };

    $scope.disconnect = function () {
      $scope.disconnecting = true;
      zohoCrmService.disconnect().then(function (response) {
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
