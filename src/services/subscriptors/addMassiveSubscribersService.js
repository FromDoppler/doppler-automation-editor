(function () {
  'use strict';

  angular
    .module('dopplerApp.lists')
    .factory('addMassiveSubscribersService', addMassiveSubscribersService);

  addMassiveSubscribersService.$inject = ['$http'];

  function addMassiveSubscribersService($http) {
    var service = {
      createNewList: createNewList,
    };

    return service;

    function createNewList(data) {
      return $http
        .post('/Lists/MasterSubscriber/CreateNewList', {
          listName: data.listName,
          associateFilters: {
            //TODO: Improve the BE to allow this value in null
            SearchText: data.filters.searchText || ' ',
            Status: data.filters.status,
            Origin: data.filters.origin,
            Score: data.filters.score,
            CanCreate: data.canCreate,
          },
        })
        .then(function (response) {
          return response.data;
        });
    }
  }
})();
