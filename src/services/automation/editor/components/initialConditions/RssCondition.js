(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('RssCondition', [
    '$injector',
    'ScheduledDateCondition',
    function ($injector, ScheduledDateCondition) {
      function RssCondition(data) {
        // Inherited constructor.
        ScheduledDateCondition.call(this, data);
      }

      // Prototype inherence from ScheduledDateCondition.
      RssCondition.prototype = Object.create(ScheduledDateCondition.prototype);
      RssCondition.prototype.panelTemplate =
        '<div dp-editor-panel-scheduled-date-condition class="dp-editor-panel-scheduled-date-condition"></div>';

      return RssCondition;
    },
  ]);
})();
