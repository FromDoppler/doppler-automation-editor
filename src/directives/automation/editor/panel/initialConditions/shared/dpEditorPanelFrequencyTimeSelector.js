(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelFrequencyTimeSelector', dpEditorPanelFrequencyTimeSelector);

  dpEditorPanelFrequencyTimeSelector.$inject = [
    'optionsListDataservice', 'settingsService'
  ];

  function dpEditorPanelFrequencyTimeSelector(optionsListDataservice, settingsService) {
    return {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/initialConditions/shared/dp-editor-panel-frequency-time-selector.html',

      scope: {
        timeSelected: '<',
        timezoneSelected: '<',
        onChange: '&',
        hasError: '<',
        isReadOnly: '&'
      },
      link: function (scope) {
        scope.timeOptions = optionsListDataservice.getTimeOptions();

        settingsService.getSettings().then(function(response) {
          scope.timezoneOptions = mapTimeZones(response.timeZones);
          const timeZone = scope.timezoneSelected !== 0 ? scope.timezoneSelected: response.idUserTimeZone;
          updateTimezoneSelected(timeZone);
          updateTimeSelected(scope.timeSelected);
          scope.defaultISODate = moment(response.defaultISODate).toDate();
        });
        scope.$watch('timeSelected', updateTimeSelected);
        scope.$watch('timezoneSelected', updateTimezoneSelected);

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

        scope.onPrevTime = function() {
          var index = _.findIndex(scope.timeOptions, function(option) {
            return _.isEqual(option.value, scope.timeValue.value);
          });
          if (index > 0) {
            scope.onChange({ key: 'time', value: scope.timeOptions[index - 1].value });
          }
        };

        scope.onNextTime = function() {
          var index = _.findIndex(scope.timeOptions, function(option) {
            return _.isEqual(option.value, scope.timeValue.value);
          });
          if (index < scope.timeOptions.length - 1) {
            scope.onChange({ key: 'time', value: scope.timeOptions[index + 1].value });
          }
        };

        function updateTimeSelected(tempTime) {
          if (tempTime) {
            scope.timeValue = _.find(scope.timeOptions, function(option) {
              return _.isEqual(option.value, tempTime);
            });
          } else if (scope.selectedComponent && scope.selectedComponent.frequency) {
            scope.timeValue = _.find(scope.timeOptions, function(option) {
              return _.isEqual(option.value, scope.selectedComponent.frequency.time);
            });
          }
        }

        function updateTimezoneSelected(tempTimezoneId) {
          scope.timeZoneValue = _.find(scope.timezoneOptions, function(option) {
            return _.isEqual(option.value, tempTimezoneId);
          });
        }
      }
    };
  }
})();