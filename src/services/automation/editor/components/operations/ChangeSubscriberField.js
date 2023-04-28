(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('ChangeSubscriberField', [
      'BaseOperation',
      'userFieldsDataservice',
      function (BaseOperation, userFieldsDataservice) {
        function ChangeSubscriberField(data) {
          // Inherited constructor.
          BaseOperation.call(this, data);

          if (data) {
            this.setData(data);
          }
        }

        // Prototype inherence from BaseOperation.
        ChangeSubscriberField.prototype = Object.create(
          BaseOperation.prototype
        );

        ChangeSubscriberField.prototype.setData = function (data) {
          BaseOperation.prototype.setData.call(this, data);
          if (
            data.hasOwnProperty('field') &&
            !userFieldsDataservice.isFieldDeleted(data.field)
          ) {
            this.field = data.field;
          }
        };

        ChangeSubscriberField.prototype.checkCompleted = function () {
          return !!this.field;
        };

        return ChangeSubscriberField;
      },
    ]);
})();
