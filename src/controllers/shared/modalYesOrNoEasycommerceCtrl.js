(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('modalYesOrNoEasycommerceCtrl', modalYesOrNoEasycommerceCtrl);

  modalYesOrNoEasycommerceCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'easycommerceService',
  ];

  function modalYesOrNoEasycommerceCtrl(
    $scope,
    close,
    data,
    easycommerceService
  ) {
    $scope.data = data;

    $scope.close = function (result) {
      close(result);
    };

    $scope.disconnect = function () {
      $scope.disconnecting = true;
      easycommerceService.disconnect().then(function (response) {
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
