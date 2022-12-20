(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('modalYesOrNoBmwCrmCtrl', modalYesOrNoBmwCrmCtrl);

  modalYesOrNoBmwCrmCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'bmwCrmService'
  ];

  function modalYesOrNoBmwCrmCtrl($scope, close, data, bmwCrmService) {
    $scope.data = data;

    $scope.close = function(result) {
      close(result);
    };

    $scope.disconnect = function(){
      $scope.disconnecting = true;
      bmwCrmService.disconnect().then(function(response){
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
