(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('ModalCreateDkimCtrl', ModalCreateDkimCtrl);

  ModalCreateDkimCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'dkimService',
    '$translate'
  ];

  function ModalCreateDkimCtrl($scope, close, data, dkimService, $translate) {
    $scope.data = data;
    $scope.addingDomain = false;

    $scope.addDomain = function() {
      if ($scope.createDomainForm.$valid) {
        if (!!_.find($scope.data.domainCurrentList, function(item) { // eslint-disable-line no-extra-boolean-cast
          return item.DomainName.toLowerCase() === $scope.DomainName.toLowerCase();
        })) {
          $scope.createDomainForm.DomainName.$setValidity('duplicated', false);
        } else {
          $scope.addingDomain = true;
          dkimService.validateDuplicateOtherUser($scope.DomainName)
            .then(function(response){
              if (response.data.success && response.data.exists) {
                $scope.duplicatedOtherUser = true;
                $scope.duplicatedOtherUserMessage = $translate.instant('control_panel.dkim.add_domain.domain_duplicated_other_user', { domain: $scope.DomainName });
                $scope.addingDomain = false;
              } else {
                $scope.createDkim();
              }
            });
        }
      }
    };

    $scope.createDkim = function(){
      $scope.addingDomain = true;
      dkimService.createDkim($scope.DomainName).then(function(response) {
        if (response.success) {
          $scope.newDomain = response.row;
          $scope.addedDomainSuccess = true;
          $scope.close();
        }
        $scope.addingDomain = false;
      });
    };

    $scope.close = function(response) {
      if (response !== undefined) {
        close(response);
      } else {
        close({
          newDomain: $scope.newDomain,
          addedDomainSuccess: $scope.addedDomainSuccess
        });
      }
    };

    $scope.resetValidations = function() {
      $scope.createDomainForm.DomainName.$setValidity('duplicated', true);
    };
  }
})();
