(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('modalYesOrNoMagentoCtrl', modalYesOrNoMagentoCtrl);

  modalYesOrNoMagentoCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'magentoService'
  ];

  function modalYesOrNoMagentoCtrl($scope, close, data, magentoService) {
    $scope.data = data;

    $scope.close = function(result) {
      close(result);
    };

    $scope.disconnect = function(){
      $scope.disconnecting = true;
      magentoService.disconnect().then(function(response){
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
