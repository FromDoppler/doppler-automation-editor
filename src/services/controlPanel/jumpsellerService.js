(function () {
  'use strict';

  angular.module('dopplerApp').factory('jumpsellerService', jumpsellerService);

  jumpsellerService.$inject = ['$http'];

  function jumpsellerService($http) {
    var service = {
      getIntegrationStatus: getIntegrationStatus,
      connect: connect,
      disconnect: disconnect,
      getUserLists: getUserLists,
      getJumpsellerFields: getJumpsellerFields,
      getUserFields: getUserFields,
      associateFieldMapping: associateFieldMapping,
      synchLists: synchLists,
      integrateList: integrateList,
      deleteList: deleteList,
      getAssociatedFieldMapping: getAssociatedFieldMapping,
      manualSync: manualSync,
      getChangedState: getChangedState,
      getListData: getListData,
      getFieldTypes: getFieldTypes,
      createField: createField,
    };

    return service;

    function connect(userData) {
      return $http
        .post('/Integration/Integration/ConnectJumpseller', userData)
        .then(function (response) {
          return response.data;
        });
    }

    function getIntegrationStatus() {
      return $http
        .get('/Integration/Integration/GetJumpsellerIntegrationStatus')
        .then(function (response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http
        .post('/Integration/Integration/DisconnectJumpseller')
        .then(function (response) {
          return response.data;
        });
    }

    function getUserLists() {
      return $http
        .get('/Integration/Integration/GetJumpsellerUserLists')
        .then(function (response) {
          return response.data;
        });
    }

    function getJumpsellerFields() {
      return $http
        .get('/Integration/Integration/GetJumpsellerFields')
        .then(function (response) {
          return response.data;
        });
    }

    function getUserFields() {
      return $http
        .get('/Automation/Automation/GetUserFields')
        .then(function (response) {
          var allFields = [];
          if (
            response.data &&
            response.data.basicFields &&
            response.data.basicFields.length
          ) {
            allFields = _.union(
              response.data.basicFields,
              response.data.customFields
            );
          }
          return allFields;
        });
    }

    function associateFieldMapping(idList, fields) {
      var fieldMappings = _.map(fields, function (field) {
        var fieldMapping = {
          ColumnName: 'Void', // eslint-disable-line // TODO: delete this when it's deleted in BE
          ThirdPartyColumnName: field.Name,
          IdField: field.idDopplerField,
          DateFormat: '',
        };
        return fieldMapping;
      });

      return $http
        .post('/Integration/Integration/AssociateJumpsellerFieldMapping', {
          IdList: idList,
          FieldMappings: fieldMappings,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function synchLists(idList) {
      return $http
        .post('/Integration/Integration/SynchJumpsellerLists', {
          idSubscribersList: idList,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function integrateList(list, entity) {
      return $http
        .post('/Integration/Integration/IntegrateJumpsellerList', {
          IdList: list.IdList,
          ListName: list.ListName,
          ListType: list.ListType,
          ThirdPartyListName: entity.DisplayName,
          ThirdPartyListAcronym: entity.Name,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function deleteList(idList) {
      return $http
        .get('/Integration/Integration/DisconnectJumpsellerList', {
          params: { idSubscriberList: idList },
        })
        .then(function (response) {
          return response.data;
        });
    }

    function getAssociatedFieldMapping(idList) {
      return $http
        .post('/Integration/Integration/GetJumpsellerAssociatedFieldMapping', {
          idList: idList,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function manualSync() {
      return $http
        .get('/Integration/Integration/SynchAllJumpsellerLists')
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

    function getFieldTypes() {
      return $http
        .get('/Integration/Integration/GetFieldTypes')
        .then(function (response) {
          return response.data;
        });
    }

    function createField(name, dataType, isPrivate) {
      return $http
        .get('/Integration/Integration/CreateField', {
          params: {
            name: encodeURIComponent(name),
            dataType: dataType,
            isPrivate: isPrivate,
          },
        })
        .then(function (response) {
          return response.data;
        });
    }
  }
})();
