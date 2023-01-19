(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('zohoCrmIntegrationCtrl', zohoCrmIntegrationCtrl);

  zohoCrmIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'zohoCrmService',
    '$timeout',
    'INTEGRATION_CODES',
    'IMPORTING_STATE',
    'IMPORTING_STATE_STR',
    'BASIC_FIELD',
    'ZOHO_CRM_FIELD_TYPE',
    'FIELD_TYPE'
  ];

  function zohoCrmIntegrationCtrl($scope, $translate, ModalService,
    zohoCrmService, $timeout, INTEGRATION_CODES, IMPORTING_STATE,
    IMPORTING_STATE_STR, BASIC_FIELD, ZOHO_CRM_FIELD_TYPE, FIELD_TYPE) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.connecting = false;
    vm.disconnected = false;
    vm.importingAllLists = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.ZOHOCRM;
    vm.selectedListId = null;
    vm.selectedEntityId = null;
    vm.integratedListsAvailable = 0;
    vm.errorMessage = '';
    vm.integrationToDelete = null;
    vm.isLoadingZohoCrmFields = false;
    vm.showMapping = false;
    vm.isMapping = false;
    vm.newField = null;

    vm.integrationData = {
      'clientName': 'Doppler',
      'clientDomain': null,
      'authRedirectUri': null,
      'clientType': 'WEB Based'
    };

    $translate.onReady().then(function() {
      vm.entityPlaceholder = $translate.instant('zoho_crm_integration.connected.select_entity_placeholder');
      vm.listPlaceholder = $translate.instant('zoho_crm_integration.connected.select_list_placeholder');
      vm.getStatus(true);
      loadDopplerFields();
      loadFieldTypes();
    });

    vm.getStatus = function(doPolling) {
      return zohoCrmService.getIntegrationStatus()
        .then(function(result){
          if (result.success) {
            if (!!result.model) { // eslint-disable-line
              vm.idThirdPartyApp = result.idThirdPartyApp;
              vm.integratedLists = result.integratedLists;
              vm.allUserList === undefined ? vm.getUserList() : filterAvailableUserLists();
              vm.allZohoCrmEntitiesList === undefined ? vm.getZohoCrmEntitiesList() : filterAvailableEntities();
              vm.lastSynchDate = result.model.LastSynchDate;
              vm.daysToDisconnection = result.model.DaysToDisconnection;
              vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
              vm.autoSyncDisabled = result.model.SyncDisabled;
            }
            if (!!vm.integratedLists && vm.integratedLists.length && isAnyImportingList(vm.integratedLists)
              && (doPolling !== undefined || doPolling)){
              vm.checkListState();
            }
            if (!!vm.integratedLists && !vm.integratedLists.length){
              vm.disableSync = true;
            }
          } else {
            vm.connectionError = true;
            vm.errorMsg = $translate.instant('zoho_crm_integration.disconnected.connection_error');
          }
          vm.newField = newFieldDefaults();
          vm.isLoading = false;
          vm.connected = !!result.model;
          vm.integrationData.clientDomain = result.urlBase;
          vm.integrationData.authRedirectUri = result.urlCallback;
          vm.webAppUrl = result.webAppUrl;
        });
    };

    vm.copyToClipboard = function(value) {
      var copyText = document.getElementById(value);
      copyText.select();
      document.execCommand('copy');
    };

    vm.getUserList = function() {
      vm.isLoading = true;
      zohoCrmService.getUserLists()
        .then(function(listResult) {
          if (listResult.success) {
            vm.allUserList = listResult.lists;
            filterAvailableUserLists();
          }
          vm.isLoading = false;
        });
    };

    vm.getZohoCrmEntitiesList = function() {
      vm.isLoading = true;
      vm.importingListDropdown = true;
      zohoCrmService.getZohoCrmEntities()
        .then(function(listResult) {
          vm.importingListDropdown = false;
          if (listResult.success) {
            vm.allZohoCrmEntitiesList = _.map(listResult.modules, function(entity){
              entity.description = entity.ModuleName;
              entity.id = entity.ApiName; // eslint-disable-line ID for the entity select directive model
              return entity;
            });
            filterAvailableEntities();
          }
          vm.isLoading = false;
        });
    };

    vm.connect = function(StartZohoAuthorization, zohoCrm) {
      if (zohoCrm.form.$valid) {
        var windowName = 'popUp';
        var windowSize = 'width=600,height=500,scrollbars=yes';
        var OpenWindow = window.open(StartZohoAuthorization + '?clientId=' + zohoCrm.integrationData.clientId + '&clientSecret=' + zohoCrm.integrationData.clientSecret, windowName, windowSize);
        OpenWindow.focus();      
        var timer = window.setInterval(function() {
          if (OpenWindow.closed) {
            window.clearInterval(timer);
            vm.getStatus();
          }
        }, 500);
      }
    };

    vm.disconnectWarning = function(){
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'ModalYesOrNoZohoCrmCtrl',
        inputs: { data:
          {
            title: $translate.instant('zoho_crm_integration.connected.disconnect_popup.title'),
            description: $translate.instant('zoho_crm_integration.connected.disconnect_popup.description'),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('actions.disconnect'),
            buttonPrimaryClass: 'button--primary button--small'
          } }
      }).then(function(modal) {
        modal.close.then(function(result) {
          if (result) {
            vm.connectionError = false;
            vm.showMapping = false;
            vm.errorMessage = '';
            vm.selectedEntityId = null;
            vm.selectedListId = null;
            vm.connected = false;
            if (vm.integrationData) {
              vm.integrationData.clientId = '';
              vm.integrationData.clientSecret = '';
            }
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
        zohoCrmService.manualSync()
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
            zohoCrmService.getChangedState(vm.stateArray, vm.idThirdPartyApp).then(function(response){
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

    vm.showMappingSection = function(fieldsMapped) {
      vm.isLoadingZohoCrmFields = true;

      var list = _.find(vm.allUserList, function(list){
        return list.IdList === vm.selectedListId;
      });

      var entity = _.find(vm.allZohoCrmEntitiesList, function(entity){
        return entity.id === vm.selectedEntityId;
      });

      vm.selectedList = list;
      vm.selectedEntity = entity;

      zohoCrmService.getZohoCrmFields(vm.selectedEntity.ApiName)
        .then(function(listResult){
          if (listResult.success) {
            vm.zohoCrmFields = listResult.fields;
            if (fieldsMapped) {
              loadFieldsMapped(fieldsMapped);
              vm.isAnUpdate = true;
            } else {
              vm.isAnUpdate = false;
            }
            insertEmailAtTheBeginningIfExists();
            vm.showMapping = true;
            vm.isLoadingZohoCrmFields = false;
            vm.isLoading = false;
          }
        })
        .catch(function() {
          showGeneralMappingError();
        });
    };

    vm.fieldFilter = function(dopplerFieldId, dopplerFieldTypeId){
      return function(field){
        return (field.idField === 0 || field.idField === -1)
          || (field.idField === dopplerFieldId)
          || (field.type == dopplerFieldTypeId && fieldNotUsed(field.idField));
      };
    }

    function fieldNotUsed(idField){
      return !_.find(vm.zohoCrmFields, function(selectedField){
        return selectedField.idDopplerField === idField
      });
    }

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
      zohoCrmService.synchZohoCrmLists(idList)
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
      zohoCrmService.deleteList(idList)
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
      zohoCrmService.getAssociatedFieldMapping(idList)
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

    $scope.getCompatibleFields = function (fieldType) {
      return function (field) {
        return field.type == fieldType || field.idField === 0;
      };
    };

    function loadFieldsMapped(fieldsMapped) {
      _.map(fieldsMapped, function(fieldMapped) {
        var fieldAlreadyMapped = _.find(vm.zohoCrmFields, function(field) {
          return field.ApiName === fieldMapped.ThirdPartyColumnName;
        });
        fieldAlreadyMapped.idDopplerField = fieldMapped.IdField;
      });
    }

    function insertEmailAtTheBeginningIfExists() {
      var zohoCrmFieldsExtracted = _.partition(vm.zohoCrmFields, function(field) {
        return field.DataType === ZOHO_CRM_FIELD_TYPE.EMAIL;
      });

      var zohoCrmEmailFields = zohoCrmFieldsExtracted[0];

      if (zohoCrmEmailFields.length > 0) {
        var zohoCrmFieldsListWithoutEmails = zohoCrmFieldsExtracted[1];
        vm.zohoCrmFields = _.union(zohoCrmEmailFields, zohoCrmFieldsListWithoutEmails);
      }
    }

    function updateListData(idList, syncDate) {
      zohoCrmService.getListData(idList).then(function(responseListData){
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
      zohoCrmService.integrateZohoCrmList(vm.selectedList, vm.selectedEntity)
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
      zohoCrmService.associateZohoCrmFieldMapping(vm.selectedListId, _.filter(vm.zohoCrmFields, function(entity){
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
      var emailFieldSelected = _.find(vm.zohoCrmFields, function(zohoCrmField) {
        return zohoCrmField.idDopplerField === BASIC_FIELD.EMAIL;
      });
      emailFieldSelected ? vm.errorMessage = '' : showGeneralMappingError($translate.instant('zoho_crm_integration.mapping.empty_email_error_message'));
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
      vm.zohoCrmEntitiesList = _.filter(vm.allZohoCrmEntitiesList, function(entity) {
        return (_.find(vm.integratedLists, function(integrated) {
          return entity.id === integrated.ThirdPartyId;
        }) === undefined);
      });
    }

    function loadDopplerFields() {
      zohoCrmService.getFields()
        .then(function(listResult){
          if (listResult.length) {
            vm.userFields = listResult;
            vm.userFields.unshift({
              idField: -1,
              name: $translate.instant('zoho_crm_integration.mapping.add_field_option'),
              DataType: 0,
              Value: null,
              DopplerFieldTypeId: -1
            });
            vm.userFields.unshift({
              idField: 0,
              name: $translate.instant('zoho_crm_integration.mapping.skip_column_option'),
              DataType: 0,
              Value: null,
              DopplerFieldTypeId: -1
            });
            vm.isLoading = false;
          }
        })
        .catch(function() {
          showGeneralMappingError();
        });
    }

    function loadFieldTypes() {
      zohoCrmService.getFieldTypes()
        .then(function (types) {
          vm.fieldTypes = types;
        })
        .catch(function () {
          showGeneralMappingError();
        });
    }

    vm.fieldChange = function (index, value) {
      if (vm.newField.index != index && value == -1) {
        vm.newField = newFieldDefaults();
        vm.newField.index = index;
        vm.newField.dataType = getFieldDataType(index);
        _.forEach(vm.zohoCrmFields, function (field, fIndex) {
          field.idDopplerField = field.idDopplerField == -1 && fIndex != index ? null : field.idDopplerField;
        });
      }
      else if (vm.newField.index == index && value != -1){
        vm.newField = newFieldDefaults();
      }
    }

    function getFieldDataType(index) {
      var fieldTypeId = vm.zohoCrmFields[index].DopplerFieldTypeId;
      var type = _.find(vm.fieldTypes, function (ftype) {
        return ftype.id === fieldTypeId;
      });
      return type ? type.id : FIELD_TYPE.STRING;
    }

    vm.createField = function (index) {
      if (vm.newField.name) {
        zohoCrmService.createField(vm.newField.name, vm.newField.dataType, vm.newField.isPrivate)
        .then(function (res) {
          if (res.success) {
            vm.userFields.push(res.field);
            vm.zohoCrmFields[index].idDopplerField = res.field.idField;
            vm.newField = newFieldDefaults();
          }
          else {
            vm.newField.error = res.errorMessage;
          }
        })
      }
      else {
        vm.newField.error = $translate.instant('zoho_crm_integration.mapping.new_field.required_message');
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

