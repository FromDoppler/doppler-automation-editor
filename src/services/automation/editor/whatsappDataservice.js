(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('whatsappDataservice', whatsappDataservice);

  whatsappDataservice.$inject = [
    '$http',
    'settingsService',
    '$window'
  ];

  function whatsappDataservice($http, settingsService, $window) {
   
    var service = {
      getWhatsappRooms: getWhatsappRooms,
      getWhatsappTemplatesByRoom: getWhatsappTemplatesByRoom,
      sendWhatsappTest: sendWhatsappTest,
      getConversationsLink: getConversationsLink,
      getConversationsPlanLink: getConversationsPlanLink,
      uploadWhatsappFile: uploadWhatsappFile,
    };

    return service;

    function getConversationsLink () {
      const defaultLink = 'https://conversations.fromdoppler.com/external-login';
      return settingsService.getLoadedData().urlConversations || defaultLink;
    }

    function getConversationsPlanLink () {
      const mainMenuData = $window['mainMenuData'];
      if(mainMenuData !== 'undefined') {
        const userPlanType = mainMenuData.user.plan.planType;
        return (userPlanType === 1)? 
          mainMenuData.user.plan.buttonUrl : // free user
          mainMenuData.homeUrl.concat('/buy-conversation?buyType=2'); // premium user
      }
    }

    function getWhatsappRooms(){
      return $http.get('/Automation/Task/GetWhatsappRooms').then(function(response) {
        return response.data;
      });
    }

    function getWhatsappTemplatesByRoom(roomId){
      return $http.get('/Automation/Task/GetWhatsappTemplatesByRoom', {
        params: {
          roomId: roomId
        }
      }).then(function(response) {
        return response.data;
      });
    }

    function sendWhatsappTest(data) {
      return $http.post('/Automation/Automation/SendTestWhatsappMessage', data);
    }

    function uploadWhatsappFile(formData) {
      return $http.post('/Automation/Automation/UploadWhatsappFile', formData,
        {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        }
      )
    }
  }
})();
