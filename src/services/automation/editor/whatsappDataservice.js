(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('whatsappDataservice', whatsappDataservice);

  whatsappDataservice.$inject = [
    '$http'
  ];

  function whatsappDataservice($http) {
   
    var service = {
      getWhatsappRooms: getWhatsappRooms,
      getWhatsappTemplatesByRoom: getWhatsappTemplatesByRoom,
      sendWhatsappTest: sendWhatsappTest
    };

    return service;

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
