(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('mercadoShopsService', mercadoShopsService);

  mercadoShopsService.$inject = ['$http'];

  function mercadoShopsService($http) {
    var service = {
      getIntegrationStatus: getIntegrationStatus,
      disconnect: disconnect,
      getUserLists: getUserLists,
      getMercadoShopsFields: getMercadoShopsFields,
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

    function getIntegrationStatus() {
      return $http
        .get('/Integration/Integration/GetMercadoShopsIntegrationStatus')
        .then(function (response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http
        .post('/Integration/Integration/DisconnectMercadoShops')
        .then(function (response) {
          return response.data;
        });
    }

    function getUserLists() {
      return $http
        .get('/Integration/Integration/GetMercadoShopsUserLists')
        .then(function (response) {
          return response.data;
        });
    }

    function getMercadoShopsFields() {
      return $http
        .get('/Integration/Integration/GetMercadoShopsFields')
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
        .post('/Integration/Integration/AssociateMercadoShopsFieldMapping', {
          IdList: idList,
          FieldMappings: fieldMappings,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function synchLists(idList) {
      return $http
        .post('/Integration/Integration/SynchMercadoShopsLists', {
          idSubscribersList: idList,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function integrateList(list, entity) {
      return $http
        .post('/Integration/Integration/IntegrateMercadoShopsList', {
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
        .get('/Integration/Integration/DisconnectMercadoShopsList', {
          params: { idSubscriberList: idList },
        })
        .then(function (response) {
          return response.data;
        });
    }

    function getAssociatedFieldMapping(idList) {
      return $http
        .post(
          '/Integration/Integration/GetMercadoShopsAssociatedFieldMapping',
          {
            idList: idList,
          }
        )
        .then(function (response) {
          return response.data;
        });
    }

    function manualSync() {
      return $http
        .get('/Integration/Integration/SynchAllMercadoShopsLists')
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
