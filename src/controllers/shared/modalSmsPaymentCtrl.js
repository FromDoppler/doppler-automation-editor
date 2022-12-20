(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalSmsPaymentCtrl', ModalSmsPaymentCtrl);

  ModalSmsPaymentCtrl.$inject = [
    '$scope',
    '$rootScope',
    'close',
    'data',
    'smsSettingsService'
  ];

  function ModalSmsPaymentCtrl($scope, $rootScope, close, data, smsSettingsService) {
    $scope.smsSettingsService = smsSettingsService;

    $scope.close = function(result) {
      close(result);
    };

    $rootScope.$on('closeSmsPaymentModal', function() {
      $scope.close(false);
    });
  }

})();