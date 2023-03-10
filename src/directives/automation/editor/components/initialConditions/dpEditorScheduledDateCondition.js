(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorScheduledDateCondition', dpEditorScheduledDateCondition);

  dpEditorScheduledDateCondition.$inject = [
    '$translate',
    'FREQUENCY_TYPE',
    'MAX_ITEMS_TO_SHOW',
    'settingsService',
    'automation',
    'AUTOMATION_COMPLETED_STATE',
    'dateValidation',
    'warningsStepsService'
  ];

  function dpEditorScheduledDateCondition($translate, FREQUENCY_TYPE, MAX_ITEMS_TO_SHOW,
    settingsService, automation, AUTOMATION_COMPLETED_STATE, dateValidation, warningsStepsService) {
    var directive = {
      restrict: 'E',
      scope: {
        component: '='
      },
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/components/initialConditions/dp-editor-scheduled-date-condition.html'
    };

    return directive;

    function link(scope) {
      var dateValidationService = {};
      dateValidation.getService().then(function (result) {
        dateValidationService = result;
        scope.component.hasStartDateExpired = dateValidationService.isTrialExpired();
        automation.checkCompleted();
      });
     
      scope.FREQUENCY_TYPE = FREQUENCY_TYPE;

      settingsService.getSettings().then(function(response) {
        scope.timeZones = mapTimeZones(response.timeZones);
      });

      scope.isFlowComplete = automation.getIsFlowComplete;
      scope.hasErrors = function() {
        return scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_DELETED_FIELDS;
      };

      scope.component.hasBlockedList = automation.hasBlockedList();
      warningsStepsService.checkWarningStep(scope.component);
      automation.checkCompleted();

      scope.getFrequencySummaryFor = function(frequencyType) {
        var innerHtml = '';
        var index;
        var truncated;

        switch (frequencyType) {
        case FREQUENCY_TYPE.DAY_WEEK:

          if (!scope.component.frequency.days.length) {
            innerHtml += '<span class="brackets">&#91;&#91;&#91;&hellip;&#93;&#93;&#93;</span>';
          } else if (scope.component.frequency.days.length <= 1) {
            innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_week.intro_single');
          } else if (scope.component.frequency.days.length > 1) {
            innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_week.intro_plural');
          }
          if (scope.component.frequency.days.length > 0) {
            index = 0;
            truncated = false;

            while (index < scope.component.frequency.days.length && !truncated) {
              innerHtml += '<b class="frequency-item">' + $translate.instant('automation_editor.sidebar.scheduled_date_day' + scope.component.frequency.days[index]);
              index++;
              // if the next item isn't the last one then the comma symbol must be added
              if (index < scope.component.frequency.days.length - 1 && index < MAX_ITEMS_TO_SHOW) {
                innerHtml += '<span>&#44;&nbsp;</span>';
              }
              // if the next item is the last one then the AND word must be added
              if (index === scope.component.frequency.days.length - 1 && index < MAX_ITEMS_TO_SHOW) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.and') + '&nbsp;</span>';
              }
              // If there are more items but the MAX_ITEMS_TO_SHOW has already been reached then the ellipsis must be added
              if (index < scope.component.frequency.days.length && index === MAX_ITEMS_TO_SHOW) {
                innerHtml += '<span>&#44;&nbsp;&hellip;</span>';
                truncated = true;
              }
              innerHtml += '</b>';
            }
          }

          break;

        case FREQUENCY_TYPE.DAY_MONTH:
          innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_month.intro');
          innerHtml += '<strong>' + scope.component.frequency.day + '</strong>';
          innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_month.of_the_month');

          break;

        case FREQUENCY_TYPE.DAY_YEAR:
          if (scope.component.frequency.customFields.length === 1 && scope.component.frequency.momentId === 0) {
            innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.intro_single');
            innerHtml += '<strong>' + scope.component.frequency.customFields[0].label + '</strong>';
          }

          if (scope.component.frequency.customFields.length === 1
            && (scope.component.frequency.momentId === 1 || scope.component.frequency.momentId === 2)) {
            innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.intro');
            if (scope.component.frequency.momentDays) {
              innerHtml += '<strong>' + scope.component.frequency.momentDays + '</strong>';
            } else {
              innerHtml += '<strong>&#91;&#91;&#91;&hellip;&#93;&#93;&#93;</strong>';
            }
            if (scope.component.frequency.momentDays.toString() === '1') {
              innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.day');
            } else {
              innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.days');
            }
            if (scope.component.frequency.momentId === 1) {
              innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.before');
            } else {
              innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.after');
            }
            innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.of_the_day');
            innerHtml += '<strong>' + scope.component.frequency.customFields[0].label + '</strong>';
          }

          if (scope.component.frequency.customFields.length > 1) {
            if (scope.component.frequency.momentId === 0) {
              innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.intro_plural');
            } else {
              innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.intro');
              if (scope.component.frequency.momentDays) {
                innerHtml += '<strong>' + scope.component.frequency.momentDays + '</strong>';
              } else {
                innerHtml += '<strong>&#91;&#91;&#91;&hellip;&#93;&#93;&#93;</strong>';
              }
              if (scope.component.frequency.momentDays.toString() === '1') {
                innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.day');
              } else {
                innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.days');
              }
              if (scope.component.frequency.momentId === 1) {
                innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.before');
              } else {
                innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.after');
              }
              innerHtml += $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.day_year.criteria_are_met');
            }

            index = 0;
            truncated = false;

            while (index < scope.component.frequency.customFields.length && !truncated) {
              innerHtml += '<b class="frequency-item">' + scope.component.frequency.customFields[index].label;
              index++;
              // if the next item isn't the last one then the comma symbol must be added
              if (index < scope.component.frequency.customFields.length - 1 && index < MAX_ITEMS_TO_SHOW) {
                innerHtml += '<span>&#44;&nbsp;</span>';
              }
              // if the next item is the last one then the AND word must be added
              if (index === scope.component.frequency.customFields.length - 1 && index < MAX_ITEMS_TO_SHOW) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.and') + '&nbsp;</span>';
              }
              // If there are more items but the MAX_ITEMS_TO_SHOW has already been reached then the ellipsis must be added
              if (index < scope.component.frequency.customFields.length && index === MAX_ITEMS_TO_SHOW) {
                innerHtml += '<span>&#44;&nbsp;&hellip;</span>';
                truncated = true;
              }
              innerHtml += '</b>';
            }
          }

          break;

        default:
          throw new Error('Frequency with unknown type cannot be parsed.');
        }

        innerHtml += getTimeHtml();
        innerHtml += getSubscriptionListsHtml();

        return innerHtml;
      };

      function getTimeHtml() {
        var timeHtml = '';

        if (scope.component.frequency.time.hour === 1) {
          timeHtml += '<span>&nbsp;' + $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.hour') + '</span>';
        } else {
          timeHtml += '<span>&nbsp;' + $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.hours') + '</span>';
        }
        timeHtml += '<strong>' + (scope.component.frequency.time.hour > 9 ? scope.component.frequency.time.hour : '0' + scope.component.frequency.time.hour);
        timeHtml += '&#58;' + (scope.component.frequency.time.minute > 9 ? scope.component.frequency.time.minute : '0' + scope.component.frequency.time.minute) + '&nbsp;h</strong>';

        var timezoneResult = _.find(scope.timeZones, function(item){
          return item.value === scope.component.frequency.timezone;
        });
        if (timezoneResult) {
          timeHtml += ' <strong>' + timezoneResult.label.split(')')[0] + ')</strong>';
        }
        return timeHtml;
      }

      function getSubscriptionListsHtml() {
        var index = 0;
        var subscriptionListsHtml = '';
        var truncated = false;

        if (scope.component.suscriptionLists.length === 1) {
          subscriptionListsHtml += $translate.instant('automation_editor.components.initial_condition.behavior.lists_sg');
        } else if (scope.component.suscriptionLists.length > 1) {
          subscriptionListsHtml += $translate.instant('automation_editor.components.initial_condition.behavior.lists_pl');
        }

        while (index < scope.component.suscriptionLists.length && !truncated) {
          subscriptionListsHtml += '<b class="frequency-item">' + scope.component.suscriptionLists[index].ListName;
          index++;
          // if the next item isn't the last one then the comma symbol must be added
          if (index < scope.component.suscriptionLists.length - 1 && index < MAX_ITEMS_TO_SHOW) {
            subscriptionListsHtml += '<span>&#44;&nbsp;</span>';
          }
          // if the next item is the last one then the AND word must be added
          if (index === scope.component.suscriptionLists.length - 1 && index < MAX_ITEMS_TO_SHOW) {
            subscriptionListsHtml += '<span>' + $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.and') + '&nbsp;</span>';
          }
          // If there are more items but the MAX_ITEMS_TO_SHOW has already been reached then the ellipsis must be added
          if (index < scope.component.suscriptionLists.length && index === MAX_ITEMS_TO_SHOW) {
            subscriptionListsHtml += '<span>&#44;&nbsp;&hellip;</span>';
            truncated = true;
          }
          subscriptionListsHtml += '</b>';
        }
        if (scope.component.allSubscribers) {
          subscriptionListsHtml += '<strong>' + $translate.instant('automation_editor.components.initial_condition.behavior.all_subscribers') + '</strong>';
        }

        return subscriptionListsHtml;
      }

      function mapTimeZones(timeZones) {
        var timeZoneList = [];
        angular.forEach(timeZones, function(time) {
          var zone = {
            label: time.Name,
            value: time.IdUserTimeZone
          };
          timeZoneList.push(zone);
        });
        return timeZoneList;
      }

      scope.hasBlockedList = function(){
        return automation.hasBlockedList();
      }
      
      scope.getTipMessage = function(){
        if (scope.hasBlockedList()) {
          return $translate.instant('automation_editor.canvas.tip_initial_condition_blocked')
        } else{
          return $translate.instant('automation_editor.canvas.tip_initial_condition')
        }
      }
    }
  }
})();
