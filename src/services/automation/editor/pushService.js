(function() {
    'use strict';
  
    angular
      .module('dopplerApp.automation.editor')
      .service('pushService', pushService);

    pushService.$inject = [
      '$http'
    ];  

    function pushService($http) {
      var initialComponentCompleted = false;
      let pushSettings = {}; 
      let promise;
      const PUSH_NOTIFICATION_TRIAL_ID_PLAN = 1;
       
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
        return $http.post(UploadPushImage, formData, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        }).then(function(response) {
          return response.data.success && response.data;
        });
      }

      function GetPushNotificationSettings() {
        if (!_.isEmpty(pushSettings)) {
          return Promise.resolve(pushSettings);
        }

        if (!promise) {
          promise = $http.get('/ControlPanel/PushNotification/GetSettings')
          .then((response) => {
            const hasActivePlan =  mainMenuData.user.pushNotificationPlan.active;
            const hasExcededCredits = response.data.data.consumedSends > mainMenuData.user.pushNotificationPlan.planData.quantity;
            const trialPeriodExpired = response.data.data.trialPeriodRemainingDays === 0;
            const isFreePlan = mainMenuData.user.pushNotificationPlan.planData.idPlan === PUSH_NOTIFICATION_TRIAL_ID_PLAN;
            pushSettings = {
              ... response.data.data,
              hasActivePlan: hasActivePlan,
              hasExcededCredits: hasExcededCredits,
              isTrialExpired: isFreePlan && (hasExcededCredits || trialPeriodExpired)
            }

            return pushSettings;
          });
        }
        return promise;
      }

      function getPushNotificationPlan() {
        if (typeof(mainMenuData) !== 'undefined'){
          return mainMenuData.user.pushNotificationPlan;
        }
        return;
      }

      var service = {
          getInitialComponentCompleted: getInitialComponentCompleted,
          setInitialComponentCompleted: setInitialComponentCompleted,
          UploadPushImage: UploadPushImage,
          getPushNotificationPlan: getPushNotificationPlan,
          GetPushNotificationSettings: GetPushNotificationSettings,
      };
  
      return service;
    }
  })();
  