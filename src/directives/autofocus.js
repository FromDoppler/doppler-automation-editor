/**
 * the HTML5 autofocus property can be finicky when it comes to dynamically loaded
 * templates and such with AngularJS. Use this simple directive to
 * tame this beast once and for all.
 *
 * Usage:
 * <input type="text" autofocus>
 *
 * License: MIT
 */
(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('autofocus', autofocus);

  autofocus.$inject = ['$timeout'];

  function autofocus($timeout) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      $timeout(function() {
        element[0].focus();
      });
    }
  }

})();
