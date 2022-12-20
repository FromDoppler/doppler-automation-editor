(function() {
  'use strict';

  angular
    .module('dopplerApp.lists')
    .controller('SubscribersGridCtrl', SubscribersGridCtrl);

  SubscribersGridCtrl.$inject = [
    '$scope',
    '$q',
    '$location',
    '$translate',
    'ModalService',
    '$rootScope'
  ];

  function SubscribersGridCtrl($scope, $q, $location, $translate, ModalService, $rootScope) {
    $scope.isLoading = false;
    $scope.dateFormat = $scope.lang === 'es' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
    $scope.assignExistentList = false;
    $scope.showHeader = false;
    $scope.$on('user_logged', function() {
      $scope.removeEnabled = $rootScope.user.plan.planType !== 'free'
        && $rootScope.user.plan.planType !== 'subscribers';
    });

    $scope.openUnsuscribePopup = function() {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalProcessFile.html',
        controller: 'ModalProcessFileCtrl'
      }).then(function(modal) {
        modal.close;
      });
    };

  }
})();
