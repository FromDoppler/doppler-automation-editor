(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('subscribersScoringService', subscribersScoringService);

  subscribersScoringService.$inject = [
    '$http'
  ];

  function subscribersScoringService($http) {

    var service = {
      saveScoringPreferences: saveScoringPreferences,
      getScoringPreferences: getScoringPreferences
    };

    return service;

    function saveScoringPreferences(scoringInformation) {
      return $http.post('/ControlPanel/CampaignsPreferences/SaveScoringPreferences', scoringInformation).then(function(response) {
        return response.data;
      });
    }

    function getScoringPreferences() {
      return $http.get('/ControlPanel/CampaignsPreferences/GetScoringPreferences').then(function(response) {
        return response.data;
      });
    }
  }
})();
