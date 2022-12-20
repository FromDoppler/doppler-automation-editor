(function() {
  'use strict';

  angular
    .module('dopplerApp.forms')
    .controller('FormIntegrateFacebookCtrl', FormIntegrateFacebookCtrl);

  FormIntegrateFacebookCtrl.$inject = [
    '$scope',
    '$translate',
    'FORM_INTEGRATION_FB_STATE',
    'FORM_INTEGRATION_ERROR_CODE',
    'facebookService',
    '$location'
  ];

  function FormIntegrateFacebookCtrl($scope, $translate, FORM_INTEGRATION_FB_STATE, FORM_INTEGRATION_ERROR_CODE,
    facebookService, $location) {
    var vm = this;

    //config options
    vm.thumbnailMaxSize = 100000;
    vm.FORM_INTEGRATION_FB_STATE = FORM_INTEGRATION_FB_STATE;
    vm.integrationStatus = FORM_INTEGRATION_FB_STATE.NO_FB_ACCOUNT;
    vm.facebookAuthorizationUrl = '/Lists/Form/StartFacebookAuthorizationFormEditor';
    vm.countDisableFanPages = 0;
    vm.disabledFanPages = false;
    vm.imageError = false;
    vm.processing = false;
    vm.error = false;
    vm.facebookLoading = true;
    vm.removeImage = false;

    //facebook temp data
    vm.currentThumbnail = '';
    vm.currentFacebookTabName = '';

    //facebook data
    vm.idForm = $location.search().idForm;
    vm.facebookData = {
      accountName: '',
      fanPages: [],
      tabUrl: '',
      thumbnail: '',
      facebookFanPageSelected: {label: '', value: ''},
      facebookTabName: '',
      idInstalledTab: 0
    };

    //controller functions exposed
    vm.integrateAccount = integrateAccount;
    vm.onFanPageSelected = onFanPageSelected;
    vm.showSettings = showSettings;
    vm.installTab = installTab;
    vm.showConfirmation = showConfirmation;
    vm.cancelDelete = cancelDelete;
    vm.deleteTab = deleteTab;
    vm.editTab = editTab;
    vm.confirmChanges = confirmChanges;
    vm.cancelChanges = cancelChanges;
    vm.deleteImage = deleteImage;

    //initial data load
    facebookService.hasPermissionInFacebook().then(function(response) {
      if (response) {
        facebookService.getFacebookDataModel(vm.idForm).then(function(response) {
          if (response) {
            loadFBModel(response);
            if (vm.facebookData.idInstalledTab) {
              vm.integrationStatus = FORM_INTEGRATION_FB_STATE.TAB_INSTALLED;
            } else {
              vm.integrationStatus = FORM_INTEGRATION_FB_STATE.NO_TAB_CONFIGURED;
            }
          }
          vm.facebookLoading = false;
        });
      } else {
        vm.facebookLoading = false;
      }
    });


    function integrateAccount() {
      vm.processing = true;
      vm.facebookLoading = vm.disabledFanPages;
      facebookService.hasPermissionInFacebook().then(function(response) {
        if (!response) {
          openFacebookPopup();
        } else {
          facebookService.getFacebookDataModel(vm.idForm).then(function(response) {
            loadFBModel(response);
            vm.integrationStatus = FORM_INTEGRATION_FB_STATE.NO_TAB_CONFIGURED;
          });
        }
        vm.facebookLoading = false;
        vm.processing = false;
      });
    }

    function showSettings() {
      if (vm.integrationStatus === FORM_INTEGRATION_FB_STATE.TAB_DELETED) {
        vm.facebookData.facebookTabName = '';
      }
      vm.integrationStatus = FORM_INTEGRATION_FB_STATE.NO_TAB_CONFIGURED_SHOW_SETTINGS;
    }

    function onFanPageSelected(option) {
      vm.facebookData.facebookFanPageSelected = option;
    }

    function installTab() {
      vm.processing = true;
      facebookService.saveTab(vm.facebookData, vm.idForm, vm.file, vm.removeImage).then(function(response) {
        if (response) {
      	  if (response.success) {
      	    facebookService.getFacebookDataModel(vm.idForm).then(function(data) {
              vm.integrationStatus = FORM_INTEGRATION_FB_STATE.TAB_INSTALLED;
              vm.currentFacebookTabName = vm.facebookData.facebookTabName;
              vm.currentThumbnail = vm.facebookData.thumbnail;
              loadFBModel(data);
              vm.processing = false;
            });
      	  } else {
            vm.error = true;
            if (response.errorCode === FORM_INTEGRATION_ERROR_CODE.TAB_ERROR_CODE) {
            	vm.tabError = true;
            	vm.processing = false;
            }
          }
        } else {
          vm.processing = false;
          vm.error = true;
        }
      });
    }

    function showConfirmation() {
      vm.integrationStatus = FORM_INTEGRATION_FB_STATE.TAB_DELETE_CONFIRMATION;
    }

    function cancelDelete() {
      vm.integrationStatus = FORM_INTEGRATION_FB_STATE.TAB_INSTALLED;
    }

    function deleteTab() {
      vm.processing = true;
      vm.error = false;
      facebookService.deleteTab(vm.idForm).then(function(response) {
        if (response) {
          vm.integrationStatus = FORM_INTEGRATION_FB_STATE.TAB_DELETED;
          vm.facebookData.thumbnail = '';
          vm.facebookData.facebookFanPageSelected = {label: '', value: ''};
          vm.facebookData.idInstalledTab = 0;
          vm.currentFacebookTabName = '';
          vm.currentThumbnail = '';
          facebookService.getFacebookDataModel(vm.idForm).then(function(response) {
            if (response) {
              vm.facebookData.fanPages = mapFanPagesArray(response.FanPageList);
            }
          });
        } else {
          vm.error = true;
        }
        vm.processing = false;
      });
    }

    function editTab() {
      vm.integrationStatus = FORM_INTEGRATION_FB_STATE.TAB_EDIT;
    }

    function confirmChanges() {
      vm.processing = true;
      vm.error = false;
      facebookService.saveTab(vm.facebookData, vm.idForm, vm.file, vm.removeImage).then(function(response) {
        if (response) {
          vm.integrationStatus = FORM_INTEGRATION_FB_STATE.TAB_INSTALLED;
          vm.currentFacebookTabName = vm.facebookData.facebookTabName;
          vm.currentThumbnail = vm.facebookData.thumbnail;
        } else {
          vm.error = true;
        }
        vm.processing = false;
      });

    }

    function cancelChanges() {
      vm.integrationStatus = FORM_INTEGRATION_FB_STATE.TAB_INSTALLED;
      vm.facebookData.facebookTabName = vm.currentFacebookTabName;
      vm.facebookData.thumbnail = vm.currentThumbnail;
      vm.file = null;
    }

    function deleteImage() {
      vm.facebookData.thumbnail = '';
      vm.thumbnailSize = 0;
      vm.imageError = false;
      vm.file = null;
      vm.removeImage = true;
    }

    function openFacebookPopup() {
      var windowName = 'popUp';
      var windowSize = 'width=600,height=500,scrollbars=yes';
      var OpenWindow = window.open(vm.facebookAuthorizationUrl, windowName, windowSize);
      if (OpenWindow !== undefined) {
        OpenWindow.focus();
      }
      var interval = window.setInterval(function() {
        try {
          if (OpenWindow === null || OpenWindow === undefined || OpenWindow.closed) {
            window.clearInterval(interval);
            if (window.integrationModel) {
              loadFBModel(window.integrationModel);
              vm.integrationStatus = vm.facebookData.idInstalledTab ? FORM_INTEGRATION_FB_STATE.TAB_INSTALLED
                : FORM_INTEGRATION_FB_STATE.NO_TAB_CONFIGURED;
              vm.processing = false;
              vm.error = false;
              $scope.$apply();
            } else {
              vm.processing = false;
              vm.error = true;
              $scope.$apply();
            }
          }
        } catch (e){} // eslint-disable-line no-empty
      }, 1000);
    }

    function mapFanPagesArray(fanpages) {
      var mapped = [];
      vm.countDisableFanPages = 0;
      angular.forEach(fanpages, function(value) {
        mapped.push({
          label: value.Name,
          value: value.Id,
          disabled: value.HasFormAssociated,
          idForm: value.IdForm
        });
        if (value.HasFormAssociated) {
          vm.countDisableFanPages += 1;
        }
      });
      vm.disabledFanPages = vm.countDisableFanPages === fanpages.length;
      return mapped;
    }

    function loadFBModel(dataModel) {
      vm.facebookData.fanPages = mapFanPagesArray(dataModel.FanPageList);
      vm.facebookData.facebookTabName = dataModel.TabName;
      vm.facebookData.accountName = dataModel.AccountName;
      vm.facebookData.thumbnail = dataModel.ImageUrl;
      vm.facebookData.facebookFanPageSelected = {label: dataModel.FanPageName, value: dataModel.FanPageId};
      vm.facebookData.tabUrl = dataModel.TabUrl ? dataModel.TabUrl : '';
      vm.facebookData.idInstalledTab = dataModel.IdFacebookTabSetting;

      vm.currentFacebookTabName = vm.facebookData.facebookTabName;
      vm.currentThumbnail = vm.facebookData.thumbnail;
    }

    $scope.$on('onSelectedFile', function(event, data){
      facebookService.uploadImage(data.file, vm.idForm).then(function(response) {
        vm.facebookData.thumbnail = response.data ? response.data : '';
        vm.removeImage = false;
      });
    });
  }
})();
