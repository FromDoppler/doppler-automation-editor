(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalUpgradePlanCtrl', ModalUpgradePlanCtrl);

  ModalUpgradePlanCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'headerService',
    'ModalService',
    '$translate'
  ];

  function ModalUpgradePlanCtrl($scope, close, data, headerService, ModalService, $translate) {
    $scope.data = data;
    $scope.data.maxlength = $scope.data.maxlength !== undefined ? $scope.data.maxlength : 50;
    var domain = data.urlbase;
    $scope.sentEmail = false;
    $scope.submitted = false;
    $scope.isLoading = false;

    activate();

    function activate() {
      $scope.model = $scope.data.model;
      $scope.model.IdClientTypePlanSelected = null;
      $scope.model.Detail = '';
    }

    $scope.upgradePlan = function () {
      $scope.submitted = true;
      if ($scope.upgradePlanForm.$valid) {
        $scope.isLoading = true;
        headerService.sendEmailUpgradePlan($scope.model, domain).then(function (result) {
          if (result.success) {
            if ($scope.model.IdClientTypePlanSelected > 0) {
              $scope.isLoading = false;
              $scope.openPopup();
            } else {
              $scope.sentEmail = true;
              setTimeout(function () {
                close(true);
              }, 3000);
            }
          }
        });
      }
    };

    $scope.openPopup = function () {
      close(false);
      var planSelected = _.filter($scope.model.ClientTypePlans, function (val) {
        return $scope.model.IdClientTypePlanSelected === val.IdUserTypePlan;
      })[0];

      return ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalConfirmationUpgradePlan.html',
        controller: 'ModalUpgradePlanCtrl',
        inputs: {
          data: {
            model: $scope.model,
            planSelected: planSelected,
            subtitle: $scope.data.idUserType === 4 ? 'confirmation-upgrade-plan-popup.subtitle_subscribers' : 'confirmation-upgrade-plan-popup.subtitle_high_volumen'
          }
        }
      });
    }

    $scope.close = function(result) {
      parent.location.reload(true);
    };
  }
})();
