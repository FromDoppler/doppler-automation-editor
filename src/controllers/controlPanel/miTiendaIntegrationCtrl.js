(function () {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('miTiendaIntegrationCtrl', miTiendaIntegrationCtrl);

  miTiendaIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'miTiendaService',
    'INTEGRATION_CODES',
    'INTEGRATION_SOURCE_TYPE',
    'BASIC_FIELD',
    'IMPORTING_STATE',
    'IMPORTING_STATE_STR',
    '$timeout'
  ];

  function miTiendaIntegrationCtrl($scope, $translate, ModalService,
    miTiendaService, INTEGRATION_CODES, INTEGRATION_SOURCE_TYPE, BASIC_FIELD, IMPORTING_STATE,
    IMPORTING_STATE_STR, $timeout) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.connecting = false;
    vm.disconnected = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.MITIENDA;
    vm.errorMessage = '';
    vm.sourceType = INTEGRATION_SOURCE_TYPE.MVC;
    vm.mvcSourceType = INTEGRATION_SOURCE_TYPE.MVC;
    vm.integratedLists = [];
    vm.allEntitiesList = [];
    vm.entitiesList = [];
    vm.importingListDropdown = false;

    $translate.onReady().then(function () {
      vm.getStatus();
      loadDopplerFields();
    });

    vm.getStatus = function () {
      return miTiendaService.getIntegrationStatus()
        .then(function (result) {
          if (result.success) {
            if (!!result.model) { // eslint-disable-line
              vm.connectedStore = result.model.AccountName
              vm.lastSyncDate = result.model.LastSynchDate;
              vm.sourceType = result.model.SourceType;
              vm.daysToDisconnection = result.model.DaysToDisconnection;
              vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
              vm.allUserList === vm.getUserList();
              vm.integratedLists = result.integratedLists;
              vm.allEntitiesList.length === 0 ? vm.getEntitiesList() : filterAvailableEntities();
              vm.disableSync = vm.integratedLists.length === 0;
            }
          } else {
            vm.connectionError = true;
            vm.errorMsg = $translate.instant('miTienda_integration.disconnected.connection_error');
          }
          vm.isLoading = false;
          vm.connected = !!result.model;
        });
    };

    vm.getUserList = function () {
      vm.isLoading = true;
      miTiendaService.getUserLists()
        .then(function (listResult) {
          if (listResult.success) {
            vm.allUserList = listResult.lists;
            vm.setDefultList();
          }
          vm.isLoading = false;
        });
    };

    vm.setDefultList = function () {
      var defaultList = _.filter(vm.allUserList, function (list) {
        return list.IsDefaultList;
      });
      if (defaultList.length > 0) {
        vm.selectedListId = defaultList[0].IdList;
      }
    };

    vm.connect = function () {
      vm.connecting = true;
      miTiendaService.connect(vm.integrationData).then(function (result) {
        if (result.success) {
          vm.getStatus();
        } else {
          vm.connectionError = true;
          vm.errorMsg = result.errorMsg.length ? result.errorMsg : $translate.instant('miTienda_integration.disconnected.connection_error');
        }
        vm.connecting = false;
      });
    };

    vm.disconnectWarning = function () {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'modalYesOrNoMiTiendaCtrl',
        inputs: {
          data:
          {
            title: $translate.instant('miTienda_integration.connected.disconnect_popup.title'),
            description: $translate.instant('miTienda_integration.connected.disconnect_popup.description'),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('actions.disconnect'),
            buttonPrimaryClass: 'button--primary button--small'
          }
        }
      }).then(function (modal) {
        modal.close.then(function (result) {
          if (result) {
            vm.connectionError = false;
            vm.showMapping = false;
            vm.errorMessage = '';
            vm.selectedListId = null;
            vm.connected = false;
            if (vm.integrationData) {
              vm.integrationData.appKey = '';
            }
            vm.disconnected = true;
            vm.connected = false;
            vm.integratedLists = [];
            vm.sourceType = INTEGRATION_SOURCE_TYPE.MVC;
          }
        });
      });
    };

    vm.synchronizeAllLists = function () {
      if (!vm.importingAllLists) {
        vm.importingAllLists = true;
        vm.integratedLists = _.map(vm.integratedLists, function (list) {
          list.SubscribersListStatus = IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
          return list;
        });
        miTiendaService.manualSync()
          .then(function () {
            vm.checkListState();
          });
        $timeout(function () {
          vm.disableSync = vm.importingAllLists;
        }, 2500);
      }
    };

    vm.showMappingSection = function (fieldsMapped) {
      vm.availablesFields = vm.userFields;
      vm.isLoadingFields = true;

      var list = _.find(vm.allUserList, function (list) {
        return list.IdList === vm.selectedListId;
      });

      var entity = _.find(vm.allEntitiesList, function (entity) {
        return entity.id === vm.selectedEntityId;
      });

      vm.selectedList = list;
      vm.selectedEntity = entity;
      vm.miTiendaFields = entity.Fields;

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

    vm.deleteList = function (idList) {
      vm.isLoading = true;
      miTiendaService.deleteList(idList)
        .then(function (listResult) {
          if (listResult.success) {
            vm.getStatus();
            vm.isLoading = false;
            vm.integrationToDelete = null;
            vm.setDefultList();
          }
        })
        .catch(function () {
          showGeneralMappingError();
        });
    };

    vm.getFiledName = function (fieldName) {
      var name = 'miTienda_integration.mapping.fields.' + fieldName;
      var value = $translate.instant(name);
      if (value === name) {
        value = fieldName;
      }
      return value;
    };

    vm.goBack = function () {
      vm.showMapping = false;
      vm.errorMessage = '';
      vm.selectedListId = null;
      vm.setDefultList();
      resetMapping();
    };

    vm.editMap = function (idList, entityId) {
      vm.selectedEntityId = entityId;
      vm.selectedListId = idList;
      vm.isLoading = true;
      vm.errorMessage = '';
      miTiendaService.getAssociatedFieldMapping(idList)
        .then(function (result) {
          if (result.success && result.fields.length > 0) {
            vm.showMappingSection(result.fields);
          } else {
            showGeneralMappingError();
          }
        })
        .catch(function () {
          showGeneralMappingError();
        });
    };

    vm.mapFields = function () {
      vm.isMapping = true;
      if (validateEmptyEmail()) {
        if (vm.isAnUpdate) {
          mapFieldsAndSynchronize();
          vm.isAnUpdate = false;
        } else {
          integrateAndSynchronize();
        }
      }
    };

    vm.synchronizeList = function (idList) {
      miTiendaService.synchLists(idList)
        .then(function (listResult) {
          if (listResult.success) {
            vm.showMapping = false;
          }
        })
        .catch(function () {
          showGeneralMappingError();
        })
        .finally(function () {
          vm.isMapping = false;
        });
    };

    vm.checkListState = function () {
      vm.stateArray = [];
      // only check lists in process
      var allInProcess = _.filter(vm.integratedLists, function (integratedList) {
        return integratedList.SubscribersListStatus === IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
      });
      vm.stateArray = _.map(allInProcess, function (list) {
        return { 'IdSubscribersList': list.IdList, 'CurrentStatus': IMPORTING_STATE_STR.IMPORTING_SUBSCRIBERS };
      });

      if (allInProcess.length) {
        vm.disableSync = true;
        vm.importingAllLists = true;

        if (!vm.timer) { //eslint-disable-line
          (function tick() {
            miTiendaService.getChangedState(vm.stateArray, vm.idThirdPartyApp).then(function (response) {
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

     vm.getEntitiesList = function() {
      vm.isLoading = true;
      vm.importingListDropdown = true;
      miTiendaService.getEntities()
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

    vm.setAvailablesFields = function () {
      vm.availablesFields = _.filter(vm.userFields, function (field) {
        return !_.find(vm.miTiendaFields, function (selectedField) {
          return selectedField.idDopplerField === field.idField
            && selectedField.idDopplerField !== 0;
        });
      });
    };

    vm.onEntitySelected = function () {
      if (vm.selectedEntityId) {
        var listName = $translate.instant('miTienda_integration.connected.lists.' + vm.selectedEntityId);
        var list = _.find(vm.allUserList, function (userList) {
          return userList.ListName === listName;
        });
        vm.selectedListId = list.IdList;
      }
    };

    function loadDopplerFields() {
      miTiendaService.getUserFields()
        .then(function (listResult) {
          if (listResult.length) {
            vm.userFields = listResult;
            vm.userFields.unshift({
              idField: 0,
              name: $translate.instant('miTienda_integration.mapping.skip_column_option'),
              DataType: 0,
              Value: null
            });
            vm.availablesFields = vm.userFields;
            vm.isLoading = false;
          }
        })
        .catch(function () {
          showGeneralMappingError();
        });
    }

    function loadFieldsMapped(fieldsMapped) {
      _.map(fieldsMapped, function (fieldMapped) {
        var fieldAlreadyMapped = _.find(vm.miTiendaFields, function (field) {
          return field.Name === fieldMapped.ThirdPartyColumnName;
        });
        fieldAlreadyMapped.idDopplerField = fieldMapped.IdField;
      });
    }

    function loadFieldsPreMapped() {
      var fieldAlreadyMapped = _.filter(vm.miTiendaFields, function (field) {
        return field.IdDopplerField;
      });
      _.map(fieldAlreadyMapped, function (fieldMapped) {
        fieldMapped.idDopplerField = fieldMapped.IdDopplerField;
      });
    }

    function insertEmailAtTheBeginningIfExists() {
      var miTiendaFieldsExtracted = _.partition(vm.miTiendaFields, function (field) {
        return field.Name === 'email';
      });

      var emailFields = miTiendaFieldsExtracted[0];

      if (emailFields.length > 0) {
        var fieldsListWithoutEmails = miTiendaFieldsExtracted[1];
        vm.miTiendaFields = _.union(emailFields, fieldsListWithoutEmails);
      }
    }

    function showGeneralMappingError(errorMessage) {
      vm.isLoading = false;
      vm.errorMessage = !!errorMessage ? errorMessage : $translate.instant('validation_messages.connection_error'); // eslint-disable-line no-extra-boolean-cast
      $timeout(function () {
        vm.errorMessage = '';
      }, 8000);
    }

    function validateEmptyEmail() {
      var emailFieldSelected = _.find(vm.miTiendaFields, function (miTiendaField) {
        return miTiendaField.idDopplerField === BASIC_FIELD.EMAIL;
      });

      emailFieldSelected ? vm.errorMessage = '' : showGeneralMappingError($translate.instant('miTienda_integration.mapping.empty_email_error_message'));
      return !!emailFieldSelected;
    };

    function integrateAndSynchronize() {
      miTiendaService.integrateList(vm.selectedList, vm.selectedEntity)
        .then(function (listResult) {
          if (listResult.success) {
            vm.selectedListId = listResult.idList;
            mapFieldsAndSynchronize();
          }
        })
        .catch(function () {
          showGeneralMappingError();
          vm.isMapping = false;
        });
    }

    function mapFieldsAndSynchronize() {
      miTiendaService.associateFieldMapping(vm.selectedListId,
        _.filter(vm.miTiendaFields, function (entity) {
          return entity.idDopplerField && entity.idDopplerField !== 0;
        })
      )
        .then(function (listResult) {
          if (listResult.success) {
            vm.synchronizeList(vm.selectedListId);
            vm.getStatus().then(function () {
              var currentList = _.find(vm.integratedLists, function (integratedList) {
                return integratedList.IdList === vm.selectedListId;
              });
              currentList.SubscribersListStatus === IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
              vm.checkListState();
              vm.selectedEntityId = null;
              vm.selectedListId = null;
              resetMapping();
            });
          }
        })
        .catch(function () {
          showGeneralMappingError();
          vm.isMapping = false;
          vm.getStatus();
        });
    };

    function updateListData(idList, syncDate) {
      miTiendaService.getListData(idList).then(function (responseListData) {
        _.map(vm.integratedLists, function (integratedList) {
          if (integratedList.IdList === idList) {
            integratedList.SubscribersCount = responseListData.SubscribersCount;
            integratedList.SubscribersListStatus = IMPORTING_STATE.READY;
            integratedList.LastUpdateFormatted = syncDate;
            vm.stateArray = _.reject(vm.stateArray, function (list) {
              return list.IdSubscribersList === integratedList.IdList;
            });
          }
        });
      });
    }

    function filterAvailableEntities() {
      vm.entitiesList = _.filter(vm.allEntitiesList, function (entity) {
        return (_.find(vm.integratedLists, function (integrated) {
          return entity.id === integrated.ThirdPartyId;
        }) === undefined);
      });
    }

    function resetMapping() {
      _.map(vm.bmwCrmFields, function (field) {
        field.idDopplerField = null;
      });
    }

    $scope.$on('ngRepeatFinished', function () {
      vm.setAvailablesFields();
    });
  }
})();

