(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelAction', dpEditorPanelAction);

  dpEditorPanelAction.$inject = [
    '$rootScope',
    '$translate',
    'ACTION_TYPE',
    'automation',
    'AUTOMATION_TYPE',
    'COMPONENT_TYPE',
    'LIST_SELECTION_STATE',
    'optionsListDataservice',
    'selectedElementsService',
    'userFieldsDataservice',
    'FIELD_TYPE',
    'settingsService',
    'utils',
  ];

  function dpEditorPanelAction(
    $rootScope,
    $translate,
    ACTION_TYPE,
    automation,
    AUTOMATION_TYPE,
    COMPONENT_TYPE,
    LIST_SELECTION_STATE,
    optionsListDataservice,
    selectedElementsService,
    userFieldsDataservice,
    FIELD_TYPE,
    settingsService,
    utils
  ) {
    var directive = {
      restrict: 'AE',
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-action.html',
      link: link,
    };

    return directive;

    function link(scope) {
      var listTitle = $translate.instant(
        'automation_editor.components.action.list_grid.title'
      );
      var listSubtitle = $translate.instant(
        'automation_editor.components.action.list_grid.subtitle'
      );
      var settingsData = settingsService.getLoadedData();
      scope.ACTION_TYPE = ACTION_TYPE;
      scope.areEmailsAvailable = false;
      scope.actionOptions = getActionOptions();
      scope.isReadOnly = automation.isReadOnly;
      scope.getReadOnlyLabel = automation.getReadOnlyLabel;
      scope.userFields = userFieldsDataservice.getCustomFields();
      scope.defaultISODate = settingsData.defaultISODate;
      scope.REGEX_NUMBER = utils.REGEX_NUMBER;
      scope.FIELD_TYPE = FIELD_TYPE;
      scope.booleanOptions = optionsListDataservice.getBooleanOptions();
      scope.$watch(
        selectedElementsService.getSelectedComponent,
        function (newSelectedComponent) {
          if (
            newSelectedComponent &&
            newSelectedComponent.type === COMPONENT_TYPE.ACTION
          ) {
            if (
              newSelectedComponent.operation &&
              newSelectedComponent.operation.field &&
              newSelectedComponent.operation.field.type === FIELD_TYPE.DATE
            ) {
              scope.datePickerPopup.value = moment(
                newSelectedComponent.operation.field.date
              ).toDate();
            }
            //we need to save changes to update the id for new Email components
            automation.saveChanges().then(function () {
              $rootScope.$broadcast('UPDATE_SAVING_STATE');
              scope.emailComponentsToBind = automation.getEmailComponentsToBind(
                scope.selectedComponent
              );
              scope.areEmailsAvailable = true;
            });
          }
        }
      );
      // date picker variables
      scope.datePickerPopup = {
        value: new Date(),
        visible: false,
      };
      scope.format = $translate.instant('automation_editor.date_format');
      scope.datePickerOptions = {
        showWeeks: false,
        dateDisabled: false,
        formatYear: 'yyyy',
        maxDate: new Date(2037, 11, 31),
        minDate: new Date(1907, 0, 1),
        startingDay: 1,
      };

      scope.$watch('datePickerPopup.visible', function (newValue, oldValue) {
        if (newValue !== oldValue && !newValue) {
          if (scope.datePickerPopup.value) {
            scope.selectedComponent.operation.field.date =
              scope.datePickerPopup.value.toISOString().substring(0, 10);
          }
          scope.datePickerPopup.value = moment(
            scope.selectedComponent.operation.field.date
          ).toDate();
        }
      });

      scope.$watch(
        'scope.selectedComponent.operation.field.date',
        function (newValue) {
          if (newValue) {
            scope.datePickerPopup.value = moment(
              scope.selectedComponent.operation.field.date
            ).toDate();
          }
        }
      );

      scope.showListSelectionSimple = function () {
        scope.toggleListSelection(
          LIST_SELECTION_STATE.SIMPLE,
          listTitle,
          listSubtitle
        );
      };

      scope.showListSelectionMultiple = function () {
        var listTitle = $translate.instant(
          'automation_editor.components.action.remove_grid.title'
        );
        var listSubtitle = $translate.instant(
          'automation_editor.components.action.remove_grid.subtitle'
        );
        scope.toggleListSelection(
          LIST_SELECTION_STATE.MULTIPLE,
          listTitle,
          listSubtitle
        );
      };

      scope.onActionSelected = function (rawActionData, oldAction) {
        if (oldAction && oldAction.type === rawActionData.value) {
          return;
        }
        scope.isSelectedField = false;
        scope.selectedComponent.operation = automation.createOperation(
          getDefaultOperationData(rawActionData)
        );
      };

      scope.onEmailSelected = function (newEmailData, oldEmail) {
        if (
          (oldEmail && oldEmail.idEmail !== newEmailData.idEmail) ||
          !oldEmail
        ) {
          scope.selectedComponent.operation.setData({
            email: newEmailData,
          });
        }
      };

      scope.showErrorFor = function (propertyElement) {
        var showError = false;

        switch (propertyElement) {
          case 'subscriptionList':
            if (
              scope.selectedComponent &&
              scope.selectedComponent.touched &&
              scope.selectedComponent.operation ===
                ACTION_TYPE.ASSOCIATE_SUBSCRIBER_TO_LIST &&
              (!scope.selectedComponent.operation.suscriptionList ||
                !scope.selectedComponent.operation.suscriptionList.ListName)
            ) {
              showError = true;
            }
            break;

          case 'action_emails':
            if (
              scope.emailComponentsToBind &&
              !scope.emailComponentsToBind.length
            ) {
              showError = true;
            }

            break;

          default:
            throw new Error('Property with unknown key cannot be parsed.');
        }

        return showError;
      };

      scope.onSubscriberFieldSelected = function (rawFieldData, oldField) {
        if (oldField && oldField.name === rawFieldData.name) {
          return;
        }
        if (rawFieldData.type === FIELD_TYPE.DATE) {
          rawFieldData.date = scope.defaultISODate.substring(0, 10);
        }
        if (rawFieldData.type === FIELD_TYPE.BOOLEAN) {
          rawFieldData.value = true;
        }
        scope.selectedComponent.operation.field = Object.assign(
          {},
          rawFieldData
        );
        scope.isSelectedField = true;
      };

      function getActionOptions() {
        var options = optionsListDataservice.getActionOptions();
        var automationType = automation.getModel().automationType;

        if (automationType === AUTOMATION_TYPE.RSS_TO_EMAIL) {
          options = _.reject(options, function (option) {
            return option.value === ACTION_TYPE.RESEND_EMAIL;
          });
        }

        return options;
      }

      scope.onConditionalAttributeSelected = function (value) {
        scope.selectedComponent.operation.field.value = value;
      };

      function getDefaultOperationData(rawActionData) {
        var defaultData = {};

        switch (rawActionData.value) {
          case ACTION_TYPE.ASSOCIATE_SUBSCRIBER_TO_LIST:
            defaultData.type = rawActionData.value;
            break;

          case ACTION_TYPE.RESEND_EMAIL:
            defaultData.type = rawActionData.value;
            if (scope.emailComponentsToBind[0]) {
              defaultData.email = scope.emailComponentsToBind[0];
            }
            break;

          case ACTION_TYPE.REMOVE_SUBSCRIBER_FROM_LIST:
            defaultData.type = rawActionData.value;
            break;

          case ACTION_TYPE.CHANGE_SUBSCRIBER_FIELD:
            defaultData.type = rawActionData.value;
            if (scope.userFields.length === 1) {
              defaultData.field = scope.userFields[0];
            }
            break;

          default:
            throw new Error('Operation with unknown type cannot be parsed.');
        }

        return defaultData;
      }
    }
  }
})();
