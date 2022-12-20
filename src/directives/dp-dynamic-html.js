(function() {
  'use strict';
  angular
    .module('dopplerApp')
    .directive('dpDynamicHtml', dpDynamicHtml);

  dpDynamicHtml.$inject = ['$compile'];

  function dpDynamicHtml($compile) {

    var directive = {
      restrict: 'A',
      replace: true,
      link: link
    };

    return directive;

    function link(scope, ele, attrs) {
      scope.$watch(attrs.dpDynamicHtml, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }

  }

})();
