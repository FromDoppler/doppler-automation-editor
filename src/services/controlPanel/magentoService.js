(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('magentoService', magentoService);

  magentoService.$inject = [
    '$http'
  ];

  function magentoService($http) {

    var service = {
      getIntegrationStatus: getIntegrationStatus,
      connect: connect,
      disconnect: disconnect,
      getUserLists: getUserLists,
      manualSync: manualSync,
      getChangedState: getChangedState,
      getListData: getListData,
      getMagentoEntities: getMagentoEntities,
      getMagentoFields: getMagentoFields,
      getFields: getFields,
      associateMagentoFieldMapping: associateMagentoFieldMapping,
      integrateMagentoList: integrateMagentoList,
      synchMagentoLists: synchMagentoLists,
      deleteList: deleteList,
      getAssociatedFieldMapping: getAssociatedFieldMapping,
      updateRfmSettings: updateRfmSettings
    };

    return service;

    function getIntegrationStatus() {
      return $http.get('/Integration/Integration/GetMagentoIntegrationStatus')
        .then(function(response) {
          return response.data;
        });
    }

    function connect(userData) {
      return $http.post('/Integration/Integration/ConnectMagento', userData)
        .then(function(response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http.post('/Integration/Integration/DisconnectMagento')
        .then(function(response) {
          return response.data;
        });
    }

    function getUserLists() {
      return $http.get('/Integration/Integration/GetMagentoUserLists')
        .then(function(response) {
          return response.data;
        });
    }

    function getMagentoEntities() {
      return $http.get('/Integration/Integration/GetMagentoEntities')
        .then(function(response) {
          return response.data;
        });
    }

    function getMagentoFields(entity) {
      return $http.get('/Integration/Integration/GetMagentoFields',
        {
          params: {
            entity: entity
          }
        })
        .then(function(response) {
          return response.data;
        });
    }

    function manualSync(){
      return $http.get('/Integration/Integration/SynchAllMagentoLists')
        .then(function(response) {
          return response.data;
        });
    }

    function synchMagentoLists(idList){
      return $http.post('/Integration/Integration/SynchMagentoLists',
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

    function associateMagentoFieldMapping(idList, magentoFields){
      var fieldMappings = _.map(magentoFields, function(magentoFields){
        var fieldMapping = {
          ColumnName: 'Void', // eslint-disable-line // TODO: delete this when it's deleted in BE
          ThirdPartyColumnName: magentoFields.Name,
          IdField: magentoFields.idDopplerField,
          DateFormat: ''
        };
        return fieldMapping;
      });

      return $http.post('/Integration/Integration/AssociateMagentoFieldMapping',
        {
          IdList: idList,
          FieldMappings: fieldMappings
        })
        .then(function(response){
          return response.data;
        });
    }

    function integrateMagentoList(list, entity){
      return $http.post('/Integration/Integration/integrateMagentoList',
        {
          IdList: list.IdList,
          ListName: list.ListName,
          ListType: list.ListType,
          ThirdPartyListName: entity.DisplayName,
          ThirdPartyListAcronym: entity.Name
        })
        .then(function(response){
          return response.data;
        });
    }

    function deleteList(idList) {
      return $http.get('/Integration/Integration/DisconnectMagentoList', {
        params: { idSubscriberList: idList }})
        .then(function(response) {
          return response.data;
        });
    }

    function getAssociatedFieldMapping(idList){
      return $http.post('/Integration/Integration/GetMagentoAssociatedFieldMapping',
        {
          idList: idList
        })
        .then(function(response) {
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
