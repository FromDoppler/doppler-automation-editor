(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .service('gridDataservice', gridDataservice);

  gridDataservice.$inject = [
    '$http'
  ];

  function gridDataservice($http) {
    var service = {
      getListsItems: getListsItems,
      deleteTask: deleteTask,
      getAllUserLabels: getAllUserLabels
    };

    return service;

    function getListsItems(url, params) {
      return $http.get(url, {
        params: params
      });
    }

    function deleteTask(url, params) {
      return $http.get(url, {
        params: params
      });
    }

    function getAllUserLabels() {
      return $http.get('/Lists/Label/GetAllUserLabels');
    }
  }
})();
