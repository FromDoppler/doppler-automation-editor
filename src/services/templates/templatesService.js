(function() {
  'use strict';

  angular
    .module('dopplerApp.templates')
    .service('templatesService', templatesService);

  templatesService.$inject = [
    '$http'
  ];

  function templatesService($http) {

    var service = {
      createTemplateFromPublic: createTemplateFromPublic,
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

    // create new template from public. "id" is the template id.
    function createTemplateFromPublic(id) {
      return $http.post('/Templates/Main/CreateTemplateFromPublic', {
        idTemplate: id
      })
        .then(function(response){
          return response.data.id;
        });
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
