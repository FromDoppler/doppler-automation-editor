(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('AddSubscriberToList', ['BaseOperation', function(BaseOperation) {

      function AddSubscriberToList(data) {
        // Inherited constructor.
        BaseOperation.call(this, data);
        this.suscriptionList = null;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseOperation.
      AddSubscriberToList.prototype = Object.create(BaseOperation.prototype);

      AddSubscriberToList.prototype.setData = function(data) {
        BaseOperation.prototype.setData.call(this, data);
        if (data.hasOwnProperty('suscriptionList')) {
          this.suscriptionList = data.suscriptionList;
        }
      };

      AddSubscriberToList.prototype.checkCompleted = function() {
        return !!this.suscriptionList;
      };

      return AddSubscriberToList;
    }]);
})();
