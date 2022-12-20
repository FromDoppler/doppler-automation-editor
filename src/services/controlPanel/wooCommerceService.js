(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('wooCommerceService', wooCommerceService);

  wooCommerceService.$inject = [
    '$http'
  ];

  function wooCommerceService($http) {

    var service = {
      getIntegrationStatus: getIntegrationStatus,
      disconnect: disconnect
    };

    return service;

    function getIntegrationStatus() {
      return $http.get('/Integration/Integration/GetWooCommerceIntegrationStatus')
        .then(function(response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http.post('/Integration/Integration/DisconnectWooCommerce')
        .then(function(response) {
          return response.data;
        });
    }
  }
})();
