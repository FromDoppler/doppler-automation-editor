(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('customDomainService', customDomainService);

  customDomainService.$inject = ['$http'];

  function customDomainService($http) {
    var service = {
      create: create,
      delete: remove,
      getAllVerified: getAllVerified,
      verify: verify,
    };

    return service;

    function create(domain) {
      return $http
        .post('/Lists/MasterCustomDomain/Create', { Domain: domain })
        .then(function (response) {
          return response.data;
        });
    }

    function remove(domainId) {
      return $http
        .delete('/Lists/MasterCustomDomain/Delete/' + domainId)
        .then(function (response) {
          return response.data;
        });
    }

    function getAllVerified() {
      return $http
        .get('/Lists/MasterCustomDomain/GetAllVerified')
        .then(function (response) {
          return response.data;
        });
    }

    function verify(domainId) {
      return $http
        .post('/Lists/MasterCustomDomain/Verify/' + domainId)
        .then(function (response) {
          return response.data;
        });
    }
  }
})();
