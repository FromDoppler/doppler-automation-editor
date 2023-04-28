(function () {
  'use strict';

  angular.module('dopplerApp').factory('prestashopService', prestashopService);

  prestashopService.$inject = ['$http'];

  function prestashopService($http) {
    var service = {
      connect: connect,
      getUserLists: getUserLists,
      getStatus: getStatus,
      disconnect: disconnect,
      manualSync: manualSync,
      getChangedState: getChangedState,
      getListData: getListData,
    };

    return service;

    function connect(apikey, shopUrl, listId) {
      var connectModel = {
        appKey: apikey,
        apiUrl: shopUrl,
        listId: listId,
      };
      return $http
        .get('/Integration/Integration/ConnectPrestashop', {
          params: connectModel,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function getUserLists() {
      return $http
        .get('/Integration/Integration/GetUserLists')
        .then(function (response) {
          return response.data;
        });
    }

    function getStatus() {
      return $http
        .get('/Integration/Integration/GetPrestashopIntegrationStatus')
        .then(function (response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http
        .post('/Integration/Integration/DisconnectPrestashop')
        .then(function (response) {
          return response.data;
        });
    }

    function manualSync(idSubscribersList) {
      return $http
        .get('/Integration/Integration/SynchPrestashopLists', {
          params: { idSubscribersList: idSubscribersList },
        })
        .then(function (response) {
          return response.data;
        });
    }

    function getChangedState(stateArray, idThirdPartyApp) {
      return $http
        .post('/Integration/Integration/GetChangedStates', {
          statusLists: stateArray,
          idThirdPartyApp: idThirdPartyApp,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function getListData(idList) {
      return $http
        .post('/Integration/Integration/GetSubscribersListInfo', {
          idList: idList,
        })
        .then(function (response) {
          return response.data;
        });
    }
  }
})();
