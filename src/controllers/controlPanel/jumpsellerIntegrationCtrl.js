(function () {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('jumpsellerIntegrationCtrl', jumpsellerIntegrationCtrl);

  jumpsellerIntegrationCtrl.$inject = [
    '$scope',
    '$translate',
    'ModalService',
    'jumpsellerService',
    'INTEGRATION_CODES',
    'BASIC_FIELD',
    'IMPORTING_STATE',
    'IMPORTING_STATE_STR',
    '$timeout',
    'FIELD_TYPE',
  ];

  function jumpsellerIntegrationCtrl(
    $scope,
    $translate,
    ModalService,
    jumpsellerService,
    INTEGRATION_CODES,
    BASIC_FIELD,
    IMPORTING_STATE,
    IMPORTING_STATE_STR,
    $timeout,
    FIELD_TYPE
  ) {
    var vm = this;
    vm.isLoading = true;
    vm.connectionError = false;
    vm.connecting = false;
    vm.disconnected = false;
    vm.idThirdPartyApp = INTEGRATION_CODES.JUMPSELLER;
    vm.errorMessage = '';
    vm.integratedLists = [];
    vm.newField = null;

    $translate.onReady().then(function () {
      vm.getStatus(true);
      loadDopplerFields();
      loadFieldTypes();
    });

    vm.getStatus = function () {
      return jumpsellerService.getIntegrationStatus().then(function (result) {
        if (result.success) {
          if (!!result.model) {
            // eslint-disable-line
            vm.connectedAccount = result.model.AccountName;
            vm.daysToDisconnection = result.model.DaysToDisconnection;
            vm.firstValidationErrorDate = result.model.FirstValidationErrorDate;
            vm.allUserList === vm.getUserList();
            vm.integratedLists = result.integratedLists;
            vm.disableSync = result.integratedLists.length === 0;
            vm.actionNeeded = result.actionNeeded;
            vm.autoSyncDisabled = result.model.SyncDisabled;
          }
        } else {
          vm.connectionError = true;
          vm.errorMsg = $translate.instant(
            'jumpseller_integration.disconnected.connection_error'
          );
        }
        vm.newField = newFieldDefaults();
        vm.isLoading = false;
        vm.connected = !!result.model;
        vm.webAppUrl = result.webAppUrl;
      });
    };

    vm.getUserList = function () {
      vm.isLoading = true;
      jumpsellerService.getUserLists().then(function (listResult) {
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
      jumpsellerService.connect(vm.integrationData).then(function (result) {
        if (result.success) {
          vm.connectionError = false;
          vm.connected = true;
          vm.lastSyncDate = ' - ';
          vm.getStatus();
        } else {
          vm.connectionError = true;
          vm.errorMsg = result.errorMsg.length
            ? result.errorMsg
            : $translate.instant(
                'jumpseller_integration.disconnected.connection_error'
              );
        }
        vm.connecting = false;
      });
    };

    vm.disconnectWarning = function () {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalYesOrNoVtex.html',
        controller: 'modalYesOrNoJumpsellerCtrl',
        inputs: {
          data: {
            title: $translate.instant(
              'jumpseller_integration.connected.disconnect_popup.title'
            ),
            description: $translate.instant(
              'jumpseller_integration.connected.disconnect_popup.description'
            ),
            buttonCancelLabel: $translate.instant('actions.cancel'),
            buttonPrimaryLabel: $translate.instant('actions.disconnect'),
            buttonPrimaryClass: 'button--primary button--small',
          },
        },
      }).then(function (modal) {
        modal.close.then(function (result) {
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
        jumpsellerService.manualSync().then(function () {
          vm.checkListState();
        });
        $timeout(function () {
          vm.disableSync = vm.importingAllLists;
        }, 2500);
      }
    };

    vm.showMappingSection = function (fieldsMapped) {
      vm.isLoadingFields = true;

      var list = _.find(vm.allUserList, function (list) {
        return list.IdList === vm.selectedListId;
      });

      vm.selectedList = list;

      jumpsellerService
        .getJumpsellerFields()
        .then(function (listResult) {
          if (listResult.success) {
            vm.jumpsellerFields = listResult.fields;
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
      jumpsellerService
        .deleteList(idList)
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
      var name = 'jumpseller_integration.mapping.fields.' + fieldName;
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
      jumpsellerService
        .getAssociatedFieldMapping(idList)
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
      jumpsellerService
        .synchLists(idList)
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
      var allInProcess = _.filter(
        vm.integratedLists,
        function (integratedList) {
          return (
            integratedList.SubscribersListStatus ===
            IMPORTING_STATE.IMPORTING_SUBSCRIBERS
          );
        }
      );
      vm.stateArray = _.map(allInProcess, function (list) {
        return {
          IdSubscribersList: list.IdList,
          CurrentStatus: IMPORTING_STATE_STR.IMPORTING_SUBSCRIBERS,
        };
      });

      if (allInProcess.length) {
        vm.disableSync = true;
        vm.importingAllLists = true;

        if (!vm.timer) {
          //eslint-disable-line
          (function tick() {
            jumpsellerService
              .getChangedState(vm.stateArray, vm.idThirdPartyApp)
              .then(function (response) {
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
                    updateListData(
                      currentList.IdSubscribersList,
                      response.syncDate
                    );
                  }
                }
              });
          })();
        }
      }
    };

    function loadDopplerFields() {
      jumpsellerService
        .getUserFields()
        .then(function (listResult) {
          if (listResult.length) {
            vm.userFields = listResult;
            vm.userFields.unshift({
              idField: -1,
              name: $translate.instant(
                'jumpseller_integration.mapping.add_field_option'
              ),
              DataType: 0,
              Value: null,
              DopplerFieldTypeId: -1,
            });
            vm.userFields.unshift({
              idField: 0,
              name: $translate.instant(
                'jumpseller_integration.mapping.skip_column_option'
              ),
              DataType: 0,
              Value: null,
            });
            vm.isLoading = false;
          }
        })
        .catch(function () {
          showGeneralMappingError();
        });
    }

    function loadFieldsMapped(fieldsMapped) {
      _.map(fieldsMapped, function (fieldMapped) {
        var fieldAlreadyMapped = _.find(vm.jumpsellerFields, function (field) {
          return field.Name === fieldMapped.ThirdPartyColumnName;
        });
        fieldAlreadyMapped.idDopplerField = fieldMapped.IdField;
      });
    }

    function loadFieldsPreMapped() {
      var fieldAlreadyMapped = _.filter(vm.jumpsellerFields, function (field) {
        return field.IdDopplerField;
      });
      _.map(fieldAlreadyMapped, function (fieldMapped) {
        fieldMapped.idDopplerField = fieldMapped.IdDopplerField;
      });
    }

    function insertEmailAtTheBeginningIfExists() {
      var jumpsellerFieldsExtracted = _.partition(
        vm.jumpsellerFields,
        function (field) {
          return field.Name === 'email';
        }
      );

      var emailFields = jumpsellerFieldsExtracted[0];

      if (emailFields.length > 0) {
        var fieldsListWithoutEmails = jumpsellerFieldsExtracted[1];
        vm.jumpsellerFields = _.union(emailFields, fieldsListWithoutEmails);
      }
    }

    function showGeneralMappingError(errorMessage) {
      vm.isLoading = false;
      vm.errorMessage = !!errorMessage
        ? errorMessage
        : $translate.instant('validation_messages.connection_error'); // eslint-disable-line no-extra-boolean-cast
      $timeout(function () {
        vm.errorMessage = '';
      }, 8000);
    }

    function validateEmptyEmail() {
      var emailFieldSelected = _.find(
        vm.jumpsellerFields,
        function (jumpsellerField) {
          return jumpsellerField.idDopplerField === BASIC_FIELD.EMAIL;
        }
      );

      emailFieldSelected
        ? (vm.errorMessage = '')
        : showGeneralMappingError(
            $translate.instant(
              'jumpseller_integration.mapping.empty_email_error_message'
            )
          );
      return !!emailFieldSelected;
    }

    function integrateAndSynchronize() {
      var entity = {
        DisplayName: $translate.instant(
          'jumpseller_integration.connected.lists.customers'
        ),
        Name: 'customers',
      };
      jumpsellerService
        .integrateList(vm.selectedList, entity)
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
      jumpsellerService
        .associateFieldMapping(
          vm.selectedListId,
          _.filter(vm.jumpsellerFields, function (entity) {
            return entity.idDopplerField && entity.idDopplerField !== 0;
          })
        )
        .then(function (listResult) {
          if (listResult.success) {
            vm.synchronizeList(vm.selectedListId);
            vm.getStatus().then(function () {
              var currentList = _.find(
                vm.integratedLists,
                function (integratedList) {
                  return integratedList.IdList === vm.selectedListId;
                }
              );
              currentList.SubscribersListStatus ===
                IMPORTING_STATE.IMPORTING_SUBSCRIBERS;
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
    }

    function updateListData(idList, syncDate) {
      jumpsellerService.getListData(idList).then(function (responseListData) {
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

    function loadFieldTypes() {
      jumpsellerService
        .getFieldTypes()
        .then(function (types) {
          vm.fieldTypes = types;
        })
        .catch(function () {
          showGeneralMappingError();
        });
    }

    vm.fieldFilter = function (dopplerFieldId, dopplerFieldTypeId) {
      return function (field) {
        return (
          field.idField === 0 ||
          field.idField === -1 ||
          field.idField === dopplerFieldId ||
          (field.type == dopplerFieldTypeId && fieldNotUsed(field.idField))
        );
      };
    };

    function fieldNotUsed(idField) {
      return !_.find(vm.jumpsellerFields, function (selectedField) {
        return selectedField.idDopplerField === idField;
      });
    }

    vm.fieldChange = function (index, value) {
      if (vm.newField.index != index && value == -1) {
        vm.newField = newFieldDefaults();
        vm.newField.index = index;
        vm.newField.dataType = getFieldDataType(index);
        _.forEach(vm.jumpsellerFields, function (field, fIndex) {
          field.idDopplerField =
            field.idDopplerField == -1 && fIndex != index
              ? null
              : field.idDopplerField;
        });
      } else if (vm.newField.index == index && value != -1) {
        vm.newField = newFieldDefaults();
      }
    };

    function getFieldDataType(index) {
      var fieldTypeId = vm.jumpsellerFields[index].DopplerFieldTypeId;
      var type = _.find(vm.fieldTypes, function (ftype) {
        return ftype.id === fieldTypeId;
      });
      return type ? type.id : FIELD_TYPE.STRING;
    }

    vm.createField = function (index) {
      if (vm.newField.name) {
        jumpsellerService
          .createField(
            vm.newField.name,
            vm.newField.dataType,
            vm.newField.isPrivate
          )
          .then(function (res) {
            if (res.success) {
              vm.userFields.push(res.field);
              vm.jumpsellerFields[index].idDopplerField = res.field.idField;
              vm.newField = newFieldDefaults();
            } else {
              vm.newField.error = res.errorMessage;
            }
          });
      } else {
        vm.newField.error = $translate.instant(
          'jumpseller_integration.mapping.new_field.required_message'
        );
      }
    };

    function newFieldDefaults() {
      return {
        index: null,
        name: '',
        dataType: FIELD_TYPE.STRING,
        isPrivate: 'true',
        error: null,
      };
    }
  }
})();
