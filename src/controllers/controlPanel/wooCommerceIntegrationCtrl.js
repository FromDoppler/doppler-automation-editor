(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('wooCommerceIntegrationCtrl', wooCommerceIntegrationCtrl);

  wooCommerceIntegrationCtrl.$inject = [
    '$translate',
    'ModalService',
    'wooCommerceService',
    'INTEGRATION_CODES',
    'INTEGRATION_SOURCE_TYPE'
  ];

  function wooCommerceIntegrationCtrl($translate, ModalService,
    wooCommerceService, INTEGRATION_CODES, INTEGRATION_SOURCE_TYPE) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.WOOCOMMERCE;
    vm.errorMessage = '';
    vm.sourceType = INTEGRATION_SOURCE_TYPE.MVC;
    vm.mvcSourceType = INTEGRATION_SOURCE_TYPE.MVC;

    $translate.onReady().then(function() {
      vm.getStatus(true);
    });

    vm.getStatus = function(){
      return wooCommerceService.getIntegrationStatus()
        .then(function(result){
          if (result.success) {
            if (!!result.model) { // eslint-disable-line
              vm.sourceType = result.model.SourceType;
              vm.lastSynchDate = result.model.LastSynchDate;
              vm.daysToDisconnection = result.model.DaysToDisconnection;
              vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
            }
          }
          vm.isLoading = false;
          vm.connected = !!result.model;
        });
    };

    vm.disconnectWarning = function() {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'modalYesOrNoWooCommerceCtrl',
        inputs: {
          data:
          {
            title: $translate.instant('wooCommerce_integration.connected.disconnect_popup.title'),
            description: $translate.instant('wooCommerce_integration.connected.disconnect_popup.description'),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('actions.disconnect'),
            buttonPrimaryClass: 'button--primary button--small'
          }
        }
      }).then(function(modal) {
        modal.close.then(function(result) {
          if (result) {
            vm.connectionError = false;
            vm.connected = false;
            vm.sourceType = INTEGRATION_SOURCE_TYPE.MVC;
          }
        });
      });
    };
  }
})();

