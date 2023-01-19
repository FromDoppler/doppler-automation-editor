(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('vtexIntegrationCtrl', vtexIntegrationCtrl);

  vtexIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'vtexService',
    '$timeout',
    'INTEGRATION_CODES',
    'IMPORTING_STATE',
    'IMPORTING_STATE_STR',
    'BASIC_FIELD',
    'VTEX_FIELD_TYPE',
    'FIELD_TYPE'
  ];

  function vtexIntegrationCtrl($scope, $translate, ModalService,
    vtexService, $timeout, INTEGRATION_CODES, IMPORTING_STATE,
    IMPORTING_STATE_STR, BASIC_FIELD, VTEX_FIELD_TYPE, FIELD_TYPE) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.connecting = false;
    vm.disconnected = false;
    vm.importingAllLists = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.VTEX;
    vm.selectedListId = null;
    vm.selectedEntityId = null;
    vm.integratedListsAvailable = 0;
    vm.errorMessage = '';
    vm.integrationToDelete = null;
    vm.isLoadingVtexFields = false;
    vm.showMapping = false;
    vm.isMapping = false;
    vm.newField = null;

    $translate.onReady().then(function() {
      vm.entityPlaceholder = $translate.instant('vtex_integration.connected.select_entity_placeholder');
      vm.listPlaceholder = $translate.instant('vtex_integration.connected.select_list_placeholder');
      vm.getStatus(true);
      loadDopplerFields();
      loadFieldTypes();
    });

    vm.getStatus = function(doPolling){
      return vtexService.getIntegrationStatus()
        .then(function(result){
          if (result.success) {
            if (!!result.model) { // eslint-disable-line
              vm.connectedStore = result.model.AccountName;
              vm.integratedLists = result.integratedLists;
              vm.allUserList === undefined ? vm.getUserList() : filterAvailableUserLists();
              vm.allVtexEntitiesList === undefined ? vm.getVtexEntitiesList() : filterAvailableEntities();
              vm.lastSynchDate = result.model.LastSynchDate;
              vm.daysToDisconnection = result.model.DaysToDisconnection;
              vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
              vm.rfm = result.rfm;
              vm.autoSyncDisabled = result.model.SyncDisabled;
            }
            if (vm.integratedLists.length && isAnyImportingList(vm.integratedLists)
              && (doPolling !== undefined || doPolling)){
              vm.checkListState();
            }
            if (!vm.integratedLists.length){
              vm.disableSync = true;
            }
          } else {
            vm.connectionError = true;
            vm.errorMsg = $translate.instant('vtex_integration.disconnected.connection_error');
          }
          vm.newField = newFieldDefaults();
          vm.isLoading = false;
          vm.connected = !!result.model;
          vm.webAppUrl = result.webAppUrl;
        });
    };

    vm.getUserList = function(){
      vm.isLoading = true;
      vtexService.getUserLists()
        .then(function(listResult){
          if (listResult.success) {
            vm.allUserList = listResult.lists;
            filterAvailableUserLists();
          }
          vm.isLoading = false;
        });
    };

    vm.getVtexEntitiesList = function(){
      vm.isLoading = true;
      vtexService.getVtexEntities()
        .then(function(listResult){
          if (listResult.success) {
            vm.allVtexEntitiesList = _.map(listResult.entities, function(entity){
              entity.description = entity.Name + ' (' + entity.StoreName + ')';
              entity.id = entity.Acronym + entity.StoreName; // eslint-disable-line ID for the entity select directive model
              return entity;
            });
            filterAvailableEntities();
          }
          vm.isLoading = false;
        });
    };

    vm.connect = function(){
      vm.connecting = true;
      vtexService.connect(vm.integrationData).then(function(result){
        if (result.success){
          vm.connectionError = false;
          vm.connected = true;
          vm.lastSyncDate = ' - ';
          vm.connectedStore = vm.integrationData.store;
          vm.getUserList();
          vm.getVtexEntitiesList();
          vm.disableSync = true;
        } else {
          vm.connectionError = true;
          vm.errorMsg = result.errorMsg.length ? result.errorMsg : $translate.instant('vtex_integration.disconnected.connection_error');
        }
        vm.connecting = false;
      });
    };

    vm.disconnectWarning = function(){
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'ModalYesOrNoVtexCtrl',
        inputs: { data:
          {
            title: $translate.instant('vtex_integration.connected.disconnect_popup.title'),
            description: $translate.instant('vtex_integration.connected.disconnect_popup.description'),
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
              vm.integrationData.token = '';
            }
            vm.selectedListId = null;
            vm.selectedEntityId = null;
            vm.connectedStore = '';
            vm.integratedLists = null;
            vm.disconnected = true;
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
        vtexService.manualSync()
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
            vtexService.getChangedState(vm.stateArray, vm.idThirdPartyApp).then(function(response){
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
      vm.isLoadingVtexFields = true;

      var list = _.find(vm.allUserList, function(list){
        return list.IdList === vm.selectedListId;
      });

      var entity = _.find(vm.allVtexEntitiesList, function(entity){
        return entity.id === vm.selectedEntityId;
      });

      vm.selectedList = list;
      vm.selectedEntity = entity;

      vtexService.getVtexFields(vm.selectedEntity.StoreName, vm.selectedEntity.Acronym)
        .then(function(listResult){
          if (listResult.success) {
            vm.vtexFields = listResult.fields;
            if (fieldsMapped) {
              loadFieldsMapped(fieldsMapped);
              vm.isAnUpdate = true;
            } else {
              vm.isAnUpdate = false;
            }
            insertEmailAtTheBeginningIfExists();
            vm.showMapping = true;
            vm.isLoadingVtexFields = false;
            vm.isLoading = false;
          }
        })
        .catch(function() {
          showGeneralMappingError();
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
      vtexService.synchVtexLists(idList)
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
      vtexService.deleteList(idList)
        .then(function(listResult){
          if (listResult.success) {
            vm.getStatus();
            vm.isLoading = false;
            vm.integrationToDelete = null;
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
      vtexService.getAssociatedFieldMapping(idList)
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
      vtexService.updateRfmSettings(vm.idThirdPartyApp, vm.rfm)
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
        var fieldAlreadyMapped = _.find(vm.vtexFields, function(field) {
          return field.Name === fieldMapped.ThirdPartyColumnName;
        });
        fieldAlreadyMapped.idDopplerField = fieldMapped.IdField;
      });
    }

    function insertEmailAtTheBeginningIfExists() {
      var vtexFieldsExtracted = _.partition(vm.vtexFields, function(field) {
        return field.DopplerFieldTypeId === FieldType.EMAIL;
      });

      var vtexEmailFields = vtexFieldsExtracted[0];

      if (vtexEmailFields.length > 0) {
        var vtexFieldsListWithoutEmails = vtexFieldsExtracted[1];
        vm.vtexFields = _.union(vtexEmailFields, vtexFieldsListWithoutEmails);
      }
    }

    function updateListData(idList, syncDate) {
      vtexService.getListData(idList).then(function(responseListData){
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
      vtexService.integrateVtexList(vm.selectedList, vm.selectedEntity)
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
      vtexService.associateVtexFieldMapping(vm.selectedListId, _.filter(vm.vtexFields, function(entity){
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
              vm.selectedEntityId = null;
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
      var emailFieldSelected = _.find(vm.vtexFields, function(vtexField){
        return vtexField.idDopplerField === BASIC_FIELD.EMAIL;
      });

      emailFieldSelected ? vm.errorMessage = '' : showGeneralMappingError($translate.instant('vtex_integration.mapping.empty_email_error_message'));
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
      vm.vtexEntitiesList = _.filter(vm.allVtexEntitiesList, function(entity) {
        return (_.find(vm.integratedLists, function(integrated) {
          return entity.id === integrated.ThirdPartyId;
        }) === undefined);
      });
    }

    vm.getFiledName = function (name) {
      return name.length > 30 ? name.substring(0, 27) + '...' : name
    }

    function loadDopplerFields() {
      vtexService.getFields()
        .then(function(listResult){
          if (listResult.length) {
            vm.userFields = listResult;
            vm.userFields.unshift({
              idField: -1,
              name: $translate.instant('vtex_integration.mapping.add_field_option'),
              DataType: 0,
              Value: null,
              DopplerFieldTypeId: -1
            });
            vm.userFields.unshift({
              idField: 0,
              name: $translate.instant('vtex_integration.mapping.skip_column_option'),
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

    function loadFieldTypes() {
      vtexService.getFieldTypes()
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
      return !_.find(vm.vtexFields, function (selectedField) {
        return selectedField.idDopplerField === idField
      });
    }

    vm.fieldChange = function (index, value) {
      if (vm.newField.index != index && value == -1) {
        vm.newField = newFieldDefaults();
        vm.newField.index = index;
        vm.newField.dataType = getFieldDataType(index);
        _.forEach(vm.vtexFields, function (field, fIndex) {
          field.idDopplerField = field.idDopplerField == -1 && fIndex != index ? null : field.idDopplerField;
        });
      }
      else if (vm.newField.index == index && value != -1) {
        vm.newField = newFieldDefaults();
      }
    }

    function getFieldDataType(index) {
      var fieldTypeId = vm.vtexFields[index].DopplerFieldTypeId;
      var type = _.find(vm.fieldTypes, function (ftype) {
        return ftype.id === fieldTypeId;
      });
      return type ? type.id : FIELD_TYPE.STRING;
    }

    vm.createField = function (index) {
      if (vm.newField.name) {
        vtexService.createField(vm.newField.name, vm.newField.dataType, vm.newField.isPrivate)
          .then(function (res) {
            if (res.success) {
              vm.userFields.push(res.field);
              vm.vtexFields[index].idDopplerField = res.field.idField;
              vm.newField = newFieldDefaults();
            }
            else {
              vm.newField.error = res.errorMessage;
            }
          })
      }
      else {
        vm.newField.error = $translate.instant('vtex_integration.mapping.new_field.required_message');
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

