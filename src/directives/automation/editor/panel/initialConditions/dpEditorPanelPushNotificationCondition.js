(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelPushNotificationCondition', dpEditorPanelPushNotificationCondition);

  dpEditorPanelPushNotificationCondition.$inject = [
    'automation',
    'DOMAINS_SELECTION_STATE',
    'FREQUENCY_TYPE',
    'optionsListDataservice',
    'settingsService',
    'userFieldsDataservice',
    'utils',
    'FIELD_TYPE',
    'SEND_TYPE',
    'changesManager',
    '$translate',
    'CHANGE_TYPE',
    '$q',
    'dateValidation'
  ];

  function dpEditorPanelPushNotificationCondition(automation, DOMAINS_SELECTION_STATE, FREQUENCY_TYPE, optionsListDataservice, settingsService, userFieldsDataservice, utils,
    FIELD_TYPE, SEND_TYPE, changesManager, $translate, CHANGE_TYPE, $q, dateValidation) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/initialConditions/dp-editor-panel-push-notification-condition.html',
      link: link
    };

    return directive;

    function link(scope) {
      scope.toggleDomainsSelection(DOMAINS_SELECTION_STATE.HIDING);
      scope.isReadOnly = automation.isReadOnly;
      scope.timeOptions = optionsListDataservice.getTimeOptions();
      scope.weekDays = optionsListDataservice.getWeekDays('short');
      scope.dayNumberOptions = optionsListDataservice.getDayNumberOptions();
      scope.dateUserFields = userFieldsDataservice.getFieldsByType(FIELD_TYPE.DATE);
      scope.dayMoments = optionsListDataservice.getDayMoments();
      scope.deletedFields = [];
      scope.timeSelected = {};
      scope.SEND_TYPE = SEND_TYPE;
      scope.FREQUENCY_TYPE = FREQUENCY_TYPE;
      scope.dpPopup = {
        show: false
      };
      scope.frequency = {};
      scope.frequency.date = new Date();
      scope.frequencyData = {};

      scope.format = $translate.instant('automation_editor.date_format');
      scope.dateOptions = {
        showWeeks: false,
        dateDisabled: false,
        formatYear: 'yyyy',
        maxDate: new Date(2030, 5, 22),
        minDate: new Date(),
        startingDay: 1
      };

      var dateValidationService = {};
      dateValidation.getService().then(function (result) {
        dateValidationService = result;
      });
      settingsService.getSettings().then(function(response) {
        scope.timeZones = mapTimeZones(response.timeZones);
        scope.userTimeZone = response.idUserTimeZone;
        scope.$watch('selectedComponent.frequency.time', updateTimeSelected);
        scope.$watch('selectedComponent.frequency.timezone', updateTimezoneSelected);
        scope.$watch('selectedComponent.frequency.customFields', updateAvailableDateFields);
        scope.$watch('selectedComponent.frequency.day', updateDayMonthSelected);
        scope.$watch('selectedComponent.frequency.days', updateDayWeeksSelected);
        scope.$watch('selectedComponent.frequency.momentId', updateDayMomentSelected);
        scope.defaultISODate = moment(response.defaultISODate).toDate();
        var roundedMinutes = Math.ceil(Math.round(scope.defaultISODate.getMinutes() / 15) * 15);

        scope.frequencyData = {
          type: FREQUENCY_TYPE.DATE,
          timezone: scope.userTimeZone,
          date: response.defaultISODate,
          time: {
            hour: roundedMinutes >= 60 ? scope.defaultISODate.getHours() + 1 : scope.defaultISODate.getHours(),
            minute: roundedMinutes % 60
          }
        };

        scope.frequency.date = scope.selectedComponent.frequency ?
          moment(scope.selectedComponent.frequency.date).toDate() :
          new Date();
      });

      scope.$watch('dpPopup.show', function(newValue, oldValue) {
        if (!newValue && newValue !== oldValue) {
          scope.setDate();
        }
      });

      scope.$watch('selectedComponent.frequency.date', function() {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.frequency.date = moment(scope.selectedComponent.frequency.date).toDate();
        }
      });

      scope.onPrevTimeSelected = function() {
        var index = _.findIndex(scope.timeOptions, function(option) {
          return _.isEqual(option.value, scope.timeSelected.value);
        });
        if (index > 0) {
          scope.onFrequencyAttributeSelected('time', scope.timeOptions[index - 1].value);
        }
      };

      scope.onNextTimeSelected = function() {
        var index = _.findIndex(scope.timeOptions, function(option) {
          return _.isEqual(option.value, scope.timeSelected.value);
        });
        if (index < scope.timeOptions.length - 1) {
          scope.onFrequencyAttributeSelected('time', scope.timeOptions[index + 1].value);
        }
      };

      scope.addNewCustomField = function() {
        scope.onCustomFieldSelected(scope.availableDateFields[0]);
        updateAvailableDateFields();
      };

      function updateAvailableDateFields() {
        if (scope.selectedComponent && scope.selectedComponent.frequency
          && scope.selectedComponent.frequency.type === FREQUENCY_TYPE.DAY_YEAR) {
          scope.availableDateFields = _.sortBy(_.differenceBy(scope.dateUserFields, scope.selectedComponent.frequency.customFields, 'id'), 'label');
        }
      }

      function updateTimeSelected(tempTime) {
        if (tempTime) {
          scope.timeSelected = _.find(scope.timeOptions, function(option) {
            return _.isEqual(option.value, tempTime);
          });
        } else if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.timeSelected = _.find(scope.timeOptions, function(option) {
            return _.isEqual(option.value, scope.selectedComponent.frequency.time);
          });
        }
      }

      function updateTimezoneSelected(tempTimezoneId) {
        if (tempTimezoneId) {
          scope.timezoneSelected = _.find(scope.timeZones, function(option) {
            return _.isEqual(option.value, tempTimezoneId);
          });
        } else if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.timezoneSelected = _.find(scope.timeZones, function(option) {
            return _.isEqual(option.value, scope.selectedComponent.frequency.timezone);
          });
        }
      }

      function mapTimeZones(timeZones) {
        var timeZoneList = [];
        angular.forEach(timeZones, function(time) {
          var zone = {
            value: time.IdUserTimeZone,
            label: time.Name
          };
          timeZoneList.push(zone);
        });
        return timeZoneList;
      }

      scope.onFrequencyAttributeSelected = function(key, value) {
        if (key === 'days' || key === 'momentId' || key === 'customFields') {
          utils.assign(scope.selectedComponent.frequency, key, value);
        } else if (key === 'time') {
          scope.validateDate(value, undefined).then(function(valid) {
            if (valid) {
              utils.assign(scope.selectedComponent.frequency, key, value);
            }
            updateTimeSelected(value);
          });
        } else {
          scope.validateDate(undefined, value).then(function(valid) {
            if (valid) {
              utils.assign(scope.selectedComponent.frequency, key, value);
            } else {
              updateTimezoneSelected(value);
            }
          });
        }
        scope.selectedComponent.hasStartDateExpired = dateValidationService.isTrialExpired();
      };

      scope.onDayWeekSelected = function(option) {
        var isAlreadyAdded = _.includes(scope.selectedComponent.frequency.days, option.value);

        if (option.selected && !isAlreadyAdded) {
          scope.selectedComponent.frequency.days.push(option.value);
          scope.onFrequencyAttributeSelected('days', _.sortBy(scope.selectedComponent.frequency.days, function(num) {
            return num === 0 ? 7 : num;
          }));
        } else {
          scope.onFrequencyAttributeSelected('days', _.without(scope.selectedComponent.frequency.days, option.value));
        }
      };

      scope.setFrequency = function(frequencyType) { 
        if(frequencyType === scope.selectedComponent.frequency.type) return;
        const frequencyData = {
          type: frequencyType,
          timezone: scope.userTimeZone
        };
        if (scope.selectedComponent.frequency) {
          frequencyData.time = scope.selectedComponent.frequency.time;
          frequencyData.timezone = scope.selectedComponent.frequency.timezone;
        }
        scope.selectedComponent.setFrequency(frequencyData);
        automation.updateAutomationFlowState();
      };

      scope.onCustomFieldSelected = function(newOption, oldOption, index) {
        var newIndex;
        var frequencyCustomFields = scope.selectedComponent.frequency.customFields;

        if (oldOption) {
          frequencyCustomFields = _.without(frequencyCustomFields, oldOption);
        }
        newIndex = index >= 0 ? index : frequencyCustomFields.length;
        frequencyCustomFields.splice(newIndex, 0, newOption);
        scope.onFrequencyAttributeSelected('customFields', frequencyCustomFields);
        if (oldOption && scope.deletedFields.length) {
          updateDeletedFields(newIndex);
        }
      };

      scope.onCustomFieldRemoved = function(option) {
        var warnedField = _.find(scope.deletedFields, function(item) {
          return item.instance.id === option.id;
        });
        scope.onFrequencyAttributeSelected('customFields',
          _.without(scope.selectedComponent.frequency.customFields, option));
        if (warnedField) {
          updateDeletedFields(warnedField.index);
        }
      };

      function updateDeletedFields(index) {
        if (Number.isInteger(index)) {
          scope.validationForm['customField' + index].$setValidity('deletedField', true);
        }
        // we need to check if there are deleted fields and if there is not then update the automation warning state
        scope.deletedFields = userFieldsDataservice.getDeletedFieldsByType(
          scope.selectedComponent.frequency.customFields, FIELD_TYPE.DATE);
        _.each(scope.deletedFields, function(deletedField) {
          scope.validationForm['customField' + deletedField.index].$setValidity('deletedField', false);
        });
        if (!scope.deletedFields.length) {
          automation.updateAutomationFlowState();
        }
      }

      scope.setSendType = function(sendType) {
        if (sendType === scope.selectedComponent.sendType ) {
          return;
        }

        var componentData;
        var oldComponentData;
        var newComponentData;

        changesManager.disable();
        oldComponentData = {
          sendType: scope.selectedComponent.sendType,
          frequency: scope.selectedComponent.frequency
        };
        componentData = {
          sendType: sendType,
          frequency: sendType === SEND_TYPE.INMEDIATE ? null: scope.frequencyData
        };
        scope.selectedComponent.setData(componentData);
        changesManager.enable();
        newComponentData = {
          sendType: sendType,
          frequency: scope.selectedComponent.frequency
        };

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: scope.selectedComponent.uid,
          key: 'PushConditionSendTypeFrequency',
          oldValue: angular.copy(oldComponentData),
          newValue: angular.copy(newComponentData)
        });
        scope.selectedComponent.hasStartDateExpired = dateValidationService.isTrialExpired();
        automation.checkCompleted();
      };

      scope.validateDate = function(time, timezoneId) {
        var defer = $q.defer();
        isValidCurrentDate(time, timezoneId).then(function(valid) {
          if (!valid) {
            scope.validationForm['date'].$setValidity('invalidDate', false);
          } else {
            scope.validationForm['date'].$setValidity('invalidDate', true);
          }
          defer.resolve(valid);
        });
        return defer.promise;
      };

      function isValidCurrentDate(time, timezoneId) {
        var defer = $q.defer();
        if (scope.selectedComponent.frequency) {
          var dateParam = scope.frequency.date.toISOString();
          var hourParam = scope.selectedComponent.frequency.time.hour;
          var minuteParam = scope.selectedComponent.frequency.time.minute;
          var timezoneParam = scope.selectedComponent.frequency.timezone;
          if (scope.validationForm['date']) {
            dateParam = moment(scope.validationForm['date'].$viewValue, scope.format.toUpperCase()).toDate().toISOString();
          }
          if (time) {
            hourParam = time.hour;
            minuteParam = time.minute;
          }
          if (timezoneId) {
            timezoneParam = timezoneId;
          }
          dateValidation.isDateExpired(dateParam, hourParam, minuteParam, timezoneParam).then(function(result) {
            defer.resolve(!result);
          });
        } else {
          defer.resolve(true);
        }
        return defer.promise;
      }

      scope.setDate = function() {
        if (scope.selectedComponent.frequency) {
          scope.validateDate().then(function(valid) {
            if (valid) {
              scope.selectedComponent.frequency.setData({
                date: scope.frequency.date.toISOString().substring(0, 19)
              });
              scope.selectedComponent.hasStartDateExpired = dateValidationService.isTrialExpired();
            }
          });
        }
      };

      scope.showDomainsSelection = function () {
        scope.toggleDomainsSelection(DOMAINS_SELECTION_STATE.SHOWING);
      };

      function updateDayMomentSelected() {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.dayMomentSelected = _.find(scope.dayMoments, function(option) {
            return option.value === scope.selectedComponent.frequency.momentId;
          });
          scope.selectedComponent.hasStartDateExpired = dateValidationService.isTrialExpired();
          automation.checkCompleted();
        }
      }

      function updateDayMonthSelected() {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.dayMonthSelected = _.find(scope.dayNumberOptions, function(option) {
            return option.value === scope.selectedComponent.frequency.day;
          });
        }
      }

      function updateDayWeeksSelected() {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          angular.forEach(scope.weekDays, function(weekDay) {
            weekDay.selected = _.includes(scope.selectedComponent.frequency.days, weekDay.value);
          });
        }
      }
    }
  }
})();
