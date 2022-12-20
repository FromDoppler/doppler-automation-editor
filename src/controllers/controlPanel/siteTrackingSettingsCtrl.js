
(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('SiteTrackingSettingsCtrl', SiteTrackingSettingsCtrl);

  SiteTrackingSettingsCtrl.$inject = [
    '$scope',
    'siteTrackingService',
    '$translate',
    'ModalService',
    'REGEX',
    'DOMAIN_STATUS',
    'PUSH_CONFIGURATION_STATUS'
  ];

  function SiteTrackingSettingsCtrl($scope, siteTrackingService, $translate, ModalService, REGEX, DOMAIN_STATUS, PUSH_CONFIGURATION_STATUS) {
    var vm = this;

    vm.isLoading = true;
    vm.isEnableSiteTracking = false;
    vm.domains = [];
    setCopyButton(); //eslint-disable-line no-undef
    activate();

    function activate() {
      siteTrackingService.getSiteTrackingPreferences()
        .then(function(data){
          var dataHub = data.dataHub;
          var dataPush = data.dataPush;
          vm.isEnableSiteTracking = dataHub.Active;
          vm.showDomains = dataHub.Active;
          vm.domains = vm.formatData(dataHub.Domains);
          vm.verifyPushConfigurationFromArray(vm.domains);
          vm.domain = dataHub.DataHubDomain;
          vm.pushSwUrl = dataPush;
          vm.isLoading = false;
        });
    }

    vm.enableDisabeSiteTracking = function() {
      siteTrackingService.saveEnableDisableSiteTracking(vm.isEnableSiteTracking)
        .then(function(success) {
          if (success) {
            vm.showDomains = vm.isEnableSiteTracking;
            if (vm.showDomains) {
              vm.isLoading = true;
              activate();
            }
          } else {
            vm.showDomains = true;
            vm.isEnableSiteTracking = true;
            vm.showDisabledSiteTrackingErrorMessage = true;
          }
        });
    };

    vm.openAddOrEditDomain = function(domain) {
      vm.newDomain = domain && domain.Domain || '';
      var domainId = domain && domain.IdDomain || 0;
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalWithInput.html',
        controller: 'ModalAddDomainCtrl',
        inputs: {
          data: {
            title: $translate.instant(domain ? 'site_tracking.edit_domain.title' : 'site_tracking.add_domain.title'),
            description: $translate.instant(domain ? 'site_tracking.edit_domain.description' : 'site_tracking.add_domain.description'),
            descriptionLi1: $translate.instant('site_tracking.add_domain.description_li_1'),
            descriptionLi2: $translate.instant('site_tracking.add_domain.description_li_2'),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('site_tracking.add_domain.add_label_button'),
            buttonPrimaryClass: 'button--primary button--small',
            fieldValue: vm.newDomain,
            required: true,
            maxlength: 50,
            regex: REGEX.DOMAIN_HTTP,
            domains: vm.domains,
            domainId: domainId,
            placeholder: $translate.instant('site_tracking.add_domain.placeholder'),
            label: $translate.instant('site_tracking.add_domain.label')
          }
        }
      })
        .then(function(modal) {
          modal.close.then(function(response) {
            if (response && response.isConfirmed) {
              vm.domains = vm.formatData(response.Domains);
              var domain = _.find(vm.domains, function(item){
                return item.Domain === response.domain.Domain;
              });
              vm.openTrackingCodeModal(domain);
            }
          });
        });
    };

    vm.formatData = function(data) {
      var items = [];
      _.each(data, function(domain){
        switch (domain.Status) {
        case DOMAIN_STATUS.PENDING: domain.Status = 'pending'; break;
        case DOMAIN_STATUS.VERIFIED: domain.Status = 'verified'; break;
        case DOMAIN_STATUS.ERROR: domain.Status = 'error'; break;
        default: domain.Status = '';
        }
        items.push(domain);
      });
      return items;
    };

    vm.openTrackingCodeModal = function(domain) {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/controlPanel/siteTrackingCodeModal.html',
        controller: 'ModalYesOrNoCtrl',
        inputs: {
          data: {
            domain: domain.Domain,
            domainCode: vm.domain,
            pushSwUrl: vm.pushSwUrl
          }
        }
      })
        .then(function(modal){
          modal.close.then(function(verify){
            if (verify) {
              vm.verifyDomain(domain);
            }
          });
        });
    };

    vm.verifyDomain = function(domain) {
      domain.isPendingVerify = true;
      siteTrackingService.verifyDomain(domain.IdDomain)
        .then(function(domainResponse) {
          if (!domainResponse || domainResponse.status === DOMAIN_STATUS.ERROR) {
            ModalService.showModal({
              templateUrl: 'angularjs/partials/controlPanel/siteTrackingUnverifyModal.html',
              controller: 'ModalYesOrNoCtrl',
              inputs: { data: {} }
            });
            domain.isPendingVerify = false;
          }
          if (domainResponse) {
            domain.ValidationDate = domainResponse.date;
            domain.Status = domainResponse.status === DOMAIN_STATUS.ERROR ? 'error' : 'verified';
            if (domainResponse.status !== DOMAIN_STATUS.ERROR) {
              vm.VerifyPushConfiguration(domain);
            } else {
              domain.isPendingVerify = false;
            }
          }
        });
    };

    vm.VerifyPushConfiguration = function(domain) {
      siteTrackingService.VerifyPushConfiguration(domain.IdDomain)
        .then(function(domainResponse) {
          var isPushConfigured = domainResponse.PushConfigurationStatus === PUSH_CONFIGURATION_STATUS.CONFIGURED;
          domain.statusPush = (!isPushConfigured) ? 'error' : 'verified';
          domain.errorStatePush = (!isPushConfigured) ? 'error_message_' + domainResponse.PushConfigurationStatus : undefined;
          domain.isPendingVerify = false;
        });
    };

    vm.verifyPushConfigurationFromArray = function(domains) {
      var verifiedDomains = domains.filter( function(item) { 
        return item.Status === 'verified';
      });
      verifiedDomains.forEach(function(item) {
        vm.VerifyPushConfiguration(item);
      });
    }; 
  }
})();
