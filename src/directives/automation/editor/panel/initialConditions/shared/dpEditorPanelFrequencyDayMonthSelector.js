(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelFrequencyDayMonthSelector', dpEditorPanelFrequencyDayMonthSelector);

  dpEditorPanelFrequencyDayMonthSelector.$inject = [
    'optionsListDataservice', '$translate'
  ];

  function dpEditorPanelFrequencyDayMonthSelector(optionsListDataservice, $translate) {
    return {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/initialConditions/shared/dp-editor-panel-frequency-day-month-selector.html',
      scope: {
        title: '<?',
        monthDays: '<?',
        selectedDay: '<',
        onChange: '&',
        isReadOnly: '&'
      },
      link: function (scope) {
        scope.monthSelectorTitle =  scope.title || $translate.instant('automation_editor.sidebar.scheduled_date_select_month_day_title');
        if (!scope.monthDays || !scope.monthDays.length) {
            scope.monthDays = optionsListDataservice.getDayNumberOptions();
        }

        function syncSelected() {
          if (!scope.monthDays || !scope.selectedDay) return;

          const selected = scope.monthDays.find(function (opt) {
            return opt.value === scope.selectedDay;
          });

          scope.selectedLabel = selected ? selected.label : '';
          scope.selectedValue = selected ? selected.value : null;
        }

        scope.$watch('selectedDay', syncSelected);
        scope.$watch('monthDays', syncSelected);

        scope.onSelect = function (option) {
          scope.onChange({ value: option.value });
        };
      }
    };
  }
})();