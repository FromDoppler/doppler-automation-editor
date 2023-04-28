(function () {
  'use strict';

  angular.module('dopplerApp').directive('infiniteScroll', infiniteScroll);

  infiniteScroll.$inject = ['$timeout', '$document'];

  function infiniteScroll($timeout, $document) {
    var directive = {
      link: link,
    };

    return directive;

    function link(scope, element, attr) {
      var container, containerElement, containerTmp;
      if (attr.infiniteScrollElement) {
        containerTmp = document.querySelector('#' + attr.infiniteScrollElement);
      }

      if (!containerTmp) {
        container = $document;
        containerElement = $document[0].body;
      } else {
        container = angular.element(containerTmp);
        containerElement = container[0];
      }

      var lengthThreshold = attr.infiniteScrollDistance || 50;
      var handler = scope.$eval(attr.infiniteScroll);
      var throttled = _.throttle(handler, 500);
      var lastRemaining = 9999;
      //Flag to avoid two calls before the last one has finished
      var isFetchingFromLastCall = false;

      lengthThreshold = parseInt(lengthThreshold, 10);

      if (!handler || !angular.isFunction(handler)) {
        handler = angular.noop;
      }

      container.on('scroll', function () {
        var scrollTop =
          containerElement.scrollTop ||
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          0;
        var remaining =
          containerElement.scrollHeight -
          (containerElement.clientHeight + scrollTop);

        //if we have reached the threshold and we scroll down
        if (
          remaining < lengthThreshold &&
          remaining - lastRemaining < 0 &&
          !isFetchingFromLastCall
        ) {
          isFetchingFromLastCall = true;
          throttled().finally(function () {
            isFetchingFromLastCall = false;
          });
        }

        lastRemaining = remaining;
      });

      scope.$on('$destroy', function () {
        container.unbind('scroll');
      });
    }
  }
})();
