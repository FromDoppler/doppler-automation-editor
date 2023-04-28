(function () {
  'use strict';

  angular.module('dopplerApp').factory('listService', listService);

  listService.$inject = ['$http'];

  function listService($http) {
    var service = {
      validateListName: validateListName,
      autocompleteUser: autocompleteUser,
      createList: createList,
    };

    return service;

    function validateListName(listName) {
      return $http
        .get(
          '/Campaigns/Summary/ValidateTestNowCreateListName?listName=' +
            listName
        )
        .then(function (response) {
          return response.data;
        });
    }

    function autocompleteUser(email) {
      return $http
        .get('/Automation/Automation/AutoCompleteUser?userEmail=' + email)
        .then(function (response) {
          return response.data;
        });
    }

    function createList(list) {
      return $http
        .post('/Campaigns/Summary/CreateList', list)
        .then(function (response) {
          return response.data;
        });
    }
  }
})();
