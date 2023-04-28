(function () {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('mercadoLibreIntegrationCtrl', mercadoLibreIntegrationCtrl);

  mercadoLibreIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'mercadoLibreService',
    'INTEGRATION_CODES',
  ];

  function mercadoLibreIntegrationCtrl(
    $scope,
    $translate,
    ModalService,
    mercadoLibreService,
    INTEGRATION_CODES
  ) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.connecting = false;
    vm.disconnected = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.MERCADOLIBRE;
    vm.errorMessage = '';
    vm.countries = [];

    $translate.onReady().then(function () {
      vm.getStatus(true);
    });

    vm.getStatus = function (doPolling) {
      return mercadoLibreService.getIntegrationStatus().then(function (result) {
        if (result.success) {
          if (!!result.model) {
            // eslint-disable-line
            vm.idThirdPartyApp = result.idThirdPartyApp;
            vm.connectedAccount = result.model.AccountName;
            vm.daysToDisconnection = result.model.DaysToDisconnection;
            vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
          }
        } else {
          vm.connectionError = true;
          vm.errorMsg = $translate.instant(
            'mercado_libre_crm_integration.disconnected.connection_error'
          );
        }
        vm.countries = result.countries;
        vm.isLoading = false;
        vm.connected = !!result.model;
        vm.webAppUrl = result.webAppUrl;
      });
    };

    vm.connect = function (country) {
      var windowName = 'popUp';
      var windowSize = 'width=600,height=500,scrollbars=yes';
      var OpenWindow = window.open(
        'StartMercadoLibreAuthorization?idThirdPartyApp=' +
          vm.idThirdPartyApp +
          '&location=' +
          country,
        windowName,
        windowSize
      );
      OpenWindow.focus();
      var timer = window.setInterval(function () {
        if (OpenWindow.closed) {
          window.clearInterval(timer);
          vm.getStatus();
        }
      }, 500);
    };

    vm.disconnectWarning = function () {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'modalYesOrNoMercadoLibreCtrl',
        inputs: {
          data: {
            title: $translate.instant(
              'mercado_libre_integration.connected.disconnect_popup.title'
            ),
            description: $translate.instant(
              'mercado_libre_integration.connected.disconnect_popup.description'
            ),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('actions.disconnect'),
            buttonPrimaryClass: 'button--primary button--small',
          },
        },
      }).then(function (modal) {
        modal.close.then(function (result) {
          if (result) {
            vm.connectionError = false;
            vm.errorMessage = '';
            vm.connected = false;
            vm.disconnected = true;
          }
        });
      });
    };
  }
})();
