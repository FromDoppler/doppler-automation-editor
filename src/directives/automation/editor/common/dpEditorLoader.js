(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorLoader', dpEditorLoader);

  dpEditorLoader.$inject = ['$rootScope'];

  function dpEditorLoader($rootScope) {
    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: 'angularjs/partials/shared/loader.html',
    };

    return directive;

    function link(scope) {
      $rootScope.$on('$stateChangeStart', function () {
        scope.isLoading = true;
      });

      $rootScope.$on('$stateChangeSuccess', function () {
        scope.isLoading = false;
      });

      $rootScope.$on('$stateChangeError', function () {
        scope.isLoading = false;
      });
    }
  }
})();
