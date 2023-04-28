(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('BaseComponent', [
    'COMPONENT_TYPE',
    'utils',
    function (COMPONENT_TYPE, utils) {
      function BaseComponent(params) {
        /**
         * This is a dynamiclly generated id that we're setting just for identification purposes.
         * and should NOT be saved into the database.
         */
        this.uid = utils.newUid();

        // Defaults.
        this.type = params && params.type ? params.type : COMPONENT_TYPE.BASE;
        this.parentUid = null;
        this.completed = false;
        this.touched = false;
        this.hasBlockedList = false;

        // Override from data.
        if (params && params.data) {
          this.setData(params.data);
        }
      }

      BaseComponent.prototype.setData = function (data) {
        if (data.hasOwnProperty('uid') && data.uid !== 0) {
          this.uid = data.uid;
          utils.updateLastUid(data.uid);
        }
        if (data.hasOwnProperty('parentUid')) {
          this.parentUid = data.parentUid;
        }
        if (data.hasOwnProperty('completed')) {
          this.completed = data.completed;
        }
        if (data.hasOwnProperty('touched')) {
          this.touched = data.touched;
        }
      };

      BaseComponent.prototype.checkCompleted = function () {
        var isCompleted = true;
        var propNames = this.getCompletedPropertiesToWatch();
        for (var i = 0; i < propNames.length; i++) {
          var propName = propNames[i];
          if (
            this[propName] === null ||
            this[propName] === undefined ||
            this[propName] === ''
          ) {
            isCompleted = false;
            break;
          }
        }
        this.completed = isCompleted;
      };

      BaseComponent.prototype.getPropertiesToWatch = function () {
        return [];
      };

      return BaseComponent;
    },
  ]);
})();
