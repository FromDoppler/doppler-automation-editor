(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('DelayComponent', [
    'BaseComponent',
    'COMPONENT_TYPE',
    function (BaseComponent, COMPONENT_TYPE) {
      function DelayComponent(data) {
        // Inherited constructor.
        BaseComponent.call(this, {
          type: COMPONENT_TYPE.DELAY,
        });

        this.id = 0;
        this.hasUnsavedChanges = true;
        this.time = data.time || '';
        this.timeUnit = data.timeUnit || 'hours';

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseComponent.
      DelayComponent.prototype = Object.create(BaseComponent.prototype);
      DelayComponent.prototype.markup =
        '<dp-editor-delay class="component--container delay" component="component" branch="branch"></dp-editor-delay>';
      DelayComponent.prototype.panelTemplate =
        '<div dp-editor-panel-delay></div>';

      DelayComponent.prototype.setData = function (data) {
        BaseComponent.prototype.setData.call(this, data);
        if (data.hasOwnProperty('id')) {
          this.id = data.id;
        }
        if (data.hasOwnProperty('time')) {
          this.time = data.time;
        }
        if (data.hasOwnProperty('timeUnit')) {
          this.timeUnit = data.timeUnit;
        }
        if (data.hasOwnProperty('hasUnsavedChanges')) {
          this.hasUnsavedChanges = data.hasUnsavedChanges;
        }
      };

      DelayComponent.prototype.checkCompleted = function () {
        this.completed = Number.isInteger(parseInt(this.time));
      };

      DelayComponent.prototype.getPropertiesToWatch = function () {
        var properties = BaseComponent.prototype.getPropertiesToWatch();
        return properties.concat(['time', 'timeUnit']);
      };

      return DelayComponent;
    },
  ]);
})();
