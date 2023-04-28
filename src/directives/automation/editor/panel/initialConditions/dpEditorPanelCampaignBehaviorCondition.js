(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive(
      'dpEditorPanelCampaignBehaviorCondition',
      dpEditorPanelCampaignBehaviorCondition
    );

  dpEditorPanelCampaignBehaviorCondition.$inject = [
    'FREQUENCY_TYPE',
    'optionsListDataservice',
    'settingsService',
    'utils',
    'SEND_TYPE',
    'changesManager',
    '$translate',
    'LIST_SELECTION_STATE',
    'automation',
    '$timeout',
    'CHANGE_TYPE',
    '$q',
    'dateValidation',
  ];

  function dpEditorPanelCampaignBehaviorCondition(
    FREQUENCY_TYPE,
    optionsListDataservice,
    settingsService,
    utils,
    SEND_TYPE,
    changesManager,
    $translate,
    LIST_SELECTION_STATE,
    automation,
    $timeout,
    CHANGE_TYPE,
    $q,
    dateValidation
  ) {
    var directive = {
      restrict: 'AE',
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/initialConditions/dp-editor-panel-campaign-behavior-condition.html',
      link: link,
    };

    return directive;

    function link(scope, element) {
      scope.confirmationEmailListTmp = _.cloneDeep(
        scope.selectedComponent.confirmationEmailList
      );
      scope.timeOptions = optionsListDataservice.getTimeOptions();
      scope.timeSelected = {};
      scope.SEND_TYPE = SEND_TYPE;
      scope.REGEX_EMAIL = utils.REGEX_EMAIL;
      scope.dpPopup = {
        show: false,
      };
      scope.frequency = {};
      scope.frequency.date = new Date();
      scope.frequencyData = {};
      scope.isReadOnly = automation.isReadOnly;

      //datepicker options
      scope.format = $translate.instant('automation_editor.date_format');
      scope.dateOptions = {
        showWeeks: false,
        dateDisabled: false,
        formatYear: 'yyyy',
        maxDate: new Date(2030, 5, 22),
        minDate: new Date(),
        startingDay: 1,
      };

      var dateValidationService = {};
      dateValidation.getService().then(function (result) {
        dateValidationService = result;
      });

      //app settings
      settingsService.getSettings().then(function (response) {
        scope.timeZones = mapTimeZones(response.timeZones);
        scope.userTimeZone = response.idUserTimeZone;
        scope.$watch('selectedComponent.frequency.time', updateTimeSelected);
        scope.$watch(
          'selectedComponent.frequency.timezone',
          updateTimezoneSelected
        );
        scope.defaultISODate = moment(response.defaultISODate).toDate();
        var roundedMinutes = Math.ceil(
          Math.round(scope.defaultISODate.getMinutes() / 15) * 15
        );

        scope.frequencyData = {
          type: FREQUENCY_TYPE.DATE,
          timezone: scope.userTimeZone,
          date: response.defaultISODate,
          time: {
            hour:
              roundedMinutes >= 60
                ? scope.defaultISODate.getHours() + 1
                : scope.defaultISODate.getHours(),
            minute: roundedMinutes % 60,
          },
        };

        scope.maxConfirmationEmails = response.maxConfirmationEmails;
        scope.frequency.date = scope.selectedComponent.frequency
          ? moment(scope.selectedComponent.frequency.date).toDate()
          : new Date();
      });

      scope.$watch('dpPopup.show', function (newValue, oldValue) {
        if (!newValue && newValue !== oldValue) {
          scope.setDate();
        }
      });

      scope.$watch('selectedComponent.frequency.date', function () {
        if (scope.selectedComponent && scope.selectedComponent.frequency) {
          scope.frequency.date = moment(
            scope.selectedComponent.frequency.date
          ).toDate();
        }
      });

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

      function updateTimeSelected(tempTime) {
        if (tempTime) {
          scope.timeSelected = _.find(scope.timeOptions, function (option) {
            return _.isEqual(option.value, tempTime);
          });
        } else if (
          scope.selectedComponent &&
          scope.selectedComponent.frequency
        ) {
          scope.timeSelected = _.find(scope.timeOptions, function (option) {
            return _.isEqual(
              option.value,
              scope.selectedComponent.frequency.time
            );
          });
        }
      }

      function updateTimezoneSelected(tempTimezoneId) {
        if (tempTimezoneId) {
          scope.timezoneSelected = _.find(scope.timeZones, function (option) {
            return _.isEqual(option.value, tempTimezoneId);
          });
        } else if (
          scope.selectedComponent &&
          scope.selectedComponent.frequency
        ) {
          scope.timezoneSelected = _.find(scope.timeZones, function (option) {
            return _.isEqual(
              option.value,
              scope.selectedComponent.frequency.timezone
            );
          });
        }
      }

      function mapTimeZones(timeZones) {
        var timeZoneList = [];
        angular.forEach(timeZones, function (time) {
          var zone = { value: time.IdUserTimeZone, label: time.Name };
          timeZoneList.push(zone);
        });
        return timeZoneList;
      }

      scope.onFrequencyAttributeSelected = function (key, value) {
        if (key === 'time') {
          scope.validateDate(value, undefined).then(function (valid) {
            if (valid) {
              utils.assign(scope.selectedComponent.frequency, key, value);
              updateTimeSelected(value);
            } else {
              updateTimeSelected(value);
            }
          });
        } else {
          scope.validateDate(undefined, value).then(function (valid) {
            if (valid) {
              utils.assign(scope.selectedComponent.frequency, key, value);
            } else {
              updateTimezoneSelected(value);
            }
          });
        }
        scope.selectedComponent.hasStartDateExpired =
          dateValidationService.isTrialExpired();
      };

      scope.setFrequency = function (frequencyType) {
        var componentData;
        var oldComponentData;
        var newComponentData;

        if (frequencyType === scope.selectedComponent.sendType) {
          return;
        }
        changesManager.disable();
        oldComponentData = {
          sendType: scope.selectedComponent.sendType,
          frequency: scope.selectedComponent.frequency,
        };
        componentData = {
          sendType: frequencyType,
          frequency:
            frequencyType === SEND_TYPE.SCHEDULED ? scope.frequencyData : null,
        };
        scope.selectedComponent.setData(componentData);
        changesManager.enable();
        newComponentData = {
          sendType: frequencyType,
          frequency: scope.selectedComponent.frequency,
        };

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: scope.selectedComponent.uid,
          key: 'sendType,frequency',
          oldValue: angular.copy(oldComponentData),
          newValue: angular.copy(newComponentData),
        });
        scope.selectedComponent.hasStartDateExpired =
          dateValidationService.isTrialExpired();
        automation.checkCompleted();
      };

      scope.validateDate = function (time, timezoneId) {
        var defer = $q.defer();
        isValidCurrentDate(time, timezoneId).then(function (valid) {
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
            dateParam = moment(
              scope.validationForm['date'].$viewValue,
              scope.format.toUpperCase()
            )
              .toDate()
              .toISOString();
          }
          if (time) {
            hourParam = time.hour;
            minuteParam = time.minute;
          }
          if (timezoneId) {
            timezoneParam = timezoneId;
          }
          dateValidation
            .isDateExpired(dateParam, hourParam, minuteParam, timezoneParam)
            .then(function (result) {
              defer.resolve(!result);
            });
        } else {
          defer.resolve(true);
        }
        return defer.promise;
      }

      scope.setDate = function () {
        //format in ISO 8601 without timezones
        if (scope.selectedComponent.frequency) {
          scope.validateDate().then(function (valid) {
            if (valid) {
              scope.selectedComponent.frequency.setData({
                date: scope.frequency.date.toISOString().substring(0, 19),
              });
              scope.selectedComponent.hasStartDateExpired =
                dateValidationService.isTrialExpired();
            }
          });
        }
      };

      scope.showListSelectionMultiple = function () {
        scope.toggleListSelection(LIST_SELECTION_STATE.MULTIPLE);
      };

      /*ConfirmationEmail Methods*/

      scope.addConfirmationEmail = function () {
        var newIndex;
        //If we have erros we need to focus on them
        var tmpArray =
          scope.validationForm.$error.pattern ||
          scope.validationForm.$error.duplicated;
        if (tmpArray && tmpArray.length) {
          _.each(tmpArray, function (element) {
            element.$$element[0].focus();
          });
          //Else we need to create a new one if we still didn't reach the max supported
        } else if (
          scope.confirmationEmailListTmp.length < scope.maxConfirmationEmails
        ) {
          newIndex = scope.confirmationEmailListTmp.push({ email: '' });
          $timeout(function () {
            element[0]
              .querySelector('input[name="Email' + (newIndex - 1) + '"]')
              .focus();
          });
        }
      };

      function validateDuplicateEmails(email, index) {
        var inputEmailName = 'Email' + index;
        var duplicateEmailIndex = _.findIndex(
          scope.confirmationEmailListTmp,
          function (item, position) {
            return item.email === email && index !== position;
          }
        );

        if (duplicateEmailIndex !== -1) {
          scope.validationForm[inputEmailName].$setValidity(
            'duplicated',
            false
          );
        } else {
          scope.validationForm[inputEmailName].$setValidity('duplicated', true);
        }
      }

      scope.onBlurConfirmationEmail = function (event, index) {
        var inputEmailValue = event.currentTarget.value;
        var inputEmailName = 'Email' + index;
        var oldComponentData = angular.copy(scope.confirmationEmailListTmp);

        validateDuplicateEmails(inputEmailValue, index);
        $timeout(function () {
          var newComponentData;
          if (!inputEmailValue.length) {
            scope.confirmationEmailListTmp.splice(index, 1);
          } else if (
            inputEmailValue &&
            utils.isEmail(inputEmailValue) &&
            inputEmailValue !== oldComponentData[index].email &&
            scope.validationForm[inputEmailName].$valid
          ) {
            if (!oldComponentData[index].email) {
              oldComponentData.splice(index, 1);
            }
            if (!scope.selectedComponent.confirmationEmailList[index]) {
              scope.selectedComponent.confirmationEmailList.push({ email: '' });
            }
            scope.selectedComponent.confirmationEmailList[index].email =
              scope.confirmationEmailListTmp[index].email;

            newComponentData = angular.copy(
              scope.selectedComponent.confirmationEmailList
            );

            changesManager.add({
              type: CHANGE_TYPE.PROPERTY,
              uid: scope.selectedComponent.uid,
              key: 'confirmationEmailList',
              oldValue: oldComponentData,
              newValue: newComponentData,
            });
          }
        });
      };

      scope.deleteConfirmationEmail = function (email, index) {
        var newComponentData;
        var oldComponentData;

        if (!scope.selectedComponent.confirmationEmailList[index]) {
          scope.confirmationEmailListTmp.splice(index, 1);
          return;
        }

        oldComponentData = angular.copy(
          scope.selectedComponent.confirmationEmailList
        );

        scope.confirmationEmailListTmp.splice(index, 1);
        scope.selectedComponent.confirmationEmailList.splice(index, 1);

        newComponentData = angular.copy(
          scope.selectedComponent.confirmationEmailList
        );

        if (email && utils.isEmail(email.email)) {
          changesManager.add({
            type: CHANGE_TYPE.PROPERTY,
            uid: scope.selectedComponent.uid,
            key: 'confirmationEmailList',
            oldValue: oldComponentData,
            newValue: newComponentData,
          });
        }
      };

      scope.$watchCollection(
        'selectedComponent.confirmationEmailList',
        function (newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            scope.confirmationEmailListTmp = _.cloneDeep(newValue);
          }
        }
      );

      scope.showInitConditionMessage = function () {
        var isReplica = automation.getModel().isReplica;
        return scope.selectedComponent.completed === false && isReplica;
      };
    }
  }
})();
