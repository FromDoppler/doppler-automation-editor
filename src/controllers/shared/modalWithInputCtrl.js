(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalWithInputCtrl', ModalWithInputCtrl);

  ModalWithInputCtrl.$inject = [
    '$scope',
    'close',
    'data'
  ];

  function ModalWithInputCtrl($scope, close, data) {
    $scope.data = data;
    $scope.data.maxlength = $scope.data.maxlength || 50;
    $scope.data.required = $scope.data.required || false;
    $scope.data.regex = $scope.data.regex || '';
    $scope.data.patternErrorMessage = $scope.data.patternErrorMessage || '';

    $scope.close = function(isConfirmed) {
      if ($scope.validationForm.$valid || !isConfirmed) {
        var result = {
          isConfirmed: isConfirmed,
          name: $scope.data.fieldValue
        };
        close(result);
      }
    };
  }
})();
