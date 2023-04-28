(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('ResendEmail', [
    'BaseOperation',
    function (BaseOperation) {
      function ResendEmail(data) {
        // Inherited constructor.
        BaseOperation.call(this, data);
        this.email = null;
        this.subject = '';

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseOperation.
      ResendEmail.prototype = Object.create(BaseOperation.prototype);

      ResendEmail.prototype.setData = function (data) {
        BaseOperation.prototype.setData.call(this, data);
        if (data.hasOwnProperty('email')) {
          this.email = data.email;
        }
        if (data.hasOwnProperty('subject')) {
          this.subject = data.subject;
        }
      };

      ResendEmail.prototype.checkCompleted = function () {
        return !!(this.subject && this.email);
      };

      return ResendEmail;
    },
  ]);
})();
