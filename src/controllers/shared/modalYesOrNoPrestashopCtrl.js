(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalYesOrNoPrestashopCtrl', ModalYesOrNoPrestashopCtrl);

  ModalYesOrNoPrestashopCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'prestashopService'
  ];

  function ModalYesOrNoPrestashopCtrl($scope, close, data, prestashopService) {
    $scope.data = data;

    $scope.close = function(result) {
      close(result);
    };

    $scope.disconnect = function(){
      $scope.disconnecting = true;
      prestashopService.disconnect().then(function(response){
        if (response.success){
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
