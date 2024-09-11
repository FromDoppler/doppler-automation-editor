(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('whatsappDataservice', whatsappDataservice);

  whatsappDataservice.$inject = [
    '$http',
    'settingsService',
    'headerService'
  ];

  function whatsappDataservice($http, settingsService, headerService) {
   
    var service = {
      getWhatsappRooms: getWhatsappRooms,
      getWhatsappTemplatesByRoom: getWhatsappTemplatesByRoom,
      sendWhatsappTest: sendWhatsappTest,
      getConversationsLink: getConversationsLink,
      getConversationsPlanLink: getConversationsPlanLink
    };

    return service;

    function getConversationsLink () {
      const defaultLink = 'https://conversations.fromdoppler.com/external-login';
      return settingsService.getLoadedData().urlConversations || defaultLink;
    }

    function getConversationsPlanLink () {
      headerService.getHeaderData().then(function (response) {
        const headerData = response;
        const userPlanType = headerData.user.plan.planType;
        if(userPlanType === 1){ // is free
          return headerData.user.plan.buttonUrl;
        } else {
          return headerData.urlBase.concat('buy-conversation?buyType=2');
        }
      });
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
  }
})();
