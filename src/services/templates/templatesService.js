(function() {
  'use strict';

  angular
    .module('dopplerApp.templates')
    .service('templatesService', templatesService);

  templatesService.$inject = [
    '$http',
    '$location',
    'EMAIL_EDITOR_TYPE',
    'unlayerEditorHelper'
  ];

  function templatesService($http, $location, EMAIL_EDITOR_TYPE, unlayerEditorHelper) {

    var service = {
      getEditorTemplateUrl: getEditorTemplateUrl,
      getEditorCampaignUrl: getEditorCampaignUrl,
      getCampaignCreationFromTemplateUrl: getCampaignCreationFromTemplateUrl,
      createTemplateFromPublicAndRedirect: createTemplateFromPublicAndRedirect,
      tryToRedirectToSetCampaignFromTemplateIfUnlayerAndEdit: tryToRedirectToSetCampaignFromTemplateIfUnlayerAndEdit,
      tryToRedirectToSetCampaignFromTemplateIfUnlayerAndContinue: tryToRedirectToSetCampaignFromTemplateIfUnlayerAndContinue,
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

    function ensureExitParameterWithCurrentUrl(parameters, idCampaign) {
      parameters = parameters || {};
      // I am not using destructuring because I think it is not
      // compatible with current build tools versions
      // TODO Analize HasDynamicContent https://github.com/MakingSense/Doppler/blob/c37468fa59cb017dbca2744436217d83a16a69ed/Doppler.Application.Automation/Services/Classes/AutomationService.cs#L808
      // to get a right result the automation needs preview save
      if (!parameters.exit) {
        parameters.exit = $location.absUrl();
      }
      if (parameters.exit && idCampaign) {
        parameters.exit = parameters.exit.concat(`&idCampaign=${idCampaign}`);
      }
      return parameters;
    }

    function ensureContinueParameterWithCurrentUrl(parameters) {
      parameters = parameters || {};
      // I am not using destructuring because I think it is not
      // compatible with current build tools versions
      if (!parameters.continue) {
        parameters.continue = $location.absUrl();
      }
      return parameters;
    }

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

    function getEditorTemplateUrl (id, editorType, parameters) {
      switch (editorType) {
        case EMAIL_EDITOR_TYPE.UNLAYER: return unlayerEditorHelper.getUnlayerTemplateEditorUrl(id, ensureExitParameterWithCurrentUrl(parameters, idCampaign));
        case EMAIL_EDITOR_TYPE.MSEDITOR:
        default: return '/MSEditor/Editor?idTemplate=' + id;
      }
    }

    function getEditorCampaignUrl (idCampaign, editorType, parameters) {
      switch (editorType) {
        case EMAIL_EDITOR_TYPE.UNLAYER: return unlayerEditorHelper.getUnlayerCampaignEditorUrl(idCampaign, ensureExitParameterWithCurrentUrl(parameters, idCampaign));
        case EMAIL_EDITOR_TYPE.MSEDITOR:
        default: return '/MSEditor/Editor?idCampaign=' + idCampaign + '&idThirdPartyApp=' + parameters.idThirdPartyApp;
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

    function redirectToUnlayerEditorForTemplateCreation(baseTemplateId, parameters) {
      window.location.href = unlayerEditorHelper.getUnlayerEditorUrlForTemplateCreation(baseTemplateId, ensureExitParameterWithCurrentUrl(parameters, idCampaign));
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

    function createTemplateFromPublicAndRedirect(baseTemplateId, editorType, parameters, onFail) {
      switch (editorType) {
        case EMAIL_EDITOR_TYPE.UNLAYER:
          redirectToUnlayerEditorForTemplateCreation(baseTemplateId, ensureExitParameterWithCurrentUrl(parameters, idCampaign));
          break;
        case EMAIL_EDITOR_TYPE.MSEDITOR:
        default:
            createMSEditorTemplateFromPublicAndRedirect(baseTemplateId, onFail);
            break;
      }
    }

    /**
     *
     * If the template is Unlayer, it redirects to the URL for setting campaign content from
     * template and returns true.
     *
     * If the template is not, it does nothing and returns false.
     *
     * @param {number} baseTemplateId
     * @param {number} editorType
     * @param {number} idCampaign
     * @param {Object|null|undefined} parameters
     * @returns {boolean} true when editorType is Unlayer. Otherwise, false indicating that no operation has been done.
     */
    function tryToRedirectToSetCampaignFromTemplateIfUnlayerAndEdit(baseTemplateId, editorType, idCampaign, parameters) {
      if (editorType !== EMAIL_EDITOR_TYPE.UNLAYER) {
        return false;
      }

      window.location.href = unlayerEditorHelper.getUnlayerEditorUrlForSetCampaignContentFromTemplate(idCampaign, baseTemplateId, ensureExitParameterWithCurrentUrl(parameters, idCampaign));
      return true;
    }

    /**
     *
     * If the template is Unlayer, it redirects to the URL for setting campaign content from
     * template and returns true.
     *
     * If the template is not, it does nothing and returns false.
     *
     * @param {number} baseTemplateId
     * @param {number} editorType
     * @param {number} idCampaign
     * @param {Object|null|undefined} parameters
     * @returns {boolean} true when editorType is Unlayer. Otherwise, false indicating that no operation has been done.
     */
    function tryToRedirectToSetCampaignFromTemplateIfUnlayerAndContinue(baseTemplateId, editorType, idCampaign, parameters) {
      if (editorType !== EMAIL_EDITOR_TYPE.UNLAYER) {
        return false;
      }

      window.location.href = unlayerEditorHelper.getUnlayerEditorUrlForSetCampaignContentFromTemplate(idCampaign, baseTemplateId, ensureContinueParameterWithCurrentUrl(parameters, idCampaign));
      return true;
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
