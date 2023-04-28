(function () {
  'use strict';

  angular.module('dopplerApp').directive('iframeOnload', iframeLoad);

  function iframeLoad() {
    var directive = {
      restrict: 'A',
      link: link,
      scope: {
        callBack: '&iframeOnload',
      },
    };

    return directive;

    function link(scope, element) {
      element.on('load', function () {
        return scope.callBack();
      });
    }
  }
})();
