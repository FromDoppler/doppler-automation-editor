(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('magentoIntegrationCtrl', magentoIntegrationCtrl);

  magentoIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'magentoService',
    '$timeout',
    'INTEGRATION_CODES',
    'IMPORTING_STATE',
    'IMPORTING_STATE_STR',
    'BASIC_FIELD',
    'INTEGRATION_SOURCE_TYPE'
  ];

  function magentoIntegrationCtrl($scope, $translate, ModalService,
    magentoService, $timeout, INTEGRATION_CODES, IMPORTING_STATE,
    IMPORTING_STATE_STR, BASIC_FIELD, INTEGRATION_SOURCE_TYPE) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.connecting = false;
    vm.disconnected = false;
    vm.importingAllLists = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.MAGENTO;
    vm.selectedEntityId = null;
    vm.integratedListsAvailable = 0;
    vm.selectedListId = null;
    vm.errorMessage = '';
    vm.integrationToDelete = null;
    vm.isLoadingMagentoFields = false;
    vm.showMapping = false;
    vm.isMapping = false;
    vm.sourceType = INTEGRATION_SOURCE_TYPE.MVC;
    vm.mvcSourceType = INTEGRATION_SOURCE_TYPE.MVC;

    $translate.onReady().then(function() {
      vm.entityPlaceholder = $translate.instant('magento_integration.connected.select_entity_placeholder');
      vm.listPlaceholder = $translate.instant('magento_integration.connected.select_list_placeholder');
      vm.getStatus(true);
      loadDopplerFields();
    });

    vm.getStatus = function(doPolling){
      return magentoService.getIntegrationStatus()
        .then(function(result){
          if (result.success) {
            if (!!result.model) { // eslint-disable-line
              vm.connectedStore = result.model.AccountName;
              vm.integratedLists = result.integratedLists;
              vm.allUserList === undefined ? vm.getUserList() : filterAvailableUserLists();
              vm.allMagentoEntitiesList === undefined ? vm.getMagentoEntitiesList() : filterAvailableEntities();
              vm.lastSyncDate = result.model.LastSynchDate;
              vm.daysToDisconnection = result.model.DaysToDisconnection;
              vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
              vm.sourceType = result.model.SourceType;
              vm.rfm = result.rfm;
            }
            if (vm.integratedLists.length && isAnyImportingList(vm.integratedLists)
              && (doPolling !== undefined || doPolling)){
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
            vm.errorMsg = $translate.instant('magento_integration.disconnected.connection_error');
          }
          vm.isLoading = false;
          vm.connected = !!result.model;
        });
    };

    vm.getUserList = function(){
      vm.isLoading = true;
      magentoService.getUserLists()
        .then(function(listResult){
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

    vm.getMagentoEntitiesList = function() {
      vm.isLoading = true;
      vm.importingListDropdown = true;
      magentoService.getMagentoEntities()
        .then(function(listResult) {
          vm.importingListDropdown = false;
          if (listResult.success) {
            vm.allMagentoEntitiesList = _.map(listResult.entities, function(entity) {
              entity.description = entity.DisplayName;
              entity.id = entity.Name; // eslint-disable-line ID for the entity select directive model
              return entity;
            });
            filterAvailableEntities();
          }
          vm.isLoading = false;
        });
    };

    vm.connect = function(){
      vm.connecting = true;
      magentoService.connect(vm.integrationData).then(function(result){
        if (result.success){
          vm.connectionError = false;
          vm.connected = true;
          vm.lastSyncDate = ' - ';
          vm.connectedStore = vm.integrationData.store;
          vm.getUserList();
          vm.getMagentoEntitiesList();
          vm.disableSync = true;
        } else {
          vm.connectionError = true;
          vm.errorMsg = result.errorMsg.length ? result.errorMsg : $translate.instant('magento_integration.disconnected.connection_error');
        }
        vm.connecting = false;
      });
    };

    vm.disconnectWarning = function(){
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'modalYesOrNoMagentoCtrl',
        inputs: { data:
          {
            title: $translate.instant('magento_integration.connected.disconnect_popup.title'),
            description: $translate.instant('magento_integration.connected.disconnect_popup.description'),
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
              vm.integrationData.store = '';
              vm.integrationData.appKey = '';
            }
            vm.selectedEntityId = null;
            vm.selectedListId = null;
            vm.connectedStore = '';
            vm.integratedLists = null;
            vm.disconnected = true;
            vm.sourceType = INTEGRATION_SOURCE_TYPE.MVC;
          }
        });
      });
    };

    vm.synchronizeAllLists = function(){
      if (!vm.importingAllLists) {
        vm.importingAllLists = true;
        vm.integratedLists = _.map(vm.integratedLists, function(list){
          list.SubscribersListStatus = IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
          return list;
        });
        magentoService.manualSync()
          .then(function(){
            vm.checkListState();
          });
        $timeout(function(){
          vm.disableSync = vm.importingAllLists;
        }, 2500);
      }
    };

    vm.checkListState = function() {
      vm.stateArray = [];
      // only check lists in process
      var allInProcess = _.filter(vm.integratedLists, function(integratedList){
        return integratedList.SubscribersListStatus === IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
      });
      vm.stateArray = _.map(allInProcess, function(list){
        return { 'IdSubscribersList': list.IdList, 'CurrentStatus': IMPORTING_STATE_STR.IMPORTING_SUBSCRIBERS };
      });

      if (allInProcess.length) {
        vm.disableSync = true;
        vm.importingAllLists = true;

        if (!vm.timer){ //eslint-disable-line
          (function tick() {
            magentoService.getChangedState(vm.stateArray, vm.idThirdPartyApp).then(function(response){
              if (response.arePending) {
                vm.timer = $timeout(tick, 1000);
              } else {
                vm.importingAllLists = false;
                vm.disableSync = false;
                vm.timer = undefined;
                vm.disableSync = false;
              }
              if (response.changedSates.length){
                for (var i = 0; i < response.changedSates.length; i++){
                  var currentList = response.changedSates[i];
                  updateListData(currentList.IdSubscribersList, response.syncDate);
                }
              }
            });
          })();
        }
      }
    };

    vm.showMappingSection = function(fieldsMapped){
      vm.availablesFields = vm.userFields;
      vm.isLoadingMagentoFields = true;

      var list = _.find(vm.allUserList, function(list){
        return list.IdList === vm.selectedListId;
      });

      var entity = _.find(vm.allMagentoEntitiesList, function(entity) {
        return entity.id === vm.selectedEntityId;
      });

      vm.selectedList = list;
      vm.selectedEntity = entity;

      magentoService.getMagentoFields(vm.selectedEntity.Name)
        .then(function(listResult){
          if (listResult.success) {
            vm.magentoFields = listResult.fields;
            if (fieldsMapped) {
              loadFieldsMapped(fieldsMapped);
              vm.isAnUpdate = true;
            } else {
              vm.isAnUpdate = false;
            }
            insertEmailAtTheBeginningIfExists();
            vm.showMapping = true;
            vm.isLoadingMagentoFields = false;
            vm.isLoading = false;
          }
        })
        .catch(function() {
          showGeneralMappingError();
        });
    };

    vm.setAvailablesFields = function(){
      vm.availablesFields = _.filter(vm.userFields, function(field){
        return !_.find(vm.magentoFields, function(selectedField){
          return selectedField.idDopplerField === field.idField && selectedField.idDopplerField !== 0;
        });
      });
    };

    vm.mapFields = function(){
      if (validateEmptyEmail()){
        if (vm.isAnUpdate) {
          mapFieldsAndSynchronize();
          vm.isAnUpdate = false;
        } else {
          integrateAndSynchronize();
        }
      }
    };

    vm.synchronizeList = function(idList){
      magentoService.synchMagentoLists(idList)
        .then(function(listResult){
          if (listResult.success) {
            vm.showMapping = false;
          }
        })
        .catch(function() {
          showGeneralMappingError();
        })
        .finally(function(){
          vm.isMapping = false;
        });
    };

    vm.deleteList = function(idList) {
      vm.isLoading = true;
      magentoService.deleteList(idList)
        .then(function(listResult){
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

    vm.goBack = function() {
      vm.showMapping = false;
      vm.errorMessage = '';
      vm.selectedEntityId = null;
      vm.selectedListId = null;
    };

    vm.editMap = function(idList, entityId) {
      vm.selectedEntityId = entityId;
      vm.selectedListId = idList;
      vm.isLoading = true;
      vm.errorMessage = '';
      magentoService.getAssociatedFieldMapping(idList)
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

    vm.updateRfmSettings = function () {
      vm.rfm.updating = true;
      magentoService.updateRfmSettings(vm.idThirdPartyApp, vm.rfm)
        .then(function (result) {
          vm.rfm = result.rfm;
          if (result.success) {
            vm.rfm.success = result.success;
            $timeout(function () {
              vm.rfm.success = false;
            }, 3000);
          } else {
            vm.rfm.error = result.errorMsg;
            $timeout(function () {
              vm.rfm.error = '';
            }, 8000);
          }
          vm.rfm.updating = false;
        })
        .catch(function () {
          vm.rfm.error = $translate.instant('validation_messages.connection_error');
          $timeout(function () {
            vm.rfm.error = '';
          }, 8000);
          vm.rfm.updating = false;
        });
    }

    function loadFieldsMapped(fieldsMapped) {
      _.map(fieldsMapped, function(fieldMapped) {
        var fieldAlreadyMapped = _.find(vm.magentoFields, function(field) {
          return field.Name === fieldMapped.ThirdPartyColumnName;
        });
        fieldAlreadyMapped.idDopplerField = fieldMapped.IdField;
      });
    }

    function insertEmailAtTheBeginningIfExists() {
      var magentoFieldsExtracted = _.partition(vm.magentoFields, function(field) {
        return field.Name === 'email';
      });

      var vtexEmailFields = magentoFieldsExtracted[0];

      if (vtexEmailFields.length > 0) {
        var magentoFieldsListWithoutEmails = magentoFieldsExtracted[1];
        vm.magentoFields = _.union(vtexEmailFields, magentoFieldsListWithoutEmails);
      }
    }

    function updateListData(idList, syncDate) {
      magentoService.getListData(idList).then(function(responseListData){
        _.map(vm.integratedLists, function(integratedList){
          if (integratedList.IdList === idList) {
            integratedList.SubscribersCount = responseListData.SubscribersCount;
            integratedList.SubscribersListStatus = IMPORTING_STATE.READY;
            integratedList.LastUpdateFormatted = syncDate;
            vm.stateArray = _.reject(vm.stateArray, function(list){
              return list.IdSubscribersList === integratedList.IdList;
            });
          }
        });
      });
    }

    function isAnyImportingList(list) {
      return !!_.find(list, function(integratedList){
        return integratedList.SubscribersListStatus === IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
      });
    }

    function integrateAndSynchronize() {
      vm.isMapping = true;
      magentoService.integrateMagentoList(vm.selectedList, vm.selectedEntity)
        .then(function(listResult){
          if (listResult.success) {
            mapFieldsAndSynchronize();
          }
        })
        .catch(function(){
          showGeneralMappingError();
          vm.isMapping = false;
        });
    }

    function mapFieldsAndSynchronize() {
      magentoService.associateMagentoFieldMapping(vm.selectedListId, _.filter(vm.magentoFields, function(entity){
        return entity.idDopplerField && entity.idDopplerField !== 0;
      }))
        .then(function(listResult){
          if (listResult.success) {
            vm.synchronizeList(vm.selectedListId);
            vm.getStatus().then(function(){
              var currentList = _.find(vm.integratedLists, function(integratedList){
                return integratedList.IdList === vm.selectedListId;
              });
              currentList.SubscribersListStatus === IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
              vm.checkListState();
              vm.selectedListId = null;
            });
          }
        })
        .catch(function() {
          showGeneralMappingError();
          vm.isMapping = false;
          vm.getStatus();
        });
    }

    function showGeneralMappingError(errorMessage) {
      vm.isLoading = false;
      vm.errorMessage = !!errorMessage ? errorMessage : $translate.instant('validation_messages.connection_error'); // eslint-disable-line no-extra-boolean-cast
      $timeout(function(){
        vm.errorMessage = '';
      }, 8000);
    }

    function validateEmptyEmail() {
      var emailFieldSelected = _.find(vm.magentoFields, function(magentoField){
        return magentoField.idDopplerField === BASIC_FIELD.EMAIL;
      });

      emailFieldSelected ? vm.errorMessage = '' : showGeneralMappingError($translate.instant('magento_integration.mapping.empty_email_error_message'));
      return !!emailFieldSelected;
    }

    function filterAvailableUserLists() {
      vm.userList = _.filter(vm.allUserList, function(list) {
        return (_.find(vm.integratedLists, function(integrated) {
          return integrated.IdList === list.IdList;
        }) === undefined);
      });
      vm.integratedListsAvailable = vm.userList ? vm.userList.length : 0;
    }

    function filterAvailableEntities() {
      vm.magentoEntitiesList = _.filter(vm.allMagentoEntitiesList, function(entity) {
        return (_.find(vm.integratedLists, function(integrated) {
          return entity.id === integrated.ThirdPartyId;
        }) === undefined);
      });
    }

    function loadDopplerFields() {
      magentoService.getFields()
        .then(function(listResult){
          if (listResult.length) {
            vm.userFields = listResult;
            vm.userFields.unshift({
              idField: 0,
              name: $translate.instant('magento_integration.mapping.skip_column_option'),
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

    $scope.$on('ngRepeatFinished', function() {
      vm.setAvailablesFields();
    });

  }
})();

