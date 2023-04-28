(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('BaseInitialConditionComponent', [
      'BaseComponent',
      function (BaseComponent) {
        function BaseInitialConditionComponent(data) {
          // Inherited constructor.
          BaseComponent.call(this, {
            type: data.type,
          });

          if (data) {
            this.setData(data);
          }
        }

        // Prototype inherence from BaseComponent.
        BaseInitialConditionComponent.prototype = Object.create(
          BaseComponent.prototype
        );

        return BaseInitialConditionComponent;
      },
    ]);
})();
