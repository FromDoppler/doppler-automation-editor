(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('automationLocaleService', automationLocaleService);

  automationLocaleService.$inject = ['$locale', '$translate'];

  function automationLocaleService($locale, $translate) {
    var service = {
      setLocale: setLocale,
    };

    function setLocale() {
      var days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      var months = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
      ];

      if ($translate.use() !== 'es') {
        $locale.NUMBER_FORMATS.DECIMAL_SEP = '.';
        _.each(days, function (day, index) {
          $locale.DATETIME_FORMATS.DAY[index] = $translate.instant(
            'automation_editor.components.initial_condition.days_of_the_week.' +
              days[index]
          );
          $locale.DATETIME_FORMATS.SHORTDAY[index] =
            $locale.DATETIME_FORMATS.DAY[index].substr(0, 3);
        });

        _.each(months, function (month, index) {
          $locale.DATETIME_FORMATS.MONTH[index] = $translate.instant(
            'automation_editor.components.initial_condition.months_of_the_week.' +
              months[index]
          );
          $locale.DATETIME_FORMATS.SHORTMONTH[index] =
            $locale.DATETIME_FORMATS.MONTH[index].substr(0, 3);
        });
      }
    }

    return service;
  }
})();
