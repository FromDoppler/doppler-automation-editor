(function () {
  'use strict';

  angular
    .module('dopplerApp.forms')
    .factory('facebookService', facebookService);

  facebookService.$inject = ['$http'];

  function facebookService($http) {
    var service = {
      getAuthorization: getAuthorization,
      hasPermissionInFacebook: hasPermissionInFacebook,
      getFacebookDataModel: getFacebookDataModel,
      saveTab: saveTab,
      deleteTab: deleteTab,
      uploadImage: uploadImage,
    };

    return service;

    function getAuthorization() {
      return $http
        .get('/Lists/Form/StartFacebookAuthorizationV2')
        .then(function (response) {
          return response.data.config;
        });
    }

    function hasPermissionInFacebook() {
      return $http
        .get('/Lists/Form/CheckFacebookPermission')
        .then(function (response) {
          return response.data.success && response.data.permission;
        });
    }

    function getFacebookDataModel(idForm) {
      return $http
        .get('/Lists/Form/GetTabInformation', { params: { idForm: idForm } })
        .then(function (response) {
          return response.data.success ? response.data.facebookDataModel : null;
        });
    }

    function saveTab(tabModel, idForm, file, removeImage) {
      var formData = new FormData(); //eslint-disable-line no-undef
      formData.append('FormId', idForm);
      formData.append('Logo', file);
      formData.append('TabName', tabModel.facebookTabName);
      formData.append('IdFacebookTabSetting', tabModel.idInstalledTab);
      formData.append('FacebookPageId', tabModel.facebookFanPageSelected.value);
      formData.append('removeImage', removeImage);

      return $http
        .post('/Lists/Form/SaveTabInformation', formData, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined },
        })
        .then(
          function (response) {
            return response.data;
          },
          function () {
            return false;
          }
        );
    }

    function deleteTab(idForm) {
      return $http
        .post('/Lists/Form/DeleteTab', { FormId: idForm })
        .then(function (response) {
          return response.data.success;
        });
    }

    function uploadImage(file, formId) {
      var formData = new FormData(); //eslint-disable-line no-undef
      formData.append('Logo', file);
      formData.append('currentLogoUri', null);
      formData.append('FormId', formId);
      return $http
        .post('/Lists/Form/BaseFacebookTabLogoUpload', formData, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined },
        })
        .then(function (response) {
          return response;
        });
    }
  }
})();
