(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive(
      'dpEditorPanelScheduledDateCondition',
      dpEditorPanelScheduledDateCondition
    );

  dpEditorPanelScheduledDateCondition.$inject = [
    '$translate',
    'automation',
    'FIELD_TYPE',
    'FREQUENCY_TYPE',
    'LIST_SELECTION_STATE',
    'optionsListDataservice',
    'settingsService',
    'userFieldsDataservice',
    'utils',
    'dateValidation',
    'AUTOMATION_COMPLETED_STATE',
  ];

  function dpEditorPanelScheduledDateCondition(
    $translate,
    automation,
    FIELD_TYPE,
    FREQUENCY_TYPE,
    LIST_SELECTION_STATE,
    optionsListDataservice,
    settingsService,
    userFieldsDataservice,
    utils,
    dateValidation,
    AUTOMATION_COMPLETED_STATE
  ) {
    var directive = {
      restrict: 'AE',
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/initialConditions/dp-editor-panel-scheduled-date-condition.html',
      link: link,
    };

    return directive;

    function link(scope, element) {
      scope.FREQUENCY_TYPE = FREQUENCY_TYPE;
      scope.dayNumberOptions = optionsListDataservice.getDayNumberOptions();
      scope.timeOptions = optionsListDataservice.getTimeOptions();
      scope.weekDays = optionsListDataservice.getWeekDays();
      scope.dayMoments = optionsListDataservice.getDayMoments();
      scope.dateUserFields = userFieldsDataservice.getFieldsByType(
        FIELD_TYPE.DATE
      );
      scope.deletedFields = [];
      scope.isFlowComplete = automation.getIsFlowComplete;
      scope.isReadOnly = automation.isReadOnly;

      settingsService.getSettings().then(function (response) {
        scope.timeZones = mapTimeZones(response.timeZones);
        scope.userTimeZone = response.idUserTimeZone;
        scope.$watch('selectedComponent.frequency.day', updateDayMonthSelected);
        scope.$watch(
          'selectedComponent.frequency.days',
          updateDayWeeksSelected
        );
        scope.$watch(
          'selectedComponent.frequency.momentId',
          updateDayMomentSelected
        );
        scope.$watch('selectedComponent.frequency.time', updateTimeSelected);
        scope.$watch(
          'selectedComponent.frequency.timezone',
          updateTimezoneSelected
        );
        scope.$watch(
          'selectedComponent.frequency.customFields',
          updateAvailableDateFields
        );
      });

      var dateValidationService = {};
      dateValidation.getService().then(function (result) {
        dateValidationService = result;
      });
      // we need to wait until the html of panel has been loaded to set as invalid the deleted fields, if any
      element.ready(function () {
        if (
          scope.selectedComponent.frequency &&
          scope.selectedComponent.frequency.type === FREQUENCY_TYPE.DAY_YEAR
        ) {
          updateDeletedFields();
        }
      });

      scope.setFrequency = function (frequencyType) {
        var frequencyData = {
          type: frequencyType,
          timezone: scope.userTimeZone,
        };
        if (scope.selectedComponent.frequency) {
          frequencyData.time = scope.selectedComponent.frequency.time;
          frequencyData.timezone = scope.selectedComponent.frequency.timezone;
        }
        scope.selectedComponent.setFrequency(frequencyData);
        automation.updateAutomationFlowState();
      };

      scope.onFrequencyAttributeSelected = function (key, value) {
        utils.assign(scope.selectedComponent.frequency, key, value);
        scope.selectedComponent.hasStartDateExpired =
          dateValidationService.isTrialExpired();
        automation.checkCompleted();
      };

      scope.onPrevTimeSelected = function () {
        var index = _.findIndex(scope.timeOptions, function (option) {
          return _.isEqual(option.value, scope.timeSelected.value);
        });
        if (index > 0) {
          scope.onFrequencyAttributeSelected(
            'time',
            scope.timeOptions[index - 1].value
          );
        }
      };

      scope.onNextTimeSelected = function () {
        var index = _.findIndex(scope.timeOptions, function (option) {
          return _.isEqual(option.value, scope.timeSelected.value);
        });
        if (index < scope.timeOptions.length - 1) {
          scope.onFrequencyAttributeSelected(
            'time',
            scope.timeOptions[index + 1].value
          );
        }
      };

      scope.onDayWeekSelected = function (option) {
        var isAlreadyAdded = _.includes(
          scope.selectedComponent.frequency.days,
          option.value
        );
        if (option.selected && !isAlreadyAdded) {
          scope.selectedComponent.frequency.days.push(option.value);
          scope.onFrequencyAttributeSelected(
            'days',
            _.sortBy(scope.selectedComponent.frequency.days, function (num) {
              return num === 0 ? 7 : num;
            })
          );
        } else {
          scope.onFrequencyAttributeSelected(
            'days',
            _.without(scope.selectedComponent.frequency.days, option.value)
          );
        }
      };

      scope.onCustomFieldSelected = function (newOption, oldOption, index) {
        var newIndex;
        var frequencyCustomFields =
          scope.selectedComponent.frequency.customFields;

        if (oldOption) {
          frequencyCustomFields = _.without(frequencyCustomFields, oldOption);
        }
        newIndex = index >= 0 ? index : frequencyCustomFields.length;
        frequencyCustomFields.splice(newIndex, 0, newOption);
        scope.onFrequencyAttributeSelected(
          'customFields',
          frequencyCustomFields
        );
        if (oldOption && scope.deletedFields.length) {
          updateDeletedFields(newIndex);
        }
      };

      scope.onCustomFieldRemoved = function (option) {
        var warnedField = _.find(scope.deletedFields, function (item) {
          return item.instance.id === option.id;
        });
        scope.onFrequencyAttributeSelected(
          'customFields',
          _.without(scope.selectedComponent.frequency.customFields, option)
        );
        if (warnedField) {
          updateDeletedFields(warnedField.index);
        }
      };

      function updateDeletedFields(index) {
        if (Number.isInteger(index)) {
          scope.customFieldForm['customField' + index].$setValidity(
            'deletedField',
            true
          );
        }
        // we need to check if there are deleted fields and if there is not then update the automation warning state
        scope.deletedFields = userFieldsDataservice.getDeletedFieldsByType(
          scope.selectedComponent.frequency.customFields,
          FIELD_TYPE.DATE
        );
        _.each(scope.deletedFields, function (deletedField) {
          scope.customFieldForm[
            'customField' + deletedField.index
          ].$setValidity('deletedField', false);
        });
        if (!scope.deletedFields.length) {
          automation.updateAutomationFlowState();
        }
      }

      scope.addNewCustomField = function () {
        scope.onCustomFieldSelected(scope.availableDateFields[0]);
        updateAvailableDateFields();
      };

      scope.showListSelectionMultiple = function () {
        scope.toggleListSelection(LIST_SELECTION_STATE.MULTIPLE);
      };

      scope.hasErrors = function () {
        return (
          scope.isFlowComplete() ===
          AUTOMATION_COMPLETED_STATE.WITH_DELETED_FIELDS
        );
      };

      scope.showInitConditionMessage = function () {
        var isReplica = automation.getModel().isReplica;
        return scope.selectedComponent.completed === false && isReplica;
      };

      function updateDayMomentSelected() {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.dayMomentSelected = _.find(scope.dayMoments, function (option) {
            return option.value === scope.selectedComponent.frequency.momentId;
          });
          scope.selectedComponent.hasStartDateExpired =
            dateValidationService.isTrialExpired();
          automation.checkCompleted();
        }
      }

      function updateDayMonthSelected() {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.dayMonthSelected = _.find(
            scope.dayNumberOptions,
            function (option) {
              return option.value === scope.selectedComponent.frequency.day;
            }
          );
        }
      }

      function updateDayWeeksSelected() {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          angular.forEach(scope.weekDays, function (weekDay) {
            weekDay.selected = _.includes(
              scope.selectedComponent.frequency.days,
              weekDay.value
            );
          });
        }
      }

      function updateTimeSelected() {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.timeSelected = _.find(scope.timeOptions, function (option) {
            return _.isEqual(
              option.value,
              scope.selectedComponent.frequency.time
            );
          });
        }
      }

      function updateTimezoneSelected() {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.timezoneSelected = _.find(scope.timeZones, function (option) {
            return _.isEqual(
              option.value,
              scope.selectedComponent.frequency.timezone
            );
          });
        }
      }

      function updateAvailableDateFields() {
        if (
          scope.selectedComponent &&
          scope.selectedComponent.frequency &&
          scope.selectedComponent.frequency.type === FREQUENCY_TYPE.DAY_YEAR
        ) {
          scope.availableDateFields = _.sortBy(
            _.differenceBy(
              scope.dateUserFields,
              scope.selectedComponent.frequency.customFields,
              'id'
            ),
            'label'
          );
        }
      }

      function mapTimeZones(timeZones) {
        var timeZoneList = [];
        angular.forEach(timeZones, function (time) {
          var zone = {
            label: time.Name,
            value: time.IdUserTimeZone,
          };
          timeZoneList.push(zone);
        });
        return timeZoneList;
      }
    }
  }
})();
