(function() {
  'use strict';

  angular
    .module('dopplerApp.forms')
    .controller('FormIntegrateCtrl', FormIntegrateCtrl);

  FormIntegrateCtrl.$inject = [
    '$location',
    '$translate',
    'formsService',
    'FORM_INTEGRATION',
    'FORM_TYPE'
  ];

  function FormIntegrateCtrl($location, $translate, formsService, FORM_INTEGRATION, FORM_TYPE) {
    var vm = this;
    var urlParams = $location.search();
    vm.idForm = urlParams.idForm ? urlParams.idForm : 0;
    vm.FORM_TYPE = FORM_TYPE;
    vm.FORM_INTEGRATION = FORM_INTEGRATION;
    vm.selectedIntegration = vm.FORM_INTEGRATION.LANDING;
    vm.integrationLink = '';
    vm.integrationEmbedScript = '';
    vm.type = 0;
    vm.dataSuccess = true;
    vm.isFirstTimePublish = true;
    vm.isLoading = true;

    $translate.onReady().then(function() {
      vm.integrations = [
        $translate.instant('forms_integrate.headers.integration_landing.description'),
        $translate.instant('forms_integrate.headers.integration_embed.description'),
        //TODO: the follow actions are not defined yet so are hidden:
        //$translate.instant('forms_integrate.headers.integration_wordpress.description'),
        $translate.instant('forms_integrate.headers.integration_facebook.description')
      ];
      loadData();
    });

    vm.showIntegration = showIntegration;
    vm.getTypeText = getTypeText;

    setCopyButton(); //eslint-disable-line no-undef

    function loadData() {
      formsService.getIntegrations(urlParams.idForm).then(function(data){
        if (data.success){
          formsService.setIntegrationData(data.formModel);
          vm.integrationLink = data.formModel.PublicLink;
          vm.integrationEmbedScript = data.formModel.EmbedCode;
          vm.type = data.formModel.Type;
          vm.isFirstTimePublish = data.formModel.IsFirstTimePublish;
          if (vm.type === vm.FORM_TYPE.INLINE) {
            vm.integrations.push($translate.instant('forms_integrate.headers.integration_iframe.description'));
            vm.iframeText = '<iframe id=\'doppler_subscription\' src=\'' + vm.integrationLink + '\' height=\'335\' width=\'375\' scrolling=\'yes\' frameborder=\'no\' style=\'overflow:scroll\'></iframe>';
          }
          if (vm.type === vm.FORM_TYPE.MODAL || vm.type === vm.FORM_TYPE.WHATSAPP) {
            vm.selectedIntegration = 'Embed';
          }
        } else {
          vm.dataSuccess = false;
        }
        vm.isLoading = false;
      });
    }

    function showIntegration(integration){
      vm.selectedIntegration = integration;
    }

    function getTypeText(type) {
      switch (type) {
      case vm.FORM_TYPE.INLINE:
        return $translate.instant('forms_grid.type.option1');
      case vm.FORM_TYPE.MODAL:
        return $translate.instant('forms_grid.type.option2');
      case vm.FORM_TYPE.WHATSAPP:
        return $translate.instant('forms_grid.type.option3');
      default:
        return $translate.instant('forms_grid.type.option1');
      }
    }
  }
})();
