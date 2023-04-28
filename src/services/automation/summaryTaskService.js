(function () {
  'use strict';

  angular
    .module('dopplerApp.automation')
    .factory('summaryTaskService', summaryTaskService);

  summaryTaskService.$inject = ['$http'];

  function summaryTaskService($http) {
    var service = {
      getSummaryTask: getSummaryTask,
      getContactInformation: getContactInformation,
      getStatesByCountry: getStatesByCountry,
      saveContactInfo: saveContactInfo,
    };

    return service;

    function getSummaryTask(id) {
      return $http.get('/Automation/SummaryTask/GetSummaryTask', {
        params: { idTask: id },
      });
    }

    function getContactInformation() {
      return $http.get('/CompleteContactInformation/GetContactInfo', {});
    }

    function getStatesByCountry(idCountry) {
      return $http.get('/ControlPanel/AccountPreferences/GetStatesByCountry', {
        params: { idCountry: idCountry },
      });
    }

    function saveContactInfo(model) {
      return $http.post('/CompleteContactInformation/SaveContactInfo', {
        model: model,
      });
    }
  }
})();
