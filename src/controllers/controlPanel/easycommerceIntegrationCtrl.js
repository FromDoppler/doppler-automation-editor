(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('easycommerceIntegrationCtrl', easycommerceIntegrationCtrl);
                 
  easycommerceIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'easycommerceService',
    '$timeout',
    'INTEGRATION_CODES',
    'IMPORTING_STATE',
    'IMPORTING_STATE_STR',
    'BASIC_FIELD',
    'INTEGRATION_SOURCE_TYPE',
    'FIELD_TYPE'
  ];

  function easycommerceIntegrationCtrl($scope, $translate, ModalService,
    easycommerceService, $timeout, INTEGRATION_CODES, IMPORTING_STATE,
    IMPORTING_STATE_STR, BASIC_FIELD, INTEGRATION_SOURCE_TYPE, FIELD_TYPE) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.connecting = false;
    vm.disconnected = false;
    vm.importingAllLists = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.EASYCOMMERCE;
    vm.selectedEntityId = null;
    vm.integratedListsAvailable = 0;
    vm.integratedLists = [];
    vm.selectedListId = null;
    vm.errorMessage = ''; 
    vm.integrationToDelete = null;
    vm.isLoadingFields = false;
    vm.showMapping = false;
    vm.isMapping = false;
    vm.newField = null;
    vm.sourceType = INTEGRATION_SOURCE_TYPE.MVC;
    vm.mvcSourceType = INTEGRATION_SOURCE_TYPE.MVC;

    $translate.onReady().then(function() {
      vm.entityPlaceholder = $translate.instant('easycommerce_integration.connected.select_entity_placeholder');
      vm.listPlaceholder = $translate.instant('easycommerce_integration.connected.select_list_placeholder');
      vm.getStatus(true);
      loadDopplerFields();
      loadFieldTypes();
    });

    vm.getStatus = function(doPolling){
      return easycommerceService.getIntegrationStatus()
        .then(function(result){
          if (result.success) {
            if (!!result.model) { // eslint-disable-line
              vm.connectedStore = result.model.AccountName;
              vm.integratedLists = result.integratedLists;
              vm.allUserList === undefined ? vm.getUserList() : filterAvailableUserLists();
              vm.allEasycommerceEntitiesList === undefined ? vm.getEasycommerceEntitiesList() : filterAvailableEntities();
              vm.lastSyncDate = result.model.LastSynchDate;
              vm.sourceType = result.model.SourceType;
              vm.daysToDisconnection = result.model.DaysToDisconnection;
              vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
              vm.autoSyncDisabled = result.model.SyncDisabled;
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
            vm.errorMsg = $translate.instant('easycommerce_integration.disconnected.connection_error');
          }
          vm.newField = newFieldDefaults();
          vm.isLoading = false;
          vm.connected = !!result.model;
          vm.webAppUrl = result.webAppUrl;
        });
    };

    vm.getUserList = function(){
      vm.isLoading = true;
      easycommerceService.getUserLists()
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

    vm.getEasycommerceEntitiesList = function() {
      vm.isLoading = true;
      vm.importingListDropdown = true;
      easycommerceService.getEasycommerceEntities()
        .then(function(listResult) {
          vm.importingListDropdown = false;
          if (listResult.success) {
            vm.allEasycommerceEntitiesList = _.map(listResult.entities, function(entity) {
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
      easycommerceService.connect(vm.integrationData).then(function(result){
        if (result.success){
          vm.connectionError = false;
          vm.connected = true;
          vm.lastSyncDate = ' - ';
          vm.connectedStore = vm.integrationData.store;
          vm.getUserList();
          vm.getEasycommerceEntitiesList();
          vm.disableSync = true;
        } else {
          vm.connectionError = true;
          vm.errorMsg = result.errorMsg.length ? result.errorMsg : $translate.instant('easycommerce_integration.disconnected.connection_error');
        }
        vm.connecting = false;
      });
    };

    vm.disconnectWarning = function(){
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'modalYesOrNoEasycommerceCtrl',
        inputs: { data:
          {
            title: $translate.instant('easycommerce_integration.connected.disconnect_popup.title'),
            description: $translate.instant('easycommerce_integration.connected.disconnect_popup.description'),
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
        easycommerceService.manualSync()
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
            easycommerceService.getChangedState(vm.stateArray, vm.idThirdPartyApp).then(function(response){
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
      vm.isLoadingFields = true;

      var list = _.find(vm.allUserList, function(list){
        return list.IdList === vm.selectedListId;
      });

      var entity = _.find(vm.allEasycommerceEntitiesList, function(entity) {
        return entity.id === vm.selectedEntityId;
      });

      vm.selectedList = list;
      vm.selectedEntity = entity;
      vm.easycommerceFields = entity.Fields;

      if (fieldsMapped) {
        loadFieldsMapped(fieldsMapped);
        vm.isAnUpdate = true;
      } else {
        loadFieldsPreMapped();
        vm.isAnUpdate = false;
      }
      insertEmailAtTheBeginningIfExists();
      vm.showMapping = true;
      vm.isLoadingFields = false;
      vm.isLoading = false;
    };

    vm.mapFields = function(){
      vm.isMapping = true;
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
      easycommerceService.synchEasycommerceLists(idList)
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
      easycommerceService.deleteList(idList)
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

    vm.goBack = function(){
      resetMapping();
      vm.showMapping = false;
      vm.errorMessage = '';
      vm.selectedEntityId = null;
      vm.selectedListId = null;
      vm.easycommerceFields = null;
      $scope.$apply();
    };

    vm.editMap = function(idList, entityId) {
      vm.selectedEntityId = entityId;
      vm.selectedListId = idList;
      vm.isLoading = true;
      vm.errorMessage = '';
      easycommerceService.getAssociatedFieldMapping(idList)
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

    vm.getFiledName = function(fieldName){
      var name = 'easycommerce_integration.mapping.fields.' + fieldName;
      var value = $translate.instant(name);
      if (value === name) {
        value = fieldName;
      }
      return value;
    };

    vm.onEntitySelected = function(){
      if (vm.selectedEntityId) {
        var listName = $translate.instant('easycommerce_integration.connected.lists.' + vm.selectedEntityId);
        var list = _.find(vm.allUserList, function(userList){
          return userList.ListName === listName;
        });
        vm.selectedListId = list.IdList;
      }
    };

    function loadFieldsMapped(fieldsMapped) {
      _.map(fieldsMapped, function(fieldMapped) {
        var fieldAlreadyMapped = _.find(vm.easycommerceFields, function(field) {
          return field.Name === fieldMapped.ThirdPartyColumnName;
        });
        fieldAlreadyMapped.idDopplerField = fieldMapped.IdField;
      });
    }

    function loadFieldsPreMapped() {
      var fieldAlreadyMapped = _.filter(vm.easycommerceFields, function(field) {
        return field.IdDopplerField;
      });
      _.map(fieldAlreadyMapped, function(fieldMapped) {
        fieldMapped.idDopplerField = fieldMapped.IdDopplerField;
      });
    }

    function insertEmailAtTheBeginningIfExists() {
      var easycommerceFieldsExtracted = _.partition(vm.easycommerceFields, function(field) {
        return field.Name === 'email';
      });

      var vtexEmailFields = easycommerceFieldsExtracted[0];

      if (vtexEmailFields.length > 0) {
        var easycommerceFieldsListWithoutEmails = easycommerceFieldsExtracted[1];
        vm.easycommerceFields = _.union(vtexEmailFields, easycommerceFieldsListWithoutEmails);
      }
    }

    function updateListData(idList, syncDate) {
      easycommerceService.getListData(idList).then(function(responseListData){
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
      easycommerceService.integrateEasycommerceList(vm.selectedList, vm.selectedEntity)
        .then(function(listResult){
          if (listResult.success) {
            vm.selectedListId = listResult.idList;
            mapFieldsAndSynchronize();
          }
        })
        .catch(function(){
          showGeneralMappingError();
          vm.isMapping = false;
        });
    }

    function mapFieldsAndSynchronize() {
      easycommerceService.associateEasycommerceFieldMapping(vm.selectedListId, _.filter(vm.easycommerceFields, function(entity){
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

    function showGeneralMappingError(errorMessage) {
      vm.isLoading = false;
      vm.errorMessage = !!errorMessage ? errorMessage : $translate.instant('validation_messages.connection_error'); // eslint-disable-line no-extra-boolean-cast
      $timeout(function(){
        vm.errorMessage = '';
      }, 8000);
    }

    function validateEmptyEmail() {
      var emailFieldSelected = _.find(vm.easycommerceFields, function(easycommerceField){
        return easycommerceField.idDopplerField === BASIC_FIELD.EMAIL;
      });

      emailFieldSelected ? vm.errorMessage = '' : showGeneralMappingError($translate.instant('easycommerce_integration.mapping.empty_email_error_message'));
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
      vm.easycommerceEntitiesList = _.filter(vm.allEasycommerceEntitiesList, function(entity) {
        return (_.find(vm.integratedLists, function(integrated) {
          return entity.id === integrated.ThirdPartyId;
        }) === undefined);
      });
    }

    function loadDopplerFields() {
      easycommerceService.getFields()
        .then(function(listResult){
          if (listResult.length) {
            vm.userFields = listResult;
            vm.userFields.unshift({
              idField: -1,
              name: $translate.instant('easycommerce_integration.mapping.add_field_option'),
              DataType: 0,
              Value: null,
              DopplerFieldTypeId: -1
            });
            vm.userFields.unshift({
              idField: 0,
              name: $translate.instant('easycommerce_integration.mapping.skip_column_option'),
              DataType: 0,
              Value: null
            });
            vm.isLoading = false;
          }
        })
        .catch(function() {
          showGeneralMappingError();
        });
    }

    function resetMapping(){
      _.map(vm.easycommerceFields, function(field){
        field.idDopplerField = null;
      });
    }

    function loadFieldTypes() {
      easycommerceService.getFieldTypes()
        .then(function (types) {
          vm.fieldTypes = types;
        })
        .catch(function () {
          showGeneralMappingError();
        });
    }

    vm.fieldFilter = function (dopplerFieldId, dopplerFieldTypeId) {
      return function (field) {
        return (field.idField === 0 || field.idField === -1)
          || (field.idField === dopplerFieldId)
          || (field.type == dopplerFieldTypeId && fieldNotUsed(field.idField));
      };
    }

    function fieldNotUsed(idField) {
      return !_.find(vm.easycommerceFields, function (selectedField) {
        return selectedField.idDopplerField === idField
      });
    }

    vm.fieldChange = function (index, value) {
      if (vm.newField.index != index && value == -1) {
        vm.newField = newFieldDefaults();
        vm.newField.index = index;
        vm.newField.dataType = getFieldDataType(index);
        _.forEach(vm.easycommerceFields, function (field, fIndex) {
          field.idDopplerField = field.idDopplerField == -1 && fIndex != index ? null : field.idDopplerField;
        });
      }
      else if (vm.newField.index == index && value != -1) {
        vm.newField = newFieldDefaults();
      }
    }

    function getFieldDataType(index) {
      var fieldTypeId = vm.easycommerceFields[index].DopplerFieldTypeId;
      var type = _.find(vm.fieldTypes, function (ftype) {
        return ftype.id === fieldTypeId;
      });
      return type ? type.id : FIELD_TYPE.STRING;
    }

    vm.createField = function (index) {
      if (vm.newField.name) {
        easycommerceService.createField(vm.newField.name, vm.newField.dataType, vm.newField.isPrivate)
          .then(function (res) {
            if (res.success) {
              vm.userFields.push(res.field);
              vm.easycommerceFields[index].idDopplerField = res.field.idField;
              vm.newField = newFieldDefaults();
            }
            else {
              vm.newField.error = res.errorMessage;
            }
          })
      }
      else {
        vm.newField.error = $translate.instant('easycommerce_integration.mapping.new_field.required_message');
      }
    }

    function newFieldDefaults() {
      return {
        index: null,
        name: '',
        dataType: FIELD_TYPE.STRING,
        isPrivate: "true",
        error: null
      };
    }
  }
})();

