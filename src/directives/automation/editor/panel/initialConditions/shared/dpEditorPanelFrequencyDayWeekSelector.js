(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelFrequencyDayWeekSelector', dpEditorPanelFrequencyDayWeekSelector);

     dpEditorPanelFrequencyDayWeekSelector.$inject = [
    'optionsListDataservice', '$translate'
  ];

  function dpEditorPanelFrequencyDayWeekSelector(optionsListDataservice, $translate) {
    return {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/initialConditions/shared/dp-editor-panel-frequency-day-week-selector.html',
      scope: {
        title: '<?',
        weekDays: '<?',
        selectedDays: '<',
        onChange: '&',
        isReadOnly: '&'
      },
      link: function (scope) {
        scope.weekSelectorTitle =  scope.title || $translate.instant('automation_editor.sidebar.scheduled_date_select_week_days_title');
        if (!scope.weekDays || !scope.weekDays.length) {
            scope.weekDays = optionsListDataservice.getWeekDays();
        }

        function syncSelectedDays() {
          scope.weekDays.forEach(function (day) {
            day.selected = scope.selectedDays && scope.selectedDays.includes(day.value);
          });
        }

        scope.$watch('selectedDays', syncSelectedDays);
        scope.$watch('weekDays', syncSelectedDays);

        scope.onDayToggled = function () {
          const selected = scope.weekDays
            .filter(d => d.selected)
            .map(d => d.value)
            .sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
          scope.onChange({ days: selected });
        };
      }
    };
  }
})();
