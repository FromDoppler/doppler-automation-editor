(function() {
  'use strict';

  angular
    .module('dopplerApp.templates')
    .service('templatesService', templatesService);

  templatesService.$inject = [
    '$http',
    'EMAIL_EDITOR_TYPE',
    'unlayerEditorHelper'
  ];

  function templatesService($http, EMAIL_EDITOR_TYPE, unlayerEditorHelper) {

    var service = {
      getEditorTemplateUrl: getEditorTemplateUrl,
      getEditorCampaignUrl: getEditorCampaignUrl,
      getCampaignCreationFromTemplateUrl: getCampaignCreationFromTemplateUrl,
      createTemplateFromPublicAndRedirect: createTemplateFromPublicAndRedirect,
      deleteTemplate: deleteTemplate,
      duplicateTemplate: duplicateTemplate,
      getCategoriesPublicTemplates: getCategoriesPublicTemplates,
      getPreviewTemplate: getPreviewTemplate,
      getPrivateTemplates: getPrivateTemplates,
      getPublicTemplates: getPublicTemplates,
      getTemplates: getTemplates,
      renameTemplate: renameTemplate
    };

    return service;


    // get all templates for this user
    function getPrivateTemplates(page, cantPerPage) {
      return $http.get('/Templates/Main/GetPrivateTemplates', {
        params: {
          page: page,
          cantPerPage: cantPerPage
        }
      }).then(function(response){
        return response.data.templates;
      });
    }

    // get all public templates
    function getPublicTemplates(categoryId, page, cantPerPage) {
      return $http.get('/Templates/Main/GetPublicTemplates', {
        params: {
          categoryId: categoryId,
          page: page,
          cantPerPage: cantPerPage
        }
      }).then(function(response){
        return response.data.templates;
      });
    }

    // get all public templates
    function getTemplates(page, cantPerPage, categoryId, allTemplates, privateTemplates) {
      return $http.get('/Templates/Main/GetTemplates', {
        params: {
          allTemplates: allTemplates,
          cantPerPage: cantPerPage,
          categoryId: categoryId,
          page: page,
          privateTemplates: privateTemplates
        }
      }).then(function(response){
        return response.data.templates;
      });
    }

    // get all categories public templates
    function getCategoriesPublicTemplates() {
      return $http.get('/Templates/Main/GetCategoriesPublicTemplates').then(function(response){
        return response.data.categories;
      });
    }

    function getEditorTemplateUrl (id, editorType) {
      switch (editorType) {
        case EMAIL_EDITOR_TYPE.UNLAYER: return unlayerEditorHelper.getUnlayerTemplateEditorUrl(id);
        case EMAIL_EDITOR_TYPE.MSEDITOR:
        default: return '/MSEditor/Editor?idTemplate=' + id;
      }
    }

    function getEditorCampaignUrl (idCampaign, editorType) {
      switch (editorType) {
        case EMAIL_EDITOR_TYPE.UNLAYER: return unlayerEditorHelper.getUnlayerCampaignEditorUrl(idCampaign);
        case EMAIL_EDITOR_TYPE.MSEDITOR:
        default: return '/MSEditor/Editor?idCampaign=' + idCampaign;
      }
    }

    function getCampaignCreationFromTemplateUrl(id, editorType) {
      switch (editorType) {
        case EMAIL_EDITOR_TYPE.UNLAYER:
          return '/Campaigns/BasicInfo?idTemplate=' + id + '&editorType=' + editorType;
        case EMAIL_EDITOR_TYPE.MSEDITOR:
        default: 
          return '/Campaigns/BasicInfo?idTemplate=' + id;
      }
    }

    function redirectToUnlayerEditorForTemplateCreation(baseTemplateId) {
      window.location.href = unlayerEditorHelper.getUnlayerEditorUrlForTemplateCreation(baseTemplateId);
    }

    function createMSEditorTemplateFromPublicAndRedirect(baseTemplateId, onFail) {
      return $http.post('/Templates/Main/CreateTemplateFromPublic', { idTemplate: baseTemplateId })
        .then(function(response) { return response.data.id; })
        .then(function(idNewTemplate) {
          if (idNewTemplate) {
            window.location.href = getEditorTemplateUrl(idNewTemplate, EMAIL_EDITOR_TYPE.MSEDITOR);
          } else {
            throw new Error("Unexpected idNewTemplate: " + idNewTemplate);
          }})
        .catch(onFail);
    }

    function createTemplateFromPublicAndRedirect(baseTemplateId, editorType, onFail) {
      switch (editorType) {
        case EMAIL_EDITOR_TYPE.UNLAYER: 
          redirectToUnlayerEditorForTemplateCreation(baseTemplateId);
          break;
        case EMAIL_EDITOR_TYPE.MSEDITOR:
        default:
            createMSEditorTemplateFromPublicAndRedirect(baseTemplateId, onFail);
            break;
      }
    }

    // rename template. "name" is the new template name. "id" is the id for the template to rename.
    function renameTemplate(id, name) {
      return $http.post('/Templates/Main/RenameTemplate', {
        id: id,
        name: name
      });
    }

    // duplicate template. "id" is the id for the template to duplicate. "name" is the new template name.
    function duplicateTemplate(id, name) {
      return $http.post('/Templates/Main/DuplicateTemplate', {
        id: id,
        name: name
      });
    }

    // delete template. "id" is the id for the template to delete.
    function deleteTemplate(id) {
      return $http.post('/Templates/Main/DeleteTemplate', {
        id: id
      });
    }

    //get html content for template
    function getPreviewTemplate(idTemplate, isPublic) {
      return $http.get('/Campaigns/Content/GetTemplateSelected', {
        params: {
          idTemplate: idTemplate,
          PublicTemplate: isPublic
        }
      });
    }

  }

})();
