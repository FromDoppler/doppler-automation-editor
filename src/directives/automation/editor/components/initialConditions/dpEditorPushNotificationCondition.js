(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPushNotificationCondition', ['automation', 'COMPONENT_TYPE', 'SEND_TYPE', 'FREQUENCY_TYPE', 'MAX_ITEMS_TO_SHOW', '$translate',
      'AUTOMATION_STATE', '$interval', 'dateValidation', 'settingsService', 'pushService', dpEditorPushNotificationCondition]);

  function dpEditorPushNotificationCondition(automation, COMPONENT_TYPE, SEND_TYPE, FREQUENCY_TYPE, MAX_ITEMS_TO_SHOW, $translate,
    AUTOMATION_STATE, $interval, dateValidation, settingsService, pushService) {
    var directive = {
      restrict: 'E',
      scope: {
        component: '='
      },
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/components/initialConditions/dp-editor-push-notification-condition.html'
    };

    return directive;

    function link(scope) {

      var dateValidationService = {};
      dateValidation.getService().then(function (result) {
        dateValidationService = result;
        scope.component.hasStartDateExpired = dateValidationService.isTrialExpired();
        automation.checkCompleted();
      });
      scope.hasErrors = function() {
        // TODO: determinate if current state has errors
      };

      var updateDateIfNotValidInterval = 900000;
      scope.FREQUENCY_TYPE = FREQUENCY_TYPE;
      scope.SEND_TYPE = SEND_TYPE;
      scope.format = $translate.instant('automation_editor.date_format').toUpperCase();
      scope.timeZone = '';
      scope.date = scope.component.frequency ? moment(scope.component.frequency.date).format(scope.format) : new Date();

      settingsService.getSettings().then(function(response) {
        scope.timeZones = response.timeZones;
      });

      if (automation.getModel().state !== AUTOMATION_STATE.ACTIVE) {
        dateValidation.updateDateIfNotValid();
        $interval(function() {
          dateValidation.updateDateIfNotValid();
        }, updateDateIfNotValidInterval);
      }

      scope.$watch('component.frequency.date', function() {
        if (scope.component.frequency) {
          scope.date = moment(scope.component.frequency.date).format(scope.format);
        }
      });

      scope.$watch('component.frequency.timezone', function() {
        if (scope.component.frequency) {
          var timezoneResult = _.find(scope.timeZones, function(item) {
            return item.IdUserTimeZone === scope.component.frequency.timezone;
          });
          if (timezoneResult) {
            scope.timeZone = timezoneResult.Name.split(')')[0];
          }
        }
      });

      scope.isInitialConditionComplete = function() {
        if (scope.component.completed) {
          pushService.setInitialComponentCompleted(true);
          return true;
        }else{
          pushService.setInitialComponentCompleted(false);
          return false;
        }
      }

      scope.getFrequencySummaryFor = function(frequencyType) {
        var innerHtml = '';
        var index;
        var truncated;
        switch (frequencyType) {
          case FREQUENCY_TYPE.UNDEFINED:
            innerHtml = $translate.instant('automation_editor.components.initial_condition.push_notification.scheduled_day');
            innerHtml += '<span class="brackets">[[[...]]]</span>';
            break;

          case SEND_TYPE.INMEDIATE:
            innerHtml = $translate.instant('automation_editor.components.initial_condition.push_notification.inmediately_send');
            innerHtml += '<strong>' + $translate.instant('automation_editor.components.initial_condition.push_notification.inmediately_frequency') + '</strong>';
            break;

          case SEND_TYPE.SCHEDULED:
            innerHtml = $translate.instant('automation_editor.components.initial_condition.push_notification.inmediately_send');
            innerHtml += '<strong>' + $translate.instant('automation_editor.components.initial_condition.push_notification.scheduled_day_frequency') + '</strong>';
            innerHtml += '&nbsp;' + $translate.instant('automation_editor.components.initial_condition.push_notification.scheduled_day_part2');
            innerHtml += '<strong>' + scope.date + '</strong>';            
            break;

          case FREQUENCY_TYPE.DAY_WEEK:
          if (!scope.component.frequency.days.length) {
            innerHtml = $translate.instant('automation_editor.components.initial_condition.push_notification.inmediately_send');
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
        innerHtml += getDomainListsHtml();

        return innerHtml;
      };

      function getTimeHtml() {
        var timeHtml = '';
        if(!scope.component.frequency) {
          return timeHtml;
        }

        if (scope.component.frequency.time.hour === 1) {
          timeHtml += '<span>&nbsp;' + $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.hour') + '</span>';
        } else {
          timeHtml += '<span>&nbsp;' + $translate.instant('automation_editor.components.initial_condition.scheduled_date.canvas.hours') + '</span>';
        }
        timeHtml += '<strong>' + (scope.component.frequency.time.hour > 9 ? scope.component.frequency.time.hour : '0' + scope.component.frequency.time.hour);
        timeHtml += '&#58;' + (scope.component.frequency.time.minute > 9 ? scope.component.frequency.time.minute : '0' + scope.component.frequency.time.minute) + '&nbsp;h</strong>';
        timeHtml += ' <strong>' + scope.timeZone + ')</strong>';
        return timeHtml;
      }

      function getDomainListsHtml() {
        var subscriptionListsHtml = '';
        if(scope.component.domains.length === 0) {
          subscriptionListsHtml += $translate.instant('automation_editor.components.initial_condition.push_notification.domains_sg');
          subscriptionListsHtml += '<span class="brackets">[[[...]]]</span>';
          return subscriptionListsHtml;
        } else if (scope.component.domains.length === 1) {
          subscriptionListsHtml += $translate.instant('automation_editor.components.initial_condition.push_notification.domains_sg');
        } else if (scope.component.domains.length > 1) {
          subscriptionListsHtml += $translate.instant('automation_editor.components.initial_condition.push_notification.domains_pl');
        }

        for (var index = 0; index < scope.component.domains.length  && index < 4; index++) {  
          if(scope.component.domains.length == 2  && index == 1 ||
            scope.component.domains.length >= 3 && index == 2) {
            subscriptionListsHtml += ( $translate.instant('automation_editor.components.initial_condition.push_notification.and') + '&nbsp;');
          } 
          subscriptionListsHtml +=('<strong>' + scope.component.domains[index].Domain + '</strong>');
          if(scope.component.domains.length > 2  && index != 1 && index < (scope.component.domains.length - 1))
            subscriptionListsHtml += ',&nbsp;';
        }

        if(scope.component.domains.length > 3) {
          subscriptionListsHtml += '<strong>...</strong>';
        }
        return subscriptionListsHtml;
      }
    }
  }
})();
