(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('mercadoLibreService', mercadoLibreService);

  mercadoLibreService.$inject = ['$http'];

  function mercadoLibreService($http) {
    var service = {
      getIntegrationStatus: getIntegrationStatus,
      disconnect: disconnect,
    };

    return service;

    function getIntegrationStatus() {
      return $http
        .get('/Integration/Integration/GetMercadoLibreIntegrationStatus')
        .then(function (response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http
        .post('/Integration/Integration/DisconnectMercadoLibre')
        .then(function (response) {
          return response.data;
        });
    }
  }
})();
