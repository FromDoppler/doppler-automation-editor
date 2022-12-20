(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('settingsService', settingsService);

  settingsService.$inject = [
    '$q',
    'automationDataservice',
    'userFieldsDataservice'
  ];

  function settingsService($q, automationDataservice, userFieldsDataservice) {
    //Global promise to be returned when the service gets called twice before it gets resolved
    var promise;
    var editorSettings = {};
    var service = {
      getSettings: getSettings,
      getLoadedData: getLoadedData
    };

    return service;

    function getSettings() {
      var defer = $q.defer();

      if (_.isEmpty(editorSettings) && !promise) {
        automationDataservice.getSettings().then(function(response) {
          editorSettings = response.data;
          userFieldsDataservice.load(editorSettings.customFields);
          defer.resolve(response.data);
        });
        promise = defer.promise;
      }

      return promise;
    }

    function getLoadedData() {
      return editorSettings;
    }
  }
})();
