(function () {
  'use strict';

  angular.module('dopplerApp').factory('zohoCrmService', zohoCrmService);

  zohoCrmService.$inject = ['$http'];

  function zohoCrmService($http) {
    var service = {
      getIntegrationStatus: getIntegrationStatus,
      connect: connect,
      disconnect: disconnect,
      getUserLists: getUserLists,
      manualSync: manualSync,
      getChangedState: getChangedState,
      getListData: getListData,
      getZohoCrmEntities: getZohoCrmEntities,
      getZohoCrmFields: getZohoCrmFields,
      getFields: getFields,
      associateZohoCrmFieldMapping: associateZohoCrmFieldMapping,
      integrateZohoCrmList: integrateZohoCrmList,
      synchZohoCrmLists: synchZohoCrmLists,
      deleteList: deleteList,
      getAssociatedFieldMapping: getAssociatedFieldMapping,
      getFieldTypes: getFieldTypes,
      createField: createField,
    };

    return service;

    function getIntegrationStatus() {
      return $http
        .get('/Integration/Integration/GetZohoIntegrationStatus')
        .then(function (response) {
          return response.data;
        });
    }

    function connect(userData) {
      return $http
        .post('/Integration/Integration/ConnectZoho', userData)
        .then(function (response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http
        .post('/Integration/Integration/DisconnectZoho')
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

    function getZohoCrmEntities() {
      return $http
        .get('/Integration/Integration/GetZohoModules')
        .then(function (response) {
          return response.data;
        });
    }

    function getZohoCrmFields(module) {
      return $http
        .get('/Integration/Integration/GetZohoFields', {
          params: {
            module: module,
          },
        })
        .then(function (response) {
          return response.data;
        });
    }

    function manualSync() {
      return $http
        .get('/Integration/Integration/SynchAllZohoLists')
        .then(function (response) {
          return response.data;
        });
    }

    function synchZohoCrmLists(idList) {
      return $http
        .post('/Integration/Integration/SynchZohoLists', {
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

    function associateZohoCrmFieldMapping(idList, zohoCrmFields) {
      var fieldMappings = _.map(zohoCrmFields, function (zohoCrmField) {
        var fieldMapping = {
          ColumnName: 'Void', // eslint-disable-line // TODO: delete this when it's deleted in BE
          ThirdPartyColumnName: zohoCrmField.ApiName,
          IdField: zohoCrmField.idDopplerField,
          DateFormat: '',
        };
        return fieldMapping;
      });

      return $http
        .post('/Integration/Integration/AssociateZohoFieldMapping', {
          IdList: idList,
          FieldMappings: fieldMappings,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function integrateZohoCrmList(list, entity) {
      return $http
        .post('/Integration/Integration/IntegrateZohoList', {
          IdList: list.IdList,
          ListName: list.ListName,
          ListType: list.ListType,
          StoreName: entity.StoreName,
          ThirdPartyListName: entity.ModuleName,
          ThirdPartyListAcronym: entity.ApiName,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function deleteList(idList) {
      return $http
        .get('/Integration/Integration/DisconnectZohoList', {
          params: { idSubscriberList: idList },
        })
        .then(function (response) {
          return response.data;
        });
    }

    function getAssociatedFieldMapping(idList) {
      return $http
        .post('/Integration/Integration/GetZohoAssociatedFieldMapping', {
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
