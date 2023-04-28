(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('ListMembership', [
    'BaseConditional',
    'DUPLICATE_STATE',
    function (BaseConditional, DUPLICATE_STATE) {
      function ListMembership(data) {
        // Inherited constructor.
        BaseConditional.call(this, data);

        this.event = '';
        this.subscriptionList = {
          IdSubscribersList: 0,
        };

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseConditional.
      ListMembership.prototype = Object.create(BaseConditional.prototype);

      ListMembership.prototype.setData = function (data) {
        BaseConditional.prototype.setData.call(this, data);
        if (data.hasOwnProperty('event')) {
          this.event = data.event;
        }
        if (data.hasOwnProperty('subscriptionList')) {
          this.subscriptionList = data.subscriptionList;
        }
      };

      ListMembership.prototype.checkCompleted = function () {
        this.completed =
          this.event.length &&
          this.subscriptionList.IdSubscribersList !== 0 &&
          (this.duplicate === DUPLICATE_STATE.FALSE ||
            this.duplicate === DUPLICATE_STATE.ORIGIN);
      };

      ListMembership.prototype.isEqual = function (conditional) {
        return (
          this.event === conditional.event &&
          this.subscriptionList.IdSubscribersList ===
            conditional.subscriptionList.IdSubscribersList
        );
      };

      ListMembership.prototype.getPropertiesToWatch = function () {
        return ['event', 'subscriptionList'];
      };

      return ListMembership;
    },
  ]);
})();
