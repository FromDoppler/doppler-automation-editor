(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('tiendanubeIntegrationCtrl', tiendanubeIntegrationCtrl);

  tiendanubeIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'tiendanubeService',
    '$timeout',
    'INTEGRATION_CODES',
    'IMPORTING_STATE',
    'IMPORTING_STATE_STR',
    'BASIC_FIELD',
    'TIENDANUBE_FIELD_TYPE',
    'FIELD_TYPE'
  ];

  function tiendanubeIntegrationCtrl($scope, $translate, ModalService,
    tiendanubeService, $timeout, INTEGRATION_CODES, IMPORTING_STATE,
    IMPORTING_STATE_STR, BASIC_FIELD, TIENDANUBE_FIELD_TYPE, FIELD_TYPE) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.connecting = false;
    vm.disconnected = false;
    vm.importingAllLists = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.TIENDANUBE;
    vm.selectedListId = null;
    vm.selectedEntityId = null;
    vm.integratedListsAvailable = 0;
    vm.errorMessage = '';
    vm.integrationToDelete = null;
    vm.isLoadingTiendanubeFields = false;
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
      vm.entityPlaceholder = $translate.instant('tiendanube_integration.connected.select_entity_placeholder');
      vm.listPlaceholder = $translate.instant('tiendanube_integration.connected.select_list_placeholder');
      vm.getStatus(true);
      loadDopplerFields();
      loadFieldTypes();
    });

    vm.getStatus = function(doPolling) {
      return tiendanubeService.getIntegrationStatus()
        .then(function(result){
          if (result.success) {
            if (!!result.model) { // eslint-disable-line
              vm.connectedStore = result.model.AccountName;
              vm.lastSynchDate = result.model.LastSynchDate;
              vm.daysToDisconnection = result.model.DaysToDisconnection;
              vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
              vm.idThirdPartyApp = result.idThirdPartyApp;
              vm.integratedLists = result.integratedLists;
              vm.allUserList === undefined ? vm.getUserList() : filterAvailableUserLists();
              vm.allTiendanubeEntitiesList === undefined ? vm.getTiendanubeEntitiesList() : filterAvailableEntities();
              vm.rfm = result.rfm;
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
            vm.errorMsg = $translate.instant('tiendanube_integration.disconnected.connection_error');
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
      tiendanubeService.getUserLists()
        .then(function(listResult) {
          if (listResult.success) {
            vm.allUserList = listResult.lists;
            filterAvailableUserLists();
          }
          vm.isLoading = false;
        });
    };

    vm.getTiendanubeEntitiesList = function() {
      vm.isLoading = true;
      vm.importingListDropdown = true;
      tiendanubeService.getTiendanubeEntities()
        .then(function(listResult) {
          vm.importingListDropdown = false;
          if (listResult.success) {
            vm.allTiendanubeEntitiesList = _.map(listResult.modules, function(entity){
              entity.description = entity.ModuleName;
              entity.id = entity.ApiName; // eslint-disable-line ID for the entity select directive model
              return entity;
            });
            filterAvailableEntities();
          }
          vm.isLoading = false;
        });
    };

    vm.connect = function(action, tiendanube) {
      if (tiendanube.form.$valid) {
        var windowName = 'popUp';
        var windowSize = 'width=600,height=500,scrollbars=yes';
        var OpenWindow = window.open(action, windowName, windowSize);
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
        controller: 'ModalYesOrNoTiendanubeCtrl',
        inputs: { data:
          {
            title: $translate.instant('tiendanube_integration.connected.disconnect_popup.title'),
            description: $translate.instant('tiendanube_integration.connected.disconnect_popup.description'),
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
        tiendanubeService.manualSync()
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
            tiendanubeService.getChangedState(vm.stateArray, vm.idThirdPartyApp).then(function(response){
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
      vm.isLoadingTiendanubeFields = true;

      var list = _.find(vm.allUserList, function(list){
        return list.IdList === vm.selectedListId;
      });

      var entity = _.find(vm.allTiendanubeEntitiesList, function(entity){
        return entity.id === vm.selectedEntityId;
      });

      vm.selectedList = list;
      vm.selectedEntity = entity;

      tiendanubeService.getTiendanubeFields(vm.selectedEntity.ApiName)
        .then(function(listResult){
          if (listResult.success) {
            vm.tiendanubeFields = listResult.fields;
            if (fieldsMapped) {
              loadFieldsMapped(fieldsMapped);
              vm.isAnUpdate = true;
            } else {
              vm.isAnUpdate = false;
            }
            insertEmailAtTheBeginningIfExists();
            vm.showMapping = true;
            vm.isLoadingTiendanubeFields = false;
            vm.isLoading = false;
          }
        })
        .catch(function() {
          showGeneralMappingError();
        });
    };

    vm.mapFields = function() {
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
      tiendanubeService.synchTiendanubeLists(idList)
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
      tiendanubeService.deleteList(idList)
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
      tiendanubeService.getAssociatedFieldMapping(idList)
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
      var name = 'tiendanube_integration.mapping.fields.' + fieldName;
      var value = $translate.instant(name);
      if (value === name) {
        value = fieldName;
      }
      return value;
    };

    vm.onEntitySelected = function() {
      var listName = $translate.instant('tiendanube_integration.connected.lists.' + vm.selectedEntityId);
      var list = _.find(vm.allUserList, function(userList) {
        return userList.ListName === listName;
      });
      vm.selectedListId = list.IdList;
    };

    vm.updateRfmSettings = function() {
      vm.rfm.updating = true;
      tiendanubeService.updateRfmSettings(vm.idThirdPartyApp, vm.rfm)
        .then(function(result) {
          vm.rfm = result.rfm;
          if (result.success) {
            vm.rfm.success = result.success;
            $timeout(function() {
              vm.rfm.success = false;
            }, 3000);
          } else {
            vm.rfm.error = result.errorMsg;
            $timeout(function() {
              vm.rfm.error = '';
            },8000);
          }
          vm.rfm.updating = false;
        })
        .catch(function() {
          vm.rfm.error = $translate.instant('validation_messages.connection_error');
          $timeout(function() {
            vm.rfm.error = '';
          }, 8000);
          vm.rfm.updating = false;
        });
    }

    function loadFieldsMapped(fieldsMapped) {
      _.map(fieldsMapped, function(fieldMapped) {
        var fieldAlreadyMapped = _.find(vm.tiendanubeFields, function(field) {
          return field.ApiName === fieldMapped.ThirdPartyColumnName;
        });
        fieldAlreadyMapped.idDopplerField = fieldMapped.IdField;
      });
    }

    function insertEmailAtTheBeginningIfExists() {
      var tiendanubeFieldsExtracted = _.partition(vm.tiendanubeFields, function(field) {
        return field.FieldName === TIENDANUBE_FIELD_TYPE.EMAIL;
      });

      var tiendanubeEmailFields = tiendanubeFieldsExtracted[0];

      if (tiendanubeEmailFields.length > 0) {
        var tiendanubeFieldsListWithoutEmails = tiendanubeFieldsExtracted[1];
        vm.tiendanubeFields = _.union(tiendanubeEmailFields, tiendanubeFieldsListWithoutEmails);
      }
    }

    function updateListData(idList, syncDate) {
      tiendanubeService.getListData(idList).then(function(responseListData){
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
      tiendanubeService.integrateTiendanubeList(vm.selectedList, vm.selectedEntity)
        .then(function(listResult){
          if (listResult.success) {
            vm.selectedListId = listResult.idList;
            vm.allUserList = vm.getUserList();
            filterAvailableUserLists();
            mapFieldsAndSynchronize();
          }
        })
        .catch(function(){
          showGeneralMappingError();
          vm.isMapping = false;
        });
    }

    function mapFieldsAndSynchronize() {
      tiendanubeService.associateTiendanubeFieldMapping(vm.selectedListId,
        _.filter(vm.tiendanubeFields, function(entity) {
          return entity.idDopplerField && entity.idDopplerField !== 0;
        })
      )
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
      var emailFieldSelected = _.find(vm.tiendanubeFields, function (tiendanubeField) {
        return tiendanubeField.idDopplerField === BASIC_FIELD.EMAIL && tiendanubeField.ApiName === 'email';
      });
      emailFieldSelected ? vm.errorMessage = '' : showGeneralMappingError($translate.instant('tiendanube_integration.mapping.empty_email_error_message'));
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
      vm.tiendanubeEntitiesList = _.filter(vm.allTiendanubeEntitiesList, function(entity) {
        return (_.find(vm.integratedLists, function(integrated) {
          return entity.id === integrated.ThirdPartyId;
        }) === undefined);
      });
    }

    function loadDopplerFields() {
      tiendanubeService.getFields()
        .then(function(listResult){
          if (listResult.length) {
            vm.userFields = listResult;
            vm.userFields.unshift({
              idField: -1,
              name: $translate.instant('tiendanube_integration.mapping.add_field_option'),
              DataType: 0,
              Value: null,
              DopplerFieldTypeId: -1
            });
            vm.userFields.unshift({
              idField: 0,
              name: $translate.instant('tiendanube_integration.mapping.skip_column_option'),
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

    function loadFieldTypes() {
      tiendanubeService.getFieldTypes()
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
          || ((dopplerFieldTypeId != -1 ? field.type == dopplerFieldTypeId: true) && fieldNotUsed(field.idField));
      };
    }

    function fieldNotUsed(idField) {
      return !_.find(vm.tiendanubeFields, function (selectedField) {
        return selectedField.idDopplerField === idField
      });
    }

    vm.fieldChange = function (index, value) {
      if (vm.newField.index != index && value == -1) {
        vm.newField = newFieldDefaults();
        vm.newField.index = index;

        if (vm.tiendanubeFields[index].DopplerFieldTypeId != -1) {
          vm.newField.dataType = getFieldDataType(index);
        }
        else {
          vm.newField.typeDisabled = false;
        }
        
        _.forEach(vm.tiendanubeFields, function (field, fIndex) {
          field.idDopplerField = field.idDopplerField == -1 && fIndex != index ? null : field.idDopplerField;
        });
      }
      else if (vm.newField.index == index && value != -1) {
        vm.newField = newFieldDefaults();
      }
    }

    function getFieldDataType(index) {
      var fieldTypeId = vm.tiendanubeFields[index].DopplerFieldTypeId;
      var type = _.find(vm.fieldTypes, function (ftype) {
        return ftype.id === fieldTypeId;
      });
      return type ? type.id : FIELD_TYPE.STRING;
    }

    vm.createField = function (index) {
      if (vm.newField.name) {
        tiendanubeService.createField(vm.newField.name, vm.newField.dataType, vm.newField.isPrivate)
          .then(function (res) {
            if (res.success) {
              vm.userFields.push(res.field);
              vm.tiendanubeFields[index].idDopplerField = res.field.idField;
              vm.newField = newFieldDefaults();
            }
            else {
              vm.newField.error = res.errorMessage;
            }
          })
      }
      else {
        vm.newField.error = $translate.instant('tiendanube_integration.mapping.new_field.required_message');
      }
    }

    function newFieldDefaults() {
      return {
        index: null,
        name: '',
        dataType: FIELD_TYPE.STRING,
        isPrivate: "true",
        error: null,
        typeDisabled: true
      };
    }
  }
})();

