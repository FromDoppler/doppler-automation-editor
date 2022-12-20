(function() {
  'use strict';

  angular
    .module('dopplerApp.forms')
    .controller('FormIntegrateLandingCtrl', FormIntegrateLandingCtrl);

  FormIntegrateLandingCtrl.$inject = [
    '$interpolate',
    '$location',
    '$translate',
    'customDomainService',
    'formsService'
  ];

  function FormIntegrateLandingCtrl($interpolate, $location, $translate, customDomainService, formsService) {
    var vm = this;
    vm.REGEX_PAGENAME = '^[a-zA-Z0-9\-]+$'; // eslint-disable-line no-useless-escape

    vm.$onInit = function() {
      var urlParams = $location.search();
      var integrationData = formsService.getIntegrationData();

      vm.customDomainsUrl = '/ControlPanel/AdvancedPreferences/CustomDomains';
      vm.buyNowPlanUrl = '/ControlPanel/AccountPreferences/UpgradeAccount';

      vm.idForm = urlParams.idForm ? urlParams.idForm : 0;
      vm.username = integrationData.UserIdentifier;
      vm.baseDopplerUrl = integrationData.FormBaseUrl + vm.username;
      vm.focusedPageNameInput = false;

      vm.pageName = integrationData.FormNickName;
      vm.pageNameDoppler = integrationData.FormNickName;
      vm.pageNameCustom = integrationData.FormNickName;

      vm.avoidPreselectionLogic = integrationData.DomainOverwrittenByUser;
      vm.currentCustomDomain = integrationData.CustomDomain;
      vm.selectedDomainType = vm.currentCustomDomain ? 'custom' : 'doppler';

      vm.customDomains = [];
      loadCustomDomains();
    };

    function loadCustomDomains() {
      customDomainService.getAllVerified()
        .then(function(verifiedDomains) {
          if (verifiedDomains && verifiedDomains.length) {
            vm.customDomains = verifiedDomains;
            if (!vm.currentCustomDomain && !vm.avoidPreselectionLogic) {
              vm.onDomainTypeSelected('custom');
            }
          }
        });
    }

    vm.onDomainTypeSelected = function(domainType) {
      if (vm.selectedDomainType === domainType) {
        return;
      }
      vm.selectedDomainType = domainType;
      vm.focusedPageNameInput = false;

      updateFormUrl();
    };

    function updateFormUrl() {
      if (vm.selectedDomainType === 'doppler') {
        vm.pageNameCustom = vm.pageName;
        vm.landingForm.pageNameCustom.$setValidity('duplicate', true);
        vm.confirmUsingDopplerDomain();
      } else if (vm.selectedDomainType === 'custom') {
        vm.pageNameDoppler = vm.pageName;
        vm.landingForm.pageNameDoppler.$setValidity('duplicate', true);
        if (vm.currentCustomDomain) {
          vm.confirmUsingCustomDomain(vm.currentCustomDomain);
        }
        if (vm.customDomains.length === 1) {
          vm.confirmUsingCustomDomain(vm.customDomains[0]);
        }
      }
    }

    vm.confirmUsingDopplerDomain = function() {
      var params = {
        IdForm: vm.idForm,
        CustomDomain: null,
        DomainOverwrittenByUser: true,
        FormNickName: vm.pageNameDoppler,
        Url: vm.getUrlWithDopplerDomain()
      };
      formsService.saveFormLandingDistributionSettings(params)
        .then(function() {
          vm.focusedPageNameInput = false;
          updatePageName(vm.pageNameDoppler);
          updateIntegrationData();
          vm.landingForm.pageNameDoppler.$setValidity('duplicate', true);
        })
        .catch(function(response) {
          var errorKey = response.data.error;

          if (errorKey === 'FormNameExisting') {
            vm.landingForm.pageNameDoppler.$setValidity('duplicate', false);
          } else {
            vm.cancelPageNameEdition();
          }
        });
    };

    vm.confirmUsingCustomDomain = function(customDomain) {
      if (customDomain) {
        vm.currentCustomDomain = customDomain;
      }
      if (!vm.currentCustomDomain) {
        return;
      }
      var params = {
        IdForm: vm.idForm,
        CustomDomain: vm.currentCustomDomain.Domain,
        DomainOverwrittenByUser: true,
        FormNickName: vm.pageNameCustom,
        Url: vm.getUrlWithCustomDomain()
      };
      formsService.saveFormLandingDistributionSettings(params)
        .then(function() {
          vm.focusedPageNameInput = false;
          updatePageName(vm.pageNameCustom);
          updateIntegrationData();
          vm.landingForm.pageNameCustom.$setValidity('duplicate', true);
        })
        .catch(function(response) {
          var errorKey = response.data.error;

          if (errorKey === 'FormNameExisting') {
            vm.landingForm.pageNameCustom.$setValidity('duplicate', false);
          } else {
            vm.cancelPageNameEdition();
          }
        });
    };

    vm.clearDuplicateError = function(inputName) {
      if (vm.landingForm[inputName].$invalid && vm.landingForm[inputName].$error.duplicate) {
        vm.landingForm[inputName].$setValidity('duplicate', true);
      }
    };

    function updatePageName(newPageName) {
      vm.pageName = newPageName;
      vm.pageNameDoppler = newPageName;
      vm.pageNameCustom = newPageName;
    }

    function updateIntegrationData() {
      formsService.updateIntegrationData('FormNickName', vm.pageName);
      formsService.updateIntegrationData('CustomDomain', vm.currentCustomDomain);
    }

    vm.cancelPageNameEdition = function() {
      vm.focusedPageNameInput = false;
      if (vm.selectedDomainType === 'doppler') {
        vm.pageNameDoppler = vm.pageName;
        vm.landingForm.pageNameDoppler.$setValidity('duplicate', true);
      } else if (vm.selectedDomainType === 'custom') {
        vm.pageNameCustom = vm.pageName;
        vm.landingForm.pageNameCustom.$setValidity('duplicate', true);
      }
    };

    vm.openNewTab = function(url) {
      window.open(url, '_blank');
    };

    vm.getCustomDomainsSelectorLabel = function() {
      if (vm.currentCustomDomain) {
        return vm.currentCustomDomain.Domain;
      } else if (vm.customDomains.length === 1) {
        return vm.customDomains[0].Domain;
      }

      return $translate.instant('forms_integrate.headers.integration_landing.custom_domain.dropdown_placeholder');
    };

    vm.getUrlWithDopplerDomain = function() {
      return vm.pageNameDoppler ? vm.baseDopplerUrl + '/' + vm.pageNameDoppler : vm.baseDopplerUrl;
    };

    vm.getUrlWithCustomDomain = function() {
      if (vm.selectedDomainType !== 'custom' || !vm.currentCustomDomain) {
        return;
      }
      var data = {
        customDomain: vm.currentCustomDomain.Domain,
        pageName: vm.pageNameCustom
      };
      var customDomainUrl = $interpolate(vm.formCustomDomainUrl)(data);
      if (!data.pageName) {
        // return url without unnecessary trailing slash
        return customDomainUrl.substring(0, customDomainUrl.length - 1);
      }
      return customDomainUrl;
    };

    vm.onFocus = function() {
      vm.focusedPageNameInput = true;
    };
  }
})();
