(function () {
  'use strict';

  angular.module('dopplerApp').factory('dkimService', dkimService);

  dkimService.$inject = ['$http'];

  function dkimService($http) {
    var service = {
      setEnabledState: setEnabledState,
      setDefault: setDefault,
      createDkim: createDkim,
      deleteDkim: deleteDkim,
      getDkimKeys: getDkimKeys,
      validateDuplicateOtherUser: validateDuplicateOtherUser,
      verifyDomain: verifyDomain,
      getPublicDomainsList: getPublicDomainsList,
    };

    return service;

    function setEnabledState(row) {
      return $http
        .post('/ControlPanel/AdvancedPreferences/SetEnabledStateDkim', row)
        .then(function (response) {
          return response.data;
        });
    }

    function setDefault(row) {
      return $http
        .post('/ControlPanel/AdvancedPreferences/SetDefaultDkim', row)
        .then(function (response) {
          return response.data;
        });
    }

    function createDkim(domain) {
      return $http
        .post('/ControlPanel/AdvancedPreferences/CreateDkim', {
          Domain: domain,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function deleteDkim(row) {
      return $http
        .post('/ControlPanel/AdvancedPreferences/DeleteDkim', row)
        .then(function (response) {
          return response.data;
        });
    }

    function getDkimKeys(DomainId) {
      return $http
        .get('/ControlPanel/AdvancedPreferences/GetDkimKeys', {
          params: {
            DomainId: DomainId,
          },
        })
        .then(function (response) {
          return response;
        });
    }

    function validateDuplicateOtherUser(DomainName) {
      return $http
        .get('/ControlPanel/AdvancedPreferences/ExistsDomain', {
          params: {
            domain: DomainName,
          },
        })
        .then(function (response) {
          return response;
        });
    }

    function verifyDomain(DomainId) {
      return $http
        .get('/ControlPanel/AdvancedPreferences/VerifyDkimAndSpf', {
          params: {
            DomainId: DomainId,
          },
        })
        .then(function (response) {
          return response;
        });
    }

    function getPublicDomainsList() {
      return $http.get(
        '/ControlPanel/AdvancedPreferences/GetPublicDomainsList'
      );
    }
  }
})();
