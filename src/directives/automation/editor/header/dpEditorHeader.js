(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorHeader', dpEditorHeader);

  dpEditorHeader.$inject = [
    '$rootScope',
    'automation'
  ];

  function dpEditorHeader($rootScope, automation) {
    var directive = {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/header/dp-editor-header.html',
      controller: ['$scope', controller]
    };

    return directive;

    function controller($scope) {
      console.log('automation', automation)
      $scope.rootComponent = automation.getModel();
      console.log('$scope.rootComponent', $scope.rootComponent)
      $scope.skipTemplateSelection = function() {
        $rootScope.$broadcast('TEMPLATES.CLOSE_TEMPLATES_VIEW');
      };
    }
  }
})();
