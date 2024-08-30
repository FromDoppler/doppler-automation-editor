(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('whatsappDataservice', whatsappDataservice);

  whatsappDataservice.$inject = [
    '$http',
    'settingsService'
  ];

  function whatsappDataservice($http,settingsService) {
   
    var service = {
      getWhatsappRooms: getWhatsappRooms,
      getWhatsappTemplatesByRoom: getWhatsappTemplatesByRoom,
      sendWhatsappTest: sendWhatsappTest,
      getConversationsLink: getConversationsLink
    };

    return service;

    function getConversationsLink () {
      const defaultLink = 'https://conversations.fromdoppler.com/external-login';
      return settingsService.getLoadedData().urlConversations || defaultLink;
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
