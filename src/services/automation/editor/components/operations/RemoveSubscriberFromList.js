(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('RemoveSubscriberFromList', [
      'BaseOperation',
      function (BaseOperation) {
        function RemoveSubscriberFromList(data) {
          // Inherited constructor.
          BaseOperation.call(this, data);
          this.suscriptionLists = [];

          if (data) {
            this.setData(data);
          }
        }

        // Prototype inherence from BaseOperation.
        RemoveSubscriberFromList.prototype = Object.create(
          BaseOperation.prototype
        );

        RemoveSubscriberFromList.prototype.setData = function (data) {
          BaseOperation.prototype.setData.call(this, data);
          if (data.hasOwnProperty('suscriptionLists')) {
            this.suscriptionLists = data.suscriptionLists;
          }
          if (data.hasOwnProperty('allSubscribers')) {
            this.allSubscribers = data.allSubscribers;
          }
        };

        RemoveSubscriberFromList.prototype.checkCompleted = function () {
          return !!this.suscriptionLists.length;
        };

        return RemoveSubscriberFromList;
      },
    ]);
})();
