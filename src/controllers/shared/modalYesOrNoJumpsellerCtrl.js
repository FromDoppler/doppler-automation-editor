(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('modalYesOrNoJumpsellerCtrl', modalYesOrNoJumpsellerCtrl);

  modalYesOrNoJumpsellerCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'jumpsellerService'
  ];

  function modalYesOrNoJumpsellerCtrl($scope, close, data, jumpsellerService) {
    $scope.data = data;

    $scope.close = function(result) {
      close(result);
    };

    $scope.disconnect = function(){
      $scope.disconnecting = true;
      jumpsellerService.disconnect().then(function(response){
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
