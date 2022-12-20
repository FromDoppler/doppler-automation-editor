(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('ActionComponent', ['$injector', 'BaseComponent', 'COMPONENT_TYPE', function($injector, BaseComponent, COMPONENT_TYPE) {

      function ActionComponent(data) {
        // Inherited constructor.
        BaseComponent.call(this, {
          type: COMPONENT_TYPE.ACTION
        });
        this.actionType = '';
        this.operation = null;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseComponent.
      ActionComponent.prototype = Object.create(BaseComponent.prototype);
      ActionComponent.prototype.markup = '<dp-editor-action class="component--container action" component="component" branch="branch"></dp-editor-action>';
      ActionComponent.prototype.panelTemplate = '<div dp-editor-panel-action class="dp-editor-panel-action"></div>';

      ActionComponent.prototype.setData = function(data) {
        var automation = $injector.get('automation');

        BaseComponent.prototype.setData.call(this, data);
        // To cover up existing actions
        if (data.hasOwnProperty('actionType') && data.actionType !== '') {
          this.actionType = data.actionType;
          this.operation = automation.createOperation({
            type: data.actionType,
            suscriptionList: data.suscriptionList
          });
        }
        if (data.hasOwnProperty('operation') && data.operation) {
          if (this.operation) {
            this.operation.setData(data.operation);
          } else {
            this.operation = automation.createOperation(data.operation);
          }
        }
      };

      ActionComponent.prototype.checkCompleted = function() {
        var isCompleted = !!this.operation;

        if (isCompleted) {
          isCompleted = this.operation.checkCompleted();
        }
        this.completed = isCompleted;
      };

      ActionComponent.prototype.getPropertiesToWatch = function() {
        return [
          'operation'
        ];
      };

      return ActionComponent;
    }]);
})();
