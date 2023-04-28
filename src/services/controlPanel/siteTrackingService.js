(function () {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .factory('siteTrackingService', siteTrackingService);

  siteTrackingService.$inject = ['$http'];

  function siteTrackingService($http) {
    var service = {
      addOrEditDomain: addOrEditDomain,
      canAddDomain: canAddDomain,
      deleteDomain: deleteDomain,
      getSiteTrackingPreferences: getSiteTrackingPreferences,
      saveEnableDisableSiteTracking: saveEnableDisableSiteTracking,
      verifyDomain: verifyDomain,
      VerifyPushConfiguration: VerifyPushConfiguration,
    };

    return service;

    function saveEnableDisableSiteTracking(isEnabled) {
      return $http
        .post(
          '/ControlPanel/CampaignsPreferences/SaveEnableDisableSiteTracking',
          {
            enable: isEnabled,
          }
        )
        .then(function (response) {
          return response.data.success;
        });
    }

    function getSiteTrackingPreferences() {
      return $http
        .get('/ControlPanel/CampaignsPreferences/GetSiteTrackingPreferences')
        .then(function (response) {
          return response.data;
        });
    }

    function addOrEditDomain(domainName, domainId) {
      return $http
        .post('/ControlPanel/CampaignsPreferences/SaveSiteTrackingDomain', {
          emailParameterDomain: domainName,
          idDomain: domainId,
        })
        .then(function (response) {
          return response.data.success ? response.data.data : response.data;
        });
    }

    function verifyDomain(domainId) {
      return $http
        .post('/ControlPanel/CampaignsPreferences/VerifyDomain', {
          IdDomain: domainId,
        })
        .then(function (response) {
          return response.data.success && response.data;
        });
    }

    function VerifyPushConfiguration(domainId) {
      return $http
        .post('/ControlPanel/CampaignsPreferences/VerifyPushConfiguration', {
          IdDomain: domainId,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function canAddDomain(url) {
      return $http
        .post('/ControlPanel/CampaignsPreferences/CanBeRegisteredDomain', {
          emailParameterDomain: url,
        })
        .then(function (response) {
          return response.data.success;
        });
    }

    function deleteDomain(domainId) {
      return $http
        .post('/ControlPanel/CampaignsPreferences/DeleteDomain', {
          IdDomain: domainId,
        })
        .then(function (response) {
          return response.data.success && response.data.domains;
        });
    }
  }
})();
