(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('mercadoShopsIntegrationCtrl', mercadoShopsIntegrationCtrl);

  mercadoShopsIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'mercadoShopsService',
    'INTEGRATION_CODES',
    'BASIC_FIELD',
    'IMPORTING_STATE',
    'IMPORTING_STATE_STR',
    '$timeout'
  ];

  function mercadoShopsIntegrationCtrl($scope, $translate, ModalService,
    mercadoShopsService, INTEGRATION_CODES, BASIC_FIELD, IMPORTING_STATE,
    IMPORTING_STATE_STR, $timeout) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.connecting = false;
    vm.disconnected = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.MERCADOSHOPS;
    vm.errorMessage = '';
    vm.integratedLists = [];
    vm.countries = [];
    
    $translate.onReady().then(function() {
      vm.getStatus(true);
      loadDopplerFields();
    });

    vm.getStatus = function(doPolling) {
      return mercadoShopsService.getIntegrationStatus()
        .then(function(result){
          if (result.success) {
            if (!!result.model) { // eslint-disable-line
              vm.idThirdPartyApp = result.idThirdPartyApp;
              vm.connectedAccount = result.model.AccountName;
              vm.daysToDisconnection = result.model.DaysToDisconnection;
              vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
              vm.allUserList === vm.getUserList();
              vm.integratedLists = result.integratedLists;
              vm.disableSync = result.integratedLists.length === 0;
              vm.actionNeeded = result.actionNeeded;
            }
          } else {
            vm.connectionError = true;
            vm.errorMsg = $translate.instant('mercado_shops_integration.disconnected.connection_error');
          }
          vm.countries = result.countries;
          vm.isLoading = false;
          vm.connected = !!result.model;
        });
    };

    vm.getUserList = function () {
      vm.isLoading = true;
      mercadoShopsService.getUserLists()
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
    
    vm.connect = function (country) {
      var windowName = 'popUp';
      var windowSize = 'width=600,height=500,scrollbars=yes';
      var OpenWindow = window.open('StartMercadoLibreAuthorization?idThirdPartyApp=' + vm.idThirdPartyApp + '&location=' + country, windowName, windowSize);
      OpenWindow.focus();
      var timer = window.setInterval(function () {
        if (OpenWindow.closed) {
          window.clearInterval(timer);
          vm.getStatus();
        }
      }, 500);
    };

    vm.disconnectWarning = function(){
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'modalYesOrNoMercadoShopsCtrl',
        inputs: { data:
          {
            title: $translate.instant('mercado_shops_integration.connected.disconnect_popup.title'),
            description: $translate.instant('mercado_shops_integration.connected.disconnect_popup.description'),
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
            vm.selectedListId = null;
            vm.connected = false;
            vm.disconnected = true;
            vm.connected = false;
            vm.integratedLists = [];
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
        mercadoShopsService.manualSync()
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

      vm.selectedList = list;

      mercadoShopsService.getMercadoShopsFields()
        .then(function (listResult) {
          if (listResult.success) {
            vm.mercadoShopsFields = listResult.fields;
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
          }
        })
        .catch(function () {
          showGeneralMappingError();
        });
    };

    vm.deleteList = function (idList) {
      vm.isLoading = true;
      mercadoShopsService.deleteList(idList)
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
      var name = 'mercado_shops_integration.mapping.fields.' + fieldName;
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
    };

    vm.editMap = function (idList) {
      vm.selectedListId = idList;
      vm.isLoading = true;
      vm.errorMessage = '';
      mercadoShopsService.getAssociatedFieldMapping(idList)
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
      mercadoShopsService.synchLists(idList)
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
            mercadoShopsService.getChangedState(vm.stateArray, vm.idThirdPartyApp).then(function (response) {
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

    function loadDopplerFields() {
      mercadoShopsService.getUserFields()
        .then(function (listResult) {
          if (listResult.length) {
            vm.userFields = listResult;
            vm.userFields.unshift({
              idField: 0,
              name: $translate.instant('mercado_shops_integration.mapping.skip_column_option'),
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
        var fieldAlreadyMapped = _.find(vm.mercadoShopsFields, function (field) {
          return field.Name === fieldMapped.ThirdPartyColumnName;
        });
        fieldAlreadyMapped.idDopplerField = fieldMapped.IdField;
      });
    }

    function loadFieldsPreMapped() {
      var fieldAlreadyMapped = _.filter(vm.mercadoShopsFields, function (field) {
        return field.IdDopplerField;
      });
      _.map(fieldAlreadyMapped, function (fieldMapped) {
        fieldMapped.idDopplerField = fieldMapped.IdDopplerField;
      });
    }

    function insertEmailAtTheBeginningIfExists() {
      var mercadoShopsFieldsExtracted = _.partition(vm.mercadoShopsFields, function (field) {
        return field.Name === 'email';
      });

      var emailFields = mercadoShopsFieldsExtracted[0];

      if (emailFields.length > 0) {
        var fieldsListWithoutEmails = mercadoShopsFieldsExtracted[1];
        vm.mercadoShopsFields = _.union(emailFields, fieldsListWithoutEmails);
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
      var emailFieldSelected = _.find(vm.mercadoShopsFields, function (mercadoShopsField) {
        return mercadoShopsField.idDopplerField === BASIC_FIELD.EMAIL;
      });

      emailFieldSelected ? vm.errorMessage = '' : showGeneralMappingError($translate.instant('mercado_Shops_integration.mapping.empty_email_error_message'));
      return !!emailFieldSelected;
    };

    function integrateAndSynchronize() {
      var entity = {
        DisplayName: $translate.instant('mercado_shops_integration.connected.lists.buyers'),
        Name: 'buyers'
      }
      mercadoShopsService.integrateList(vm.selectedList, entity)
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
      mercadoShopsService.associateFieldMapping(vm.selectedListId,
        _.filter(vm.mercadoShopsFields, function (entity) {
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
      mercadoShopsService.getListData(idList).then(function (responseListData) {
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
  }
})();

