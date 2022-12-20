(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('modalYesOrNoMercadoShopsCtrl', modalYesOrNoMercadoLibreCtrl);

  modalYesOrNoMercadoLibreCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'mercadoShopsService'
  ];

  function modalYesOrNoMercadoLibreCtrl($scope, close, data, mercadoShopsService) {
    $scope.data = data;

    $scope.close = function(result) {
      close(result);
    };

    $scope.disconnect = function(){
      $scope.disconnecting = true;
      mercadoShopsService.disconnect().then(function(response){
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
