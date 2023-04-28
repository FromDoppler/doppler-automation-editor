(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('pushService', pushService);

  pushService.$inject = ['$http'];

  function pushService($http) {
    var initialComponentCompleted = false;

    //Returns the completed component status
    function getInitialComponentCompleted() {
      return initialComponentCompleted;
    }

    //Set component as completed
    function setInitialComponentCompleted(value) {
      initialComponentCompleted = value;
    }

    function UploadPushImage(formData) {
      var UploadPushImage = '/Automation/Automation/UploadPushImage';
      return $http
        .post(UploadPushImage, formData, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined },
        })
        .then(function (response) {
          return response.data.success && response.data;
        });
    }

    var service = {
      getInitialComponentCompleted: getInitialComponentCompleted,
      setInitialComponentCompleted: setInitialComponentCompleted,
      UploadPushImage: UploadPushImage,
    };

    return service;
  }
})();
