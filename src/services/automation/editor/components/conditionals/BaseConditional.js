(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('BaseConditional', [
    '$translate',
    'DUPLICATE_STATE',
    'utils',
    function ($translate, DUPLICATE_STATE, utils) {
      function BaseConditional(data) {
        // Defaults.
        this.uid = utils.newUid();
        this.conditionUid = 0;
        this.type = data.type;
        this.completed = false;
        this.duplicate = DUPLICATE_STATE.FALSE;
        this.label = $translate.instant(
          'automation_editor.components.condition.conditionals.' +
            this.type +
            '.label'
        );
      }

      BaseConditional.prototype.setData = function (data) {
        if (data.hasOwnProperty('uid')) {
          this.uid = data.uid;
          utils.updateLastUid(data.uid);
        }
        if (data.hasOwnProperty('duplicate')) {
          this.duplicate = data.duplicate;
        }
      };

      return BaseConditional;
    },
  ]);
})();
