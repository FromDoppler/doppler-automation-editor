(function () {
  'use strict';

  angular.module('dopplerApp').service('importService', importService);

  importService.$inject = ['$http'];

  function importService($http) {
    var service = {
      removeImportedSubscribers: removeImportedSubscribers,
    };

    return service;

    // get all header data
    function removeImportedSubscribers(ImportRequestId) {
      return $http
        .post('/MasterSubscriber/Import', { ImportRequestId: ImportRequestId })
        .then(function (response) {
          return response.data.data;
        });
    }
  }
})();
