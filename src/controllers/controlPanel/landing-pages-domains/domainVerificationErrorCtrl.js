(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('domainVerificationErrorCtrl', domainVerificationErrorCtrl);

  domainVerificationErrorCtrl.$inject = [
    '$scope',
    'close',
    'data'
  ];

  function domainVerificationErrorCtrl($scope, close, data) {
    $scope.formDopplerPagesDomain = data.formDopplerPagesDomain;

    $scope.closeModal = function(param) {
      close(param);
    };
  }
})();
