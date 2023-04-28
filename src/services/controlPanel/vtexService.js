(function () {
  'use strict';

  angular.module('dopplerApp').factory('vtexService', vtexService);

  vtexService.$inject = ['$http'];

  function vtexService($http) {
    var service = {
      getIntegrationStatus: getIntegrationStatus,
      connect: connect,
      disconnect: disconnect,
      getUserLists: getUserLists,
      manualSync: manualSync,
      getChangedState: getChangedState,
      getListData: getListData,
      getVtexEntities: getVtexEntities,
      getVtexFields: getVtexFields,
      getFields: getFields,
      associateVtexFieldMapping: associateVtexFieldMapping,
      integrateVtexList: integrateVtexList,
      synchVtexLists: synchVtexLists,
      deleteList: deleteList,
      getAssociatedFieldMapping: getAssociatedFieldMapping,
      updateRfmSettings: updateRfmSettings,
      getFieldTypes: getFieldTypes,
      createField: createField,
    };

    return service;

    function getIntegrationStatus() {
      return $http
        .get('/Integration/Integration/GetVtexIntegrationStatus')
        .then(function (response) {
          return response.data;
        });
    }

    function connect(userData) {
      return $http
        .post('/Integration/Integration/ConnectVtex', userData)
        .then(function (response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http
        .post('/Integration/Integration/DisconnectVtex')
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

    function getVtexEntities() {
      return $http
        .get('/Integration/Integration/GetVtexEntities')
        .then(function (response) {
          return response.data;
        });
    }

    function getVtexFields(storeName, acronym) {
      return $http
        .get('/Integration/Integration/GetVtexFields', {
          params: {
            storeName: storeName,
            acronym: acronym,
          },
        })
        .then(function (response) {
          return response.data;
        });
    }

    function manualSync() {
      return $http
        .get('/Integration/Integration/SynchAllVtexLists')
        .then(function (response) {
          return response.data;
        });
    }

    function synchVtexLists(idList) {
      return $http
        .post('/Integration/Integration/SynchVtexLists', {
          idSubscribersList: idList,
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

    function getFields() {
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

    function associateVtexFieldMapping(idList, vtexFields) {
      var fieldMappings = _.map(vtexFields, function (vtexField) {
        var fieldMapping = {
          ColumnName: 'Void', // eslint-disable-line // TODO: delete this when it's deleted in BE
          ThirdPartyColumnName: vtexField.Name,
          IdField: vtexField.idDopplerField,
          DateFormat: '',
        };
        return fieldMapping;
      });

      return $http
        .post('/Integration/Integration/AssociateVtexFieldMapping', {
          IdList: idList,
          FieldMappings: fieldMappings,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function integrateVtexList(list, entity) {
      return $http
        .post('/Integration/Integration/IntegrateVtexList', {
          IdList: list.IdList,
          ListName: list.ListName,
          ListType: list.ListType,
          StoreName: entity.StoreName,
          ThirdPartyListName: entity.Name,
          ThirdPartyListAcronym: entity.Acronym,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function deleteList(idList) {
      return $http
        .get('/Integration/Integration/DisconnectVtexList', {
          params: { idSubscriberList: idList },
        })
        .then(function (response) {
          return response.data;
        });
    }

    function getAssociatedFieldMapping(idList) {
      return $http
        .post('/Integration/Integration/GetVtexAssociatedFieldMapping', {
          idList: idList,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function updateRfmSettings(idThirdPartyApp, rfm) {
      return $http
        .post('/Integration/Integration/UpdateRfmSettings', {
          idThirdPartyApp: idThirdPartyApp,
          rfm: rfm,
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
