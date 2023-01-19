(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('tiendanubeService', tiendanubeService);

  tiendanubeService.$inject = [
    '$http'
  ];

  function tiendanubeService($http) {

    var service = {
      getIntegrationStatus: getIntegrationStatus,
      connect: connect,
      disconnect: disconnect,
      getUserLists: getUserLists,
      manualSync: manualSync,
      getChangedState: getChangedState,
      getListData: getListData,
      getTiendanubeEntities: getTiendanubeEntities,
      getTiendanubeFields: getTiendanubeFields,
      getFields: getFields,
      associateTiendanubeFieldMapping: associateTiendanubeFieldMapping,
      integrateTiendanubeList: integrateTiendanubeList,
      synchTiendanubeLists: synchTiendanubeLists,
      deleteList: deleteList,
      getAssociatedFieldMapping: getAssociatedFieldMapping,
      getFieldTypes: getFieldTypes,
      createField: createField,
      updateRfmSettings: updateRfmSettings
    };

    return service;

    function getIntegrationStatus() {
      return $http.get('/Integration/Integration/GetTiendanubeIntegrationStatus')
        .then(function(response) {
          return response.data;
        });
    }

    function connect(userData) {
      return $http.post('/Integration/Integration/ConnectTiendanube', userData)
        .then(function(response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http.post('/Integration/Integration/TiendanubeDisconnect')
        .then(function(response) {
          return response.data;
        });
    }

    function getUserLists() {
      return $http.get('/Integration/Integration/GetTiendanubeUserLists')
        .then(function(response) {
          return response.data;
        });
    }

    function getTiendanubeEntities() {
      return $http.get('/Integration/Integration/GetTiendanubeModules')
        .then(function(response) {
          return response.data;
        });
    }

    function getTiendanubeFields(module) {
      return $http.get('/Integration/Integration/GetTiendanubeFields',
        {
          params: {
            module: module
          }
        })
        .then(function(response) {
          return response.data;
        });
    }

    function manualSync(){
      return $http.get('/Integration/Integration/SynchAlltiendanubeLists')
        .then(function(response) {
          return response.data;
        });
    }

    function synchTiendanubeLists(idList){
      return $http.post('/Integration/Integration/SynchTiendanubeLists',
        {
          idSubscribersList: idList
        })
        .then(function(response) {
          return response.data;
        });
    }

    function getChangedState(stateArray, idThirdPartyApp ){
      return $http.post('/Integration/Integration/GetChangedStates',
        {
          statusLists: stateArray,
          idThirdPartyApp: idThirdPartyApp
        })
        .then(function(response) {
          return response.data;
        });
    }

    function getListData(idList){
      return $http.post('/Integration/Integration/GetSubscribersListInfo',
        {
          idList: idList
        })
        .then(function(response) {
          return response.data;
        });
    }

    function getFields(){
      return $http.get('/Automation/Automation/GetUserFields')
        .then(function(response){
          var allFields = [];
          if (response.data && response.data.basicFields && response.data.basicFields.length){
            allFields = _.union(response.data.basicFields, response.data.customFields);
          }
          return allFields;
        });
    }

    function associateTiendanubeFieldMapping(idList, tiendanubeFields){
      var fieldMappings = _.map(tiendanubeFields, function(tiendanubeField) {
        var fieldMapping = {
          ColumnName: 'Void', // eslint-disable-line // TODO: delete this when it's deleted in BE
          ThirdPartyColumnName: tiendanubeField.ApiName,
          IdField: tiendanubeField.idDopplerField,
          DateFormat: ''
        };
        return fieldMapping;
      });

      return $http.post('/Integration/Integration/AssociateTiendanubeFieldMapping',
        {
          IdList: idList,
          FieldMappings: fieldMappings
        })
        .then(function(response){
          return response.data;
        });
    }

    function integrateTiendanubeList(list, entity){
      return $http.post('/Integration/Integration/IntegrateTiendanubeList',
        {
          IdList: list.IdList,
          ListName: list.ListName,
          ListType: list.ListType,
          StoreName: entity.StoreName,
          ThirdPartyListName: entity.ModuleName,
          ThirdPartyListAcronym: entity.ApiName
        })
        .then(function(response){
          return response.data;
        });
    }

    function deleteList(idList) {
      return $http.get('/Integration/Integration/DisconnectTiendanubeList', {
        params: { idSubscriberList: idList }})
        .then(function(response) {
          return response.data;
        });
    }

    function getAssociatedFieldMapping(idList){
      return $http.post('/Integration/Integration/GetTiendanubeAssociatedFieldMapping',
        {
          idList: idList
        })
        .then(function(response) {
          return response.data;
        });
    }

    function getFieldTypes() {
      return $http.get('/Integration/Integration/GetFieldTypes')
        .then(function (response) {
          return response.data;
        });
    }

    function createField(name, dataType, isPrivate) {
      return $http.get('/Integration/Integration/CreateField',
        {
          params: {
            name: encodeURIComponent(name),
            dataType: dataType,
            isPrivate: isPrivate
          }
        })
        .then(function (response) {
          return response.data;
        });
    }

    function updateRfmSettings(idThirdPartyApp, rfm) {
      return $http.post('/Integration/Integration/UpdateRfmSettings',
        {
          idThirdPartyApp: idThirdPartyApp,
          rfm: rfm,
        })
        .then(function (response) {
          return response.data;
        });
    }
  }
})();
