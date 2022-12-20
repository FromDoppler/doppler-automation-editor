(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('FooterCtrl', FooterCtrl);

  FooterCtrl.$inject = [
    '$scope'
  ];

  function FooterCtrl($scope) {
    $scope.yearNow = new Date().getFullYear();
  }

})();