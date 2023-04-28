(function () {
  'use strict';

  angular.module('dopplerApp').controller('ModalYesOrNoCtrl', ModalYesOrNoCtrl);

  ModalYesOrNoCtrl.$inject = ['$scope', 'close', 'data'];

  function ModalYesOrNoCtrl($scope, close, data) {
    $scope.data = data;

    $scope.close = function (result) {
      close(result);
    };
  }
})();
