(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('easycommerceService', easycommerceService);

  easycommerceService.$inject = [
    '$http'
  ];

  function easycommerceService($http) {

    var service = {
      getIntegrationStatus: getIntegrationStatus,
      connect: connect,
      disconnect: disconnect,
      getUserLists: getUserLists,
      manualSync: manualSync,
      getChangedState: getChangedState,
      getListData: getListData,
      getEasycommerceEntities: getEasycommerceEntities,
      getFields: getFields,
      associateEasycommerceFieldMapping: associateEasycommerceFieldMapping,
      integrateEasycommerceList: integrateEasycommerceList,
      synchEasycommerceLists: synchEasycommerceLists,
      deleteList: deleteList,
      getAssociatedFieldMapping: getAssociatedFieldMapping
    };

    return service;

    function getIntegrationStatus() {
      return $http.get('/Integration/Integration/GetEasycommerceIntegrationStatus')
        .then(function(response) {
          return response.data;
        });
    }

    function connect(userData) {
      return $http.post('/Integration/Integration/ConnectEasycommerce', userData)
        .then(function(response) {
          return response.data;
        });
    }

    function disconnect() {
      return $http.post('/Integration/Integration/DisconnectEasycommerce')
        .then(function(response) {
          return response.data;
        });
    }

    function getUserLists() {
      return $http.get('/Integration/Integration/GetEasycommerceUserLists')
        .then(function(response) {
          return response.data;
        });
    }

    function getEasycommerceEntities() {
      return $http.get('/Integration/Integration/GetEasycommerceEntities')
        .then(function(response) {
          return response.data;
        });
    }

    function manualSync(){
      return $http.get('/Integration/Integration/SynchAllEasycommerceLists')
        .then(function(response) {
          return response.data;
        });
    }

    function synchEasycommerceLists(idList){
      return $http.post('/Integration/Integration/SynchEasycommerceLists',
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

    function associateEasycommerceFieldMapping(idList, easycommerceFields){
      var fieldMappings = _.map(easycommerceFields, function(easycommerceFields){
        var fieldMapping = {
          ColumnName: 'Void', // eslint-disable-line // TODO: delete this when it's deleted in BE
          ThirdPartyColumnName: easycommerceFields.Name,
          IdField: easycommerceFields.idDopplerField,
          DateFormat: ''
        };
        return fieldMapping;
      });

      return $http.post('/Integration/Integration/AssociateEasycommerceFieldMapping',
        {
          IdList: idList,
          FieldMappings: fieldMappings
        })
        .then(function(response){
          return response.data;
        });
    }

    function integrateEasycommerceList(list, entity){
      return $http.post('/Integration/Integration/integrateEasycommerceList',
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
      return $http.get('/Integration/Integration/DisconnectEasycommerceList', {
        params: { idSubscriberList: idList }})
        .then(function(response) {
          return response.data;
        });
    }

    function getAssociatedFieldMapping(idList){
      return $http.post('/Integration/Integration/GetEasycommerceAssociatedFieldMapping',
        {
          idList: idList
        })
        .then(function(response) {
          return response.data;
        });
    }
  }
})();
