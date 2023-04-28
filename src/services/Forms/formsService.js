(function () {
  'use strict';

  angular.module('dopplerApp.forms').factory('formsService', formsService);

  formsService.$inject = ['$http'];

  function formsService($http) {
    var integrationData = {};

    var service = {
      getFormConfig: getFormConfig,
      getIntegrations: getIntegrations,
      getIntegrationData: getIntegrationData,
      saveFormLandingDistributionSettings: saveFormLandingDistributionSettings,
      setIntegrationData: setIntegrationData,
      updateIntegrationData: updateIntegrationData,
    };

    return service;

    function getFormConfig() {
      return $http
        .get('/Lists/Form/GetUserFormConfig')
        .then(function (response) {
          return response.data.config;
        });
    }

    function getIntegrations(idForm) {
      return $http
        .get('/Lists/Form/GetIntegrations', {
          params: {
            idForm: idForm,
          },
        })
        .then(function (response) {
          return response.data;
        });
    }

    function getIntegrationData() {
      return integrationData;
    }

    function saveFormLandingDistributionSettings(settings) {
      return $http
        .post('/Lists/Form/SaveFormLandingDistributionSettings', settings)
        .then(function (response) {
          return response.data;
        });
    }

    function setIntegrationData(data) {
      integrationData = data;
    }

    function updateIntegrationData(property, value) {
      integrationData[property] = value;
    }
  }
})();
