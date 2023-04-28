(function () {
  'use strict';

  angular.module('dopplerApp').factory('bmwCrmService', bmwCrmService);

  bmwCrmService.$inject = ['$http'];

  function bmwCrmService($http) {
    var service = {
      getIntegrationStatus: getIntegrationStatus,
      connect: connect,
      disconnect: disconnect,
      getEntities: getEntities,
      getUserLists: getUserLists,
      getUserFields: getUserFields,
      integrateList: integrateList,
      associateFieldMapping: associateFieldMapping,
      deleteList: deleteList,
      synchLists: synchLists,
      manualSync: manualSync,
      getChangedState: getChangedState,
      getListData: getListData,
      getAssociatedFieldMapping: getAssociatedFieldMapping,
      campaignsSync: campaignsSync,
      getFieldTypes: getFieldTypes,
      createField: createField,
    };

    return service;

    function getIntegrationStatus() {
      return $http
        .get('/Integration/Integration/GetBmwCrmIntegrationStatus')
        .then(function (response) {
          return response.data;
        });
    }

    function connect(userData) {
      return $http
        .post('/Integration/Integration/ConnectBmwCrm', userData)
        .then(function (response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http
        .post('/Integration/Integration/DisconnectBmwCrm')
        .then(function (response) {
          return response.data;
        });
    }

    function getEntities() {
      return $http
        .get('/Integration/Integration/GetBmwCrmEntities')
        .then(function (response) {
          return response.data;
        });
    }

    function getUserLists() {
      return $http
        .get('/Integration/Integration/GetBmwCrmUserLists')
        .then(function (response) {
          return response.data;
        });
    }

    function getUserFields() {
      return $http
        .get('/Automation/Automation/GetUserFields', {
          params: { getReadOnlyFields: false },
        })
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

    function integrateList(list, entity) {
      return $http
        .post('/Integration/Integration/IntegrateBmwCrmList', {
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
        .post('/Integration/Integration/AssociateBmwCrmFieldMapping', {
          IdList: idList,
          FieldMappings: fieldMappings,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function deleteList(idList) {
      return $http
        .get('/Integration/Integration/DisconnectBmwCrmList', {
          params: { idSubscriberList: idList },
        })
        .then(function (response) {
          return response.data;
        });
    }

    function synchLists(idList) {
      return $http
        .post('/Integration/Integration/SynchBmwCrmLists', {
          idSubscribersList: idList,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function manualSync() {
      return $http
        .get('/Integration/Integration/SynchAllBmwCrmLists')
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

    function getAssociatedFieldMapping(idList) {
      return $http
        .post('/Integration/Integration/GetBmwCrmAssociatedFieldMapping', {
          idList: idList,
        })
        .then(function (response) {
          return response.data;
        });
    }

    function campaignsSync() {
      return $http
        .get('/Integration/Integration/SynchBmwCrmCampaigns')
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
