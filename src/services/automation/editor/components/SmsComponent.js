(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('SmsComponent', [
    'BaseComponent',
    'COMPONENT_TYPE',
    function (BaseComponent, COMPONENT_TYPE) {
      function SmsComponent(data) {
        // Inherited constructor.
        BaseComponent.call(this, {
          type: COMPONENT_TYPE.SMS,
        });

        this.smsText = '';
        this.name = '';
        this.id = 0;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseComponent.
      SmsComponent.prototype = Object.create(BaseComponent.prototype);
      SmsComponent.prototype.markup =
        '<dp-editor-sms class="component--container sms" component="component" branch="branch"></dp-editor-sms>';
      SmsComponent.prototype.panelTemplate = '<div dp-editor-panel-sms></div>';

      SmsComponent.prototype.setData = function (data) {
        BaseComponent.prototype.setData.call(this, data);
        if (data.hasOwnProperty('field')) {
          this.field = data.field;
        }
        if (data.hasOwnProperty('smsText')) {
          this.smsText = data.smsText;
        }
        if (data.hasOwnProperty('name')) {
          this.name = data.name;
        }
        if (data.hasOwnProperty('id')) {
          this.id = data.id;
        }
      };

      SmsComponent.prototype.checkCompleted = function () {
        this.completed =
          !!this.field && this.smsText !== '' && this.name !== '';
      };

      SmsComponent.prototype.getPropertiesToWatch = function () {
        var properties = BaseComponent.prototype.getPropertiesToWatch();
        return properties.concat(['field', 'smsText', 'name']);
      };

      return SmsComponent;
    },
  ]);
})();
