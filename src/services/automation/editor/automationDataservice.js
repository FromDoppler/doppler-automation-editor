(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('automationDataservice', automationDataservice);

  automationDataservice.$inject = [
    '$http'
  ];

  function automationDataservice($http) {
    var service = {
      getAutomation: getAutomation,
      getAutomationDefaultName: getAutomationDefaultName,
      getEmailLinks: getEmailLinks,
      getHtmlContent: getHtmlContent,
      getHtmlContentForPreview: getHtmlContentForPreview,
      getListsItems: getListsItems,
      getListsForSendTest: getListsForSendTest,
      getSettings: getSettings,
      getSubscribersLists: getSubscribersLists,
      getUserLabels: getUserLabels,
      saveCampaign: saveCampaign,
      saveChanges: saveChanges,
      saveTemplateContent: saveTemplateContent,
      getCountries: getCountries,
      getOrigins: getOrigins,
      getScores: getScores,
      getSiteBehaviorStatus: getSiteBehaviorStatus,
      pauseAutomationCampaign: pauseAutomationCampaign,
      sendTestToList: sendTestToList,
      sendTestToEmails: sendTestToEmails,
      startAutomationCampaign: startAutomationCampaign,
      stopAutomationCampaign: stopAutomationCampaign,
      saveTinyEditorContent: saveTinyEditorContent,
      validateAndAutoCompleteRSS: validateAndAutoCompleteRSS,
      hasDynamicContent: hasDynamicContent
    };

    return service;

    function getAutomation(id) {
      var automationUrl = '/Automation/Automation/GetAutomationModel?idScheduledTask=' + id;
      return $http.get(automationUrl);
    }

    function saveChanges(automation) {
      return $http.post('/Automation/Automation/SaveAutomationModel', automation );
    }

    function saveCampaign(idScheduledTask, campaign, html) {
      var postObj = {
        idCampaign: campaign.id,
        idTask: idScheduledTask,
        html: html
      };

      return $http.post('/Automation/Automation/SaveImportContent', postObj);
    }

    function saveTemplateContent(idCampaign, idTemplate) {
      return $http.post('/Automation/Automation/SaveTemplateContent', {
        idCampaign: idCampaign,
        idTemplate: idTemplate
      });
    }

    function getSubscribersLists(idSegment, idLabel, searchText, page, cantPerPage, sort, sortdir) {
      return $http.get('/Automation/Task/GetSubscribersLists', {
        params: {
          idSegment: idSegment,
          idLabel: idLabel,
          searchText: searchText,
          page: page,
          cantPerPage: cantPerPage,
          sort: sort,
          sortdir: sortdir
        }
      }).then(function(response){
        return response.data.associationModel;
      });
    }

    function getUserLabels() {
      return $http.get('/Automation/Task/GetUserLabels').then(function(response) {
        return response.data.labelList;
      });
    }

    function getAutomationDefaultName() {
      return $http.get('/Automation/Automation/GetAutomationName').then(function(response) {
        return response.data;
      });
    }

    function getCountries() {
      return $http.get('/Automation/Automation/GetCountries');
    }

    function getOrigins() {
      return $http.get('/Automation/Automation/GetSubscriberSourceTypes');
    }

    function getScores() {
      return $http.get('/Automation/Automation/GetScores');
    }

    function getEmailLinks(idCampaign) {
      return $http.get('/Automation/Automation/GetAutomationCampaignLink?idCampaign=' + idCampaign);
    }

    function getSettings() {
      return $http.get('/Automation/Automation/GetSettings');
    }

    function startAutomationCampaign(id) {
      var automationUrl = '/Automation/Automation/StartAutomationCampaign?idScheduledTask=' + id;
      return $http.get(automationUrl);
    }

    function stopAutomationCampaign(id) {
      var automationUrl = '/Automation/Automation/StopAutomationCampaign?idScheduledTask=' + id;
      return $http.get(automationUrl);
    }

    function pauseAutomationCampaign(id) {
      var automationUrl = '/Automation/Automation/PauseAutomationCampaign?idScheduledTask=' + id;
      return $http.get(automationUrl);
    }

    function getHtmlContent(idCampaign) {
      return $http.get('/Campaigns/Content/GetHTMLJsonContent', {
        params: {
          idCampaign: idCampaign,
          replaceTags: true
        }
      }).then(function(response) {
        return response.data.html;
      });
    }

    function getListsForSendTest() {
      return $http.get('/Automation/Automation/GetSubscribersListsForTest').then(function(response) {
        return response.data.subscribersLists;
      });;
    }

    function getListsItems(url, params) {
      return $http.get(url, {
        params: params
      });
    }

    function sendTestToList(idList, idCampaign){
      return $http.post('/Automation/Automation/SendTestBySubscriberList', {
        IdSubscriberList: idList,
        IdCampaign: idCampaign
      });
    }

    function sendTestToEmails(emailList, idCampaign){
      return $http.post('/Automation/Automation/SendTestByEmails', {
        Emails: emailList,
        IdCampaign: idCampaign
      });
    }

    function saveTinyEditorContent(idCampaign, html){
      return $http.post('/Automation/Automation/SaveEditorContent', {
        idCampaign: idCampaign,
        html: html
      });
    }

    function validateAndAutoCompleteRSS(url){
      return $http.get('/Automation/Automation/IsValidRSS', {
        params: {
          RssFeed: url
        }
      }).then(function(response) {
        return response.data;
      });
    }

    function getHtmlContentForPreview(idCampaign) {
      return $http.get('/Automation/Content/GetContentCampaign', {
        params: {
          idCampaign: idCampaign
        }
      }).then(function(response) {
        return response.data.html;
      });
    }

    function getSiteBehaviorStatus() {
      return $http.get('/Automation/Automation/GetSiteBehaviorStatus')
        .then(function(response) {
          return response.data.status;
        });
    }

    function hasDynamicContent(idScheduledTask, idCampaign) {
      return $http.get('/Automation/Automation/HasDynamicContent', {
        params: {
          idScheduledTask: idScheduledTask,
          idCampaign: idCampaign
        }
      });
    }
  }
})();
