(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('GotoComponent', [
    'BaseComponent',
    'COMPONENT_TYPE',
    function (BaseComponent, COMPONENT_TYPE) {
      function GotoComponent(data) {
        // Inherited constructor.
        BaseComponent.call(this, {
          type: COMPONENT_TYPE.GOTO_STEP,
        });

        this.id = 0;
        this.hasUnsavedChanges = true;
        this.goto = data.goto || 0;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseComponent.
      GotoComponent.prototype = Object.create(BaseComponent.prototype);
      GotoComponent.prototype.markup =
        '<dp-editor-goto class="component--container goto" component="component" branch="branch"></dp-editor-goto>';
      GotoComponent.prototype.panelTemplate =
        '<div dp-editor-panel-goto></div>';

      GotoComponent.prototype.setData = function (data) {
        BaseComponent.prototype.setData.call(this, data);
        if (data.hasOwnProperty('id')) {
          this.id = data.id;
        }
        if (data.hasOwnProperty('goto')) {
          this.goto = data.goto;
        }
        if (data.hasOwnProperty('hasUnsavedChanges')) {
          this.hasUnsavedChanges = data.hasUnsavedChanges;
        }
      };

      GotoComponent.prototype.checkCompleted = function () {
        this.completed = this.goto > 0;
      };

      GotoComponent.prototype.getPropertiesToWatch = function () {
        var properties = BaseComponent.prototype.getPropertiesToWatch();
        return properties.concat(['goto']);
      };

      return GotoComponent;
    },
  ]);
})();
