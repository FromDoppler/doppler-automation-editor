(function () {
  'use strict';

  angular.module('dp-dropzone', []).directive('dpDropzone', dpDropzone);

  function dpDropzone() {
    var directive = {
      link: link,
    };

    return directive;

    function link(scope, element, attrs) {
      var config, dropzone;
      config = scope[attrs.dpDropzone];
      // create a Dropzone for the element with the given options
      dropzone = new Dropzone(element[0], config.options); //eslint-disable-line no-undef
      // bind the given event handlers
      angular.forEach(config.eventHandlers, function (handler, event) {
        dropzone.on(event, handler);
      });
    }
  }
})();
