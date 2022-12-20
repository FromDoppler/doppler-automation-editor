(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('BaseField', ['$translate', 'BASIC_FIELDS', 'userFieldsDataservice', function($translate, BASIC_FIELDS, userFieldsDataservice) {
      function BaseField(data) {
        //defaults
        this.type = data.type;
        this.id = 0;
        this.name = '';
        this.label = '';
        this.deleted = false;
      }

      BaseField.prototype.setData = function(data) {
        if (data.hasOwnProperty('id')) {
          this.id = data.id;
          this.deleted = !userFieldsDataservice.findField(this.id);
        }
        if (data.hasOwnProperty('name')) {
          this.name = data.name;
          this.label = getTranslatedField(this.name);
        }
      };

      function getTranslatedField(fieldName) {
        var fieldLabel = fieldName;

        if (_.includes(BASIC_FIELDS, fieldName)) {
          fieldLabel = $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.fields.' + fieldName);
        }

        return fieldLabel;
      }

      return BaseField;
    }]);
})();
