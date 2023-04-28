(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('modalYesOrNoWooCommerceCtrl', modalYesOrNoWooCommerceCtrl);

  modalYesOrNoWooCommerceCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'wooCommerceService',
  ];

  function modalYesOrNoWooCommerceCtrl(
    $scope,
    close,
    data,
    wooCommerceService
  ) {
    $scope.data = data;

    $scope.close = function (result) {
      close(result);
    };

    $scope.disconnect = function () {
      $scope.disconnecting = true;
      wooCommerceService.disconnect().then(function (response) {
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
