(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('bmwCrmIntegrationCtrl', bmwCrmIntegrationCtrl);
                 
  bmwCrmIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'bmwCrmService',
    '$timeout',
    'INTEGRATION_CODES',
    'IMPORTING_STATE',
    'IMPORTING_STATE_STR',
    'BASIC_FIELD',
    'INTEGRATION_SOURCE_TYPE'
  ];

  function bmwCrmIntegrationCtrl($scope, $translate, ModalService,
    bmwCrmService, $timeout, INTEGRATION_CODES, IMPORTING_STATE,
    IMPORTING_STATE_STR, BASIC_FIELD) {
    var vm = this;
    vm.isLoading = true;
    vm.importingListDropdown = false;
    vm.connectionError = false;
    vm.connecting = false;
    vm.connected = false;
    vm.disconnected = false;
    vm.isLoadingFields = false;
    vm.isAnUpdate = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.BMWCRM;
    vm.errorMessage = ''; 
    vm.integrationToDelete = null;
    vm.allEntitiesList = [];
    vm.entitiesList = [];
    vm.allUserList = [];
    vm.userList = [];
    vm.integratedLists = [];
    vm.campaigns = [];
    vm.integratedListsAvailable = 0;
    vm.bmwCrmFields = [];
    vm.showMapping = false;
    vm.isMapping = false;

    $translate.onReady().then(function(){
      vm.synchronizeCampaings();
      vm.getStatus(true);
      loadDopplerFields();
    });

    vm.getStatus = function(doPolling){
      return bmwCrmService.getIntegrationStatus()
        .then(function(result){
          vm.connected = !!result.model;
          if (result.success) {
            if (!!result.model) { // eslint-disable-line
              vm.connectedAccount = result.model.AccountName;
              vm.integratedLists = result.integratedLists;
              vm.allUserList.length === 0 ? vm.getUserList() : filterAvailableUserLists();
              vm.allEntitiesList.length === 0 ? vm.getEntitiesList() : filterAvailableEntities();
              vm.lastSyncDate = result.model.LastSynchDate;
              vm.daysToDisconnection = result.model.DaysToDisconnection;
              vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
            }
            if (vm.integratedLists.length && isAnyImportingList(vm.integratedLists)
              && (doPolling !== undefined || doPolling)) {
              vm.checkListState();
            }
            if (!vm.integratedLists.length) {
              vm.disableSync = true;
            } else {
              if (vm.integratedLists[0].IdList) {
                vm.selectedListId = vm.integratedLists[0].IdList;
              }
            }  
          } else {
            vm.connectionError = true;
            vm.errorMsg = $translate.instant('bmwcrm_integration.disconnected.connection_error');
          }
          vm.isLoading = false;
        });
    };

    vm.connect = function(){
      vm.connecting = true;
      bmwCrmService.connect(vm.integrationData).then(function(result){
        if (result.success){
          vm.connectionError = false;
          vm.connected = true;
          vm.lastSyncDate = ' - ';
          vm.connectedAccount = vm.integrationData.userName;
          vm.disableSync = true;
          vm.getEntitiesList();
          vm.getUserList();
          vm.synchronizeCampaings();
        } else {
          vm.connectionError = true;
          vm.errorMsg = result.errorMsg.length ? result.errorMsg : $translate.instant('bmwcrm_integration.disconnected.connection_error');
        }
        vm.connecting = false;
      });
    };

    vm.disconnectWarning = function(){
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'modalYesOrNoBmwCrmCtrl',
        inputs: { data:
          {
            title: $translate.instant('bmwcrm_integration.connected.disconnect_popup.title'),
            description: $translate.instant('bmwcrm_integration.connected.disconnect_popup.description'),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('actions.disconnect'),
            buttonPrimaryClass: 'button--primary button--small'
          } }
      }).then(function(modal){
        modal.close.then(function(result) {
          if (result) {
            vm.connectionError = false;
            vm.connected = false;
            if (vm.integrationData) {
              vm.integrationData.userName = '';
              vm.integrationData.password = '';
              vm.integrationData.token = '';
            }
            vm.connectedAccount = '';
            vm.disconnected = true;
          }
        });
      });
    };

    vm.getEntitiesList = function() {
      vm.isLoading = true;
      vm.importingListDropdown = true;
      bmwCrmService.getEntities()
        .then(function(result) {
          vm.importingListDropdown = false;
          if (result.success) {
            vm.allEntitiesList = _.map(result.entities, function(entity) {
              entity.description = entity.DisplayName;
              entity.id = entity.Name; // eslint-disable-line ID for the entity select directive model
              return entity;
            });
            filterAvailableEntities();
          }
          vm.isLoading = false;
        });
    };

    vm.getUserList = function() {
      vm.isLoading = true;
      bmwCrmService.getUserLists()
        .then(function(listResult) {
          if (listResult.success) {
            vm.allUserList = listResult.lists;
            filterAvailableUserLists();
            vm.setDefultList();
          }
          vm.isLoading = false;
        });
    };

    vm.setDefultList = function() {
      var defaultList = _.filter(vm.allUserList, function(list) {
        return list.IsDefaultList;
      });
      if (defaultList.length > 0) {
        vm.selectedListId = defaultList[0].IdList;
      }
    };

    vm.onEntitySelected = function() {
      if (vm.selectedEntityId) {
        var listName = $translate.instant('bmwcrm_integration.connected.lists.' + vm.selectedEntityId);
        var list = _.find(vm.allUserList, function(userList) {
          return userList.ListName === listName;
        });
        vm.selectedListId = list.IdList;
      }
    };

    vm.showMappingSection = function(fieldsMapped) {
      vm.availablesFields = vm.userFields;
      vm.isLoadingFields = true;

      var list = _.find(vm.allUserList, function(list) {
        return list.IdList === vm.selectedListId;
      });

      var entity = _.find(vm.allEntitiesList, function(entity) {
        return entity.id === vm.selectedEntityId;
      });

      vm.selectedList = list;
      vm.selectedEntity = entity;
      vm.bmwCrmFields = entity.Fields;

      if (fieldsMapped) {
        loadFieldsMapped(fieldsMapped);
        vm.isAnUpdate = true;
      } else {
        loadFieldsPreMapped();
        vm.isAnUpdate = false;
      }
      vm.showMapping = true;
      vm.isLoadingFields = false;
      vm.isLoading = false;
    };

    vm.setAvailablesFields = function(){
      vm.availablesFields = _.filter(vm.userFields, function(field){
        return !_.find(vm.bmwCrmFields, function(selectedField){
          return selectedField.idDopplerField === field.idField
                && selectedField.idDopplerField !== 0;
        });
      });
    };

    vm.goBack = function(){
      resetMapping();
      vm.showMapping = false;
      vm.errorMessage = '';
      vm.selectedEntityId = null;
      vm.selectedListId = null;
      vm.bmwCrmFields = null;
      $scope.$apply();
    };

    vm.getFiledName = function(fieldName) {
      var name = 'bmwcrm_integration.mapping.fields.' + fieldName;
      var value = $translate.instant(name);
      if (value === name) {
        value = fieldName;
      }
      return value;
    };

    vm.mapFields = function() {
      vm.isMapping = true;
      if (vm.isAnUpdate) {
        mapFieldsAndSynchronize();
        vm.isAnUpdate = false;
      } else {
        integrateAndSynchronize();
      }
    };

    vm.deleteList = function(idList) {
      vm.isLoading = true;
      bmwCrmService.deleteList(idList)
        .then(function(listResult) {
          if (listResult.success) {
            vm.getStatus();
            vm.isLoading = false;
            vm.integrationToDelete = null;
            vm.setDefultList();
          }
        })
        .catch(function() {
          showGeneralMappingError();
        });
    };

    vm.synchronizeList = function(idList) {
      bmwCrmService.synchLists(idList)
        .then(function(listResult) {
          if (listResult.success) {
            vm.showMapping = false;
          }
        })
        .catch(function() {
          showGeneralMappingError();
        })
        .finally(function() {
          vm.isMapping = false;
        });
    };

    vm.synchronizeAllLists = function() {
      if (!vm.importingAllLists) {
        vm.importingAllLists = true;
        vm.integratedLists = _.map(vm.integratedLists, function(list) {
          list.SubscribersListStatus = IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
          return list;
        });
        bmwCrmService.manualSync()
          .then(function() {
            vm.checkListState();
          });
        $timeout(function() {
          vm.disableSync = vm.importingAllLists;
        }, 2500);
      }
    };

    vm.synchronizeCampaings = function(){
      if (!vm.importingCampaings){
        vm.importingCampaings = true;
        bmwCrmService.campaignsSync()
          .then(function(result){
            if (result.success){
              vm.campaigns = _.map(result.campaigns, function(campaign){
                campaign.ObjectModel = JSON.parse(campaign.ObjectModel);
                return campaign;
              });
              vm.importingCampaings = false;
            } else {
              vm.importingCampaings = false;
            }
          })
          .catch(function(){
            vm.importingCampaings = false;
          });
      }
    };

    vm.checkListState = function() {
      vm.stateArray = [];
      var allInProcess = _.filter(vm.integratedLists, function(integratedList) {
        return integratedList.SubscribersListStatus === IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
      });
      vm.stateArray = _.map(allInProcess, function(list) {
        return { 'IdSubscribersList': list.IdList, 'CurrentStatus': IMPORTING_STATE_STR.IMPORTING_SUBSCRIBERS };
      });

      if (allInProcess.length) {
        vm.disableSync = true;
        vm.importingAllLists = true;

        if (!vm.timer) { //eslint-disable-line
          (function tick() {
            bmwCrmService.getChangedState(vm.stateArray, vm.idThirdPartyApp).then(function(response) {
              if (response.arePending) {
                vm.timer = $timeout(tick, 1000);
              } else {
                vm.importingAllLists = false;
                vm.disableSync = false;
                vm.timer = undefined;
                vm.disableSync = false;
              }
              if (response.changedSates.length) {
                for (var i = 0; i < response.changedSates.length; i++) {
                  var currentList = response.changedSates[i];
                  updateListData(currentList.IdSubscribersList, response.syncDate);
                }
              }
            });
          })();
        }
      }
    };

    vm.editMap = function(idList, entityId) {
      vm.selectedEntityId = entityId;
      vm.selectedListId = idList;
      vm.isLoading = true;
      vm.errorMessage = '';
      bmwCrmService.getAssociatedFieldMapping(idList)
        .then(function(result) {
          if (result.success && result.fields.length > 0) {
            vm.showMappingSection(result.fields);
          } else {
            showGeneralMappingError();
          }
        })
        .catch(function() {
          showGeneralMappingError();
        });
    };

    function filterAvailableEntities() {
      vm.entitiesList = _.filter(vm.allEntitiesList, function(entity) {
        return (_.find(vm.integratedLists, function(integrated) {
          return entity.id === integrated.ThirdPartyId;
        }) === undefined);
      });
    }

    function filterAvailableUserLists() {
      vm.userList = _.filter(vm.allUserList, function(list) {
        return (_.find(vm.integratedLists, function(integrated) {
          return integrated.IdList === list.IdList;
        }) === undefined);
      });
      vm.integratedListsAvailable = vm.userList ? vm.userList.length : 0;
    }

    function loadFieldsMapped(fieldsMapped) {
      _.map(fieldsMapped, function(fieldMapped) {
        var fieldAlreadyMapped = _.find(vm.bmwCrmFields, function(field) {
          return field.Name === fieldMapped.ThirdPartyColumnName;
        });
        fieldAlreadyMapped.idDopplerField = fieldMapped.IdField;
      });
    }

    function loadFieldsPreMapped() {
      var fieldAlreadyMapped = _.filter(vm.bmwCrmFields, function(field) {
        return field.IdDopplerField;
      });
      _.map(fieldAlreadyMapped, function(fieldMapped) {
        fieldMapped.idDopplerField = fieldMapped.IdDopplerField;
      });
    }

    function showGeneralMappingError(errorMessage) {
      vm.isLoading = false;
      vm.errorMessage = !!errorMessage ? errorMessage : $translate.instant('validation_messages.connection_error'); // eslint-disable-line no-extra-boolean-cast
      $timeout(function() {
        vm.errorMessage = '';
      }, 8000);
    }

    function loadDopplerFields() {
      bmwCrmService.getUserFields()
        .then(function(listResult) {
          if (listResult.length) {
            vm.userFields = _.filter(listResult, function(field){
              return field.idField !== BASIC_FIELD.EMAIL;
            });
            vm.userFields.unshift({
              idField: 0,
              name: $translate.instant('bmwcrm_integration.mapping.skip_column_option'),
              DataType: 0,
              Value: null
            });
            vm.availablesFields = vm.userFields;
            vm.isLoading = false;
          }
        })
        .catch(function() {
          showGeneralMappingError();
        });
    }

    function integrateAndSynchronize() {
      bmwCrmService.integrateList(vm.selectedList, vm.selectedEntity)
        .then(function(listResult) {
          if (listResult.success) {
            vm.selectedListId = listResult.idList;
            mapFieldsAndSynchronize();
          }
        })
        .catch(function() {
          showGeneralMappingError();
          vm.isMapping = false;
        });
    }

    function mapFieldsAndSynchronize() {
      bmwCrmService.associateFieldMapping(vm.selectedListId, _.filter(vm.bmwCrmFields, function(entity) {
        return entity.idDopplerField && entity.idDopplerField !== 0;
      }))
        .then(function(listResult) {
          if (listResult.success) {
            vm.synchronizeList(vm.selectedListId);
            vm.getStatus().then(function() {
              var currentList = _.find(vm.integratedLists, function(integratedList) {
                return integratedList.IdList === vm.selectedListId;
              });
              currentList.SubscribersListStatus === IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
              vm.checkListState();
              vm.selectedListId = null;
              vm.selectedEntityId = null;
              resetMapping();
            });
          }
        })
        .catch(function() {
          showGeneralMappingError();
          vm.isMapping = false;
          vm.getStatus();
        });
    }

    function isAnyImportingList(list) {
      return !!_.find(list, function(integratedList) {
        return integratedList.SubscribersListStatus === IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
      });
    }

    function updateListData(idList, syncDate) {
      bmwCrmService.getListData(idList).then(function(responseListData) {
        _.map(vm.integratedLists, function(integratedList) {
          if (integratedList.IdList === idList) {
            integratedList.SubscribersCount = responseListData.SubscribersCount;
            integratedList.SubscribersListStatus = IMPORTING_STATE.READY;
            integratedList.LastUpdateFormatted = syncDate;
            vm.stateArray = _.reject(vm.stateArray, function(list) {
              return list.IdSubscribersList === integratedList.IdList;
            });
          }
        });
      });
    }

    function resetMapping(){
      _.map(vm.bmwCrmFields, function(field){
        field.idDopplerField = null;
      });
    }

    $scope.$on('ngRepeatFinished', function(){
      vm.setAvailablesFields();
    });
  }
})();

